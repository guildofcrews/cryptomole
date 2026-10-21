"use client";

import { useFollowedCoins } from "@/hooks/useFollowedCoins";

interface FollowButtonProps {
  slug: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function FollowButton({
  slug,
  size = "md",
  showLabel = false,
}: FollowButtonProps) {
  const { isFollowing, toggle, isLoaded } = useFollowedCoins();

  if (!isLoaded) {
    return (
      <button
        className={`${
          size === "sm" ? "p-1.5" : "p-2"
        } rounded-lg bg-white/5 animate-pulse`}
        disabled
      >
        <svg
          className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"} text-ui-muted`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    );
  }

  const following = isFollowing(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`${
        size === "sm" ? "p-1.5" : "p-2"
      } rounded-lg transition-all ${
        following
          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
          : "bg-white/5 text-ui-muted hover:bg-white/10 hover:text-white"
      } ${showLabel ? "flex items-center gap-1.5" : ""}`}
      title={following ? "Unfollow" : "Follow"}
    >
      <svg
        className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`}
        fill={following ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {showLabel && (
        <span className="text-sm font-medium">
          {following ? "Following" : "Follow"}
        </span>
      )}
    </button>
  );
}
