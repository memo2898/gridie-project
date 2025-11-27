// src/gridie/lang/es.ts

export const es = {
  sorting: {
    sortAscending: "Ordenar Ascendente",
    sortDescending: "Ordenar Descendente",
    clearSorting: "Limpiar Ordenamiento",
    clearAllSorting: "Limpiar Todo el Ordenamiento"
  },
  table: {
    noData: "No hay datos disponibles"
  }
} as const;

export type LanguageES = typeof es;