"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import apiClient from "@/lib/apiClient";

export default function GoogleButton({
  label,
  onError,
}: {
  label: string;
  onError: (message: string) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    scope: "openid email profile",
    onSuccess: async ({ code }) => {
      setLoading(true);
      try {
        await apiClient("/auth/google", {
          method: "POST",
          body: JSON.stringify({ code }),
        });
        router.push("/feed");
      } catch (err) {
        onError(err instanceof Error ? err.message : "Google sign-in failed");
        setLoading(false);
      }
    },
    onError: () => onError("Google sign-in failed"),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={loading}
      className="mb-10 flex w-full cursor-pointer items-center justify-center rounded-md border border-canvas bg-surface py-3 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-divider border-t-primary" />
      ) : (
        <Image
          src="/images/google.svg"
          alt=""
          width={20}
          height={20}
          className="mr-2 h-auto w-5"
        />
      )}
      <span className="text-[16px] font-medium leading-[1.4] text-heading">
        {label}
      </span>
    </button>
  );
}
