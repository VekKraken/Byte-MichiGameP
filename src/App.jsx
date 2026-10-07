import LoginPage from './pages/LoginPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
    if (window.location.pathname === '/michibyte.html') {
        return (
            <ProtectedRoute>
                <ProfilePage />
            </ProtectedRoute>
        );
    }

    if (window.location.pathname === '/login.html') return <LoginPage />;

    return <LandingPage />;
}