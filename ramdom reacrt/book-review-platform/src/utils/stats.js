const STATS_STORAGE_KEY = "bookr_stats";

export const getUserStats = () => {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return { totalReviews: 0, totalFavorites: 0 };
    const parsed = JSON.parse(raw);
    return {
      totalReviews: Number(parsed.totalReviews) || 0,
      totalFavorites: Number(parsed.totalFavorites) || 0,
    };
  } catch (e) {
    console.error("Error reading stats from localStorage", e);
    return { totalReviews: 0, totalFavorites: 0 };
  }
};

export const setUserStats = (stats) => {
  try {
    const current = getUserStats();
    const merged = {
      totalReviews: Number(stats.totalReviews ?? current.totalReviews) || 0,
      totalFavorites:
        Number(stats.totalFavorites ?? current.totalFavorites) || 0,
    };
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (e) {
    console.error("Error writing stats to localStorage", e);
    return null;
  }
};
