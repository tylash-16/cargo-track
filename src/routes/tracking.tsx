import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { searchShipment } from "../services/shipmentServices"

export const Route = createFileRoute("/tracking")({
  component: Tracking,
});

function Tracking() {
    const [trackingNumber, setTrackingNumber] = useState("");
const [shipment, setShipment] = useState<any>(null)
const [error, setError] = useState("")
  return (
    <div className="mx-auto mt-16 max-w-xl rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-4xl font-bold">
        Track Shipment
      </h1>

      <p className="mb-8 text-center text-gray-600">
        Enter your tracking number below.
      </p>

      <input
  type="text"
  placeholder="Example: CT123456789TZ"
  value={trackingNumber}
  onChange={(e) => setTrackingNumber(e.target.value)}
  className="w-full rounded-lg border p-3"
/>      

   <button
  
  onClick={() => {
    const result = searchShipment(trackingNumber)

    if (result) {
      setShipment(result)
      setError("")
    } else {
      setShipment(null)
      setError("Tracking number not found.")
    }
  }}
  className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
>
  Track Now
</button>

{error && (
  <div className="mt-4 rounded-lg bg-red-100 p-4 text-center text-red-700">
    {error}
  </div>
)}
  

{shipment && (
  <div className="mt-6 rounded-lg border bg-gray-50 p-6">
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
      <p className="mt-2">
  <strong>Status:</strong>

  <span
    className={`ml-2 rounded-full px-3 py-1 text-sm font-semibold text-white ${
      shipment.status === "Delivered"
        ? "bg-green-500"
        : shipment.status === "In Transit"
        ? "bg-yellow-500"
        : "bg-red-500"
    }`}
  >
    {shipment.status}
  </span>
</p>
    </p>

    <p>
      <strong>Location:</strong>{" "}
      {shipment.location}
        <strong>Estimated Delivery:</strong>{" "}
  {shipment.estimatedDelivery}
    </p>
  </div>
)}
    </div>
  );
}
