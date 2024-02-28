"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if(localStorage.getItem("token")){
      router.push("/all-volunteer")
    }else{
      router.push("/login")
    }
  })
  return (
    <>
    
    </>
  );
}
