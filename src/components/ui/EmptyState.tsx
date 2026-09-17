import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
        gap: 2,
      }}
    >
      <InboxIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}