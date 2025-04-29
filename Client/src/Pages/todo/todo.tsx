import { CreateTask } from "@/components/Modals";
import { motion } from "framer-motion";
import { useState } from "react";
import { OptionsMenu } from "@/components/Dropdown";
import { Task } from "@/types";
import { useDeleteTask, useGetTasks, useUpdateTask } from "./useTodo";
import { useQueryClient } from "@tanstack/react-query";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface StatusProps {
  title: string;
  cards: Task[];
  status: string;
}

interface CardProps {
  task: Task;
  isOverlay?: boolean;
}

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
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 md:p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Board</h1>
            <p className="text-neutral-400 text-sm mt-1">
              Manage and organize your tasks
            </p>
          </div>
          <CreateTask />
        </div>
      </div>
      <Board />
    </div>
  );
};

const Board = () => {
  const { data: tasks = [], isLoading, isError, error } = useGetTasks();
  const queryClient = useQueryClient();
  const { updateTaskMutation } = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const statuses = ["Todo", "In-Progress", "Done"];

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.task) {
      setActiveTask(event.active.data.current.task as Task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) {
      console.log("Drag ended outside a droppable area");
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((task: Task) => task.id === activeId);
    if (!activeTask) {
      console.error("Active task not found!");
      return;
    }
    const activeContainer = activeTask.status;

    const overIsColumn = statuses.includes(overId);
    const overContainer = overIsColumn
      ? overId
      : tasks.find((t: Task) => t.id === overId)?.status;

    if (!overContainer) {
      console.error("Could not determine the 'over' container");
      return;
    }

    if (activeContainer === overContainer) {
      console.log(`Reordering within column: ${activeContainer}`);
      const activeIndex = tasks.findIndex((t: Task) => t.id === activeId);
      const overIndex = tasks.findIndex((t: Task) => t.id === overId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        queryClient.setQueryData<Task[]>(["tasks"], (oldTasks = []) => {
          const tasksInContainer = oldTasks.filter(
            (t: Task) => t.status === activeContainer
          );
          const oldIndexInContainer = tasksInContainer.findIndex(
            (t: Task) => t.id === activeId
          );
          const newIndexInContainer = tasksInContainer.findIndex(
            (t: Task) => t.id === overId
          );

          if (oldIndexInContainer !== -1 && newIndexInContainer !== -1) {
            const sortedTasksInContainer = arrayMove(
              tasksInContainer,
              oldIndexInContainer,
              newIndexInContainer
            );
            const otherTasks = oldTasks.filter(
              (t: Task) => t.status !== activeContainer
            );
            return [...otherTasks, ...sortedTasksInContainer];
          }
          return oldTasks;
        });
      } else {
        console.log("Reorder: active/over index invalid or same", {
          activeIndex,
          overIndex,
        });
      }
    } else if (activeContainer !== overContainer) {
      console.log(`Moving from ${activeContainer} to ${overContainer}`);
      updateTaskMutation({
        id: activeId,
        status: overContainer,
      });
    } else {
      console.log("Drag end condition not met:", {
        activeContainer,
        overContainer,
      });
    }
  };

  if (isLoading) {
    return <div className="p-12">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="p-12 text-center">
        <div className="text-red-500 font-medium">Failed to get tasks</div>
        <div className="text-neutral-400 text-sm mt-2">
          {error instanceof Error ? error.message : "Please try again later"}
        </div>
      </div>
    );
  }

  const tasksByStatus: { [key: string]: Task[] } = statuses.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((task: Task) => task.status === status);
      return acc;
    },
    {} as { [key: string]: Task[] }
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      collisionDetection={closestCorners}
    >
      <div className="flex flex-col h-full w-full p-4 md:p-12">
        <TaskStats cards={tasks} />
        <div className="flex flex-col md:flex-row w-full gap-3 overflow-x-auto">
          {statuses.map((status) => (
            <Status
              key={status}
              title={status.replace("-", " ")}
              cards={tasksByStatus[status] || []}
              status={status}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <Card task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

const Status = ({ title, cards, status }: StatusProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const cardIds = cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className="min-w-[200px] md:min-w-[180px] max-w-full md:w-56 h-fit shrink-0 bg-baseform p-2 rounded-xl border border-baseborder"
      data-status={status}
      data-testid={`column-${status}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-lg text-white">{title}</h3>
        <span className="px-2 py-1 text-sm text-neutral-400">
          {cards.length}
        </span>
      </div>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div
          className={`min-h-[60px] w-full transition-colors rounded ${
            isOver ? "bg-neutral-700/50" : "bg-transparent"
          }`}
        >
          {cards.map((task) => (
            <Card key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const Card = ({ task, isOverlay }: CardProps) => {
  const { id, title, status } = task;
  const { updateTaskMutation } = useUpdateTask();
  const { deleteTaskMutation } = useDeleteTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: { task },
    disabled: isEditing,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition || "transform 150ms ease",
    opacity: isDragging && isOverlay ? 1 : undefined,
    zIndex: isDragging || isOverlay ? 1000 : "auto",
    touchAction: "none",
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    updateTaskMutation({
      id: id,
      title: editedTitle,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  if (isEditing && isDragging) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab p-3 mb-2 rounded border border-baseborder bg-baseform/30 active:cursor-grabbing relative ${
        isOverlay ? "shadow-xl" : ""
      }`}
      data-testid={`card-${id}`}
    >
      <div className="flex items-center justify-between">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="bg-baseform text-white text-sm rounded px-2 py-1 w-full"
              autoFocus
            />
            <div className="absolute right-3 top-3 flex flex-col gap-2 bg-baseform rounded-md border border-baseborder shadow-lg p-2">
              <button
                onClick={handleSave}
                className="text-xs text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-xs text-white bg-gray-500 px-2 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="rounded-lg text-sm text-white mr-2">{title}</p>
            <OptionsMenu
              onEdit={handleEdit}
              onDelete={() => deleteTaskMutation(id)}
            />
          </>
        )}
      </div>
    </div>
  );
};
