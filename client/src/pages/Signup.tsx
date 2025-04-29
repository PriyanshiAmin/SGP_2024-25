import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contex/useAuth";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{ email?: string; phone?: string; password?: string }>({});
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|edu\.in)$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    const newErrors: { email?: string; phone?: string; password?: string } = {};

    // Validate email
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email (e.g., user@gmail.com or name@charusat.edu.in)";
    }

    // Validate phone number
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian phone number";
    }

    // Validate password
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters long, include uppercase, lowercase, a number, and a special character";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setAuth(token, user);
      navigate("/profile");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src="/src/images/signup.png" alt="sign-in" />
        </div>
        <div className="flex-1 p-10 max-w-md">
          <div className="mb-8">
            <p className="text-gray-500 mb-2">Join Us</p>
            <h1 className="text-2xl font-bold text-gray-900">Sign Up to RescueNet</h1>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#ee5050]"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-[#ee5050]`}
              required
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 border ${
                formErrors.phone ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-[#ee5050]`}
              required
            />
            {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#ee5050]`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full p-3 bg-[#ee5050] text-white rounded-md hover:bg-[#b94141] transition-colors mt-4"
            >
              Sign up
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#ee5050] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
