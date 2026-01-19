import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Navbar Component
 *
 * Responsibility:
 * - Provides global navigation across the application.
 * - Reflects authentication state by conditionally rendering
 *   user actions (login/signup vs write/profile/logout).
 * - Handles logout flow and client-side redirection.
 *
 * This component is persistent across routes and remains fixed
 * at the top of the viewport for consistent user access.
 */
const Navbar = () => {
	// Access authentication context state and actions
	const { user, logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	/**
	 * Handles user logout.
	 *
	 * Contract:
	 * - Invokes logout from auth context to clear session state.
	 * - Redirects user to home route after logout completion.
	 */
	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-border py-3 md:py-4">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 flex justify-between items-center">
				{/* Application brand logo / home navigation link */}
				<Link
					to="/"
					className="text-xl md:text-2xl font-bold text-text-primary tracking-tighter hover:text-primary transition-colors">
					Medium Clone
				</Link>

				{/* Right-side navigation actions based on auth state */}
				<div className="flex items-center gap-2 md:gap-6">
					{isAuthenticated ? (
						<>
							{/* Link to article creation page */}
							<Link
								to="/new-article"
								className="inline-flex items-center justify-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-md">
								Write
							</Link>

							{/* Link to authenticated user's profile */}
							<Link
								to={`/profile/${user.username}`}
								className="text-text-secondary text-sm md:text-[0.95rem] font-medium hover:text-text-primary transition-colors hidden sm:block">
								{user.username}
							</Link>

							{/* Logout action button */}
							<button
								onClick={handleLogout}
								className="inline-flex items-center justify-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-transparent text-text-primary border border-border hover:bg-bg-secondary hover:border-text-secondary">
								Logout
							</button>
						</>
					) : (
						<>
							{/* Link to login page */}
							<Link
								to="/login"
								className="text-text-secondary text-sm md:text-[0.95rem] font-medium hover:text-text-primary transition-colors hidden sm:block">
								Sign In
							</Link>

							{/* Link to signup page */}
							<Link
								to="/signup"
								className="inline-flex items-center justify-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-md">
								Get Started
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
