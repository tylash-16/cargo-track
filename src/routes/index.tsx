import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  
  return (  
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-5xl font-bold">CargoTrack</h1>

    <p className="mt-4 text-lg text-gray-600">
      Track your shipments easily across Tanzania.
    </p>

    <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
      Track Shipment
    </button>
  </div>
)
}
