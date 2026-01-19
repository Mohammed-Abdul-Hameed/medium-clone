import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

/**
 * useAuth Hook
 *
 * Provides typed access to the authentication context.
 * Ensures that authentication state and actions are only
 * consumed within the AuthProvider tree.
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};

/**
 * AuthProvider Component
 *
 * Responsibility:
 * - Maintains global authentication state.
 * - Persists user session across page reloads using localStorage.
 * - Exposes signup, login, and logout actions to consumers.
 *
 * This provider serves as the single source of truth
 * for client-side authentication status.
 */
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	/**
	 * Initialize authentication state on application mount.
	 *
	 * Behavior:
	 * - Reads persisted token and user data from localStorage.
	 * - Restores user session if stored data is valid.
	 * - Clears corrupted storage data to prevent inconsistent state.
	 */
	useEffect(() => {
		const token = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (token && storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				console.error('Error parsing user from localStorage', error);
				localStorage.removeItem('user');
				localStorage.removeItem('token');
			}
		}
		setLoading(false);
	}, []);

	/**
	 * Registers a new user account.
	 *
	 * Contract:
	 * - Sends credentials to signup endpoint.
	 * - Stores returned token and user in localStorage.
	 * - Updates authentication state upon success.
	 */
	const signup = async (username, email, password) => {
		try {
			const response = await api.post('/auth/signup', {
				username,
				email,
				password,
			});

			const { user, token } = response.data.data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			setUser(user);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.response?.data?.message || 'Signup failed',
			};
		}
	};

	/**
	 * Authenticates an existing user.
	 *
	 * Contract:
	 * - Sends login credentials to authentication endpoint.
	 * - Stores returned token and user in localStorage.
	 * - Updates authentication state upon success.
	 */
	const login = async (email, password) => {
		try {
			const response = await api.post('/auth/login', {
				email,
				password,
			});

			const { user, token } = response.data.data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			setUser(user);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.response?.data?.message || 'Login failed',
			};
		}
	};

	/**
	 * Terminates the current user session.
	 *
	 * Behavior:
	 * - Clears persisted authentication data.
	 * - Resets in-memory user state.
	 */
	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
	};

	// Exposed authentication context value
	const value = {
		user,
		loading,
		signup,
		login,
		logout,
		isAuthenticated: !!user,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
