export function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-blue-600 px-8 py-4 text-white">
      <h1 className="text-2xl font-bold">CargoTrack</h1>

      <ul className="flex gap-6">
        <li>Home</li>
        <li>Tracking</li>
        <li>Login</li>
      </ul>
    </nav>
  )
}