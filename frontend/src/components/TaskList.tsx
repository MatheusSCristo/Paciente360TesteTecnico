import {
  Badge,
  Box,
  HStack,
  Pagination,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../api/axios";


export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "TO_DO" | "DOING" | "DONE";
  dueDate: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
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

const PAGE_SIZE = 5; 

const useTasks = (page: number) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `http://localhost:3000/tasks?page=${page}&perPage=${PAGE_SIZE}`
        );

        const json: TasksResponse = response.data;

        setTasks(json.data);
        setTotal(json.meta.total);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page]); 

  return { tasks, total, loading };
};

const TaskList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { tasks, total, loading } = useTasks(page);

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="white">
      <Text fontSize="xl" mb={4} fontWeight="bold">
        Lista de Tarefas ({total})
      </Text>

      {loading ? (
        <Stack align="center" py={10}>
          <Spinner size="lg" color="teal.500" />
        </Stack>
      ) : (
        <VStack align="stretch" gap={3}>
          {tasks.length === 0 && (
            <Text color="gray.500" textAlign="center">
              Nenhuma tarefa encontrada.
            </Text>
          )}

          {tasks.map((task) => (
            <Box
              key={task.id}
              p={3}
              borderWidth={1}
              borderRadius="md"
              bg="gray.50"
            >
              <HStack justify="space-between">
                <Text fontWeight="semibold">{task.title}</Text>
                <HStack>
                  <Badge
                    colorScheme={
                      task.status === "DONE"
                        ? "green"
                        : task.status === "DOING"
                        ? "yellow"
                        : "gray"
                    }
                  >
                    {task.status}
                  </Badge>
                  <Badge
                    colorScheme={
                      task.priority === "HIGH"
                        ? "red"
                        : task.priority === "MEDIUM"
                        ? "yellow"
                        : "blue"
                    }
                  >
                    {task.priority}
                  </Badge>
                </HStack>
              </HStack>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {task.description}
              </Text>
              {task.dueDate && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Vencimento: {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              )}
            </Box>
          ))}
        </VStack>
      )}

      {total > 0 && (
        <Stack mt={6} align="center">
          <Pagination.Root
            count={total}
            pageSize={PAGE_SIZE} 
            page={page} 
            onPageChange={(e) => setPage(e.page)}
          >
            <HStack gap={2}>
              <Pagination.PrevTrigger>
                <ChevronLeft size={18} />
              </Pagination.PrevTrigger>

              <Pagination.Context>
                {({ pages }) =>
                  pages.map((pageItem, index) => {
                    if (pageItem.type === "ellipsis") {
                      return <Pagination.Ellipsis key={index} index={index} />;
                    }

                    return (
                      <Pagination.Item
                        key={index}
                        type="page"
                        value={pageItem.value}
                      >
                        {pageItem.value}
                      </Pagination.Item>
                    );
                  })
                }
              </Pagination.Context>

              <Pagination.NextTrigger>
                <ChevronRight size={18} />
              </Pagination.NextTrigger>
            </HStack>
          </Pagination.Root>
        </Stack>
      )}
    </Box>
  );
};

export default TaskList;
