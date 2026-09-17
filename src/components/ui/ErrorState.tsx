import { Alert, AlertTitle, Box, Button } from '@mui/material';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box sx={{ py: 4 }}>
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>Something went wrong</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}