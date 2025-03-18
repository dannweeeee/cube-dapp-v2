"use client";

import { useFetchUserDetailsByAddress } from "@/hooks/useFetchUserDetailsByAddress";
import { useAccount } from "wagmi";

export default function RegisterPage() {
  const { address } = useAccount();
  const { user } = useFetchUserDetailsByAddress(address || null);
  console.log(user);

  return <div>Register</div>;
}
