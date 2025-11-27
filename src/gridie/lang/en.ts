// src/gridie/lang/en.ts

export const en = {
  sorting: {
    sortAscending: "Sort Ascending",
    sortDescending: "Sort Descending",
    clearSorting: "Clear Sorting",
    clearAllSorting: "Clear All Sorting"
  },
  table: {
    noData: "No data available"
  }
} as const;

export type LanguageEN = typeof en;