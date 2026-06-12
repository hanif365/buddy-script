"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import { User, Comment } from "@/types";
import CommentItem from "@/components/CommentItem";

export default function CommentSection({
  postId,
  currentUser,
  onCommentAdded,
}: {
  postId: string;
  currentUser: User | null;
  onCommentAdded: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    apiClient(`/posts/${postId}/comments`)
      .then((res) => setComments(res.comments))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await apiClient(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setComments((prev) => [res.comment, ...prev]);
      setText("");
      onCommentAdded();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-6 pt-5">
      <form
        onSubmit={submit}
        className="mb-5 flex items-center gap-2 rounded-[18px] bg-comment px-3 py-1"
      >
        <Image
          src={currentUser?.avatar || "/images/default-avatar.svg"}
          alt=""
          width={26}
          height={26}
          className="h-[26px] w-[26px] shrink-0 rounded-full object-cover"
        />
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment"
          className="h-9 w-full bg-transparent text-[14px] text-body outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="cursor-pointer text-[14px] font-medium text-primary disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {loading ? (
        <p className="pb-4 text-[14px] text-muted">Loading comments...</p>
      ) : (
        comments.map((c) => (
          <CommentItem key={c._id} comment={c} currentUser={currentUser} />
        ))
      )}
    </div>
  );
}
