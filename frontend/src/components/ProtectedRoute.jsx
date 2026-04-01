import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <p className="p-6 text-slate-200">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
