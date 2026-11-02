"""Train an XGBoost regression model for CommuteIQ journey-delay prediction.

Run from the ML model folder:
    python train.py --data ".\\new data\\delay_training_table.csv"

The CSV must contain a chronological 'split' column with 'train' and 'test'
values. The script holds out the latest 20% of the train period for validation
and keeps the supplied test period untouched until final evaluation.
"""

from __future__ import annotations

import argparse
from importlib import import_module
import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


TARGET = "delay_min"
TIME_COL = "departure_time_utc"
SPLIT_COL = "split"

# These columns are known from the uploaded 44-column training table and are
# intended to be available at prediction time. Outcome/after-trip fields are
# deliberately not included.
NUMERIC_FEATURES = [
    "crosses_state_border",
    "distance_km",
    "n_signals",
    "toll_count",
    "baseline_min",
    "planned_eta_min",
    "planned_delay",
    "planned_rel",
    "hour_ist",
    "dow",
    "is_peak",
    "congestion_ratio",
    "incident_count",
    "road_closure_flag",
    "speed_lag_5",
    "speed_lag_15",
    "speed_lag_30",
    "speed_lag_60",
    "speed_roll_mean_1h",
    "speed_roll_std_1h",
    "speed_roll_mean_3h",
    "speed_roll_std_3h",
    "lag15r",
    "lag30r",
    "lag60r",
    "roll1r",
    "roll3r",
    "rollstd1r",
]

CATEGORICAL_FEATURES = ["route_id", "mode", "city", "road_type"]

# These columns exist in the uploaded CSV but are not used as predictors:
# trip_id / timestamps / split are identifiers or split controls;
# actual_duration_min, arrived_within_tolerance and delay_min are outcomes;
# label_source and tolerance_min are label/definition metadata;
# p30r, p60r, p30_delta and p60_delta are held out until their exact
# definitions and prediction-time availability are confirmed.


def regression_metrics(y_true: pd.Series, y_pred: np.ndarray) -> dict[str, float]:
    """Calculate regression metrics in minutes, plus R-squared."""
    return {
        "mae_minutes": float(mean_absolute_error(y_true, y_pred)),
        "rmse_minutes": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "r2": float(r2_score(y_true, y_pred)),
    }


def date_range_text(frame: pd.DataFrame) -> str:
    return (
        f"{frame[TIME_COL].min().isoformat()} to "
        f"{frame[TIME_COL].max().isoformat()}"
    )


