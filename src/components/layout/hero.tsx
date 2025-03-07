"use client";

import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/hero-highlight";
import { useLogin } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: async () => {
      router.push("/home");
    },
  });

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
      },
    }),
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center text-primary py-32 md:py-44 px-4 md:px-8 overflow-hidden">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariant}
        custom={0}
        className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center !leading-tight tracking-tight relative z-10"
      >
        Pay With Crypto
        <br />
        <Highlight className="text-black dark:text-white rounded-xl px-3 py-1">
          While Staying Onchain
        </Highlight>
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariant}
        custom={0.2}
        className="text-center mt-6 text-base md:text-lg lg:text-xl md:max-w-3xl mx-auto font-medium text-primary/80 dark:text-primary/90 relative z-10"
      >
        Cube is the onchain hub for executing real world payments with
        stablecoins
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariant}
        custom={0.4}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0 relative z-10"
      >
        <Button
          variant="default"
          className="rounded-xl bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 text-white px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={login}
        >
          Get Started
        </Button>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariant}
        custom={0.6}
        className="container mx-auto mt-16 relative z-10"
      >
        <div className="relative w-full md:w-11/12 lg:w-10/12 mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl z-10" />
          <Image
            src="/assets/png/cube-cover-banner-v4.png"
            height={720}
            width={1080}
            alt="Cube Banner"
            className="w-full h-auto rounded-3xl shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
