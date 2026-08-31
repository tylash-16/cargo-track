import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-blue-700 px-10 py-4 text-white">
      <h1 className="text-2xl font-bold">
        CargoTrack
      </h1>

      <div className="flex gap-8">
        <Link to="/">Home</Link>

        <Link to="/services">
          Services
        </Link>

        <Link to="/tracking">
          Tracking
        </Link>

        <Link to="/about">
          About
        </Link>

        <Link to="/contact">
          Contact
        </Link>
      </div>
    </nav>
  );
}