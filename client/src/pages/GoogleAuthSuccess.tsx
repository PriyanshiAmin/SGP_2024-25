import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contex/useAuth";

const GoogleAuthSuccess = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Ideally decode token and fetch user details
      setAuth(token, {
        id: "",
        name: "",
        email: ""
      }); // or decode the token to get user info
      navigate("/profile");
    } else {
      console.error("No token found in URL");
      navigate("/signin");
    }
  }, [location.search, setAuth, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-700">Logging you in via Google...</p>
    </div>
  );
};

export default GoogleAuthSuccess;
