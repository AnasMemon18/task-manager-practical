import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';

interface TaskPaginationProps {
  page: number;
  pageSize: number;
  totalFiltered: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export function TaskPagination({
  page,
  pageSize,
  totalFiltered,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: TaskPaginationProps) {
  const { t } = useTranslation();

  const start = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalFiltered);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const unitKey = totalFiltered === 1 ? 'pagination.taskSingular' : 'pagination.taskPlural';

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 3,
        p: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {t('pagination.showing', {
          start,
          end,
          total: totalFiltered,
          unit: t(unitKey),
        })}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => onPageChange(page - 1)}
              disabled={!canGoPrev}
              aria-label={t('pagination.previousPage')}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <Typography variant="body2" sx={{ minWidth: 90, textAlign: 'center' }}>
              {t('pagination.pageIndicator', { page, totalPages })}
            </Typography>

            <IconButton
              size="small"
              onClick={() => onPageChange(page + 1)}
              disabled={!canGoNext}
              aria-label={t('pagination.nextPage')}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {t('pagination.perPage')}
          </Typography>
          <ToggleButtonGroup
            value={pageSize}
            exclusive
            onChange={(_e, next: number | null) => {
              if (next !== null) onPageSizeChange(next);
            }}
            size="small"
            aria-label={t('pagination.perPage')}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <ToggleButton
                key={size}
                value={size}
                aria-label={t('pagination.perPageOption', { size })}
              >
                {size}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
    </Box>
  );
}