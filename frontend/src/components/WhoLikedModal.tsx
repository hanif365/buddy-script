"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import { Reactor } from "@/types";
import { reactionMap } from "@/lib/reactions";

export default function WhoLikedModal({
  endpoint,
  onClose,
}: {
  endpoint: string;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<Reactor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient(endpoint)
      .then((res) => setUsers(res.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-[460px] flex-col overflow-hidden rounded-lg bg-surface shadow-[rgb(149_157_165_/_30%)_0px_8px_24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-divider px-6 py-4">
          <h4 className="text-[18px] font-semibold text-heading">
            Reactions
            {users.length > 0 && (
              <span className="ml-2 font-normal text-muted">{users.length}</span>
            )}
          </h4>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[22px] leading-none text-muted transition hover:bg-comment"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-divider border-t-primary" />
            </div>
          ) : users.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-muted">No reactions yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {users.map((u) => {
                const reaction = u.reaction ? reactionMap[u.reaction] : null;
                return (
                  <li key={u._id} className="flex items-center gap-3">
                    <span className="relative shrink-0">
                      <Image
                        src={u.avatar || "/images/default-avatar.svg"}
                        alt=""
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      {reaction && (
                        <span className="absolute -right-1 -bottom-1">
                          <reaction.Emoji size={18} />
                        </span>
                      )}
                    </span>
                    <span className="text-[15px] font-medium text-heading">
                      {u.firstName} {u.lastName}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
