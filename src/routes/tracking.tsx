import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Shipment } from "../types/shipment";
import { searchShipment } from "../services/shipmentServices";
import StatusBadge from "../components/StatusBadge";
import ShipmentProgress from "../components/ShipmentProgress";


export const Route = createFileRoute("/tracking")({
  component: Tracking,
});

function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async() => {
    const result = await searchShipment(trackingNumber);

    if (!result) {
      setShipment(null);
      setError("Tracking Number not found.");
      return;
    }

    setShipment(result);
    setError("");
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Track Your Shipment
      </h1>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter Tracking Number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="flex-1 rounded-lg border p-3"
        />

        <button
          onClick={handleSearch}
          className="rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700"
        >
          Track
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {shipment && (
        <div className="mt-8 rounded-lg border p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Shipment Details
          </h2>

          <p>
            <strong>Tracking Number:</strong>{" "}
            {shipment.trackingNumber}
          </p>

          <p>
            <strong>Sender:</strong>{" "}
            {shipment.sender}
          </p>

          <p>
            <strong>Receiver:</strong>{" "}
            {shipment.receiver}
          </p>

          <p>
             <strong>Status:</strong>{" "}
             <StatusBadge status={shipment.status} />
             <ShipmentProgress status={shipment.status} />
          </p>

          <p>
            <strong>Current Location:</strong>{" "}
            {shipment.location}
          </p>

          <p>
            <strong>Estimated Delivery:</strong>{" "}
            {shipment.estimatedDelivery}
          </p>
          <hr className="my-6" />

<h3 className="mb-4 text-xl font-bold">
  Tracking History
</h3>

<div className="space-y-4">
  {shipment.history.map((item, index) => (
    <div
      key={index}
      className="flex items-center justify-between rounded-lg border p-4"
    >
      <div>
        <p className="font-semibold">
          {item.status}
        </p>

        <p className="text-sm text-gray-500">
          {item.date} • {item.time}
        </p>
      </div>

      <div className="h-3 w-3 rounded-full bg-green-600"></div>
    </div>
  ))}
    </div>
        </div>
      )}
    </div>
  );
}