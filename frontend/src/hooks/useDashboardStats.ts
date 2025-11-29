import { useEffect, useState } from "react";

export type DashboardStats = {
  pending: number;
  overdue: number;
  completedThisWeek: number;
};

const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        pending: 7,
        overdue: 2,
        completedThisWeek: 5,
      });
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return { stats, loading };
};

export default useDashboardStats;
