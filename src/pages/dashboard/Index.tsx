import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, LogOut, Sun, Moon, Bot, UserRound } from "lucide-react";
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
      className={`flex h-screen w-full overflow-hidden ${isDark ? "bg-gray-900 text-white" : "bg-gray-50/50"}`}
    >
      <aside
        className={`w-64 items-center py-10 border-r flex flex-col shrink-0 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <div className="h-20 mb-8 flex items-center px-6 py-4">
          <img
            src={isDark ? voxaLogoDark : voxaLogo}
            alt="Voxa Realty Logo"
            className="h-16 object-contain"
          />
        </div>
        <nav className="flex-1 w-full flex flex-col gap-2 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveTab("Calls")}
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
            onClick={() => setActiveTab("Assistant")}
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
            onClick={() => setActiveTab("Profile")}
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
