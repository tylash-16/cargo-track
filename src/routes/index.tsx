import { createFileRoute, Link,useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
    const navigate = useNavigate();

const [trackingNumber, setTrackingNumber] = useState("");

const handleTrack = () => {
  if (!trackingNumber.trim()) return;

  navigate({
    to: "/tracking",
    search: {
      tracking: trackingNumber,
    },
  });
};
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-5xl font-bold md:text-6xl">
            Fast & Secure Cargo Tracking
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Track your shipments in real time across Tanzania and worldwide with
            CargoTrack.
          </p>
           <div className="mx-auto mt-10 flex max-w-2xl rounded-xl bg-white p-2 shadow-lg">
   <input
    type="text"
    placeholder="Enter Tracking Number..."
    value={trackingNumber}
    onChange={(e) => setTrackingNumber(e.target.value)}
    className="flex-1 rounded-lg px-4 py-3 text-black outline-none"
  />

    <button
    onClick={handleTrack}
    className="rounded-lg bg-blue-700 px-8 text-white hover:bg-blue-800"
  >
    Track
     </button>
      </div>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/tracking"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-700 hover:bg-gray-100"
            >
              Track Shipment
            </Link>

            <Link
              to="/services"
              className="rounded-lg border border-white px-8 py-3 font-semibold hover:bg-white hover:text-blue-700"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Why Choose CargoTrack?
          </h2>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="rounded-xl border p-6 text-center shadow">
              <div className="text-5xl">🚚</div>
              <h3 className="mt-4 text-xl font-bold">
                Fast Delivery
              </h3>

              <p className="mt-3 text-gray-600">
                We deliver shipments quickly and safely.
              </p>
            </div>

            <div className="rounded-xl border p-6 text-center shadow">
              <div className="text-5xl">📍</div>
              <h3 className="mt-4 text-xl font-bold">
                Live Tracking
              </h3>

              <p className="mt-3 text-gray-600">
                Track your shipment anytime.
              </p>
            </div>

            <div className="rounded-xl border p-6 text-center shadow">
              <div className="text-5xl">🔒</div>
              <h3 className="mt-4 text-xl font-bold">
                Secure Cargo
              </h3>

              <p className="mt-3 text-gray-600">
                Your goods are fully protected.
              </p>
            </div>

            <div className="rounded-xl border p-6 text-center shadow">
              <div className="text-5xl">🌍</div>
              <h3 className="mt-4 text-xl font-bold">
                Worldwide Shipping
              </h3>

              <p className="mt-3 text-gray-600">
                Delivering across the globe.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Services */}
<section className="bg-gray-50 py-20">
  <div className="mx-auto max-w-6xl px-6">
    <h2 className="mb-12 text-center text-4xl font-bold">
      Our Services
    </h2>

    <div className="grid gap-8 md:grid-cols-4">

      <div className="rounded-xl bg-white p-6 text-center shadow transition hover:-translate-y-2 hover:shadow-xl">
        <div className="text-5xl">✈️</div>
        <h3 className="mt-4 text-xl font-bold">Air Freight</h3>
        <p className="mt-3 text-gray-600">
          Fast international air cargo delivery.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 text-center shadow transition hover:-translate-y-2 hover:shadow-xl">
        <div className="text-5xl">🚢</div>
        <h3 className="mt-4 text-xl font-bold">Sea Freight</h3>
        <p className="mt-3 text-gray-600">
          Affordable worldwide ocean shipping.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 text-center shadow transition hover:-translate-y-2 hover:shadow-xl">
        <div className="text-5xl">🚛</div>
        <h3 className="mt-4 text-xl font-bold">Road Transport</h3>
        <p className="mt-3 text-gray-600">
          Safe and reliable local deliveries.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 text-center shadow transition hover:-translate-y-2 hover:shadow-xl">
        <div className="text-5xl">📦</div>
        <h3 className="mt-4 text-xl font-bold">Warehousing</h3>
        <p className="mt-3 text-gray-600">
          Secure storage and inventory management.
        </p>
      </div>

    </div>
  </div>
</section>

      {/* Statistics */}
      <section className="bg-gray-100 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div>
              <h2 className="text-5xl font-bold text-blue-700">
                15K+
              </h2>

              <p className="mt-3 text-gray-600">
                Shipments Delivered
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-blue-700">
                120+
              </h2>

              <p className="mt-3 text-gray-600">
                Countries Served
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-blue-700">
                99%
              </h2>

              <p className="mt-3 text-gray-600">
                Customer Satisfaction
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-blue-700">
                24/7
              </h2>

              <p className="mt-3 text-gray-600">
                Customer Support
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
<section className="bg-white py-20">
  <div className="mx-auto max-w-6xl px-6">

    <h2 className="mb-12 text-center text-4xl font-bold">
      What Our Clients Say
    </h2>

    <div className="grid gap-8 md:grid-cols-3">

      <div className="rounded-xl bg-gray-50 p-6 shadow">
        <div className="mb-4 text-2xl text-yellow-500">
          ⭐⭐⭐⭐⭐
        </div>

        <p className="text-gray-600 italic">
          "CargoTrack made it very easy to monitor my shipment from Dar es Salaam to Mwanza."
        </p>

        <h3 className="mt-6 font-bold">
          John M.
        </h3>
      </div>

      <div className="rounded-xl bg-gray-50 p-6 shadow">
        <div className="mb-4 text-2xl text-yellow-500">
          ⭐⭐⭐⭐⭐
        </div>

        <p className="text-gray-600 italic">
          "Excellent customer support and very fast delivery. Highly recommended."
        </p>

        <h3 className="mt-6 font-bold">
          Sarah K.
        </h3>
      </div>

      <div className="rounded-xl bg-gray-50 p-6 shadow">
        <div className="mb-4 text-2xl text-yellow-500">
          ⭐⭐⭐⭐⭐
        </div>

        <p className="text-gray-600 italic">
          "The tracking system is accurate and simple to use."
        </p>

        <h3 className="mt-6 font-bold">
          David P.
        </h3>
      </div>

    </div>

  </div>
</section>

      {/* Call To Action */}
      <section className="bg-blue-700 py-20 text-center text-white">
        <h2 className="text-4xl font-bold">
          Ready to Track Your Shipment?
        </h2>

        <p className="mt-5 text-lg">
          Experience fast, secure and reliable cargo tracking.
        </p>

        <Link
          to="/tracking"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-700 hover:bg-gray-100"
        >
          Track Now
        </Link>
      </section>
    </>
  );
}