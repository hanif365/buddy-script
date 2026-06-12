"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import { User, Post } from "@/types";

type Visibility = "public" | "private";

const privacyOptions: { value: Visibility; label: string; icon: React.ReactNode }[] = [
  { value: "public", label: "Public", icon: <GlobeIcon /> },
  { value: "private", label: "Private", icon: <LockIcon /> },
];

export default function Composer({
  user,
  onCreated,
}: {
  user: User | null;
  onCreated: (post: Post) => void;
}) {
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const handlePost = async () => {
    if (!text.trim() && !file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("text", text);
      form.append("visibility", visibility);
      if (file) form.append("image", file);

      const res = await apiClient("/posts", { method: "POST", body: form });
      onCreated(res.post);
      setText("");
      setVisibility("public");
      removeImage();
    } finally {
      setLoading(false);
    }
  };

  const name = user ? `${user.firstName} ${user.lastName}` : "";
  const current = privacyOptions.find((o) => o.value === visibility)!;

  return (
    <div className="mb-4 rounded-md bg-surface p-6">
      <div className="flex items-center gap-3">
        <Image
          src={user?.avatar || "/images/default-avatar.svg"}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
        <div>
          <h4 className="text-[14px] leading-tight font-bold text-heading">{name}</h4>

          <div ref={menuRef} className="relative mt-1">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex cursor-pointer items-center gap-1 rounded-md bg-input px-2 py-0.5 text-[12px] font-semibold text-body"
            >
              {current.icon}
              {current.label}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path
                  fill="currentColor"
                  d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute top-[34px] left-0 z-20 w-36 overflow-hidden rounded-md bg-surface py-1 shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
                {privacyOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      setVisibility(o.value);
                      setMenuOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[14px] hover:bg-input ${
                      o.value === visibility
                        ? "font-semibold text-primary"
                        : "text-body"
                    }`}
                  >
                    {o.icon}
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Write something"
          className="h-[88px] w-full resize-none rounded-md p-2 text-[16px] text-body outline-none"
        />
        {!text && (
          <label className="pointer-events-none absolute top-2 left-2 flex items-center gap-2 text-[16px] text-muted">
            Write something ...
            <svg width="23" height="24" viewBox="0 0 23 24" fill="none">
              <path
                fill="currentColor"
                d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z"
              />
            </svg>
          </label>
        )}
      </div>

      {preview && (
        <div className="relative mt-3 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="max-h-60 rounded-md" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-[18px] leading-none text-white"
          >
            ×
          </button>
        </div>
      )}

      <div className="mt-2.5 flex h-16 items-center justify-between rounded-b-md bg-[rgba(24,144,255,0.05)] dark:bg-[rgba(24,144,255,0.12)] px-4">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex cursor-pointer items-center gap-2 px-2.5 text-[16px] text-muted transition hover:text-primary"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fill="currentColor"
              d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51z"
            />
          </svg>
          Photo
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={onPickImage}
          className="hidden"
        />

        <button
          type="button"
          onClick={handlePost}
          disabled={loading || (!text.trim() && !file)}
          className="flex cursor-pointer items-center justify-center rounded-md bg-primary px-[22px] py-3 transition hover:bg-primary-hover disabled:opacity-60"
        >
          <svg className="mr-2" width="14" height="13" viewBox="0 0 14 13" fill="none">
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-[16px] font-medium text-white">
            {loading ? "Posting..." : "Post"}
          </span>
        </button>
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="1.1"
        d="M7 12.5A5.5 5.5 0 107 1.5a5.5 5.5 0 000 11zM1.5 7h11M7 1.5c1.38 1.5 2.17 3.47 2.17 5.5S8.38 11 7 12.5C5.62 11 4.83 9.03 4.83 7S5.62 3 7 1.5z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.2 6.2V4.7a3.8 3.8 0 017.6 0v1.5M3.5 6.2h7c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1z"
      />
    </svg>
  );
}
