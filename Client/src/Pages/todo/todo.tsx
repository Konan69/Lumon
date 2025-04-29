import { CreateTask } from "@/components/Modals";
import { useState, useMemo } from "react";
import { OptionsMenu } from "@/components/Dropdown";
import { Task } from "@/types";
import { useDeleteTask, useGetTasks, useUpdateTask } from "../../hooks/useTodo";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCategoryStore from "@/store/categoriesStore";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  closestCorners,
  DropAnimation,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskStatsSkeleton } from "@/components/Skeletons/TaskStatsSkeleton";
import { StatusSkeleton } from "@/components/Skeletons/StatusSkeleton";
import { AlertTriangle } from "lucide-react";

const STATUS_OPTIONS_WITH_ALL = [
  { value: "All", label: "All Statuses" },
  { value: "Todo", label: "Todo" },
  { value: "In-Progress", label: "In Progress" },
  { value: "Done", label: "Done" },
] as const;

interface StatusProps {
  title: string;
  cards: Task[];
  status: string;
}

interface CardProps {
  task: Task;
  isOverlay?: boolean;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

const TaskStats = ({ cards }: { cards: Task[] }) => {
  const totalTasks = cards.length;
  const completedTasks = cards.filter((card) => card.status === "Done").length;
  const inProgressTasks = cards.filter(
    (card) => card.status === "In-Progress"
  ).length;
  const todoTasks = cards.filter((card) => card.status === "Todo").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div
        className="bg-baseform p-4 rounded-lg border border-baseborder"
        data-testid="stats-total"
      >
        <h3 className="text-sm text-neutral-400">Total Tasks</h3>
        <p className="text-2xl font-semibold text-white mt-1">{totalTasks}</p>
      </div>
      <div
        className="bg-baseform p-4 rounded-lg border border-baseborder"
        data-testid="stats-completed"
      >
        <h3 className="text-sm text-neutral-400">Completed</h3>
        <p className="text-2xl font-semibold text-green-500 mt-1">
          {completedTasks}
        </p>
      </div>
      <div
        className="bg-baseform p-4 rounded-lg border border-baseborder"
        data-testid="stats-in-progress"
      >
        <h3 className="text-sm text-neutral-400">In Progress</h3>
        <p className="text-2xl font-semibold text-yellow-500 mt-1">
          {inProgressTasks}
        </p>
      </div>
      <div
        className="bg-baseform p-4 rounded-lg border border-baseborder"
        data-testid="stats-todo"
      >
        <h3 className="text-sm text-neutral-400">To Do</h3>
        <p className="text-2xl font-semibold text-blue-500 mt-1">{todoTasks}</p>
      </div>
    </div>
  );
};

