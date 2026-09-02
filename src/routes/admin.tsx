
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import {
  addShipment,
  updateShipment,
  deleteShipment,
  shipments,
} from "../services/shipmentServices";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const [formData, setFormData] = useState({
    trackingNumber: "",
    sender: "",
    receiver: "",
    location: "",
    status: "Picked Up",
    estimatedDelivery: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [list, setList] = useState(() => shipments.slice());
  const [editing, setEditing] = useState(false);
  const [editingTracking, setEditingTracking] = useState("");

  const handleEdit = (shipment: any) => {
  setFormData({
    trackingNumber: shipment.trackingNumber,
    sender: shipment.sender,
    receiver: shipment.receiver,
    location: shipment.location,
    status: shipment.status,
    estimatedDelivery: shipment.estimatedDelivery,
  });

  setEditing(true);
  setEditingTracking(shipment.trackingNumber);
};
const handleDelete = (trackingNumber: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this shipment?"
  );

  if (!confirmed) return;

  deleteShipment(trackingNumber);

  setList(shipments.slice());

  setMessage("Shipment deleted successfully.");
  setError("");
};

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.trackingNumber ||
      !formData.sender ||
      !formData.receiver
    ) {
      setError("Please fill all required fields.");
      setMessage("");
      return;
    }
    

     let success;

    if (editing) {
    success = updateShipment(editingTracking, formData);
    } else {
      success = addShipment(formData);
   }

    if (!success) {
      setError("Tracking Number already exists.");
      setMessage("");
      return;
    }

    if (editing) {
    setMessage("Shipment updated successfully.");
    } else {
    setMessage("Shipment saved successfully.");
  }

setError("");

    setEditing(false);
    setEditingTracking("");

    setFormData({
      trackingNumber: "",
      sender: "",
      receiver: "",
      location: "",
      status: "Picked Up",
      estimatedDelivery: "",
    });

    setList(shipments.slice());
  };

  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">
        CargoTrack Admin Dashboard
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Tracking Number"
          value={formData.trackingNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              trackingNumber: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        />

        <input
          type="text"
          placeholder="Sender"
          value={formData.sender}
          onChange={(e) =>
            setFormData({
              ...formData,
              sender: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        />

        <input
          type="text"
          placeholder="Receiver"
          value={formData.receiver}
          onChange={(e) =>
            setFormData({
              ...formData,
              receiver: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        />

        <input
          type="text"
          placeholder="Current Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({
              ...formData,
              location: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        />

        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        >
          <option>Picked Up</option>
          <option>In Transit</option>
          <option>Warehouse</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
        </select>

        <input
          type="date"
          value={formData.estimatedDelivery}
          onChange={(e) =>
            setFormData({
              ...formData,
              estimatedDelivery: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {editing ? "Update Shipment" : "Save Shipment"}
        </button>
      </form>
            <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">
          All Shipments
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Tracking</th>
                <th className="border p-3 text-left">Sender</th>
                <th className="border p-3 text-left">Receiver</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Location</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map((shipment: any) => (
                <tr key={shipment.trackingNumber}>
                  <td className="border p-3">
                    {shipment.trackingNumber}
                  </td>

                  <td className="border p-3">
                    {shipment.sender}
                  </td>

                  <td className="border p-3">
                    {shipment.receiver}
                  </td>

                  <td className="border p-3">
                    {shipment.status}
                  </td>

                  <td className="border p-3">
                    {shipment.location}
                  </td>
                 <td className="border p-3 text-center">
  <button
    onClick={() => handleEdit(shipment)}
    className="mr-2 rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
  >
    Edit
  </button>

    <button
  onClick={() => handleDelete(shipment.trackingNumber)}
  className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
>
  Delete
</button>
      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}