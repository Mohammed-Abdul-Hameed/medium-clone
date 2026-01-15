import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const ArticleView = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticle();
  }, [id]);

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

  if (loading) {
    return <div className="container">Loading article...</div>;
  }

  if (error || !article) {
    return <div className="max-w-[728px] mx-auto py-8 px-6 bg-red-50 text-error p-4 rounded-lg mb-6 border-l-4 border-error text-sm">{error || 'Article not found'}</div>;
  }

  const isAuthor = user && user._id === article.author._id;

  return (
    <div className="max-w-[728px] mx-auto py-8 px-6">
      <article className="py-8">
        <header className="mb-12 pb-8 border-b border-border">
          <h1 className="text-[2.75rem] font-bold leading-tight mb-6 text-text-primary">{article.title}</h1>
          <div className="flex items-center gap-6 mb-6">
            <Link to={`/profile/${article.author.username}`} className="flex items-center gap-3 group">
              <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">{article.author.username}</span>
            </Link>
            <span className="text-text-secondary">
              {new Date(article.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          {isAuthor && (
            <div className="flex gap-4 mt-4">
              <Link to={`/edit-article/${article._id}`} className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap bg-transparent text-text-primary border border-border hover:bg-bg-secondary hover:border-text-secondary">
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap bg-red-500 text-white hover:bg-red-600 hover:-translate-y-[1px] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </header>
        <div className="text-lg leading-[1.8] text-text-primary space-y-6">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default ArticleView;
