// src/gridie/lang/es.ts
export const es = {
  sorting: {
    sortAscending: "Ordenar Ascendente",
    sortDescending: "Ordenar Descendente",
    clearSorting: "Limpiar Ordenamiento",
    clearAllSorting: "Limpiar Todo el Ordenamiento"
  },
  filtering: {
    operators: {
      // String operators
      contains: "Contiene",
      notcontains: "No contiene",
      startswith: "Comienza con",
      endswith: "Termina con",
      equals: "Igual a",
      notequal: "No igual a",
      // Number/Date operators
      '=': "Igual",
      '<>': "Diferente",
      '<': "Menor que",
      '>': "Mayor que",
      '<=': "Menor o igual",
      '>=': "Mayor o igual",
      between: "Entre"
    },
    placeholders: {
      string: "Escriba para filtrar...",
      number: "Ingrese un número...",
      date: "Seleccione una fecha...",
      boolean: "Seleccione...",
      betweenFrom: "Desde...", 
      betweenTo: "Hasta..."     
    },
    booleanOptions: {
      true: "Sí",
      false: "No"
    }
  },
  table: {
    noData: "No hay datos disponibles"
  }
} as const;