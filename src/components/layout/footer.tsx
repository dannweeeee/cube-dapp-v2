"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="backdrop-blur-sm text-primary py-12 font-sans border-t border-gray-100 shadow-sm bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/svg/cube-blue.svg"
                alt="Cube Logo"
                width={40}
                height={40}
                className="hover:opacity-80 transition-opacity duration-300"
              />
              <span className="text-xl font-bold text-primary">Cube</span>
            </Link>
            <p className="mt-3 text-sm text-primary/70 max-w-md">
              Breaking the ice in finance, one Cube at a time.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8">
          <p className="text-sm text-primary/60 mb-4 md:mb-0">
            © {new Date().getFullYear()} Cube Protocol. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-primary/10"
              onClick={() =>
                window.open("https://github.com/usecube", "_blank")
              }
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-primary/10"
              onClick={() => window.open("https://x.com/dannweeeee", "_blank")}
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