export const Todo = () => {
  const { data: allTasks = [], isLoading, isError, error } = useGetTasks();
  const categories = useCategoryStore((state) => state.categories) ?? [];
  const queryClient = useQueryClient();
  const { updateTaskMutation } = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const statuses = ["Todo", "In-Progress", "Done"];

  const filteredTasks = useMemo(() => {
    if (isLoading || isError) return [];
    return allTasks.filter((task: Task) => {
      const statusMatch =
        statusFilter === "All" || task.status === statusFilter;
      const categoryMatch =
        categoryFilter === "All" || task.Category?.id === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [allTasks, statusFilter, categoryFilter, isLoading, isError]);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.task) {
      const task = allTasks.find(
        (t: Task) => t.id === (event.active.data.current?.task as Task).id
      );
      setActiveTask(task || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || isError) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskData = allTasks.find((task: Task) => task.id === activeId);
    if (!activeTaskData) return;
    const activeContainer = activeTaskData.status;

    const overIsColumn = statuses.includes(overId);
    let overContainer: string | undefined;
    if (overIsColumn) {
      overContainer = overId;
    } else {
      const overTaskData = allTasks.find((t: Task) => t.id === overId);
      overContainer = overTaskData?.status;
    }

    if (!overContainer) return;

    if (activeContainer === overContainer && active.id !== over.id) {
      const activeIndex = allTasks.findIndex((t: Task) => t.id === activeId);
      const overIndex = allTasks.findIndex((t: Task) => t.id === overId);
      if (activeIndex !== -1 && overIndex !== -1) {
        queryClient.setQueryData<Task[]>(["tasks"], (oldTasks = []) => {
          return arrayMove(oldTasks, activeIndex, overIndex);
        });
      } else {
        console.error("Could not find indices for reordering.");
      }
    } else if (activeContainer !== overContainer) {
      updateTaskMutation({ id: activeId, status: overContainer });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="p-4 md:px-6 pt-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Task Board</h1>
              <p className="text-neutral-400 text-sm mt-1">
                Manage and organize your tasks
              </p>
            </div>
            <CreateTask />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <Label className="text-sm text-neutral-400 px-1">
                Filter by Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] text-white bg-baseform border-baseborder h-9">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="text-white bg-baseform border-baseborder">
                  <SelectGroup>
                    {STATUS_OPTIONS_WITH_ALL.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <Label className="text-sm text-neutral-400 px-1">
                Filter by Category
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px] text-white bg-baseform border-baseborder h-9">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent className="text-white bg-baseform border-baseborder">
                  <SelectGroup>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TaskStatsSkeleton />
          <div className="flex flex-col md:flex-row w-full gap-4 overflow-x-auto pb-4">
            <StatusSkeleton />
            <StatusSkeleton />
            <StatusSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const tasksByStatus: { [key: string]: Task[] } = statuses.reduce(
    (acc, status) => {
      acc[status] = filteredTasks.filter(
        (task: Task) => task.status === status
      );
      return acc;
    },
    {} as { [key: string]: Task[] }
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 md:px-6 pt-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Board</h1>
            <p className="text-neutral-400 text-sm mt-1">
              Manage and organize your tasks
            </p>
          </div>
          <CreateTask />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <Label className="text-sm text-neutral-400 px-1">
              Filter by Status
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] text-white bg-baseform border-baseborder h-9">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="text-white bg-baseform border-baseborder">
                <SelectGroup>
                  {STATUS_OPTIONS_WITH_ALL.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <Label className="text-sm text-neutral-400 px-1">
              Filter by Category
            </Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] text-white bg-baseform border-baseborder h-9">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent className="text-white bg-baseform border-baseborder">
                <SelectGroup>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TaskStats cards={filteredTasks} />

        {isError ? (
          <div className="flex flex-col items-center justify-center p-6 md:p-12 bg-baseform/50 rounded-lg border border-baseborder mt-4">
            <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
            <div className="text-red-500 font-medium text-lg">
              Failed to load tasks
            </div>
            <div className="text-neutral-400 text-sm mt-1 text-center">
              {error instanceof Error
                ? error.message
                : "An unknown error occurred. Please check your connection or try again later."}
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            collisionDetection={closestCorners}
          >
            <div className="flex flex-col md:flex-row w-full gap-4 overflow-x-auto pb-4">
              {statuses.map((status) => (
                <Status
                  key={status}
                  title={status.replace("-", " ")}
                  cards={tasksByStatus[status] || []}
                  status={status}
                />
              ))}
            </div>
            <DragOverlay dropAnimation={dropAnimation}>
              {activeTask ? <Card task={activeTask} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

const Status = ({ title, cards, status }: StatusProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-full md:min-w-[280px] md:w-1/3 bg-baseform/50 p-4 rounded-lg border border-baseborder min-h-[200px] transition-colors duration-150 ease-in-out ${
        isOver ? "bg-neutral-700/50" : ""
      }`}
    >
      <h2 className="text-lg font-semibold text-white mb-4 capitalize">
        {title} ({cards.length})
      </h2>
      <SortableContext
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-1">
          {cards.map((card) => (
            <Card key={card.id} task={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const Card = ({ task, isOverlay }: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { task },
    disabled: isEditing,
  });
  const { deleteTaskMutation } = useDeleteTask();
  const { updateTaskMutation } = useUpdateTask();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 150ms ease",
    opacity: isDragging && !isOverlay ? 0.5 : 1,
    zIndex: isDragging || isOverlay ? 10 : undefined,
  };

  const handleDelete = () => {
    deleteTaskMutation(task.id);
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (editedTitle.trim() !== task.title) {
      updateTaskMutation({ id: task.id, title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-md border border-baseborder ${
        isOverlay
          ? "bg-baseform shadow-xl"
          : "bg-baseform/80 hover:border-neutral-500"
      } cursor-grab active:cursor-grabbing`}
      {...attributes}
      {...listeners}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <Input
            value={editedTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditedTitle(e.target.value)
            }
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-baseform text-white border-btn h-8 text-sm"
          />
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-7 text-xs px-2"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-btn text-black h-7 text-xs px-2"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium break-words">
              {task.title}
            </p>
            {task.Category && (
              <span className="text-xs mt-1 inline-block px-2 py-0.5 rounded bg-neutral-700 text-neutral-300">
                {task.Category.name}
              </span>
            )}
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            role="button"
            aria-label="Task options"
          >
            <OptionsMenu onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        </div>
      )}
    </div>
  );
};
