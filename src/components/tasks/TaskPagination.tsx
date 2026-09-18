import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
  const start = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalFiltered);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        mt: 3,
        p: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {start}–{end} of {totalFiltered}{" "}
        {totalFiltered === 1 ? "task" : "tasks"}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {totalPages > 1 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => onPageChange(page - 1)}
              disabled={!canGoPrev}
              aria-label="Previous page"
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <Typography
              variant="body2"
              sx={{ minWidth: 90, textAlign: "center" }}
            >
              Page {page} of {totalPages}
            </Typography>

            <IconButton
              size="small"
              onClick={() => onPageChange(page + 1)}
              disabled={!canGoNext}
              aria-label="Next page"
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Per page
          </Typography>
          <ToggleButtonGroup
            value={pageSize}
            exclusive
            onChange={(_e, next: number | null) => {
              if (next !== null) onPageSizeChange(next);
            }}
            size="small"
            aria-label="Tasks per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <ToggleButton
                key={size}
                value={size}
                aria-label={`${size} per page`}
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
