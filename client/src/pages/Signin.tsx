import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contex/useAuth";
import { jwtDecode } from "jwt-decode";

type GoogleJwtPayload = {
  name: string;
  email: string;
  picture: string;
  sub: string; // Google unique user ID
};

export default function SigninForm() {
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await login(phone, password);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src="/src/images/signin.png" alt="Sign in illustration" />
        </div>

        <div className="flex-1 p-10 max-w-md order-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back to RescueNet</h1>
            <p className="text-gray-500 mb-8">Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-2">
              <label htmlFor="tel" className="block text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <input
                type="tel"
                id="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#ee5050]"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#ee5050]"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-gray-300 text-[#ee5050] focus:ring-[#ee5050]"
                />
                <span className="text-sm text-gray-900">Remember for 30 days</span>
              </label>
              <a href="#" className="text-sm text-[#ee5050] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-[#ee5050] text-white rounded-md hover:bg-[#b63737] transition-colors"
            >
              Sign in
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#ee5050] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
