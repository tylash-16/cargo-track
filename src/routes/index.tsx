import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { searchShipment } from "../services/shipmentServices";
import type { Shipment } from "../types/shipment";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack() {
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
      setError("Tracking number not found.");
      return;
    }

    setShipment(result);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-blue-600"
          >
            CargoTrack
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="font-medium text-slate-700 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/tracking"
              className="font-medium text-slate-700 hover:text-blue-600"
            >
              Track Shipment
            </Link>

            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Admin Login
            </Link>
          </div>

        </div>
      </nav>


      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">

          <div className="mx-auto max-w-3xl text-center text-white">

            <div className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              🚚 Reliable Shipment Tracking
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Track Your Shipment
              <span className="block text-blue-200">
                Across Tanzania
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Track your package in real time and stay updated
              throughout its delivery journey.
            </p>


            {/* TRACKING BOX */}
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-3 shadow-2xl">

              <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  placeholder="Enter tracking number e.g. CT55555555TZ"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTrack();
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-200 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <button
                  onClick={handleTrack}
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Tracking..." : "Track Shipment"}
                </button>

              </div>

            </div>


            {/* ERROR */}
            {error && (
              <div className="mx-auto mt-4 max-w-2xl rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}


            {/* RESULT */}
            {shipment && (
              <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-white p-6 text-left text-slate-900 shadow-xl">

                <div className="flex flex-col justify-between gap-4 sm:flex-row">

                  <div>
                    <p className="text-sm text-slate-500">
                      Tracking Number
                    </p>

                    <h2 className="text-xl font-bold">
                      {shipment.trackingNumber}
                    </h2>
                  </div>

                  <span className="h-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    {shipment.status}
                  </span>

                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Sender
                    </p>
                    <p className="mt-1 font-semibold">
                      {shipment.sender}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Receiver
                    </p>
                    <p className="mt-1 font-semibold">
                      {shipment.receiver}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Current Location
                    </p>
                    <p className="mt-1 font-semibold">
                      {shipment.location}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Estimated Delivery
                    </p>
                    <p className="mt-1 font-semibold">
                      {shipment.estimatedDelivery}
                    </p>
                  </div>

                </div>

                <Link
                  to="/tracking"
                  className="mt-6 block rounded-xl bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
                >
                  View Full Tracking Details
                </Link>

              </div>
            )}

          </div>
        </div>
      </section>


      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold text-blue-600">
            WHY CARGOTRACK
          </p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Simple and Reliable Tracking
          </h2>

          <p className="mt-4 text-slate-600">
            Everything you need to keep track of your shipments
            from pickup to delivery.
          </p>
        </div>


        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="text-4xl">📦</div>

            <h3 className="mt-5 text-xl font-bold">
              Easy Tracking
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Enter your tracking number and instantly see
              the current status of your shipment.
            </p>
          </div>


          <div className="rounded-2xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="text-4xl">📍</div>

            <h3 className="mt-5 text-xl font-bold">
              Shipment Location
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Know where your shipment currently is and
              follow its journey.
            </p>
          </div>


          <div className="rounded-2xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="text-4xl">🔔</div>

            <h3 className="mt-5 text-xl font-bold">
              Status Updates
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Follow shipment progress from receiving to
              final delivery.
            </p>
          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="bg-white py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <p className="font-semibold text-blue-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Track Your Package in 3 Steps
            </h2>
          </div>


          <div className="mt-12 grid gap-8 md:grid-cols-3">

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                1
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Enter Tracking Number
              </h3>

              <p className="mt-3 text-slate-600">
                Enter the tracking number provided when
                your shipment was registered.
              </p>
            </div>


            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                2
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Check Status
              </h3>

              <p className="mt-3 text-slate-600">
                View the current location and delivery
                status of your shipment.
              </p>
            </div>


            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                3
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Follow Delivery
              </h3>

              <p className="mt-3 text-slate-600">
                Follow your package until it reaches
                its destination.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center text-white">

          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Track Your Shipment?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Enter your tracking number and get the latest
            information about your package.
          </p>

          <Link
            to="/tracking"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white hover:bg-blue-700"
          >
            Track Shipment
          </Link>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="bg-slate-950 py-8 text-slate-400">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">

          <div>
            <p className="text-lg font-bold text-white">
              CargoTrack
            </p>

            <p className="mt-1 text-sm">
              Reliable shipment tracking across Tanzania.
            </p>
          </div>

          <div className="text-sm">
            © {new Date().getFullYear()} CargoTrack. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}