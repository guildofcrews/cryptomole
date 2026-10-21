"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "cryptomole_followed_coins";

const DEFAULT_COINS = ["bitcoin", "ethereum", "solana", "tether", "usdc"];

function getStoredCoins(): string[] {
  if (typeof window === "undefined") return DEFAULT_COINS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COINS));
    return DEFAULT_COINS;
  } catch {
    return DEFAULT_COINS;
  }
}

let listeners: (() => void)[] = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  listeners = [...listeners, callback];
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

export function useFollowedCoins() {
  const followedSlugs = useSyncExternalStore(
    subscribe,
    getStoredCoins,
    () => DEFAULT_COINS
  );
  
  const isLoaded = typeof window !== "undefined";

  const follow = useCallback((slug: string) => {
    const current = getStoredCoins();
    if (current.includes(slug)) return;
    const updated = [...current, slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const unfollow = useCallback((slug: string) => {
    const current = getStoredCoins();
    const updated = current.filter((s) => s !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const isFollowing = useCallback(
    (slug: string) => {
      return followedSlugs.includes(slug);
    },
    [followedSlugs]
  );

  const toggle = useCallback(
    (slug: string) => {
      if (isFollowing(slug)) {
        unfollow(slug);
      } else {
        follow(slug);
      }
    },
    [isFollowing, follow, unfollow]
  );

  return {
    followedSlugs,
    isLoaded,
    follow,
    unfollow,
    isFollowing,
    toggle,
  };
}
