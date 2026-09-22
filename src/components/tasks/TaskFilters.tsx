import { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { TaskPriority, TaskSort, TaskStatus } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  dueFrom: string | null;
  dueTo: string | null;
  sort: TaskSort;
  hasActiveFilters: boolean;
  onFilterChange: (
    key: 'search' | 'status' | 'priority' | 'dueFrom' | 'dueTo',
    value: string | null,
  ) => void;
  onSortChange: (sort: TaskSort) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: (TaskStatus | 'All')[] = ['All', 'Todo', 'In Progress', 'Done'];
const PRIORITY_OPTIONS: (TaskPriority | 'All')[] = ['All', 'Low', 'Medium', 'High'];

function sortToKey(sort: TaskSort): string {
  return `${sort.field}:${sort.direction}`;
}

export function TaskFilters({
  search,
  status,
  priority,
  dueFrom,
  dueTo,
  sort,
  hasActiveFilters,
  onFilterChange,
  onSortChange,
  onClear,
}: TaskFiltersProps) {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch !== search) {
      onFilterChange('search', debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const currentSortKey = sortToKey(sort);

  const sortOptions: { label: string; value: TaskSort }[] = [
    { label: t('filters.sortNewestFirst'), value: { field: 'createdAt', direction: 'desc' } },
    { label: t('filters.sortOldestFirst'), value: { field: 'createdAt', direction: 'asc' } },
    { label: t('filters.sortDueSoonest'), value: { field: 'dueDate', direction: 'asc' } },
    { label: t('filters.sortDueLatest'), value: { field: 'dueDate', direction: 'desc' } },
    { label: t('filters.sortPriorityHigh'), value: { field: 'priority', direction: 'desc' } },
    { label: t('filters.sortPriorityLow'), value: { field: 'priority', direction: 'asc' } },
    { label: t('filters.sortTitleAZ'), value: { field: 'title', direction: 'asc' } },
  ];

  function handleSortChange(key: string): void {
    const option = sortOptions.find((o) => sortToKey(o.value) === key);
    if (option) onSortChange(option.value);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        p: 2,
        mb: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <TextField
        size="small"
        placeholder={t('filters.search')}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        slotProps={{ htmlInput: { 'aria-label': t('filters.searchAriaLabel') } }}
        sx={{ flexGrow: 1, minWidth: 220 }}
      />

      <TextField
        size="small"
        select
        label={t('filters.status')}
        value={status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        sx={{ minWidth: 140 }}
      >
        {STATUS_OPTIONS.map((s) => (
          <MenuItem key={s} value={s}>
            {s === 'All' ? t('filters.statusAll') : s}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        select
        label={t('filters.priority')}
        value={priority}
        onChange={(e) => onFilterChange('priority', e.target.value)}
        sx={{ minWidth: 140 }}
      >
        {PRIORITY_OPTIONS.map((p) => (
          <MenuItem key={p} value={p}>
            {p === 'All' ? t('filters.priorityAll') : p}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        label={t('filters.dueFrom')}
        type="date"
        value={dueFrom ?? ''}
        onChange={(e) => onFilterChange('dueFrom', e.target.value || null)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 160 }}
      />

      <TextField
        size="small"
        label={t('filters.dueTo')}
        type="date"
        value={dueTo ?? ''}
        onChange={(e) => onFilterChange('dueTo', e.target.value || null)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 160 }}
      />

      <TextField
        size="small"
        select
        label={t('filters.sortBy')}
        value={currentSortKey}
        onChange={(e) => handleSortChange(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        {sortOptions.map((o) => (
          <MenuItem key={sortToKey(o.value)} value={sortToKey(o.value)}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>

      {hasActiveFilters && (
        <Button size="small" onClick={onClear} sx={{ ml: 'auto' }}>
          {t('filters.clearAll')}
        </Button>
      )}
    </Box>
  );
}