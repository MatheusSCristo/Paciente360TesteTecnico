import {
  Button,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import api from "../api/axios";
import { toaster } from "../components/ui/toaster";
import { PriorityLevel, TaskStatus } from "../utils/enums";

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  status: z.enum(TaskStatus, { message: "Status inválido" }),
  priority: z.enum(PriorityLevel, { message: "Prioridade inválida" }),
  dueDate: z.string().optional(),
});

type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export interface Task extends CreateTaskSchema {
  id?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask: Task | null;
}

const defaultValues: CreateTaskSchema = {
  title: "",
  description: "",
  status: TaskStatus.TO_DO,
  priority: PriorityLevel.MEDIUM,
  dueDate: "",
};

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  initialTask,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: initialTask || defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        initialTask
          ? {
              ...initialTask,
              dueDate: initialTask.dueDate
                ? initialTask.dueDate.substring(0, 10)
                : "",
            }
          : defaultValues
      );
    }
  }, [isOpen, initialTask, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onFormSubmit: SubmitHandler<CreateTaskSchema> = async (data) => {
    const formData = {
      ...data,
      status: (data.status as TaskStatus) || null,
      priority: (data.priority as PriorityLevel) || null,
      dueDate: data.dueDate ? data.dueDate : null,
    };
    let promise;
    if (initialTask) {
      promise = api.put(
        `http://localhost:3000/tasks/${initialTask.id}`,
        formData
      );
    } else {
      promise = api.post("http://localhost:3000/tasks", formData);
    }

    toaster.promise(promise, {
      success: {
        title: initialTask ? "Tarefa atualizada!" : "Tarefa criada!",
        description: "A operação foi realizada com sucesso.",
      },
      error: (err: unknown) => ({
        title: "Erro ao salvar",
        description:
          (err as { response: { data: { message: string } } })?.response?.data
            ?.message || "Ocorreu um erro inesperado.",
      }),
      loading: {
        title: "Salvando...",
        description: "Por favor, aguarde.",
      },
    });

    try {
      await promise;
      window.location.reload();
      handleClose();
    } catch {
      console.error("Erro ao salvar tarefa");
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && handleClose()}
      placement={"center"}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          padding={{ base: 5, md: 10 }}
          rounded={16}
          w={{ base: "90%", md: "40%" }}
        >
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Dialog.Header mb={4}>
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {initialTask ? "Editar Tarefa" : "Adicionar Tarefa"}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  pos="absolute"
                  top="2"
                  right="2"
                >
                  <X size={20} />
                </Button>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={4}>
                <Field.Root invalid={!!errors.title}>
                  <Field.Label>Título*</Field.Label>
                  <Input
                    placeholder="Título da tarefa"
                    pl={3}
                    {...register("title")}
                  />
                  {errors.title && (
                    <Field.ErrorText>{errors.title.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.description}>
                  <Field.Label>Descrição</Field.Label>
                  <Textarea
                    placeholder="Descrição da tarefa"
                    p={3}
                    {...register("description")}
                  />
                </Field.Root>

                <Field.Root invalid={!!errors.status}>
                  <Field.Label>Status</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field pl={3} {...register("status")}>
                      <option value={TaskStatus.TO_DO}>A Fazer</option>
                      <option value={TaskStatus.DOING}>Fazendo</option>
                      <option value={TaskStatus.DONE}>Concluída</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {errors.status && (
                    <Field.ErrorText>{errors.status.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.priority}>
                  <Field.Label>Prioridade</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field pl={3} {...register("priority")}>
                      <option value={PriorityLevel.LOW}>Baixa</option>
                      <option value={PriorityLevel.MEDIUM}>Média</option>
                      <option value={PriorityLevel.HIGH}>Alta</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {errors.priority && (
                    <Field.ErrorText>{errors.priority.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.dueDate}>
                  <Field.Label>Data Entrega</Field.Label>
                  <Input type="date" px={3} {...register("dueDate")} />
                  {errors.dueDate && (
                    <Field.ErrorText>{errors.dueDate.message}</Field.ErrorText>
                  )}
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer mt={6} justifyContent="flex-end" gap={3}>
              <Button
                variant="outline"
                onClick={handleClose}
                p={3}
                rounded={12}
                w={"1/5"}
                _hover={{ bg: "blackAlpha.500", color: "black" }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                p={3}
                rounded={12}
                w={"1/5"}
                _hover={{ bg: "blackAlpha.500", color: "black" }}
              >
                {initialTask ? "Salvar" : "Criar"}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default TaskModal;
