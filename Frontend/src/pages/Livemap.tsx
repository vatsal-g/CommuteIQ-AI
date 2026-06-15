import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function LiveMap() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative"
      }}
    >
      <MapContainer
        center={[28.6328, 77.2197]}
        zoom={13}
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[28.6328, 77.2197]}>
          <Popup>Rajiv Chowk Metro</Popup>
        </Marker>

        {/* Recommended Route */}
        <Polyline
          positions={[
            [28.6100, 77.2000],
            [28.6328, 77.2197],
            [28.6500, 77.2400]
          ]}
          pathOptions={{
            color: "green",
            weight: 6
          }}
        />

        {/* Alternative Route */}
        <Polyline
          positions={[
            [28.6100, 77.2000],
            [28.6400, 77.2350],
            [28.6500, 77.2400]
          ]}
          pathOptions={{
            color: "red",
            weight: 6
          }}
        />
      </MapContainer>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "#0f172a",
          color: "white",
          padding: "16px",
          borderRadius: "12px",
          minWidth: "250px",
          border: "1px solid #334155"
        }}
      >
        <h3>Commute Copilot</h3>

        <p>
          <strong>Recommended Route:</strong>
          <br />
          Route A
        </p>

        <p>
          <strong>Confidence:</strong> 90%
        </p>

        <p>
          <strong>Time Saved:</strong> 4 min
        </p>

        <p>Traffic conditions stable</p>
      </div>
    </div>
  );
}