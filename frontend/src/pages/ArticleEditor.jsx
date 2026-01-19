import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

/**
 * ArticleEditor Component
 *
 * Responsibility:
 * - Provides UI and logic for creating new articles.
 * - Supports edit mode when an article ID is present in route params.
 * - Handles form state, validation feedback, API communication,
 *   and navigation after successful submission.
 *
 * This component acts as the write/edit workspace for articles.
 */
const ArticleEditor = () => {
	// Local form state
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [isEditMode, setIsEditMode] = useState(false);

	// Route params and navigation utilities
	const { id } = useParams();
	const navigate = useNavigate();

	/**
	 * Detects edit mode when article ID is present.
	 * Triggers article fetch to preload existing data.
	 */
	useEffect(() => {
		if (id) {
			setIsEditMode(true);
			fetchArticle();
		}
	}, [id]);

	/**
	 * Fetches existing article data for edit mode.
	 *
	 * Failure mode:
	 * - Displays error message if article retrieval fails.
	 */
	const fetchArticle = async () => {
		try {
			const response = await api.get(`/articles/${id}`);
			const article = response.data.data.article;
			setTitle(article.title);
			setContent(article.content);
		} catch (err) {
			setError('Failed to load article');
			console.error(err);
		}
	};

	/**
	 * Handles article form submission.
	 *
	 * Contract:
	 * - In create mode, issues POST request to create new article.
	 * - In edit mode, issues PUT request to update existing article.
	 * - Redirects to home feed on success.
	 *
	 * Failure mode:
	 * - Displays API error message on request failure.
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			if (isEditMode) {
				await api.put(`/articles/${id}`, { title, content });
			} else {
				await api.post('/articles', { title, content });
			}
			navigate('/');
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to save article');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6 mt-12 relative md:pb-8 pb-20">
			{/* Floating publish button for desktop layout */}
			<div className="fixed top-20 md:top-24 right-4 md:right-6 z-10 hidden md:block">
				<button
					type="submit"
					form="article-form"
					className="inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
					disabled={loading}>
					{loading ? 'Saving...' : isEditMode ? 'Update' : 'Publish'}
				</button>
			</div>

			{/* Floating publish button optimized for mobile layout */}
			<div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-10 md:hidden">
				<button
					type="submit"
					form="article-form"
					className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full font-semibold text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
					disabled={loading}>
					{loading ? '...' : isEditMode ? '✓' : '📝'}
				</button>
			</div>

			<div className="max-w-[800px] mx-auto py-8 px-6">
				<h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-text-primary">
					{isEditMode ? 'Edit Article' : 'Write a New Story'}
				</h1>

				{/* Displays submission or fetch errors */}
				{error && (
					<div className="bg-red-50 text-error p-3 md:p-4 rounded-lg mb-4 md:mb-6 border-l-4 border-error text-xs md:text-sm">
						{error}
					</div>
				)}

				{/* Article creation / editing form */}
				<form id="article-form" onSubmit={handleSubmit} className="bg-white">
					{/* Title input field */}
					<div className="mb-4 md:mb-6">
						<input
							type="text"
							className="w-full text-3xl md:text-4xl font-bold py-3 md:py-4 border-none border-b border-border mb-4 md:mb-6 bg-transparent focus:border-primary focus:ring-0 outline-none placeholder:text-text-secondary placeholder:opacity-50"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Article Title"
							required
						/>
					</div>

					{/* Main article content textarea */}
					<div className="mb-4 md:mb-6">
						<textarea
							className="w-full text-base md:text-lg leading-[1.8] py-3 md:py-4 border-none resize-y min-h-[300px] md:min-h-[400px] bg-transparent focus:ring-0 outline-none placeholder:text-text-secondary placeholder:opacity-50"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Tell your story..."
							rows={15}
							required
						/>
					</div>

					{/* Form action buttons */}
					<div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border">
						{/* Cancel returns user to previous page */}
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-transparent text-text-primary border border-border hover:bg-bg-secondary hover:border-text-secondary order-2 sm:order-1">
							Cancel
						</button>

						{/* Submit button for publish/update */}
						<button
							type="submit"
							className="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed order-1 sm:order-2"
							disabled={loading}>
							{loading ? 'Saving...' : isEditMode ? 'Update' : 'Publish'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ArticleEditor;
