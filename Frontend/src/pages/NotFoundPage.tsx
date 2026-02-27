import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-5xl font-bold text-purple-600">?</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-purple-700">Page not found</h1>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-md">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}