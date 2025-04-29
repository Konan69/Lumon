import { getAuthRequest, postAuthRequest } from "../lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/types";
import toast from "react-hot-toast";
import useCategoryStore from "@/store/categoriesStore";

const useGetCategories = () => {
  const setCategories = useCategoryStore((state) => state.setCategories);

  const queryResult = useQuery<Category[]>({
    queryKey: ["Categories"],
    queryFn: async () => {
      try {
        const response = await getAuthRequest("categories");
        if (response) {
          setCategories(response);
        }
        return response;
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw error;
      }
    },
  });

  return queryResult;
};

const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const addCategory = useCategoryStore((state) => state.addCategory);

  return useMutation<Category, Error, { name: string }>({
    mutationFn: async ({ name }: { name: string }) => {
      const response = await postAuthRequest("categories/create", { name });
      return response.category;
    },
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
      addCategory(newCategory);
    },
    onError: (error) => {
      toast.error(`Failed to create category`);
    },
  });
};

export { useGetCategories, useCreateCategory };
