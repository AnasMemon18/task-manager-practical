import { useDraggable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import type { Task } from "../../types";
import { TaskCard } from "./TaskCard";

interface DraggableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function DraggableTaskCard({
  task,
  onEdit,
  onDelete,
}: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : "auto",
      }
    : undefined;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      sx={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </Box>
  );
}
