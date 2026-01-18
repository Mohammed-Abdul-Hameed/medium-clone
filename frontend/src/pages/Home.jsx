import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchArticles();
	}, []);

	const fetchArticles = async () => {
		try {
			const response = await api.get('/articles');
			setArticles(response.data.data.articles);
		} catch (err) {
			setError('Failed to load articles');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6 text-center text-text-secondary">
				Loading articles...
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6 bg-red-50 text-error p-3 md:p-4 rounded-lg mb-4 md:mb-6 border-l-4 border-error text-xs md:text-sm">
				{error}
			</div>
		);
	}

	return (
		<div className="max-w-[728px] mx-auto py-6 md:py-8 px-4 md:px-6">
			<div className="mb-8 md:mb-12 pb-6 md:pb-8 border-b border-border">
				<h1 className="text-2xl md:text-4xl font-bold mb-2 text-text-primary">
					Latest Stories
				</h1>
				<p className="text-base md:text-lg text-text-secondary">
					Discover stories, thinking, and expertise from writers on any topic.
				</p>
			</div>

			{articles.length === 0 ? (
				<div className="text-center py-16 px-8 text-text-secondary">
					<h2 className="text-2xl font-semibold mb-2 text-text-primary">
						No articles yet
					</h2>
					<p>Be the first to share your story!</p>
				</div>
			) : (
				<div className="flex flex-col gap-10">
					{articles.map((article) => (
						<article
							key={article._id}
							className="pb-10 border-b border-border transition-all hover:translate-x-1 duration-300 last:border-b-0 group">
							<Link to={`/articles/${article._id}`}>
								<h2 className="text-2xl font-bold mb-3 text-text-primary leading-tight group-hover:text-primary transition-colors">
									{article.title}
								</h2>
								<p className="text-text-secondary mb-4 leading-relaxed text-base">
									{article.content.substring(0, 200)}...
								</p>
								<div className="flex items-center gap-4 text-sm">
									<Link
										to={`/profile/${article.author.username}`}
										className="text-text-primary font-semibold hover:text-primary transition-colors">
										{article.author.username}
									</Link>
									<span className="text-text-secondary">
										{new Date(article.createdAt).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
										})}
									</span>
								</div>
							</Link>
						</article>
					))}
				</div>
			)}
		</div>
	);
};

export default Home;
