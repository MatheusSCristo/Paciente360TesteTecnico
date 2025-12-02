import React, { createContext, useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { type Task } from "../components/TaskModal";

export type DashboardStats = {
  pending: number;
  overdue: number;
  completedThisWeek: number;
};

type Meta = {
  total: number;
  perPage: number;
  totalPages: number;
  page: number;
};

type TasksResponse = {
  data: Task[];
  meta: Meta;
  message: string;
};

interface TaskContextData {
  tasks: Task[];
  stats: DashboardStats | null;
  loading: boolean;
  statsLoading: boolean;
  total: number;
  page: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  fetchTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/tasks?page=${page}&perPage=${itemsPerPage}`
      );

      const json: TasksResponse = response.data;

      setTasks(json.data);
      setTotal(json.meta.total);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await api.get(`/tasks/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchTasks(), fetchStats()]);
  }, [fetchTasks, fetchStats]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        statsLoading,
        total,
        page,
        itemsPerPage,
        setPage,
        setItemsPerPage,
        fetchTasks,
        fetchStats,
        refreshAll,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
