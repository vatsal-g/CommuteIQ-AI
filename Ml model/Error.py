
import pandas as pd
import numpy as np

# Load the predictions from the final test dataset
df = pd.read_csv("model_output/test_predictions.csv")

# Calculate prediction errors
df["error"] = (
    df["predicted_delay_min"] - df["delay_min"]
)

df["absolute_error"] = df["error"].abs()

# Determine whether predictions fall within tolerances
df["within_5"] = df["absolute_error"] <= 5
df["within_10"] = df["absolute_error"] <= 10
df["within_15"] = df["absolute_error"] <= 15

print("\nOVERALL ERROR ANALYSIS")
print("----------------------")

print("Total journeys:", len(df))
print("MAE:", round(df["absolute_error"].mean(), 2))
print("Average signed error:", round(df["error"].mean(), 2))

for tolerance in [5, 10, 15]:
    accuracy = (
        df["absolute_error"] <= tolerance
    ).mean() * 100

    print(f"Within +/- {tolerance} minutes: {accuracy:.2f}%")


# Evaluate performance by transport mode
if "mode" in df.columns:

    print("\nPERFORMANCE BY TRANSPORT MODE")
    print("-----------------------------")

    mode_results = df.groupby("mode").agg(
        trips=("absolute_error", "size"),
        mae=("absolute_error", "mean"),
        accuracy_5=("within_5", "mean"),
        accuracy_10=("within_10", "mean")
    )

    mode_results["accuracy_5"] *= 100
    mode_results["accuracy_10"] *= 100

    print(mode_results.round(2).to_string())


# Evaluate performance by city
if "city" in df.columns:

    print("\nPERFORMANCE BY CITY")
    print("-------------------")

    city_results = df.groupby("city").agg(
        trips=("absolute_error", "size"),
        mae=("absolute_error", "mean"),
        accuracy_5=("within_5", "mean")
    )

    city_results["accuracy_5"] *= 100

    print(city_results.round(2).to_string())


# Identify the 20 worst predictions
print("\n20 LARGEST PREDICTION ERRORS")
print("---------------------------")

columns = [
    c for c in [
        "route_id",
        "city",
        "mode",
        "delay_min",
        "predicted_delay_min",
        "error",
        "absolute_error"
    ]
    if c in df.columns
]

worst = df.nlargest(20, "absolute_error")[columns]

print(worst.to_string(index=False))

# Save diagnostic results
mode_results.to_csv(
    "model_output/mode_error_analysis.csv"
) if "mode" in df.columns else None

worst.to_csv(
    "model_output/worst_predictions.csv",
    index=False
)

print("\nAnalysis files saved in model_output.")
