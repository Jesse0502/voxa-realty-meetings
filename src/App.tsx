import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "./store/hooks";
import LandingPage from "./pages/LandingPage.tsx";
import BestAiReceptionistPage from "./pages/BestAiReceptionistPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginRegister from "./pages/login/Index.tsx";
import DashboardPage from "./pages/dashboard/Index.tsx";
import OnboardingPage from "./pages/OnboardingPage.tsx";
import SubscriptionSuccessful from "./pages/SubscriptionSuccessful.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import VoiceLibraryPage from "./pages/VoiceLibraryPage.tsx";

const queryClient = new QueryClient();
const SITE_URL = "https://www.voxarealty.com";

type PageSeoMeta = {
  title: string;
  description: string;
};

const PAGE_SEO_BY_PATH: Record<string, PageSeoMeta> = {
  "/": {
    title:
      "AI Receptionist for Real Estate Teams | Book More Calls | Voxa Realty",
    description:
      "Voxa Realty is an AI receptionist and AI sales agent for real estate teams. Respond to missed calls in seconds, follow up internet leads, and book more qualified calls.",
  },
  "/best-ai-receptionist-for-real-estate-agents": {
    title: "Best AI Receptionist for Real Estate Agents in 2026 | Voxa Realty",
    description:
      "Compare what makes the best AI receptionist for real estate agents and see how Voxa improves lead response time, qualification quality, and booked appointments.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Voxa Realty",
    description: "Read the Privacy Policy for Voxa Realty.",
  },
  "/terms-of-service": {
    title: "Terms of Service | Voxa Realty",
    description: "Read the Terms of Service for Voxa Realty.",
  },
  "/voice-library": {
    title: "Voice Library | Voxa Realty",
    description:
      "Listen to Voxa Realty AI receptionist voice samples and choose the voice that best represents your real estate brand.",
  },
};

const INDEXABLE_PATHS = new Set(Object.keys(PAGE_SEO_BY_PATH));

const upsertMetaTag = (name: string, content: string) => {
  let tag = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertPropertyMetaTag = (property: string, content: string) => {
  let tag = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let canonical = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", href);
};

const RouteMetaManager = () => {
  const location = useLocation();

  useEffect(() => {
    const normalizedPath =
      location.pathname === "/"
        ? "/"
        : location.pathname.replace(/\/+$/, "") || "/";
    const pageSeo = PAGE_SEO_BY_PATH[normalizedPath];
    const isIndexable = INDEXABLE_PATHS.has(normalizedPath);

    if (isIndexable && pageSeo) {
      const indexableContent =
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
      const canonicalUrl =
        normalizedPath === "/"
          ? `${SITE_URL}/`
          : `${SITE_URL}${normalizedPath}`;

      document.title = pageSeo.title;
      upsertMetaTag("description", pageSeo.description);
      upsertMetaTag("robots", indexableContent);
      upsertMetaTag("googlebot", indexableContent);
      upsertMetaTag("twitter:title", pageSeo.title);
      upsertMetaTag("twitter:description", pageSeo.description);
      upsertMetaTag("twitter:image", `${SITE_URL}/logo.png`);
      upsertPropertyMetaTag("og:title", pageSeo.title);
      upsertPropertyMetaTag("og:description", pageSeo.description);
      upsertPropertyMetaTag("og:url", canonicalUrl);
      upsertPropertyMetaTag("og:image", `${SITE_URL}/logo.png`);
      upsertCanonical(canonicalUrl);
      return;
    }

    upsertMetaTag("robots", "noindex, nofollow");
    upsertMetaTag("googlebot", "noindex, nofollow");
    upsertCanonical(`${SITE_URL}${normalizedPath}`);
  }, [location.pathname]);

  return null;
};

// Auth Guard: Only accessible by authenticated users
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token);
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);

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

  if (user && user.account_type === "pending") {
    // Return a restricted message or redirect if they haven't paid logic
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Payment Pending</h2>
        <p className="text-gray-600 mb-4">Please complete your setup fee payment to access the dashboard.</p>
        <button onClick={() => window.location.href = "/onboarding"} className="px-4 py-2 bg-blue-600 text-white rounded">
          Go to Onboarding
        </button>
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
        <RouteMetaManager />
        <Routes>
          <Route
            path="/"
            element={
              <RequireGuest>
                <LandingPage />
              </RequireGuest>
            }
          />
          <Route
            path="/best-ai-receptionist-for-real-estate-agents"
            element={<BestAiReceptionistPage />}
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
            path="/onboarding"
            element={
              <RequireGuest>
                <OnboardingPage />
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
          <Route
            path="/dashboard/calls"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/assistant"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/contacts"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/contacts/:contactId"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/subscription_successful"
            element={<SubscriptionSuccessful />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />
          <Route
            path="/terms-of-service"
            element={<TermsOfService />}
          />
          <Route path="/voice-library" element={<VoiceLibraryPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
