import {
    Button,
    Flex,
    Heading,
    SimpleGrid,
    Skeleton,
    Stat,
    Text, // Na v3 importamos apenas o componente pai
} from "@chakra-ui/react";
import useDashboardStats from "../hooks/useDashboardStats";

const Dashboard = () => {
  const { stats, loading } = useDashboardStats();

  return (
    <Flex direction="column" align="left" p={{ base: 4, md: 8 }}>
      <Flex direction={"row"} justify={"space-between"} align={"center"}>
        <Flex direction="column" align="left" >
          <Heading size="3xl" color="gray.700">
            Minhas Tarefas
          </Heading>
          <Text fontSize="lg" mb={4} color="gray.600">
            Visualize e gerecie suas tarefas
          </Text>
        </Flex>
        <Button bg={"gray.600"} size="lg" p={4} rounded={10} >
          Adicionar Tarefa
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="100%">
        <Stat.Root bg="gray.100" p={6} borderRadius={12} boxShadow="md">
          <Stat.Label fontSize="lg" color="gray.600">
            Tarefas Pendentes
          </Stat.Label>
          <Skeleton loading={loading} borderRadius={12} w={"20%"}>
            <Stat.ValueText fontSize="3xl" color="blue.500">
              {stats?.pending ?? 0}
            </Stat.ValueText>
          </Skeleton>
        </Stat.Root>

        <Stat.Root bg="gray.100" p={6} borderRadius={12} boxShadow="md">
          <Stat.Label fontSize="lg" color="gray.600">
            Tarefas Atrasadas
          </Stat.Label>
          <Skeleton loading={loading} borderRadius={12} w={"20%"}>
            <Stat.ValueText fontSize="3xl" color="red.500">
              {stats?.overdue ?? 0}
            </Stat.ValueText>
          </Skeleton>
        </Stat.Root>

        <Stat.Root bg="gray.100" p={6} borderRadius={12} boxShadow="md">
          <Stat.Label fontSize="lg" color="gray.600">
            Tarefas Concluídas na Semana
          </Stat.Label>
          <Skeleton loading={loading} borderRadius={12} w={"20%"}>
            <Stat.ValueText fontSize="3xl" color="green.500">
              {stats?.completedThisWeek ?? 0}
            </Stat.ValueText>
          </Skeleton>
        </Stat.Root>
      </SimpleGrid>
    </Flex>
  );
};

export default Dashboard;