def main() -> None:
    try:
        XGBRegressor = import_module("xgboost").XGBRegressor
    except ModuleNotFoundError as exc:
        if exc.name != "xgboost":
            raise
        raise SystemExit(
            "The xgboost package is not installed in this Python environment. "
            "Install it with: python -m pip install xgboost"
        ) from exc

    parser = argparse.ArgumentParser(
        description="Train and evaluate the CommuteIQ XGBoost delay model"
    )
    parser.add_argument(
        "--data",
        default=r".\new data\delay_training_table.csv",
        help="Path to delay_training_table.csv",
    )
    parser.add_argument(
        "--output-dir",
        default="model_output",
        help="Folder in which model and evaluation files will be saved",
    )
    parser.add_argument(
        "--validation-fraction",
        type=float,
        default=0.20,
        help="Latest fraction of the train period reserved for validation (default: 0.20)",
    )
    args = parser.parse_args()

    if not 0.05 <= args.validation_fraction <= 0.40:
        raise ValueError("--validation-fraction must be between 0.05 and 0.40")

    data_path = Path(args.data)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    if not data_path.is_file():
        raise FileNotFoundError(
            f"CSV not found: {data_path}\n"
            "Check the path. Expected, from the ML model folder:\n"
            r'  .\new data\delay_training_table.csv'
        )

    print(f"Loading dataset: {data_path}")
    df = pd.read_csv(data_path)
    print(f"Dataset shape: {df.shape[0]:,} rows x {df.shape[1]} columns")

    required_columns = {
        TARGET,
        TIME_COL,
        SPLIT_COL,
        *NUMERIC_FEATURES,
        *CATEGORICAL_FEATURES,
        "planned_delay",
        "baseline_min",
    }
    missing_columns = sorted(required_columns.difference(df.columns))
    if missing_columns:
        raise ValueError(
            "Your CSV is missing columns required by this training script: "
            + ", ".join(missing_columns)
        )

    # Parse timestamps so the validation period can be selected chronologically.
    df[TIME_COL] = pd.to_datetime(df[TIME_COL], utc=True, errors="coerce")
    if df[TIME_COL].isna().any():
        bad_count = int(df[TIME_COL].isna().sum())
        raise ValueError(f"Found {bad_count} invalid/missing values in {TIME_COL}")

    # Keep only rows with a known target. Do not invent target values.
    df[TARGET] = pd.to_numeric(df[TARGET], errors="coerce")
    missing_target_count = int(df[TARGET].isna().sum())
    if missing_target_count:
        raise ValueError(
            f"Found {missing_target_count} rows without a numeric {TARGET}. "
            "Resolve these labels before training."
        )

    df[SPLIT_COL] = df[SPLIT_COL].astype(str).str.strip().str.lower()
    train_df = df.loc[df[SPLIT_COL] == "train"].copy()
    test_df = df.loc[df[SPLIT_COL] == "test"].copy()

    if train_df.empty or test_df.empty:
        raise ValueError("Column 'split' must contain non-empty 'train' and 'test' groups.")

    train_df = train_df.sort_values(TIME_COL).reset_index(drop=True)
    test_df = test_df.sort_values(TIME_COL).reset_index(drop=True)

    # Confirm the supplied split is genuinely chronological.
    if train_df[TIME_COL].max() >= test_df[TIME_COL].min():
        raise ValueError(
            "The supplied train/test split is not strictly chronological. "
            "Check the 'split' column before training."
        )

    # Reserve the latest part of the training period for validation.
    validation_count = max(1, int(round(len(train_df) * args.validation_fraction)))
    fit_count = len(train_df) - validation_count
    if fit_count < 1:
        raise ValueError("Not enough training rows after creating the validation split.")

    fit_df = train_df.iloc[:fit_count].copy()
    validation_df = train_df.iloc[fit_count:].copy()

    # Add cyclical encodings: hour 23 is close to hour 0; Sunday is close to Monday.
    hour_values = pd.to_numeric(df["hour_ist"], errors="coerce")
    dow_values = pd.to_numeric(df["dow"], errors="coerce")
    df["hour_sin"] = np.sin(2 * np.pi * hour_values / 24.0)
    df["hour_cos"] = np.cos(2 * np.pi * hour_values / 24.0)
    df["dow_sin"] = np.sin(2 * np.pi * dow_values / 7.0)
    df["dow_cos"] = np.cos(2 * np.pi * dow_values / 7.0)

    # Copy the generated cyclical columns into the previously separated frames.
    for frame in (fit_df, validation_df, test_df):
        frame["hour_sin"] = np.sin(2 * np.pi * pd.to_numeric(frame["hour_ist"], errors="coerce") / 24.0)
        frame["hour_cos"] = np.cos(2 * np.pi * pd.to_numeric(frame["hour_ist"], errors="coerce") / 24.0)
        frame["dow_sin"] = np.sin(2 * np.pi * pd.to_numeric(frame["dow"], errors="coerce") / 7.0)
        frame["dow_cos"] = np.cos(2 * np.pi * pd.to_numeric(frame["dow"], errors="coerce") / 7.0)

    numeric_features = NUMERIC_FEATURES + ["hour_sin", "hour_cos", "dow_sin", "dow_cos"]
    feature_columns = numeric_features + CATEGORICAL_FEATURES

    X_fit = fit_df[feature_columns]
    y_fit = fit_df[TARGET].astype(float)
    X_val = validation_df[feature_columns]
    y_val = validation_df[TARGET].astype(float)
    X_test = test_df[feature_columns]
    y_test = test_df[TARGET].astype(float)

    # Median imputation for numeric columns; most-frequent imputation and
    # one-hot encoding for categorical columns. Fit only on model-fit rows.
    numeric_pipeline = Pipeline(
        steps=[("imputer", SimpleImputer(strategy="median"))]
    )
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, numeric_features),
            ("categorical", categorical_pipeline, CATEGORICAL_FEATURES),
        ]
    )

    X_fit_processed = preprocessor.fit_transform(X_fit)
    X_val_processed = preprocessor.transform(X_val)
    X_test_processed = preprocessor.transform(X_test)

    print("\nChronological data split:")
    print(f"  Model fitting: {len(fit_df):,} rows | {date_range_text(fit_df)}")
    print(f"  Validation:    {len(validation_df):,} rows | {date_range_text(validation_df)}")
    print(f"  Final test:    {len(test_df):,} rows | {date_range_text(test_df)}")
    print(f"  Features before one-hot encoding: {len(feature_columns)}")

    # XGBoost builds decision trees sequentially. Each new tree helps correct
    # errors made by the trees already in the ensemble. Early stopping monitors
    # validation MAE and stops when it no longer improves.
    model =XGBRegressor(
        objective="reg:squarederror",
        n_estimators=1000,
        learning_rate=0.03,
        max_depth=4,
        min_child_weight=3,
        subsample=0.80,
        colsample_bytree=0.80,
        reg_alpha=0.0,
        reg_lambda=5.0,
        eval_metric="mae",
        early_stopping_rounds=50,
        tree_method="hist",
        random_state=42,
        n_jobs=-1,
    )

    print("\nStarting XGBoost training...")
    model.fit(
        X_fit_processed,
        y_fit,
        eval_set=[(X_val_processed, y_val)],
        verbose=100,
    )

    # Evaluate validation data for model selection and test data for final reporting.
    val_predictions = model.predict(X_val_processed)
    test_predictions = model.predict(X_test_processed)
    validation_metrics = regression_metrics(y_val, val_predictions)
    test_metrics = regression_metrics(y_test, test_predictions)

    # Compare with the existing planned_delay estimate using the exact same test rows.
    planned_delay_baseline = pd.to_numeric(test_df["planned_delay"], errors="coerce")
    if planned_delay_baseline.isna().any():
        raise ValueError("planned_delay contains missing/non-numeric values in the test set.")
    baseline_metrics = regression_metrics(y_test, planned_delay_baseline.to_numpy())
    mae_improvement = (
        (baseline_metrics["mae_minutes"] - test_metrics["mae_minutes"])
        / baseline_metrics["mae_minutes"]
        * 100.0
        if baseline_metrics["mae_minutes"] > 0
        else None
    )

    # Save preprocessing and model together so live inference uses the same transformations.
    model_bundle = {
        "preprocessor": preprocessor,
        "model": model,
        "feature_columns": feature_columns,
        "numeric_features": numeric_features,
        "categorical_features": CATEGORICAL_FEATURES,
        "target": TARGET,
        "target_definition": "delay_min = actual_duration_min - baseline_min",
    }
    model_path = output_dir / "xgb_delay_pipeline.joblib"
    joblib.dump(model_bundle, model_path)

    # Save feature importance using the names after preprocessing/one-hot encoding.
    transformed_names = preprocessor.get_feature_names_out()
    importance_df = pd.DataFrame(
        {
            "feature": transformed_names,
            "importance": model.feature_importances_,
        }
    ).sort_values("importance", ascending=False)
    importance_df.to_csv(output_dir / "feature_importance.csv", index=False)

    # Save individual predictions for later inspection.
    id_columns = [c for c in ["trip_id", "route_id", "city", "mode", TIME_COL] if c in test_df.columns]
    predictions_df = test_df[id_columns + ["baseline_min", "planned_delay", TARGET]].copy()
    predictions_df["predicted_delay_min"] = test_predictions
    predictions_df["predicted_eta_min"] = (
        predictions_df["baseline_min"] + predictions_df["predicted_delay_min"]
    )
    predictions_df.to_csv(output_dir / "test_predictions.csv", index=False)

    metrics_output = {
        "dataset": str(data_path),
        "rows_total": int(len(df)),
        "rows_model_fit": int(len(fit_df)),
        "rows_validation": int(len(validation_df)),
        "rows_final_test": int(len(test_df)),
        "fit_period_utc": [fit_df[TIME_COL].min().isoformat(), fit_df[TIME_COL].max().isoformat()],
        "validation_period_utc": [validation_df[TIME_COL].min().isoformat(), validation_df[TIME_COL].max().isoformat()],
        "test_period_utc": [test_df[TIME_COL].min().isoformat(), test_df[TIME_COL].max().isoformat()],
        "best_iteration": int(getattr(model, "best_iteration", model.n_estimators - 1)),
        "validation_xgboost": validation_metrics,
        "test_xgboost": test_metrics,
        "test_planned_delay_baseline": baseline_metrics,
        "test_mae_improvement_vs_planned_delay_pct": (
            float(mae_improvement) if mae_improvement is not None else None
        ),
        "features_used": feature_columns,
        "features_not_used": [
            "trip_id", "departure_time_utc (ordering only)", "split",
            "delay_min (target)", "actual_duration_min",
            "arrived_within_tolerance", "label_source", "tolerance_min",
            "p30r", "p60r", "p30_delta", "p60_delta",
        ],
    }
    metrics_path = output_dir / "metrics.json"
    metrics_path.write_text(json.dumps(metrics_output, indent=2), encoding="utf-8")

    print("\nTRAINING COMPLETE")
    print("Validation metrics:", json.dumps(validation_metrics, indent=2))
    print("Final test metrics:", json.dumps(test_metrics, indent=2))
    print("Planned-delay baseline:", json.dumps(baseline_metrics, indent=2))
    if mae_improvement is not None:
        print(f"MAE change vs planned-delay baseline: {mae_improvement:.2f}%")
    print(f"Best boosting iteration: {metrics_output['best_iteration']}")
    print("\nSaved files:")
    print(f"  Model:             {model_path}")
    print(f"  Metrics:           {metrics_path}")
    print(f"  Test predictions:  {output_dir / 'test_predictions.csv'}")
    print(f"  Feature importance:{output_dir / 'feature_importance.csv'}")


if __name__ == "__main__":
    main()
