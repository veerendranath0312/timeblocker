import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

