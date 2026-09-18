import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { TaskFilters, TaskPriority, TaskStatus } from "../types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_VIEW: TaskFilters["view"] = "list";

const DEFAULTS: TaskFilters = {
  search: "",
  status: "All",
  priority: "All",
  dueFrom: null,
  dueTo: null,
  page: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  view: DEFAULT_VIEW,
};

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TaskFilters = useMemo(
    () => ({
      search: searchParams.get("search") ?? DEFAULTS.search,
      status:
        (searchParams.get("status") as TaskStatus | "All") ?? DEFAULTS.status,
      priority:
        (searchParams.get("priority") as TaskPriority | "All") ??
        DEFAULTS.priority,
      dueFrom: searchParams.get("dueFrom"),
      dueTo: searchParams.get("dueTo"),
      page: Number(searchParams.get("page")) || DEFAULT_PAGE,
      pageSize: Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
      view: (searchParams.get("view") as TaskFilters["view"]) ?? DEFAULT_VIEW,
    }),
    [searchParams],
  );

  const setFilter = useCallback(
    (key: keyof TaskFilters, value: string | number | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (value === null || value === "" || value === "All") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }

        // Any filter change (except page/pageSize/view) resets to page 1
        if (key !== "page" && key !== "pageSize" && key !== "view") {
          next.delete("page");
        }

        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, setFilter, clearFilters };
}
