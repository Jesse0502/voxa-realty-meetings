import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { fetchCurrentUser } from "./store/authSlice";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginRegister from "./pages/login/Index.tsx";
import DashboardPage from "./pages/dashboard/Index.tsx";

const queryClient = new QueryClient();

// Auth Guard: Only accessible by authenticated users
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token);
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [token, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (status === "loading" && !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return children;
};

// Guest Guard: Only accessible by unauthenticated users (e.g. login/register)
const RequireGuest = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token);
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireGuest>
                <Index />
              </RequireGuest>
            }
          />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <LoginRegister />
              </RequireGuest>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
