import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stat,
  Text
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskModal from "./TaskModal";

const Dashboard = () => {
  const { stats, statsLoading} = useTasks();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  
  return (
    <>
      <Flex direction="column" align="left" p={{ base: 4, md: 8 }}>
        <Flex direction={"row"} justify={"space-between"} align={"center"}>
          <Flex direction="column" align="left">
            <Heading size={{ base: "xl", md: "3xl" }} color="gray.700">
              Minhas Tarefas
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} mb={4} color="gray.600">
              Visualize e gerecie suas tarefas
            </Text>
          </Flex>
          <Button
            bg={"gray.600"}
            size="lg"
            p={2}
            display={{ base: "none", md: "flex" }}
            rounded={10}
            onClick={() => setTaskModalOpen(true)}
            color={"white"}
            _hover={{ bg: "gray.700" }}
          >
            Nova Tarefa
          </Button>
          <Button
            bg={"gray.600"}
            size="lg"
            p={2}
            display={{ base: "flex", md: "none" }}
            rounded={10}
            onClick={() => setTaskModalOpen(true)}
            color={"white"}
            _hover={{ bg: "gray.700" }}
          >
            <Plus size={20} />
          </Button>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap={{
            base: 4,
            md: 6,
          }}
          w="100%"
        >
          <Stat.Root
            bg="gray.100"
            p={{ base: 3, md: 6 }}
            borderRadius={12}
            boxShadow="md"
          >
            <Stat.Label fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Tarefas Pendentes
            </Stat.Label>
            <Skeleton loading={statsLoading} borderRadius={12} w={"20%"}>
              <Stat.ValueText fontSize="3xl" color="blue.500">
                {stats?.pending ?? 0}
              </Stat.ValueText>
            </Skeleton>
          </Stat.Root>

          <Stat.Root
            bg="gray.100"
            p={{ base: 3, md: 6 }}
            borderRadius={12}
            boxShadow="md"
          >
            <Stat.Label fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Tarefas Atrasadas
            </Stat.Label>
            <Skeleton loading={statsLoading} borderRadius={12} w={"20%"}>
              <Stat.ValueText fontSize="3xl" color="red.500">
                {stats?.overdue ?? 0}
              </Stat.ValueText>
            </Skeleton>
          </Stat.Root>

          <Stat.Root
            bg="gray.100"
            p={{ base: 3, md: 6 }}
            borderRadius={12}
            boxShadow="md"
          >
            <Stat.Label fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Tarefas Concluídas na Semana
            </Stat.Label>
            <Skeleton loading={statsLoading} borderRadius={12} w={"20%"}>
              <Stat.ValueText fontSize="3xl" color="green.500">
                {stats?.completedThisWeek ?? 0}
              </Stat.ValueText>
            </Skeleton>
          </Stat.Root>
        </SimpleGrid>
      </Flex>
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        initialTask={null}
      />
    </>
  );
};

export default Dashboard;
