"use client";

import { useToast } from "@/hooks/use-toast";
import { SignOutButton } from "@clerk/nextjs";

function SignOutLink() {
  const { toast } = useToast();

  function handleLogout() {
    toast({ description: "로그아웃에 성공했습니다." });
  }

  return (
    <SignOutButton redirectUrl="/">
      <button className="w-full text-left" onClick={handleLogout}>
        Logout
      </button>
    </SignOutButton>
  );
}

export default SignOutLink;
