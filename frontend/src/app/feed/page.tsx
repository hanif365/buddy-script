"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";
import { User, Post } from "@/types";

export default function FeedPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [me, feed] = await Promise.all([
          apiClient("/auth/me"),
          apiClient("/posts"),
        ]);
        setUser(me.user);
        setPosts(feed.posts);
        setCursor(feed.nextCursor);
        setHasMore(Boolean(feed.nextCursor));
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursor) return;
    setLoadingMore(true);
    try {
      const feed = await apiClient(`/posts?cursor=${encodeURIComponent(cursor)}`);
      setPosts((prev) => [...prev, ...feed.posts]);
      setCursor(feed.nextCursor);
      setHasMore(Boolean(feed.nextCursor));
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, hasMore, loadingMore]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar user={user} />

      <div className="mx-auto max-w-[1140px] px-3 pt-[68px] 2xl:max-w-[1320px]">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr_1fr]">
          <aside className="sticky top-[68px] hidden max-h-[calc(100vh-68px)] self-start overflow-y-auto pt-[18px] lg:block">
            <LeftSidebar />
          </aside>

          <main className="mx-auto w-full max-w-[600px] pt-[18px] pb-10 lg:max-w-none">
            <Composer
              user={user}
              onCreated={(post) => setPosts((prev) => [post, ...prev])}
            />

            {loading ? (
              <div className="flex justify-center py-10">
                <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-divider border-t-primary" />
              </div>
            ) : posts.length === 0 ? (
              <p className="py-10 text-center text-muted">No posts yet.</p>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} currentUser={user} />
                ))}

                {hasMore ? (
                  <div ref={loaderRef} className="flex justify-center py-6">
                    {loadingMore && (
                      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-divider border-t-primary" />
                    )}
                  </div>
                ) : (
                  <p className="py-6 text-center text-[14px] text-muted">
                    You&apos;re all caught up.
                  </p>
                )}
              </>
            )}
          </main>

          <aside className="sticky top-[68px] hidden max-h-[calc(100vh-68px)] self-start overflow-y-auto pt-[18px] lg:block">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
