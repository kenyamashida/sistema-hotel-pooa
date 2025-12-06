import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, user, adminOnly }) {
  if (!user) return <Navigate to="/" />
  if (adminOnly && !user.isAdmin) return <Navigate to="/cliente" />
  return children
}
