import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateTask } from "@/hooks/useTodo";
import { useCreateCategory } from "@/hooks/useCategory";
import useCategoryStore from "@/store/categoriesStore";
import { Category } from "@/types";
import { CreateCategoryModal } from "./Create-category-modal";

interface StatusOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "Todo", label: "Todo" },
  { value: "In-Progress", label: "In-Progress" },
  { value: "Done", label: "Done" },
] as const;

export const CreateTask = () => {
  const [status, setStatus] = useState<string>("Todo");
  const [title, setTitle] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);

  const categories = useCategoryStore((state) => state.categories) ?? [];

  const { mutate: createTaskMutate } = useCreateTask();

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === status);
  const isFormValid = title.trim() !== "" && status !== "";

  const resetForm = () => {
    setTitle("");
    setStatus("Todo");
    setSelectedCategoryId(null);
    setIsCreateCategoryModalOpen(false);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    createTaskMutate(
      { title, status, categoryId: selectedCategoryId ?? undefined },
      {
        onSuccess: () => {
          resetForm();
        },
        onError: () => {
          /* hook handles toast */
        },
      }
    );
  };

  const handleCategoryCreated = (newCategory: Category) => {
    setSelectedCategoryId(newCategory.id);
    setIsCreateCategoryModalOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-[#75F94C] text-black hover:bg-[#75F94C]/90">
            Create Task
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90%] max-w-[425px] border-baseborder bg-baseform/95 p-4 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-white text-center">
              Create A New Task
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Title Input */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label
                htmlFor="title"
                className="text-left sm:text-right text-white"
              >
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full sm:col-span-3 text-white bg-baseform"
              />
            </div>
            {/* Status Select */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label
                htmlFor="status"
                className="text-left sm:text-right text-white"
              >
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:col-span-3 text-white bg-baseform">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="text-white bg-baseform">
                  <SelectGroup>
                    {STATUS_OPTIONS.map((statusOption) => (
                      <SelectItem
                        key={statusOption.value}
                        value={statusOption.value}
                      >
                        {statusOption.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* Category Select + Modal Trigger */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label
                htmlFor="category"
                className="text-left sm:text-right text-white"
              >
                Category (Optional)
              </Label>
              <div className="sm:col-span-3 flex items-center gap-2">
                <Select
                  value={selectedCategoryId ?? ""}
                  onValueChange={(value) =>
                    setSelectedCategoryId(value || null)
                  }
                >
                  <SelectTrigger className="w-full text-white bg-baseform">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="text-white bg-baseform">
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateCategoryModalOpen(true)}
                  className="shrink-0"
                >
                  New
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-btn text-black hover:bg-btn/90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              type="submit"
              disabled={!isFormValid}
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateCategoryModal
        open={isCreateCategoryModalOpen}
        onOpenChange={setIsCreateCategoryModalOpen}
        onCategoryCreated={handleCategoryCreated}
      />
    </>
  );
};
