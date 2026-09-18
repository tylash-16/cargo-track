import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import {
  addShipment,
  deleteShipment,
  getShipments,
  updateShipment,
} from "../services/shipmentServices";
import type { Shipment } from "../types/shipment";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

const statuses = [
  "Package Received",
  "Departed Warehouse",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const emptyForm = {
  trackingNumber: "",
  sender: "",
  receiver: "",
  location: "",
  status: "Package Received",
  estimatedDelivery: "",
};

function Admin() {
  const navigate = useNavigate();

  const [shipments, setShipments] = useState<any[]>([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingTrackingNumber, setEditingTrackingNumber] = useState<
    string | null
  >(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // CHECK LOGIN
  // =========================
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      await loadShipments();
    }

    checkUser();
  }, [navigate]);

  // =========================
  // LOAD SHIPMENTS
  // =========================
  async function loadShipments() {
    setLoading(true);

    const data = await getShipments();

    setShipments(data || []);
    setLoading(false);
  }

  // =========================
  // FORM INPUT
  // =========================
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // =========================
  // ADD / UPDATE SHIPMENT
  // =========================
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !formData.trackingNumber ||
      !formData.sender ||
      !formData.receiver ||
      !formData.location ||
      !formData.estimatedDelivery
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setSaving(true);

    const shipment: Shipment = {
      trackingNumber: formData.trackingNumber.trim(),
      sender: formData.sender.trim(),
      receiver: formData.receiver.trim(),
      location: formData.location.trim(),
      status: formData.status,
      estimatedDelivery: formData.estimatedDelivery,
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

    if (editingTrackingNumber) {
      success = await updateShipment(editingTrackingNumber, shipment);

      if (success) {
        setMessage("Shipment updated successfully.");
      }
    } else {
      success = await addShipment(shipment);

      if (success) {
        setMessage("Shipment added successfully.");
      }
    }

    setSaving(false);

    if (!success) {
      setError(
        editingTrackingNumber
          ? "Failed to update shipment."
          : "Failed to add shipment."
      );
      return;
    }

    setFormData(emptyForm);
    setEditingTrackingNumber(null);

    await loadShipments();
  }

  // =========================
  // EDIT
  // =========================
  function handleEdit(shipment: any) {
    setEditingTrackingNumber(shipment.tracking_number);

    setFormData({
      trackingNumber: shipment.tracking_number,
      sender: shipment.sender,
      receiver: shipment.receiver,
      location: shipment.location,
      status: shipment.status,
      estimatedDelivery: shipment.estimated_delivery,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // CANCEL EDIT
  // =========================
  function cancelEdit() {
    setEditingTrackingNumber(null);
    setFormData(emptyForm);
    setMessage("");
    setError("");
  }

  // =========================
  // DELETE
  // =========================
  async function handleDelete(trackingNumber: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${trackingNumber}?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    const success = await deleteShipment(trackingNumber);

    if (!success) {
      setError("Failed to delete shipment.");
      return;
    }

    setMessage("Shipment deleted successfully.");

    await loadShipments();
  }

  // =========================
  // QUICK STATUS UPDATE
  // =========================
  async function handleQuickStatusUpdate(
    trackingNumber: string,
    newStatus: string
  ) {
    const shipment = shipments.find(
      (item) => item.tracking_number === trackingNumber
    );

    if (!shipment) {
      return;
    }

    if (shipment.status === newStatus) {
      return;
    }

    const shipmentData: Shipment = {
      trackingNumber: shipment.tracking_number,
      sender: shipment.sender,
      receiver: shipment.receiver,
      location: shipment.location,
      status: newStatus,
      estimatedDelivery: shipment.estimated_delivery,
      history: shipment.history || [],
    };

    const success = await updateShipment(
      trackingNumber,
      shipmentData
    );

    if (!success) {
      setError("Failed to update shipment status.");
      return;
    }

    setMessage("Shipment status updated successfully.");

    await loadShipments();
  }

  // =========================
  // LOGOUT
  // =========================
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredShipments = shipments.filter((shipment) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      shipment.tracking_number
        ?.toLowerCase()
        .includes(searchText) ||
      shipment.sender?.toLowerCase().includes(searchText) ||
      shipment.receiver?.toLowerCase().includes(searchText) ||
      shipment.location?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // STATISTICS
  // =========================
  const totalShipments = shipments.length;

  const deliveredShipments = shipments.filter(
    (item) => item.status === "Delivered"
  ).length;

  const inTransitShipments = shipments.filter(
    (item) =>
      item.status === "In Transit" ||
      item.status === "Departed Warehouse" ||
      item.status === "Out for Delivery"
  ).length;

  const pendingShipments = shipments.filter(
    (item) => item.status === "Package Received"
  ).length;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================
          HEADER
      ========================= */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              CargoTrack
            </h1>

            <p className="text-sm text-slate-500">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* TITLE */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Dashboard Overview
          </h2>

          <p className="mt-1 text-slate-500">
            Manage and monitor all CargoTrack shipments.
          </p>
        </div>

        {/* =========================
            MESSAGE
        ========================= */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* =========================
            STATISTICS
        ========================= */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Shipments
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalShipments}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {deliveredShipments}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              In Transit
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {inTransitShipments}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {pendingShipments}
            </p>
          </div>

        </div>

        {/* =========================
            ADD / EDIT FORM
        ========================= */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {editingTrackingNumber
                  ? "Edit Shipment"
                  : "Add New Shipment"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {editingTrackingNumber
                  ? "Update shipment information below."
                  : "Create a new shipment record."}
              </p>
            </div>

            {editingTrackingNumber && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >

            {/* TRACKING NUMBER */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tracking Number
              </label>

              <input
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                disabled={!!editingTrackingNumber}
                placeholder="e.g. CT55555555TZ"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
              />
            </div>

            {/* SENDER */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Sender
              </label>

              <input
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                placeholder="Sender name"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* RECEIVER */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Receiver
              </label>

              <input
                name="receiver"
                value={formData.receiver}
                onChange={handleChange}
                placeholder="Receiver name"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Location
              </label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Zanzibar"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* ESTIMATED DELIVERY */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Estimated Delivery
              </label>

              <input
                type="date"
                name="estimatedDelivery"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingTrackingNumber
                    ? "Update Shipment"
                    : "Add Shipment"}
              </button>
            </div>

          </form>
        </section>

        {/* =========================
            SEARCH + FILTER
        ========================= */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Shipments
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Search and filter your shipment records.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {/* SEARCH */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search Shipment
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tracking number, sender, receiver or location..."
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* FILTER */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Filter by Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="All">All Statuses</option>

                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* RESULTS COUNT */}
          <div className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredShipments.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {totalShipments}
            </span>{" "}
            shipments
          </div>

        </section>

        {/* =========================
            SHIPMENT TABLE
        ========================= */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-[1100px] w-full">

              <thead className="bg-slate-100">

                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Tracking Number
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Sender
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Receiver
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Update Status
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredShipments.length === 0 ? (

                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center"
                    >
                      <p className="font-medium text-slate-700">
                        No shipments found.
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try another search or status filter.
                      </p>
                    </td>
                  </tr>

                ) : (

                  filteredShipments.map((shipment) => (

                    <tr
                      key={shipment.tracking_number}
                      className="hover:bg-slate-50"
                    >

                      {/* TRACKING */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-blue-600">
                          {shipment.tracking_number}
                        </p>
                      </td>

                      {/* SENDER */}
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {shipment.sender}
                      </td>

                      {/* RECEIVER */}
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {shipment.receiver}
                      </td>

                      {/* LOCATION */}
                      <td className="px-5 py-4 text-sm text-slate-700">
                        📍 {shipment.location}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            shipment.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : shipment.status === "Package Received"
                                ? "bg-orange-100 text-orange-700"
                                : shipment.status === "Out for Delivery"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {shipment.status}
                        </span>

                      </td>

                      {/* QUICK STATUS */}
                      <td className="px-5 py-4">

                        <select
                          value={shipment.status}
                          onChange={(e) =>
                            handleQuickStatusUpdate(
                              shipment.tracking_number,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >

                          {statuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}

                        </select>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() => handleEdit(shipment)}
                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                shipment.tracking_number
                              )
                            }
                            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="mt-12 border-t bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CargoTrack. All rights reserved.
      </footer>

    </div>
  );
}