
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "../services/authService";
import { useEffect,useState } from "react";
import type { SyntheticEvent } from "react";
import {
  getShipments,
  addShipment,
  updateShipment,
  deleteShipment,
} from "../services/shipmentServices";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },

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
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editingTracking, setEditingTracking] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);

const itemsPerPage = 5;
useEffect(() => {
  loadShipments();
}, []);

async function loadShipments() {
  const data = await getShipments();
  setList(data);
}
  const totalShipments = list.length;

const deliveredCount = list.filter(
  (shipment: any) => shipment.status === "Delivered"
).length;

const transitCount = list.filter(
  (shipment: any) => shipment.status === "In Transit"
).length;

const pickedUpCount = list.filter(
  (shipment: any) => shipment.status === "Picked Up"
).length;
  const filteredShipments = list
  .filter((shipment: any) => {
    const matchesSearch =
      shipment.trackingNumber
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      shipment.sender
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      shipment.receiver
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a: any, b: any) => {
    if (sortBy === "A-Z") {
      return a.trackingNumber.localeCompare(b.trackingNumber);
    }

    if (sortBy === "Z-A") {
      return b.trackingNumber.localeCompare(a.trackingNumber);
    }

    if (sortBy === "Sender") {
      return a.sender.localeCompare(b.sender);
    }

    if (sortBy === "Status") {
      return a.status.localeCompare(b.status);
    }

    return 0;
  });

const totalPages = Math.ceil(
  filteredShipments.length / itemsPerPage
);

const startIndex = (currentPage - 1) * itemsPerPage;

const paginatedShipments = filteredShipments.slice(
  startIndex,
  startIndex + itemsPerPage
);

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

const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/login";
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
      <div className="mb-6 flex items-center justify-between">
  <h1 className="text-3xl font-bold">
    CargoTrack Admin Dashboard
  </h1>

  <button
    onClick={handleLogout}
    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
  >
    Logout
    </button>
     </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-blue-600 p-5 text-white shadow">
          <h3 className="text-lg font-semibold">Total Shipments</h3>
          <p className="mt-2 text-3xl font-bold">{totalShipments}</p>
        </div>

        <div className="rounded-lg bg-yellow-500 p-5 text-white shadow">
          <h3 className="text-lg font-semibold">In Transit</h3>
          <p className="mt-2 text-3xl font-bold">{transitCount}</p>
        </div>

        <div className="rounded-lg bg-green-600 p-5 text-white shadow">
          <h3 className="text-lg font-semibold">Delivered</h3>
          <p className="mt-2 text-3xl font-bold">{deliveredCount}</p>
        </div>

        <div className="rounded-lg bg-purple-600 p-5 text-white shadow">
          <h3 className="text-lg font-semibold">Picked Up</h3>
          <p className="mt-2 text-3xl font-bold">{pickedUpCount}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-700">{error}</div>
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
        <h2 className="mb-4 text-2xl font-bold">All Shipments</h2>

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search shipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border p-3"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border p-3"
          >
            <option>All</option>
            <option>Picked Up</option>
            <option>In Transit</option>
            <option>Warehouse</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border p-3"
          >
            <option>Latest</option>
            <option>A-Z</option>
            <option>Z-A</option>
            <option>Sender</option>
            <option>Status</option>
          </select>
        </div>

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
              {paginatedShipments.map((shipment: any) => (
                <tr key={shipment.trackingNumber}>
                  <td className="border p-3">{shipment.trackingNumber}</td>
                  <td className="border p-3">{shipment.sender}</td>
                  <td className="border p-3">{shipment.receiver}</td>
                  <td className="border p-3">{shipment.status}</td>
                  <td className="border p-3">{shipment.location}</td>
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
          <div className="mt-4 flex items-center justify-between">
  <button
    onClick={() =>
      setCurrentPage((page) => Math.max(page - 1, 1))
    }
    disabled={currentPage === 1}
    className="rounded bg-gray-600 px-4 py-2 text-white disabled:opacity-50"
  >
    Previous
  </button>

  <span className="font-semibold">
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    onClick={() =>
      setCurrentPage((page) => Math.min(page + 1, totalPages))
    }
    disabled={
      currentPage === totalPages || totalPages === 0
    }
    className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
  >
    Next
  </button>
    </div>
        </div>
      </div>
    </div>
  );
}