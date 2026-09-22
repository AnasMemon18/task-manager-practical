import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { createTaskSchema, type TaskFormValues } from '../../utils/validation';
import type { Task } from '../../types';

interface TaskFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  onSubmit: (values: TaskFormValues) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: Task['status'][] = ['Todo', 'In Progress', 'Done'];
const PRIORITY_OPTIONS: Task['priority'][] = ['Low', 'Medium', 'High'];

const EMPTY_VALUES: TaskFormValues = {
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  dueDate: '',
};

export function TaskForm({ open, mode, task, onSubmit, onClose }: TaskFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(createTaskSchema(t)),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && task) {
        reset({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
        });
      } else {
        reset(EMPTY_VALUES);
      }
    }
  }, [open, mode, task, reset]);

  function handleFormSubmit(values: TaskFormValues): void {
    onSubmit(values);
  }

  const dialogTitle = mode === 'edit' ? t('taskForm.editTitle') : t('taskForm.createTitle');
  const submitLabel = mode === 'edit' ? t('taskForm.save') : t('taskForm.create');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogTitle>{dialogTitle}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('taskForm.title')}
              autoFocus
              fullWidth
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label={t('taskForm.description')}
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              select
              label={t('taskForm.status')}
              fullWidth
              {...register('status')}
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label={t('taskForm.priority')}
              fullWidth
              {...register('priority')}
              error={!!errors.priority}
              helperText={errors.priority?.message}
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label={t('taskForm.dueDate')}
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('dueDate')}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            {t('taskForm.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? t('taskForm.saving') : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}