import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PhoneCall,
  LogOut,
  Sparkles,
  CircleUser,
  Menu,
  Users,
} from "lucide-react";
import voxaLogo from "@/assets/voxa-logo.png";
import voxaLogoDark from "@/assets/voxa-logo-dark.png";
import { CallsSection } from "@/components/CallsSection";
import { AssistantSection } from "@/components/AssistantSection";
import { ProfileSection } from "@/components/ProfileSection";
import { ContactsSection } from "@/components/ContactsSection";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser, logout } from "@/store/authSlice";
import { clearProfile } from "@/store/profileSlice";
import { clearContacts } from "@/store/contactsSlice";
import { clearCalls } from "@/store/callsSlice";
import { clearAssistant } from "@/store/assistantSlice";

type DashboardSection = "calls" | "assistant" | "contacts" | "profile";

const dashboardNavItems = [
  {
    label: "Calls",
    section: "calls",
    path: "/dashboard/calls",
    icon: PhoneCall,
  },
  {
    label: "Assistant",
    section: "assistant",
    path: "/dashboard/assistant",
    icon: Sparkles,
  },
  {
    label: "Contacts",
    section: "contacts",
    path: "/dashboard/contacts",
    icon: Users,
  },
  {
    label: "Profile",
    section: "profile",
    path: "/dashboard/profile",
    icon: CircleUser,
  },
] as const;

const getDashboardSectionFromPath = (pathname: string): DashboardSection => {
  if (pathname.startsWith("/dashboard/assistant")) {
    return "assistant";
  }

  if (pathname.startsWith("/dashboard/contacts")) {
    return "contacts";
  }

  if (pathname.startsWith("/dashboard/profile")) {
    return "profile";
  }

  return "calls";
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const authStatus = useAppSelector((state) => state.auth.status);
  const hasLoadedCurrentUser = useAppSelector(
    (state) => state.auth.hasLoadedCurrentUser,
  );

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("voxaTheme");
    return saved === "dark";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeSection = getDashboardSectionFromPath(location.pathname);

  const handleLogout = () => {
    dispatch(clearAssistant());
    dispatch(clearCalls());
    dispatch(clearContacts());
    dispatch(clearProfile());
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (
      !token ||
      authStatus === "loading" ||
      authStatus === "failed" ||
      hasLoadedCurrentUser
    ) {
      return;
    }

    dispatch(fetchCurrentUser());
  }, [authStatus, dispatch, hasLoadedCurrentUser, token]);

  useEffect(() => {
    if (isDark) {
      localStorage.setItem("voxaTheme", "dark");
    } else {
      localStorage.setItem("voxaTheme", "light");
    }
  }, [isDark]);

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={`flex flex-col md:flex-row w-full min-h-screen md:h-screen md:overflow-hidden ${isDark ? "bg-gray-900 text-white" : "bg-gray-50/50"}`}
    >
      {/* Mobile top bar */}
      <div
        className={`sticky top-0 z-30 flex md:hidden items-center justify-between px-4 py-4 border-b shrink-0 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <img
          src={isDark ? voxaLogoDark : voxaLogo}
          alt="Voxa Realty Logo"
          className="h-11 object-contain"
        />
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <Menu className="h-7 w-7" />
        </button>
      </div>

      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col shrink-0 transition-transform duration-300 w-72 md:w-64 items-center py-10 border-r ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <div className="h-20 mb-8 flex items-center px-6 py-4">
          <img
            src={isDark ? voxaLogoDark : voxaLogo}
            alt="Voxa Realty Logo"
            className="h-16 object-contain"
          />
        </div>
        <nav className="flex-1 w-full flex flex-col gap-2 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {dashboardNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;

            return (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.path)}
                className={`flex justify-start w-full gap-4 md:gap-3 rounded-lg px-5 md:px-4 py-5 md:py-4 text-lg md:text-sm font-medium items-center transition-colors ${
                  isActive
                    ? isDark
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                    : isDark
                      ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-6 w-6 md:h-5 md:w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div
          className={`w-full p-4 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}
        >
          <button
            onClick={handleLogout}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isDark
                ? "text-red-400 hover:bg-red-950/30 hover:text-red-300"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 relative flex flex-col min-w-0 md:overflow-hidden">
        {activeSection === "calls" && <CallsSection isDark={isDark} />}
        {activeSection === "assistant" && <AssistantSection isDark={isDark} />}
        {activeSection === "contacts" && <ContactsSection isDark={isDark} />}
        {activeSection === "profile" && <ProfileSection isDark={isDark} />}
      </div>
    </div>
  );
}
