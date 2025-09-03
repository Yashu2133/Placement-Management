import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-3">404</h1>
      <p className="mb-4">Page Not Found</p>
      <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Go to Login</Link>
    </div>
  )
}
