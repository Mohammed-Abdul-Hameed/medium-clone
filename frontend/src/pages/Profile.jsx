import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { username } = useParams();

  useEffect(() => {
    fetchProfile();
  }, [username]);

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

  if (loading) {
    return <div className="max-w-[728px] mx-auto py-8 px-6 text-center text-text-secondary">Loading profile...</div>;
  }

  if (error) {
    return <div className="max-w-[728px] mx-auto py-8 px-6 bg-red-50 text-error p-4 rounded-lg mb-6 border-l-4 border-error text-sm">{error}</div>;
  }

  if (!profileUser) {
    return <div className="max-w-[728px] mx-auto py-8 px-6 text-center text-text-secondary">User not found</div>;
  }

  return (
    <div className="max-w-[728px] mx-auto py-8 px-6">
      <div className="py-12 border-b border-border mb-12">
        <h1 className="text-4xl font-bold mb-2 text-text-primary">{profileUser.username}</h1>
        <p className="text-text-secondary text-base mb-4">{profileUser.email}</p>
        <div className="text-lg leading-[1.6] text-text-primary mt-4">
          {profileUser.bio ? profileUser.bio : 'No bio yet.'}
        </div>
      </div>

      <div className="profile-articles">
        <h2 className="text-[1.75rem] font-bold mb-8 text-text-primary">Stories</h2>

        {articles.length === 0 ? (
          <div className="text-center py-16 px-8 text-text-secondary">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">No articles yet</h2>
            <p>This user hasn't published any stories yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {articles.map((article) => (
              <article key={article._id} className="pb-10 border-b border-border transition-all hover:translate-x-1 duration-300 last:border-b-0 group">
                <Link to={`/articles/${article._id}`}>
                  <h2 className="text-2xl font-bold mb-3 text-text-primary leading-tight group-hover:text-primary transition-colors">{article.title}</h2>
                  <p className="text-text-secondary mb-4 leading-relaxed text-base">
                    {article.content.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm">
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
    </div>
  );
};

export default Profile;
