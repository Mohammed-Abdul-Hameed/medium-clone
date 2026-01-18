import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
	const { user, logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-border py-3 md:py-4">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 flex justify-between items-center">
				<Link
					to="/"
					className="text-xl md:text-2xl font-bold text-text-primary tracking-tighter hover:text-primary transition-colors">
					Medium Clone
				</Link>
				<div className="flex items-center gap-2 md:gap-6">
					{isAuthenticated ? (
						<>
							<Link
								to="/new-article"
								className="inline-flex items-center justify-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-md">
								Write
							</Link>
							<Link
								to={`/profile/${user.username}`}
								className="text-text-secondary text-sm md:text-[0.95rem] font-medium hover:text-text-primary transition-colors hidden sm:block">
								{user.username}
							</Link>
							<button
								onClick={handleLogout}
								className="inline-flex items-center justify-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-transparent text-text-primary border border-border hover:bg-bg-secondary hover:border-text-secondary">
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="text-text-secondary text-sm md:text-[0.95rem] font-medium hover:text-text-primary transition-colors hidden sm:block">
								Sign In
							</Link>
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
