"use client";

import { useState } from "react";
import Footer from "../Footer/footer";
import { Header } from "../Header/header";
import { MobileNav } from "../Header/mobile_header";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onLoginClick={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
        onRegisterClick={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <main className="flex-1">{children}</main>

      <Footer />
      <MobileNav />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
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
