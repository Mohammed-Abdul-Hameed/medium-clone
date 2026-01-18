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

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="app">
					<Navbar />
					<main className="main-content pt-16 md:pt-20">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/articles/:id" element={<ArticleView />} />
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
							<Route path="/profile/:username" element={<Profile />} />
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
