"use client";

import { useState, useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "cryptomole_followed_coins";
const DEFAULT_COINS = ["bitcoin", "ethereum", "solana", "sui", "chainlink"];

function saveCoins(coins: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
  } catch {
    // ignore
  }
}

let cachedCoins: string[] = DEFAULT_COINS;
let cachedJson = JSON.stringify(DEFAULT_COINS);

function getSnapshot(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored !== cachedJson) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCoins = parsed;
        cachedJson = stored;
      }
    } else if (!stored) {
      saveCoins(DEFAULT_COINS);
      cachedCoins = DEFAULT_COINS;
      cachedJson = JSON.stringify(DEFAULT_COINS);
    }
  } catch {
    // ignore
  }
  return cachedCoins;
}

function getServerSnapshot(): string[] {
  return DEFAULT_COINS;
}

const storageSubscribers = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  storageSubscribers.add(callback);

  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      callback();
    }
  };
  window.addEventListener("storage", handler);

  return () => {
    storageSubscribers.delete(callback);
    window.removeEventListener("storage", handler);
  };
}

function notifySubscribers() {
  storageSubscribers.forEach((cb) => cb());
}

export function useFollowedCoins() {
  const followedSlugs = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [isHydrated, setIsHydrated] = useState(false);

  if (typeof window !== "undefined" && !isHydrated) {
    setIsHydrated(true);
  }

  const follow = useCallback((slug: string) => {
    const current = getSnapshot();
    if (current.includes(slug)) return;
    const updated = [...current, slug];
    cachedCoins = updated;
    cachedJson = JSON.stringify(updated);
    saveCoins(updated);
    notifySubscribers();
  }, []);

  const unfollow = useCallback((slug: string) => {
    const current = getSnapshot();
    const updated = current.filter((s) => s !== slug);
    if (updated.length === current.length) return;
    cachedCoins = updated;
    cachedJson = JSON.stringify(updated);
    saveCoins(updated);
    notifySubscribers();
  }, []);

  const isFollowing = useCallback(
    (slug: string) => followedSlugs.includes(slug),
    [followedSlugs]
  );

  const toggle = useCallback(
    (slug: string) => {
      if (followedSlugs.includes(slug)) {
        unfollow(slug);
      } else {
        follow(slug);
      }
    },
    [followedSlugs, follow, unfollow]
  );

  return {
    followedSlugs,
    isLoaded: isHydrated,
    follow,
    unfollow,
    isFollowing,
    toggle,
  };
}
