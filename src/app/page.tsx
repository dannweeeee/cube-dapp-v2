"use client";

import Footer from "@/components/layout/footer";
import Hero from "@/components/layout/hero";
import Navbar from "@/components/layout/navbar";
import { useRedirectUserToRegistration } from "@/hooks/useRedirectUserToRegistration";

export default function Home() {
  useRedirectUserToRegistration();

  return (
    <div>
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
