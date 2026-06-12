"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import Field from "@/components/Field";
import GoogleButton from "@/components/GoogleButton";

export default function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agree) {
      setError("Please agree to the terms & conditions");
      return;
    }

    setLoading(true);
    try {
      await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      router.push("/feed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md bg-surface p-12 max-lg:mt-[30px] max-lg:text-center">
      <Image
        src="/images/logo.svg"
        alt="BuddyScript"
        width={158}
        height={33}
        className="mx-auto mb-7 h-auto w-[161px]"
      />
      <p className="mb-2 text-center leading-[1.4] text-body">Get Started Now</p>
      <h4 className="mb-[50px] text-center text-[28px] font-medium leading-[1.2] text-heading max-2xl:text-[22px]">
        Registration
      </h4>

      <GoogleButton label="Register with google" onError={setError} />

      <div className="relative mb-10 text-center before:absolute before:bottom-[11px] before:left-0 before:h-[2px] before:w-[108px] before:rounded-md before:border before:border-divider before:content-[''] after:absolute after:right-0 after:bottom-[11px] after:h-[2px] after:w-[108px] after:rounded-md after:border after:border-divider after:content-[''] max-lg:before:w-[44%] max-lg:after:w-[44%]">
        <span className="text-[14px] leading-[1.4] text-[#C4C4C4] dark:text-[#5a5a5a]">Or</span>
      </div>

      {error && (
        <p className="mb-4 text-center text-[14px] text-red-500">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Field
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Field
          label="Repeat Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="mb-2 flex items-center gap-2 max-lg:justify-center">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4 cursor-pointer appearance-none rounded-full border border-black/25 dark:border-white/25 outline-none checked:border-primary checked:bg-[radial-gradient(circle_at_center,#1890ff_4px,transparent_4px)]"
          />
          <label className="text-[14px] text-body max-2xl:text-[12px]">
            I agree to terms &amp; conditions
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-10 mb-[60px] w-full rounded-md bg-primary py-3 text-[16px] font-medium text-white transition hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px] disabled:opacity-70 cursor-pointer"
        >
          {loading ? "Please wait..." : "Register now"}
        </button>
      </form>

      <p className="text-center text-[14px] text-body">
        Already have an account?{" "}
        <Link href="/login" className="text-primary">
          Login
        </Link>
      </p>
    </div>
  );
}
