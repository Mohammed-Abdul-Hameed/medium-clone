import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import ArticleEditor from './pages/ArticleEditor';
import ArticleView from './pages/ArticleView';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

/**
 * App Component
 *
 * Responsibility:
 * - Serves as the root component of the frontend application.
 * - Configures global authentication provider.
 * - Sets up client-side routing for all application pages.
 * - Applies persistent layout elements such as Navbar.
 *
 * This component acts as the main entry point for UI composition.
 */
function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="app">
					{/* Global navigation bar visible across all pages */}
					<Navbar />

					{/* Main content area with route-based rendering */}
					<main className="main-content pt-16 md:pt-20">
						<Routes>
							{/* Public routes */}
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/articles/:id" element={<ArticleView />} />
							<Route path="/profile/:username" element={<Profile />} />

							{/* Protected routes requiring authentication */}
							<Route
								path="/new-article"
								element={
									<ProtectedRoute>
										<ArticleEditor />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/edit-article/:id"
								element={
									<ProtectedRoute>
										<ArticleEditor />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
