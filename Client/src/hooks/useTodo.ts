import {
  deleteAuthRequest,
  getAuthRequest,
  patchAuthRequest,
  postAuthRequest,
} from "../lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types";
import toast from "react-hot-toast";

const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await getAuthRequest("tasks");
      return response.tasks;
    },
  });
};

const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    { title: string; status: string; categoryId?: string }
  >({
    mutationFn: async (taskData) => {
      const response = await postAuthRequest("tasks/create", taskData);
      return response.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create task`);
    },
  });
};

const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const { mutate: updateTaskMutation } = useMutation<
    any,
    Error,
    Partial<Task>,
    { previousTasks?: Task[] }
  >({
    mutationFn: async (task: Partial<Task>) => {
      const response = await patchAuthRequest(`tasks/${task.id}`, {
        status: task.status,
        title: task.title,
      });
      return response;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      if (variables.status && variables.id) {
        queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
          old.map((task) =>
            task.id === variables.id
              ? { ...task, status: variables.status ?? task.status }
              : task
          )
        );
      }

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      toast.error("Failed to update task");
      console.error("Failed to update task:", err);
    },
    onSuccess: () => {},
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return { updateTaskMutation };
};

const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteTaskMutation } = useMutation({
    mutationFn: async (taskId: string) => {
      const isDeleted = await deleteAuthRequest(`tasks/${taskId}`);
      return isDeleted;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
  return { deleteTaskMutation };
};

export { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask };
