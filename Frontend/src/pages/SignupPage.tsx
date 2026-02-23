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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-gray-800 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <BookOpenIcon className="w-10 h-10 text-purple-600 mx-auto mb-4" />

                <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Create Your Account</h2>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Start organizing your studies and tracking your progress
                </p>

                <Button variant="outline" className="w-full mb-4 flex items-center justify-center gap-2">
                    <img src="/Google-Logo.svg" alt="Google" className="w-5 h-5" />
                    Sign up with Google
                </Button>

                <div className="text-center text-xs text-gray-500 mb-4">
                    ----------OR SIGN UP WITH EMAIL----------
                </div>

                <label className="block mb-1 text-sm text-gray-700">Full Name</label>
                <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4"
                />

                <label className="block mb-1 text-sm text-gray-700">Email</label>
                <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-6"
                />

                <label className= "block mb-1 text-sm text-gray-700"> Create Password</label>
                <Input
                    placeholder="Create your password"
                    value= {password}
                    onChange={(e) => setPassword(e.target.value)}
                    className= "mb-6"
                
                />
                <Button className="w-full mb-4" onClick={handleSignup}>
                    Create Account
                </Button>

                <p className="text-sm text-center mb-2">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-blue-600 font-medium"
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
