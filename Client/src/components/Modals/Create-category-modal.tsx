import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory } from "@/hooks/useCategory";
import { Category } from "@/types";
import { useState } from "react";

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated: (category: Category) => void;
}

export const CreateCategoryModal = ({
  open,
  onOpenChange,
  onCategoryCreated,
}: CreateCategoryModalProps) => {
  const [name, setName] = useState("");
  const { mutate: createCategoryMutate, isPending } = useCreateCategory();

  const handleCreate = () => {
    if (!name.trim()) return; // Basic validation

    createCategoryMutate(
      { name: name.trim() },
      {
        onSuccess: (newCategory) => {
          onCategoryCreated(newCategory); // Pass the new category back
          setName(""); // Reset input
          onOpenChange(false); // Close modal
        },
        onError: () => {
          // Error toast is handled by the hook
        },
      }
    );
  };

  // Close modal without creating
  const handleClose = () => {
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90%] max-w-[350px] border-baseborder bg-baseform/95 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-white text-center">
            Create New Category
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="category-name" className="text-white">
            Category Name
          </Label>
          <Input
            id="category-name"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 text-white bg-baseform"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-btn text-black hover:bg-btn/90 disabled:opacity-50"
            onClick={handleCreate}
            disabled={isPending || !name.trim()}
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
