import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { signup } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		const result = await signup(username, email, password);

		if (result.success) {
			navigate('/');
		} else {
			setError(result.error);
		}
		setLoading(false);
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4 md:p-6">
			<div className="w-full max-w-[450px] p-6 md:p-10 bg-white rounded-xl shadow-lg border border-border">
				<h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-text-primary">
					Join Medium Clone
				</h1>
				<p className="text-center text-text-secondary mb-6 md:mb-8 text-sm md:text-[0.95rem]">
					Create an account to start writing
				</p>

				{error && (
					<div className="bg-red-50 text-error p-3 md:p-4 rounded-lg mb-4 md:mb-6 border-l-4 border-error text-xs md:text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="mb-4 md:mb-6">
					<div className="mb-4 md:mb-6">
						<label
							htmlFor="username"
							className="block mb-2 font-semibold text-xs md:text-sm text-text-primary">
							Username
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="johndoe"
							required
							className="w-full p-3 md:p-3.5 border border-border rounded-lg text-sm md:text-base bg-white transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
						/>
					</div>

					<div className="mb-4 md:mb-6">
						<label
							htmlFor="email"
							className="block mb-2 font-semibold text-xs md:text-sm text-text-primary">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							className="w-full p-3 md:p-3.5 border border-border rounded-lg text-sm md:text-base bg-white transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
						/>
					</div>

					<div className="mb-4 md:mb-6">
						<label
							htmlFor="password"
							className="block mb-2 font-semibold text-xs md:text-sm text-text-primary">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="At least 6 characters"
							required
							minLength={6}
							className="w-full p-3 md:p-3.5 border border-border rounded-lg text-sm md:text-base bg-white transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
						/>
					</div>

					<button
						type="submit"
						className="w-full p-3 md:p-3.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
						disabled={loading}>
						{loading ? 'Creating account...' : 'Sign Up'}
					</button>
				</form>

				<p className="text-center text-text-secondary text-xs md:text-sm">
					Already have an account?{' '}
					<Link to="/login" className="text-primary font-semibold hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Signup;
