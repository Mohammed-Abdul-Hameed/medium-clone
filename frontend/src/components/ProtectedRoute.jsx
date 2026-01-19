import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute Component
 *
 * Responsibility:
 * - Guards routes that require authentication.
 * - Displays a loading state while authentication status is resolving.
 * - Redirects unauthenticated users to the login page.
 *
 * This component acts as a client-side access control layer
 * for protected application routes.
 */
const ProtectedRoute = ({ children }) => {
	// Access authentication state and loading indicator
	const { isAuthenticated, loading } = useAuth();

	// Render interim loading state while auth status is being determined
	if (loading) {
		return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
	}

	// Redirect unauthenticated users to login screen
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	// Render protected content for authenticated users
	return children;
};

export default ProtectedRoute;
