import { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import type { TaskPriority, TaskSort, TaskStatus } from "../../types";
import { useDebounce } from "../../hooks/useDebounce";

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | "All";
  priority: TaskPriority | "All";
  dueFrom: string | null;
  dueTo: string | null;
  sort: TaskSort;
  hasActiveFilters: boolean;
  onFilterChange: (
    key: "search" | "status" | "priority" | "dueFrom" | "dueTo",
    value: string | null,
  ) => void;
  onSortChange: (sort: TaskSort) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: (TaskStatus | "All")[] = [
  "All",
  "Todo",
  "In Progress",
  "Done",
];
const PRIORITY_OPTIONS: (TaskPriority | "All")[] = [
  "All",
  "Low",
  "Medium",
  "High",
];

interface SortOption {
  label: string;
  value: TaskSort;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Newest first", value: { field: "createdAt", direction: "desc" } },
  { label: "Oldest first", value: { field: "createdAt", direction: "asc" } },
  {
    label: "Due date (soonest)",
    value: { field: "dueDate", direction: "asc" },
  },
  {
    label: "Due date (latest)",
    value: { field: "dueDate", direction: "desc" },
  },
  {
    label: "Priority (high to low)",
    value: { field: "priority", direction: "desc" },
  },
  {
    label: "Priority (low to high)",
    value: { field: "priority", direction: "asc" },
  },
  { label: "Title (A–Z)", value: { field: "title", direction: "asc" } },
];

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
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch !== search) {
      onFilterChange("search", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const currentSortKey = sortToKey(sort);

  function handleSortChange(key: string): void {
    const option = SORT_OPTIONS.find((o) => sortToKey(o.value) === key);
    if (option) onSortChange(option.value);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        p: 2,
        mb: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <TextField
        size="small"
        placeholder="Search title or description…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        slotProps={{ htmlInput: { "aria-label": "Search tasks" } }}
        sx={{ flexGrow: 1, minWidth: 220 }}
      />

      <TextField
        size="small"
        select
        label="Status"
        value={status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        sx={{ minWidth: 140 }}
      >
        {STATUS_OPTIONS.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        select
        label="Priority"
        value={priority}
        onChange={(e) => onFilterChange("priority", e.target.value)}
        sx={{ minWidth: 140 }}
      >
        {PRIORITY_OPTIONS.map((p) => (
          <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        label="Due from"
        type="date"
        value={dueFrom ?? ""}
        onChange={(e) => onFilterChange("dueFrom", e.target.value || null)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 160 }}
      />

      <TextField
        size="small"
        label="Due to"
        type="date"
        value={dueTo ?? ""}
        onChange={(e) => onFilterChange("dueTo", e.target.value || null)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 160 }}
      />

      <TextField
        size="small"
        select
        label="Sort by"
        value={currentSortKey}
        onChange={(e) => handleSortChange(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        {SORT_OPTIONS.map((o) => (
          <MenuItem key={sortToKey(o.value)} value={sortToKey(o.value)}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>

      {hasActiveFilters && (
        <Button size="small" onClick={onClear} sx={{ ml: "auto" }}>
          Clear all
        </Button>
      )}
    </Box>
  );
}
