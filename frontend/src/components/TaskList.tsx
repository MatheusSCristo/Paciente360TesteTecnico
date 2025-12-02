import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Pagination,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  RefreshCcw,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskModal, { type Task } from "./TaskModal";

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

const priorityColor = {
  LOW: {
    text: "white",
    bg: "green.500",
  },
  MEDIUM: {
    text: "white",
    bg: "yellow.500",
  },
  HIGH: {
    text: "white",
    bg: "red.500",
  },
};

const statusColor = {
  TO_DO: {
    text: "black",
    bg: "gray.300",
  },
  DOING: {
    text: "white",
    bg: "yellow.400",
  },
};

const TaskList: React.FC = () => {
  const breakpointValue = useBreakpointValue({ base: 3, md: 8 });
  const { tasks, total, loading, page, setPage, itemsPerPage, setItemsPerPage, refreshAll } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (breakpointValue) {
      setItemsPerPage(breakpointValue);
    }
  }, [breakpointValue, setItemsPerPage]);


  return (
    <>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        initialTask={selectedTask}
      />
      <Flex direction={"column"} flex={1} overflow="hidden">
        <Box p={4} borderWidth={1} borderRadius="md" bg="white" h={"100%"}>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Flex align="start" direction={"column"}>
              <Text fontSize="xl" fontWeight="bold">
                Lista de Tarefas ({total})
              </Text>
              <Text fontSize="sm" color="gray.500">
                Exibindo {tasks.length} de {total} tarefas
              </Text>
            </Flex>
            <Button
              color="black"
              bg="transparent"
              onClick={() => {
                setPage(1);
                refreshAll();
              }}
              _hover={{ bg: "gray.200" }}
            >
              <RefreshCcw size={16} />
            </Button>
          </Flex>

          {loading ? (
            <Stack align="center" py={10}>
              <Spinner size="lg" color="teal.500" />
            </Stack>
          ) : tasks.length === 0 ? (
            <Text color="gray.500" textAlign="center" mt={10}>
              Nenhuma tarefa encontrada.
            </Text>
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                xl: "repeat(4,1fr)",
              }}
              gap={5}
            >
              {tasks.map((task) => (
                <Flex
                  onClick={() => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  key={task.id}
                  p={2}
                  _hover={{ bg: "gray.200", cursor: "pointer", scale: 1.02 }}
                  transition={"all 0.2s ease-in-out"}
                  minW="0"
                  borderWidth={1}
                  borderRadius="md"
                  bg="gray.100"
                  shadow={"lg"}
                  direction={"column"}
                  position={"relative"}
                  justifyContent={"space-between"}
                >
                  {task.completedAt && (
                    <Box
                      position={"absolute"}
                      top={-3}
                      right={-2}
                      p={0.1}
                      border={"2px solid green"}
                      borderRadius="full"
                      bg="green.50"
                    >
                      <Check size={20} color={"green"} />
                    </Box>
                  )}
                  <HStack gap={2} align="start">
                    <VStack align="start" mt={2} gap={0} w={"full"}>
                      <HStack
                        justify="space-between"
                        align={"start"}
                        gap={1}
                        w="full"
                      >
                        <Text
                          fontWeight="semibold"
                          wordBreak={"break-word"}
                          lineClamp={2}
                          title={task.title}
                        >
                          {task.title}
                        </Text>
                        {!task.completedAt && task.dueDate && (
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            textWrap={"nowrap"}
                          >
                            Entrega:{" "}
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Text>
                        )}
                        {task.completedAt && (
                          <Text
                            fontSize="xs"
                            color="green.500"
                            textWrap={"nowrap"}
                          >
                            Concluída em:{" "}
                            {new Date(task.completedAt).toLocaleDateString()}
                          </Text>
                        )}
                      </HStack>
                      <Text
                        ml={2}
                        fontSize="xs"
                        title={task.description}
                        color="gray.800"
                        wordBreak="break-word"
                        lineClamp={3}
                      >
                        {task.description}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack mt={2} gap={4}>
                    <Badge
                      fontSize="xs"
                      color={priorityColor[task.priority].text}
                      bg={priorityColor[task.priority].bg}
                      p={1}
                    >
                      <Flag size={16} />
                      {priorityMapped[task.priority]}
                    </Badge>
                    {task.status != "DONE" && (
                      <Badge
                        fontSize="xs"
                        color={statusColor[task.status].text}
                        bg={statusColor[task.status].bg}
                        p={1}
                      >
                        <Clock size={16} />
                        {statusMapped[task.status]}
                      </Badge>
                    )}
                  </HStack>
                  <Flex justifyContent={"space-between"}>
                    <Text fontSize="xs" color="gray.500">
                      Criada em: {new Date(task.createdAt).toLocaleDateString()}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Atualizada em:{" "}
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Grid>
          )}
        </Box>
        {total > 0 && (
          <Stack my={3} align="center">
            <Pagination.Root
              count={total}
              pageSize={itemsPerPage}
              page={page}
              onPageChange={(e) => setPage(e.page)}
            >
              <HStack gap={2}>
                <Pagination.PrevTrigger _hover={{ bg: "gray.200" }}>
                  <ChevronLeft size={18} />
                </Pagination.PrevTrigger>

                <Pagination.Context>
                  {({ pages }) =>
                    pages.map((pageItem, index) => {
                      if (pageItem.type === "ellipsis") {
                        return (
                          <Pagination.Ellipsis key={index} index={index} />
                        );
                      }

                      return (
                        <Pagination.Item
                          key={index}
                          type="page"
                          value={pageItem.value}
                          _hover={{ bg: "gray.200" }}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          w={8}
                          h={8}
                          rounded={"md"}
                          bg={
                            pageItem.value == page ? "gray.200" : "transparent"
                          }
                        >
                          {pageItem.value}
                        </Pagination.Item>
                      );
                    })
                  }
                </Pagination.Context>

                <Pagination.NextTrigger _hover={{ bg: "gray.200" }}>
                  <ChevronRight size={18} />
                </Pagination.NextTrigger>
              </HStack>
            </Pagination.Root>
          </Stack>
        )}
      </Flex>
    </>
  );
};

export default TaskList;
