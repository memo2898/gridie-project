// src/gridie/lang/en.ts
export const en = {
  sorting: {
    sortAscending: "Sort Ascending",
    sortDescending: "Sort Descending",
    clearSorting: "Clear Sorting",
    clearAllSorting: "Clear All Sorting"
  },
  filtering: {
    operators: {
      // String operators
      contains: "Contains",
      notcontains: "Does not contain",
      startswith: "Starts with",
      endswith: "Ends with",
      equals: "Equals",
      notequal: "Not equal",
      // Number/Date operators
      '=': "Equal",
      '<>': "Not equal",
      '<': "Less than",
      '>': "Greater than",
      '<=': "Less or equal",
      '>=': "Greater or equal",
      between: "Between"
    },
    placeholders: {
      string: "Type to filter...",
      number: "Enter a number...",
      date: "Select a date...",
      boolean: "Select...",
      betweenFrom: "From...",  // ← Nuevo
      betweenTo: "To..."        // ← Nuevo
    },
    booleanOptions: {
      true: "Yes",
      false: "No"
    }
  },
  table: {
    noData: "No data available"
  }
} as const;