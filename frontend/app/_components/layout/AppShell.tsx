"use client";

import { useEffect, useState } from "react";
import Footer from "../Footer/footer";
import { Header } from "../Header/header";
import { MobileNav } from "../Header/mobile_header";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import { AuthProvider } from "../auth/AuthContext";
import { fetchCurrentUser, logoutUser } from "../auth/api";
import type { AuthUser } from "../auth/types";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadCurrentUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();

        if (!ignore) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("[AppShell] loadCurrentUser error:", error);
      }
    };

    void loadCurrentUser();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("[AppShell] handleLogout error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        user={user}
        logoutLoading={logoutLoading}
        onLoginClick={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
        onLogoutClick={handleLogout}
        onRegisterClick={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <AuthProvider user={user}>
        <main className="flex-1">{children}</main>
      </AuthProvider>

      <Footer />
      <MobileNav />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={setUser}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
}
