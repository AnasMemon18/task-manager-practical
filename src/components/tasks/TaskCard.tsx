import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import type { Task } from '../../types';
import { formatDate, isOverdue } from '../../utils/date';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const STATUS_COLORS: Record<Task['status'], 'default' | 'warning' | 'success'> = {
  Todo: 'default',
  'In Progress': 'warning',
  Done: 'success',
};

const PRIORITY_COLORS: Record<Task['priority'], 'success' | 'warning' | 'error'> = {
  Low: 'success',
  Medium: 'warning',
  High: 'error',
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { t } = useTranslation();
  const overdue = isOverdue(task);

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            mb: 1,
            textDecoration: task.status === 'Done' ? 'line-through' : 'none',
            color: task.status === 'Done' ? 'text.disabled' : 'text.primary',
          }}
        >
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip label={task.status} color={STATUS_COLORS[task.status]} size="small" />
          <Chip
            label={t('taskCard.priorityLabel', { priority: task.priority })}
            color={PRIORITY_COLORS[task.priority]}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color={overdue ? 'error.main' : 'text.secondary'}>
            {overdue
              ? t('taskCard.overdue', { date: formatDate(task.dueDate) })
              : t('taskCard.due', { date: formatDate(task.dueDate) })}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title={t('taskCard.editTooltip')}>
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            aria-label={t('taskCard.editAria', { title: task.title })}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('taskCard.deleteTooltip')}>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(task)}
            aria-label={t('taskCard.deleteAria', { title: task.title })}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}