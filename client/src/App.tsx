import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Guides from "./pages/Guides";
import Contact from "./pages/Contact";
import Volunteer from "./pages/Volunteer";
import Report from "./pages/Report";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import UserProfile from "./pages/UserProfile";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import { useAuth } from "./contex/useAuth";
import { AuthProvider } from "./contex/AuthContex";
import AdminLogin from './pages/admin/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/signin" replace />;
};

const ProtectedAdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    // For simplicity, we're just checking if token exists
    // In production, you'd want to verify the token with the backend
    setIsAdmin(true);
    setLoading(false);
  }, [navigate]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin panel...</div>;
  }
  
  return isAdmin ? element : null;
};

const RECAPTCHA_SITE_KEY = "6LeLTwQrAAAAANb0t9V8BnqA5EAYga9gr29rb0ra";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/volunteer" element={<Volunteer />} />
      <Route path="/report" element={<Report />} />
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/profile" replace /> : <Signin />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/profile" replace /> : <Signup />} />
      <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
      <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/panel" element={<ProtectedAdminRoute element={<AdminPanel />} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen max-w-max">
      {/* Only show Navbar on non-admin pages */}
      {!isAdminPage && <Navbar />}

      <main className="flex-grow">
        <AppRoutes />
      </main>

      {/* Only show Footer on non-admin pages */}
      {!isAdminPage && <Footer />}
    </div>
  );
};

const AppWithProviders: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            <App />
          </GoogleReCaptchaProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppWithProviders;