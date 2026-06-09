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
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("voxaTheme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={`flex flex-col md:flex-row w-full min-h-screen md:h-screen md:overflow-hidden ${isDark ? "dark bg-[#0d1117] text-white" : "bg-gray-50/50"}`}
    >
      {/* Mobile top bar — always dark */}
      <div className="sticky top-0 z-30 flex md:hidden items-center justify-between px-4 py-4 border-b shrink-0 bg-[#0d1117] border-[#1e2430]">
        <img
          src={voxaLogoDark}
          alt="Voxa Realty Logo"
          className="h-14 object-contain"
        />
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always dark */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col shrink-0 transition-transform duration-300 ease-in-out w-64 md:w-64 border-r border-[#1e2430] bg-[#0d1117] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-5 py-6 border-b border-[#1e2430]">
          <img
            src={voxaLogoDark}
            alt="Voxa Realty Logo"
            className="h-14 object-contain"
          />
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto px-3 py-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {dashboardNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;

            return (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center w-full gap-3 rounded-md px-4 py-3.5 text-[15px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#119c9e]/15 text-[#3ecfcf] shadow-[inset_0_0_0_1px_rgba(17,156,158,0.15)]"
                    : "text-gray-400 hover:text-gray-100 hover:bg-white/[0.06]"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-[#3ecfcf]" : "text-gray-500"
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[#1e2430] space-y-1">
          <button
            onClick={() => setIsDark((d) => !d)}
            className="flex items-center w-full gap-3 rounded-md px-4 py-3 text-[15px] font-medium text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-all duration-150"
          >
            <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
            {isDark ? "Light mode" : "Dark mode"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 rounded-md px-4 py-3 text-[15px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Log out
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
