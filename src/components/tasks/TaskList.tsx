import { Grid } from "@mui/material";
import type { Task } from "../../types";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  return (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid key={task.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}
