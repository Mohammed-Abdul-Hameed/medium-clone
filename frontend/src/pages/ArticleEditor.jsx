import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const ArticleEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchArticle();
    }
  }, [id]);

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
    <div className="max-w-[728px] mx-auto py-8 px-6">
      <div className="max-w-[800px] mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-8 text-text-primary">
          {isEditMode ? 'Edit Article' : 'Write a New Story'}
        </h1>

        {error && <div className="bg-red-50 text-error p-4 rounded-lg mb-6 border-l-4 border-error text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white">
          <div className="mb-6">
            <input
              type="text"
              className="w-full text-4xl font-bold py-4 border-none border-b border-border mb-6 bg-transparent focus:border-primary focus:ring-0 outline-none placeholder:text-text-secondary placeholder:opacity-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              required
            />
          </div>

          <div className="mb-6">
            <textarea
              className="w-full text-lg leading-[1.8] py-4 border-none resize-y min-h-[400px] bg-transparent focus:ring-0 outline-none placeholder:text-text-secondary placeholder:opacity-50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story..."
              rows={20}
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-border">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap bg-transparent text-text-primary border border-border hover:bg-bg-secondary hover:border-text-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;
