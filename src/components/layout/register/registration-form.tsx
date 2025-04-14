"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { toast } from "sonner";
import { useAccount } from "wagmi";

const registrationFormSchema = z.object({
  username: z.string().min(4).max(20),
  email: z.string().email(),
  firstname: z.string().min(1).max(20),
  lastname: z.string().min(1).max(20),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      username: "",
      email: "",
      firstname: "",
      lastname: "",
    },
  });
  const { address } = useAccount();

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "/api/create-user",
        {
          wallet_address: address,
          username: data.username,
          email: data.email,
          first_name: data.firstname,
          last_name: data.lastname,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("User added to database successfully", response.data);
        toast.success("Your account has been created successfully!");
        router.push("/wallet");
      } else {
        throw new Error("Failed to add user to database");
      }
    } catch (error) {
      console.error("User registration error:", error);
      toast.error(
        "There was an error creating your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md p-6 bg-white/75 dark:bg-neutral-900 rounded-xl shadow-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2
          className="font-bold text-xl text-neutral-800 dark:text-neutral-200"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Welcome to Cube
        </motion.h2>
        <motion.p
          className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Create a Cube account to get started.
        </motion.p>

        <TooltipProvider>
          <motion.form
            className="my-8"
            onSubmit={handleSubmit(onSubmit)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex flex-col gap-2" variants={itemVariants}>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="username"
                  type="text"
                  className={errors.username ? "border-red-500 pr-10" : ""}
                  {...register("username")}
                />
                {errors.username && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{errors.username.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-2 mt-6"
              variants={itemVariants}
            >
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  className={errors.email ? "border-red-500 pr-10" : ""}
                  {...register("email")}
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{errors.email.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-2 mt-6"
              variants={itemVariants}
            >
              <Label htmlFor="firstname">First Name</Label>
              <div className="relative">
                <Input
                  id="firstname"
                  placeholder="First Name"
                  type="text"
                  className={errors.firstname ? "border-red-500 pr-10" : ""}
                  {...register("firstname")}
                />
                {errors.firstname && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{errors.firstname.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-2 mt-6"
              variants={itemVariants}
            >
              <Label htmlFor="lastname">Last Name</Label>
              <div className="relative">
                <Input
                  id="lastname"
                  placeholder="Last Name"
                  type="text"
                  className={errors.lastname ? "border-red-500 pr-10" : ""}
                  {...register("lastname")}
                />
                {errors.lastname && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{errors.lastname.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Confirm"}
              </Button>
            </motion.div>
          </motion.form>
        </TooltipProvider>
      </motion.div>
    </motion.div>
  );
}
