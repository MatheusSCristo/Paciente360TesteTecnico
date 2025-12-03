import {
  Drawer,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  VStack
} from "@chakra-ui/react";
import { useState } from "react";
// 1. Importando os ícones reais da Lucide
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const path = window.location.pathname;

  const routes = [
    { name: "Início", path: "/" },
    // { name: "Calendário", path: "/calendario" },
  ];

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1.5rem"
      bg="gray.600"
      color="white"
    >
      <Heading size={{ md: 'xl', base: '2xl', "2xl": '2xl' }} letterSpacing="tighter" color="white">
        Tasks
      </Heading>

      <HStack gap={8} display={{ base: "none", md: "flex" }}>
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            fontSize={{md:"sm","2xl":"md"}}
            color={"white"}
            fontWeight={path === route.path ? "bold" : "normal"}
            padding={2}
            rounded={8}
            textDecoration={path === route.path ? "underline" : "none"}
            textUnderlineOffset={4}
            focusRing={"none"}
            _hover={{ textDecoration: "none", bg: "gray.500" }}
          >
            {route.name}
          </Link>
        ))}
      </HStack>

      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Trigger asChild>
          <IconButton
            variant="ghost"
            display={{ base: "flex", md: "none" }}
            aria-label="Abrir menu"
          >
            <Menu size={32} color="white" />
          </IconButton>
        </Drawer.Trigger>

        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg="gray.300" color="white" padding={4}>
            <Drawer.Header
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Drawer.Title color="black">Menu</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <IconButton variant="ghost" size="sm" aria-label="Fechar menu">
                  <X size={20} />
                </IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>

            <Drawer.Body>
              <VStack align="start" mt={4}>
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    fontSize="lg"
                    width={"100%"}
                    padding={2}
                    rounded={8}
                    onClick={() => setOpen(false)}
                    focusRing={"none"}
                    fontWeight={path === route.path ? "bold" : "normal"}
                    bg={path === route.path ? "gray.200" : "transparent"}
                  >
                    {route.name}
                  </Link>
                ))}
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Flex>
  );
}
