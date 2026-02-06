// import { useState, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginWithEmail } from "../services/auth";
// import Input from "../ui/Input";
// import Button from "../ui/Button";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!email) return;
//     await loginWithEmail(email);
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
//       <div className="bg-white dark:bg-slate-800 p-10 rounded-xl shadow-md w-full max-w-md text-center">
//         <h1 className="mb-2">Study Planner</h1>
//         <p className="text-gray-600 dark:text-slate-300 mb-6">
//           Organize your studies, track your progress, and achieve your goals
//         </p>

//         <Button variant="outline" className="w-full mb-4">
//           Continue with Google
//         </Button>

//         <div className="flex items-center my-4">
//           <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
//           <span className="px-3 text-gray-500 text-sm">OR CONTINUE WITH EMAIL</span>
//           <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
//         </div>

//         <form onSubmit={handleSubmit} className="text-left">
//           <label className="block mb-1">Email</label>
//           <Input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mb-4"
//           />

//           <Button type="submit" className="w-full">
//             Sign In
//           </Button>
//         </form>

//         <p className="text-gray-500 text-sm mt-4">
//           Demo app – any email will work for testing.
//         </p>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { BookOpenIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email) return;
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-gray-800 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <BookOpenIcon className="w-10 h-10 text-purple-600 mx-auto mb-4" />

        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Sign in to continue organizing your studies
        </p>

        <Button variant="outline" className="w-full mb-4 flex items-center justify-center gap-2">
          <img src="/Google-Logo.svg" alt="Google" className="w-5 h-5" />
          Continue wth Google
        </Button>

        <div className="text-center text-xs text-gray-500 mb-4">
          OR CONTINUE WITH EMAIL
        </div>

        <label className="block mb-1 text-sm text-gray-700">Email</label>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-6"
        />

        <Button className="w-full mb-4" onClick={handleLogin}>
          Sign In
        </Button>

        <p className="text-sm text-center mb-2">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-blue-600 font-medium"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </p>

        <p className="text-xs text-center text-gray-400">
          Demo app – any email will work for testing
        </p>
      </div>
    </div>
  );
}
