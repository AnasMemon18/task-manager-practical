import { Alert, AlertTitle } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Alert severity="info" sx={{ alignItems: 'flex-start' }}>
      <AlertTitle>{title}</AlertTitle>
      {description}
    </Alert>
  );
}