import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { Grid } from '@mui/material';
import type { Task, TaskStatus } from '../../types';
import { TaskColumn } from './TaskColumn';

interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const COLUMNS: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

export function TaskBoard({ tasks, onEdit, onDelete, onStatusChange }: TaskBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.status === newStatus) return;

    onStatusChange(taskId, newStatus);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Grid container spacing={2}>
        {COLUMNS.map((status) => (
          <Grid key={status} size={{ xs: 12, md: 4 }}>
            <TaskColumn
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid>
        ))}
      </Grid>
    </DndContext>
  );
}