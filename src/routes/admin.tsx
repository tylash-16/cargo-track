import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import {
  getShipments,
  addShipment,
  updateShipment,
  deleteShipment,
} from "../services/shipmentServices";

import type { Shipment } from "../types/shipment";

export const Route = createFileRoute("/admin")({
  component: () => <Admin />,
});

const emptyForm = {
  trackingNumber: "",
  sender: "",
  receiver: "",
  location: "",
  status: "Package Received",
  estimatedDelivery: "",
};

export default function Admin() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editing, setEditing] = useState(false);
  const [editingTracking, setEditingTracking] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments() {
    const data = await getShipments();
    setShipments(data || []);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !formData.trackingNumber ||
      !formData.sender ||
      !formData.receiver
    ) {
      setError("Please fill all required fields");
      return;
    }

    const shipment: Shipment = {
      ...formData,
      history: [
        {
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: formData.status,
        },
      ],
    };

    let success = false;

    if (editing) {
      success = await updateShipment(editingTracking, shipment);
    } else {
      success = await addShipment(shipment);
    }

    if (success) {
      setMessage(
        editing
          ? "Shipment updated successfully."
          : "Shipment added successfully."
      );

      setError("");
      setEditing(false);
      setEditingTracking("");
      setFormData(emptyForm);

      loadShipments();
    } else {
      setMessage("");
      setError("Operation failed.");
    }
  }

  function handleEdit(item: any) {
    setEditing(true);
    setEditingTracking(item.tracking_number);

    setFormData({
      trackingNumber: item.tracking_number,
      sender: item.sender,
      receiver: item.receiver,
      location: item.location,
      status: item.status,
      estimatedDelivery: item.estimated_delivery,
    });
  }

  async function handleDelete(tracking: string) {
    if (!confirm("Delete shipment?")) return;

    await deleteShipment(tracking);

    loadShipments();
  }

  return (
    <div className="mx-auto max-w-6xl p-8">

      <h1 className="mb-8 text-3xl font-bold">
        Admin Dashboard
      </h1>

      {message && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-10 grid gap-4 md:grid-cols-2"
      >
        <input
          placeholder="Tracking Number"
          value={formData.trackingNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              trackingNumber: e.target.value,
            })
          }
          className="rounded border p-3"
        />

        <input
          placeholder="Sender"
          value={formData.sender}
          onChange={(e) =>
            setFormData({
              ...formData,
              sender: e.target.value,
            })
          }
          className="rounded border p-3"
        />

        <input
          placeholder="Receiver"
          value={formData.receiver}
          onChange={(e) =>
            setFormData({
              ...formData,
              receiver: e.target.value,
            })
          }
          className="rounded border p-3"
        />

        <input
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({
              ...formData,
              location: e.target.value,
            })
          }
          className="rounded border p-3"
        />

        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value,
            })
          }
          className="rounded border p-3"
        >
          <option>Package Received</option>
          <option>Departed Warehouse</option>
          <option>In Transit</option>
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
          className="rounded border p-3"
        />

        <button
          className="rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
        >
          {editing ? "Update Shipment" : "Add Shipment"}
        </button>
      </form>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3">Tracking</th>

            <th>Sender</th>

            <th>Receiver</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {shipments.map((item: any) => (

            <tr key={item.id} className="border-t">

              <td className="p-3">
                {item.tracking_number}
              </td>

              <td>{item.sender}</td>

              <td>{item.receiver}</td>

              <td>{item.status}</td>

              <td className="space-x-2">

                <button
                  onClick={() => handleEdit(item)}
                  className="rounded bg-yellow-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(item.tracking_number)
                  }
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
