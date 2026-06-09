import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-white">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-white/10">404</h1>
        <p className="text-xl font-semibold text-white">Page not found</p>
        <p className="text-sm text-white/40">The page you're looking for doesn't exist.</p>
        <a href="/" className="inline-block mt-2 text-sm font-medium text-[#3ecfcf] hover:text-[#3ecfcf]/80 underline underline-offset-4">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
