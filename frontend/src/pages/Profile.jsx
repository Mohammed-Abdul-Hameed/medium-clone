import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

/**
 * Profile Component
 *
 * Responsibility:
 * - Fetches and displays a user's public profile by username.
 * - Renders user metadata (username, email, bio).
 * - Displays a list of articles authored by the user.
 * - Conditionally exposes author-only actions when viewing own profile.
 *
 * This component represents the public-facing user profile page.
 */
const Profile = () => {
	// Local state for profile data and UI status flags
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// Route param for resolving profile owner
	const { username } = useParams();

	// Currently authenticated user (if any)
	const { user: currentUser } = useAuth();

	/**
	 * Fetch profile data when username route parameter changes.
	 */
	useEffect(() => {
		fetchProfile();
	}, [username]);

	/**
	 * Retrieves profile and authored articles from API.
	 *
	 * Failure mode:
	 * - Sets error state if retrieval fails.
	 * - Always resolves loading state after request completion.
	 */
	const fetchProfile = async () => {
		try {
			const response = await api.get(`/users/${username}`);
			setProfile(response.data.data);
		} catch (err) {
			setError('Failed to load profile');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// Loading state while profile data is being fetched
	if (loading) {
		return (
			<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6 text-center text-text-secondary">
				Loading profile...
			</div>
		);
	}

	// Error fallback state
	if (error) {
		return (
			<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6 bg-red-50 text-error p-3 md:p-4 rounded-lg mb-4 md:mb-6 border-l-4 border-error text-xs md:text-sm">
				{error}
			</div>
		);
	}

	// Profile not found fallback
	if (!profile || !profile.user) {
		return (
			<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6 text-center text-text-secondary">
				User not found
			</div>
		);
	}

	// Extract resolved profile user and articles
	const profileUser = profile.user;
	const articles = profile.articles || [];

	// Determine whether the current viewer owns this profile
	const isOwnProfile = currentUser && currentUser.username === username;

	return (
		<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6">
			{/* Profile header section */}
			<div className="py-8 md:py-12 border-b border-border mb-8 md:mb-12">
				<h1 className="text-2xl md:text-4xl font-bold mb-2 text-text-primary">
					{profileUser.username}
				</h1>
				<p className="text-text-secondary text-sm md:text-base mb-4">{profileUser.email}</p>
				<div className="text-sm md:text-lg leading-[1.6] text-text-primary mt-4">
					{profileUser.bio ? profileUser.bio : 'No bio yet.'}
				</div>
			</div>

			<div className="profile-articles">
				{/* Articles section header with conditional write action */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
					<h2 className="text-xl md:text-[1.75rem] font-bold text-text-primary">
						Stories
					</h2>

					{/* Write action visible only on own profile */}
					{isOwnProfile && (
						<Link
							to="/new-article"
							className="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-md">
							Write a story
						</Link>
					)}
				</div>

				{/* Empty state when no articles exist */}
				{articles.length === 0 ? (
					<div className="text-center py-12 md:py-16 px-4 md:px-8 text-text-secondary">
						{/* Empty state for own profile */}
						{isOwnProfile ? (
							<>
								<h2 className="text-xl md:text-2xl font-semibold mb-4 text-text-primary">
									You haven't written any stories yet
								</h2>
								<p className="text-sm md:text-lg mb-6">
									Share your thoughts, experiences, and expertise with the world.
									Start writing your first article today!
								</p>
								<Link
									to="/new-article"
									className="inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-md">
									Write your first story
								</Link>
							</>
						) : (
							<>
								<h2 className="text-xl md:text-2xl font-semibold mb-2 text-text-primary">
									No articles yet
								</h2>
								<p className="text-sm md:text-base">
									This user hasn't published any stories yet.
								</p>
							</>
						)}
					</div>
				) : (
					<div className="flex flex-col gap-10">
						{/* Article preview list */}
						{articles.map((article) => (
							<article
								key={article._id}
								className="pb-10 border-b border-border transition-all hover:translate-x-1 duration-300 last:border-b-0 group">
								<Link to={`/articles/${article._id}`}>
									{/* Article title */}
									<h2 className="text-2xl font-bold mb-3 text-text-primary leading-tight group-hover:text-primary transition-colors">
										{article.title}
									</h2>

									{/* Article excerpt */}
									<p className="text-text-secondary mb-4 leading-relaxed text-base">
										{article.content.substring(0, 200)}...
									</p>

									{/* Publication date */}
									<div className="flex items-center gap-4 text-sm">
										<span className="text-text-secondary">
											{new Date(article.createdAt).toLocaleDateString(
												'en-US',
												{
													month: 'short',
													day: 'numeric',
													year: 'numeric',
												},
											)}
										</span>
									</div>
								</Link>
							</article>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
