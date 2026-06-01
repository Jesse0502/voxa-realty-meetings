import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, LogOut, Sun, Moon, Bot, UserRound, Menu, X } from "lucide-react";
import voxaLogo from "@/assets/voxa-logo.png";
import voxaLogoDark from "@/assets/voxa-logo-dark.png";
import { CallsSection } from "@/components/CallsSection";
import { AssistantSection } from "@/components/AssistantSection";
import { ProfileSection } from "@/components/ProfileSection";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { clearProfile } from "@/store/profileSlice";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("voxaTheme");
    return saved === "dark";
  });
  const [activeTab, setActiveTab] = useState("Calls");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearProfile());
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (isDark) {
      localStorage.setItem("voxaTheme", "dark");
    } else {
      localStorage.setItem("voxaTheme", "light");
    }
  }, [isDark]);

  return (
    <div
      className={`flex flex-col md:flex-row h-screen w-full overflow-hidden ${isDark ? "bg-gray-900 text-white" : "bg-gray-50/50"}`}
    >
      {/* Mobile top bar */}
      <div
        className={`flex md:hidden items-center justify-between px-4 py-3 border-b shrink-0 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <img
          src={isDark ? voxaLogoDark : voxaLogo}
          alt="Voxa Realty Logo"
          className="h-8 object-contain"
        />
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <Menu className="h-5 w-5" />
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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col shrink-0 transition-transform duration-300 w-64 items-center py-10 border-r ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <div className="h-20 mb-8 flex items-center justify-between px-6 py-4">
          <img
            src={isDark ? voxaLogoDark : voxaLogo}
            alt="Voxa Realty Logo"
            className="h-16 object-contain"
          />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`md:hidden p-1.5 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 w-full flex flex-col gap-2 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => { setActiveTab("Calls"); setIsSidebarOpen(false); }}
            className={`flex justify-start w-full gap-3 rounded-lg px-4 py-3 text-sm font-medium items-center transition-colors ${
              activeTab === "Calls"
                ? isDark
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
                : isDark
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Phone className="h-4 w-4" />
            Calls
          </button>

          <button
            onClick={() => { setActiveTab("Assistant"); setIsSidebarOpen(false); }}
            className={`flex justify-start w-full gap-3 rounded-lg px-4 py-3 text-sm font-medium items-center transition-colors ${
              activeTab === "Assistant"
                ? isDark
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
                : isDark
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Bot className="h-4 w-4" />
            Assistant
          </button>

          <button
            onClick={() => { setActiveTab("Profile"); setIsSidebarOpen(false); }}
            className={`flex justify-start w-full gap-3 rounded-lg px-4 py-3 text-sm font-medium items-center transition-colors ${
              activeTab === "Profile"
                ? isDark
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
                : isDark
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <UserRound className="h-4 w-4" />
            Profile
          </button>
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
      <div className="flex-1 relative flex flex-col min-w-0">
        {activeTab === "Calls" && <CallsSection isDark={isDark} />}
        {activeTab === "Assistant" && <AssistantSection isDark={isDark} />}
        {activeTab === "Profile" && <ProfileSection isDark={isDark} />}
      </div>
    </div>
  );
}
