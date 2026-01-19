import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

/**
 * ArticleView Component
 *
 * Responsibility:
 * - Fetches and displays a single article by ID or slug from route params.
 * - Handles loading and error states during data retrieval.
 * - Conditionally exposes edit/delete actions to the article author.
 * - Manages article deletion flow with confirmation and redirect.
 *
 * This component represents the read-only article detail page.
 */
const ArticleView = () => {
	// Local state for article data and UI status flags
	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [deleting, setDeleting] = useState(false);

	// Route params, auth context, and navigation helpers
	const { id } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	/**
	 * Fetch article data when route parameter changes.
	 */
	useEffect(() => {
		fetchArticle();
	}, [id]);

	/**
	 * Retrieves article data from API.
	 *
	 * Failure mode:
	 * - Sets error state if retrieval fails.
	 * - Always resolves loading state after request completes.
	 */
	const fetchArticle = async () => {
		try {
			const response = await api.get(`/articles/${id}`);
			setArticle(response.data.data.article);
		} catch (err) {
			setError('Failed to load article');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handles article deletion.
	 *
	 * Contract:
	 * - Prompts user for confirmation before deletion.
	 * - Issues DELETE request to API.
	 * - Redirects to home feed upon success.
	 *
	 * Failure mode:
	 * - Displays alert and resets deletion state on failure.
	 */
	const handleDelete = async () => {
		if (!window.confirm('Are you sure you want to delete this article?')) {
			return;
		}

		setDeleting(true);
		try {
			await api.delete(`/articles/${id}`);
			navigate('/');
		} catch (err) {
			alert('Failed to delete article');
			console.error(err);
			setDeleting(false);
		}
	};

	// Loading state while article data is being fetched
	if (loading) {
		return (
			<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6 text-center text-text-secondary">
				Loading article...
			</div>
		);
	}

	// Error or missing article fallback state
	if (error || !article) {
		return (
			<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6 bg-red-50 text-error p-3 md:p-4 rounded-lg mb-4 md:mb-6 border-l-4 border-error text-xs md:text-sm">
				{error || 'Article not found'}
			</div>
		);
	}

	// Determine if current user is the article author
	const isAuthor = user && user._id === article.author._id;

	return (
		<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6">
			<article className="py-6 md:py-8">
				{/* Article header containing title, author, date, and author actions */}
				<header className="mb-8 md:mb-12 pb-6 md:pb-8 border-b border-border">
					<h1 className="text-2xl md:text-[2.75rem] font-bold leading-tight mb-4 md:mb-6 text-text-primary">
						{article.title}
					</h1>

					{/* Author identity and publication date */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4 md:mb-6">
						<Link
							to={`/profile/${article.author.username}`}
							className="flex items-center gap-3 group">
							<span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
								{article.author.username}
							</span>
						</Link>
						<span className="text-text-secondary text-sm md:text-base">
							{new Date(article.createdAt).toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}
						</span>
					</div>

					{/* Edit/Delete controls visible only to article author */}
					{isAuthor && (
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
							<Link
								to={`/edit-article/${article._id}`}
								className="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-transparent text-text-primary border border-border hover:bg-bg-secondary hover:border-text-secondary">
								Edit
							</Link>
							<button
								onClick={handleDelete}
								className="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-red-500 text-white hover:bg-red-600 hover:-translate-y-[1px] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
								disabled={deleting}>
								{deleting ? 'Deleting...' : 'Delete'}
							</button>
						</div>
					)}
				</header>

				{/* Article content rendered as paragraph blocks */}
				<div className="text-base md:text-lg leading-[1.8] text-text-primary space-y-4 md:space-y-6">
					{article.content.split('\n').map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>
			</article>
		</div>
	);
};

export default ArticleView;
