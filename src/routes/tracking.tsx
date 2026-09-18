import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import type { Shipment } from "../types/shipment";
import { searchShipment } from "../services/shipmentServices";

import ShipmentProgress from "../components/ShipmentProgress";

export const Route = createFileRoute("/tracking")({
  component: Tracking,
});

function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number.");
      setShipment(null);
      return;
    }

    setLoading(true);
    setError("");
    setShipment(null);

    const result = await searchShipment(trackingNumber);

    setLoading(false);

    if (!result) {
      setError(
        "Shipment not found. Please check your tracking number."
      );
      return;
    }

    setShipment(result);
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            CargoTrack
          </Link>

          <div className="flex items-center gap-4">

            <Link
              to="/"
              className="hidden font-medium text-slate-600 hover:text-blue-600 sm:block"
            >
              Home
            </Link>

            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Admin Login
            </Link>

          </div>

        </div>
      </nav>


      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-700 px-6 py-16 text-white">

        <div className="mx-auto max-w-4xl text-center">

          <p className="mb-3 font-semibold text-blue-200">
            CARGOTRACK
          </p>

          <h1 className="text-4xl font-extrabold md:text-5xl">
            Track Your Shipment
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Enter your tracking number below to see the
            latest information about your shipment.
          </p>


          {/* SEARCH */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-3 shadow-xl">

            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                type="text"
                placeholder="Example: CT55555555TZ"
                value={trackingNumber}
                onChange={(e) =>
                  setTrackingNumber(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              <button
                onClick={handleSearch}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Searching..." : "Track"}
              </button>

            </div>

          </div>

          {error && (
            <div className="mx-auto mt-4 max-w-2xl rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

        </div>

      </section>


      {/* RESULT */}
      <main className="mx-auto max-w-5xl px-6 py-12">

        {shipment ? (
          <div className="space-y-6">

            {/* MAIN INFO CARD */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">

              <div className="flex flex-col justify-between gap-5 border-b pb-6 md:flex-row md:items-center">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Tracking Number
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {shipment.trackingNumber}
                  </h2>
                </div>


                <div className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
                  {shipment.status}
                </div>

              </div>


              {/* DETAILS */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Sender
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {shipment.sender}
                  </p>
                </div>


                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Receiver
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {shipment.receiver}
                  </p>
                </div>


                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Current Location
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    📍 {shipment.location}
                  </p>
                </div>


                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Estimated Delivery
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {shipment.estimatedDelivery}
                  </p>
                </div>

              </div>


              {/* PROGRESS */}
              <ShipmentProgress status={shipment.status} />

            </div>


            {/* HISTORY */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">

              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Tracking History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest updates for this shipment.
                </p>
              </div>


              {shipment.history && shipment.history.length > 0 ? (

                <div className="space-y-5">

                  {[...shipment.history]
                    .reverse()
                    .map((item, index) => (

                      <div
                        key={`${item.date}-${item.time}-${index}`}
                        className="flex gap-4"
                      >

                        {/* Timeline dot */}
                        <div className="flex flex-col items-center">

                          <div
                            className={`mt-1 h-3 w-3 rounded-full ${
                              index === 0
                                ? "bg-blue-600"
                                : "bg-slate-300"
                            }`}
                          />

                          {index !==
                            shipment.history.length - 1 && (
                            <div className="mt-1 h-full w-px bg-slate-200" />
                          )}

                        </div>


                        {/* History details */}
                        <div className="pb-5">

                          <p
                            className={`font-semibold ${
                              index === 0
                                ? "text-blue-700"
                                : "text-slate-700"
                            }`}
                          >
                            {item.status}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.date} • {item.time}
                          </p>

                        </div>

                      </div>

                    ))}

                </div>

              ) : (

                <p className="text-slate-500">
                  No tracking history available.
                </p>

              )}

            </div>


            {/* BACK BUTTON */}
            <div className="text-center">

              <Link
                to="/"
                className="inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
              >
                ← Back to Home
              </Link>

            </div>

          </div>

        ) : (

          /* EMPTY STATE */
          <div className="rounded-2xl border bg-white px-6 py-16 text-center shadow-sm">

            <div className="text-5xl">
              📦
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Enter a Tracking Number
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Enter your shipment tracking number above
              to see its current status, location, and
              delivery history.
            </p>

          </div>

        )}

      </main>


      {/* FOOTER */}
      <footer className="border-t bg-white py-8">

        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">

          © {new Date().getFullYear()} CargoTrack.
          Reliable shipment tracking across Tanzania.

        </div>

      </footer>

    </div>
  );
}