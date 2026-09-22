import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 4 }}>
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              {t('common.retry')}
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>{t('common.errorTitle')}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}