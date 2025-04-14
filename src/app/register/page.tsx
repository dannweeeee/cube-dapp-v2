"use client";

import Navbar from "@/components/layout/register/navbar";
import { RegistrationForm } from "@/components/layout/register/registration-form";
import { useRedirectUserToWallet } from "@/hooks/useRedirectUserToWallet";

export default function RegisterPage() {
  useRedirectUserToWallet();

  return (
    <div>
      <Navbar />
      <RegistrationForm />
    </div>
  );
}
