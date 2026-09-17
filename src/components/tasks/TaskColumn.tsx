import { useDroppable } from "@dnd-kit/core";
import { Box, Paper, Typography } from "@mui/material";
import type { Task, TaskStatus } from "../../types";
import { DraggableTaskCard } from "./DraggableTaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskColumn({
  status,
  tasks,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        p: 2,
        bgcolor: isOver ? "action.hover" : "background.default",
        borderColor: isOver ? "primary.main" : "divider",
        transition: "background-color 0.15s, border-color 0.15s",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {status}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {tasks.length}
        </Typography>
      </Box>

      {tasks.map((task) => (
        <DraggableTaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {tasks.length === 0 && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.disabled",
            fontSize: 14,
            py: 4,
          }}
        >
          Drop a task here
        </Box>
      )}
    </Paper>
  );
}
