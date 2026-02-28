
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { BookOpenIcon } from "@heroicons/react/24/solid";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!name || !email) return;
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 px-4">

      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border border-purple-100">

        <BookOpenIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />

        <h2 className="text-3xl font-bold mb-2 text-center text-purple-700">
          Create Your Account
        </h2>

        <p className="text-sm text-gray-600 mb-8 text-center">
          Start organizing your studies and tracking your progress
        </p>

        {/* Google Button */}
        <Button
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <img src="/Google-Logo.svg" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </Button>

        <div className="text-center text-xs text-gray-500 mb-4">
          OR SIGN UP WITH EMAIL
        </div>

        {/* Name */}
        <label className="block mb-1 text-sm text-gray-700">Full Name</label>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 bg-purple-50/40 border-purple-200 focus:border-purple-400"
        />

        {/* Email */}
        <label className="block mb-1 text-sm text-gray-700">Email</label>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-6 bg-purple-50/40 border-purple-200 focus:border-purple-400"
        />

        
        {/* Password */}
        <label className="block mb-1 text-sm text-gray-700">Password</label>
        <Input
          placeholder="Create your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 bg-purple-50/40 border-purple-200 focus:border-purple-400"
        />

        {/* Submit */}
        <Button
          className="w-full mb-4 bg-purple-500 hover:bg-purple-600 text-white shadow-md"
          onClick={handleSignup}
        >
          Create Account
        </Button>

        <p className="text-sm text-center mb-2">
          Already have an account?{" "}
          <button
            type="button"
            className="text-purple-600 font-medium"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </p>

        <p className="text-xs text-center text-gray-400">
          Demo app – any name and email will work for testing
        </p>
      </div>
    </div>
  );
}
