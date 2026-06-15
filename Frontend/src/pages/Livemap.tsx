import { useEffect, useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface LiveMapProps {
  source: string;
  destination: string;
}

export default function LiveMap({
  source,
  destination
}: LiveMapProps) {
  const [sourceCoords, setSourceCoords] = useState<
    [number, number] | null
  >(null);

  const [destCoords, setDestCoords] = useState<
    [number, number] | null
  >(null);

  const [routeCoords, setRouteCoords] = useState<any[]>([]);

  // Convert place name -> coordinates
  useEffect(() => {
    const getCoordinates = async (
      place: string,
      setter: React.Dispatch<
        React.SetStateAction<[number, number] | null>
      >
    ) => {
      if (!place) return;

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            place
          )}&format=json&limit=1`
        );

        if (res.data.length > 0) {
          const lat = parseFloat(res.data[0].lat);
          const lon = parseFloat(res.data[0].lon);

          setter([lat, lon]);
        }
      } catch (err) {
        console.error("Geocoding Error:", err);
      }
    };

    getCoordinates(source, setSourceCoords);
    getCoordinates(destination, setDestCoords);
  }, [source, destination]);

  // Fetch real road route
  useEffect(() => {
    const getRoute = async () => {
      if (!sourceCoords || !destCoords) return;

      try {
        const apiKey = import.meta.env.VITE_ORS_API_KEY;

        const response = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            coordinates: [
              [sourceCoords[1], sourceCoords[0]],
              [destCoords[1], destCoords[0]]
            ]
          },
          {
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json"
            }
          }
        );

        const coords =
          response.data.features[0].geometry.coordinates.map(
            (coord: number[]) => [coord[1], coord[0]]
          );

        setRouteCoords(coords);

        console.log("Route Loaded:", coords);
      } catch (err) {
        console.error("Route Error:", err);
      }
    };

    getRoute();
  }, [sourceCoords, destCoords]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative"
      }}
    >
      <MapContainer
        center={[28.6328, 77.2197]}
        zoom={11}
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sourceCoords && (
          <Marker position={sourceCoords}>
            <Popup>{source}</Popup>
          </Marker>
        )}

        {destCoords && (
          <Marker position={destCoords}>
            <Popup>{destination}</Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: "green",
              weight: 6
            }}
          />
        )}
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
          <strong>From:</strong>
          <br />
          {source || "Enter source"}
        </p>

        <p>
          <strong>To:</strong>
          <br />
          {destination || "Enter destination"}
        </p>

        <p>
          <strong>Status:</strong>
          <br />
          Real road route enabled
        </p>
      </div>
    </div>
  );
}