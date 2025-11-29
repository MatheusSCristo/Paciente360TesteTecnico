import {
  Badge,
  Box,
  Checkbox,
  Flex,
  Grid,
  HStack,
  Pagination,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Check, ChevronLeft, ChevronRight, Clock, Flag } from "lucide-react";
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

const statusMapped = {
  TO_DO: "PENDENTE",
  DOING: "FAZENDO",
  DONE: "CONCLUÍDO",
};

const priorityMapped = {
  LOW: "BAIXA",
  MEDIUM: "MÉDIA",
  HIGH: "ALTA",
};

const TaskList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { tasks, total, loading } = useTasks(page);

  return (
    <Flex direction={"column"} flex={1} overflow="hidden">
      <Box p={4} borderWidth={1} borderRadius="md" bg="white" h={"100%"}>
        <Text fontSize="xl" mb={4} fontWeight="bold">
          Lista de Tarefas ({total})
        </Text>

        {loading ? (
          <Stack align="center" py={10}>
            <Spinner size="lg" color="teal.500" />
          </Stack>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={3}
          >
            {tasks.length === 0 && (
              <Text color="gray.500" textAlign="center">
                Nenhuma tarefa encontrada.
              </Text>
            )}

            {tasks.map((task) => (
              <Box
                key={task.id}
                p={2}
                borderWidth={1}
                borderRadius="md"
                bg="gray.300"
                shadow={"lg"}
              >
                <HStack gap={2} align="start">
                  <Checkbox.Root
                    bg={"white"}
                    rounded={"md"}
                    checked={task.status === "DONE"}
                    onCheckedChange={() => {}}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                  <VStack align="start" mt={2} gap={0}>
                    <Text fontWeight="semibold">{task.title}</Text>
                    <Text fontSize="sm" color="gray.800">
                      {task.description}
                    </Text>
                  </VStack>
                </HStack>
                <HStack mt={2} gap={4}>
                  <Badge
                    fontSize="xs"
                    color="white"
                    bg={
                      task.priority === "HIGH"
                        ? "red.500"
                        : task.priority === "MEDIUM"
                        ? "yellow.500"
                        : "green.500"
                    }
                    p={1}
                  >
                    <Flag size={16} />
                    {priorityMapped[task.priority]}
                  </Badge>
                  <Badge fontSize="xs" color="black" bg={"gray.100"} p={1}>
                    {task.status == "DONE" ? (
                      <Check size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                    {statusMapped[task.status]}
                  </Badge>
                </HStack>
                {task.dueDate && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Vencimento: {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                )}
              </Box>
            ))}
          </Grid>
        )}
      </Box>
      {total > 0 && (
        <Stack mb={3} align="center">
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
    </Flex>
  );
};

export default TaskList;
