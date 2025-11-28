// src/gridie/filteringFunctions/index.ts

export type FilterOperator = 
  // String operators
  | 'contains' 
  | 'notcontains' 
  | 'startswith' 
  | 'endswith' 
  | 'equals' 
  | 'notequal'
  // Number/Date operators
  | '=' 
  | '<>' 
  | '<' 
  | '>' 
  | '<=' 
  | '>='
  | 'between';

export interface FilterState {
  columnIndex: number;
  operator: FilterOperator;
  value: any;
  value2?: any; // Para "between"
}



export class FilteringManager {
  private filterStates: FilterState[] = [];


  // Agregar esta función helper al inicio de la clase
private normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, ''); // Elimina los diacríticos (tildes)
}


  // Agregar o actualizar filtro en una columna
  addFilter(columnIndex: number, operator: FilterOperator, value: any, value2?: any): void {
    const existingIndex = this.filterStates.findIndex(f => f.columnIndex === columnIndex);
    
    if (existingIndex !== -1) {
      // Actualizar filtro existente
      this.filterStates[existingIndex] = {
        columnIndex,
        operator,
        value,
        value2
      };
    } else {
      // Agregar nuevo filtro
      this.filterStates.push({
        columnIndex,
        operator,
        value,
        value2
      });
    }
  }

  // Limpiar valor de filtro pero mantener el operador
  clearFilterValue(columnIndex: number): void {
    const index = this.filterStates.findIndex(f => f.columnIndex === columnIndex);
    if (index !== -1) {
      this.filterStates.splice(index, 1);
    }
  }

  // Limpiar todos los filtros
  clearAll(): void {
    this.filterStates = [];
  }

  // Obtener filtro de una columna
  getColumnFilter(columnIndex: number): FilterState | null {
    return this.filterStates.find(f => f.columnIndex === columnIndex) || null;
  }

  

  // Obtener todos los filtros
  getAllFilters(): FilterState[] {
    return [...this.filterStates];
  }

  // Aplicar todos los filtros a los datos
  applyFilters(data: any[], headers: any[]): any[] {
    if (this.filterStates.length === 0) return data;

    return data.filter(row => {
      // AND entre todos los filtros
      return this.filterStates.every(filterState => {
        const cellValue = this.getCellValueByPosition(row, filterState.columnIndex);
        const headerType = headers[filterState.columnIndex]?.type;
        
        return this.evaluateFilter(
          cellValue, 
          filterState.operator, 
          filterState.value, 
          filterState.value2,
          headerType
        );
      });
    });
  }

  private getCellValueByPosition(row: any, position: number): any {
    if (Array.isArray(row)) {
      return row[position];
    }
    const values = Object.values(row);
    return values[position];
  }

private evaluateFilter(
  cellValue: any, 
  operator: FilterOperator, 
  filterValue: any, 
  filterValue2?: any,
  type?: string
): boolean {
  // Si no hay valor de filtro, no filtrar
  if (filterValue === null || filterValue === undefined || filterValue === '') {
    return true;
  }

  // Manejar valores null/undefined en la celda
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  // ✅ SOLUCIÓN 1: Normalizar strings para comparación
  const cellStr = String(cellValue);
  const filterStr = String(filterValue);
  
  // Para operadores de string, normalizar (sin tildes, lowercase)
  const isStringOperator = ['contains', 'notcontains', 'startswith', 'endswith', 'equals', 'notequal'].includes(operator);
  const normalizedCell = isStringOperator ? this.normalizeString(cellStr) : cellStr;
  const normalizedFilter = isStringOperator ? this.normalizeString(filterStr) : filterStr;

  switch (operator) {
    // String operators - Case insensitive y sin tildes
    case 'contains':
      return normalizedCell.includes(normalizedFilter);
    
    case 'notcontains':
      return !normalizedCell.includes(normalizedFilter);
    
    case 'startswith':
      return normalizedCell.startsWith(normalizedFilter);
    
    case 'endswith':
      return normalizedCell.endsWith(normalizedFilter);
    
    case 'equals':
      return normalizedCell === normalizedFilter;
    
    case 'notequal':
      return normalizedCell !== normalizedFilter;

    // Number/Date operators
    case '=':
      return this.compareValues(cellValue, filterValue, type) === 0;
    
    case '<>':
      return this.compareValues(cellValue, filterValue, type) !== 0;
    
    case '<':
      return this.compareValues(cellValue, filterValue, type) < 0;
    
    case '>':
      return this.compareValues(cellValue, filterValue, type) > 0;
    
    case '<=':
      return this.compareValues(cellValue, filterValue, type) <= 0;
    
    case '>=':
      return this.compareValues(cellValue, filterValue, type) >= 0;
    
    case 'between':
      if (filterValue2 === null || filterValue2 === undefined || filterValue2 === '') {
        return true;
      }
      const compareMin = this.compareValues(cellValue, filterValue, type);
      const compareMax = this.compareValues(cellValue, filterValue2, type);
      return compareMin >= 0 && compareMax <= 0;

    default:
      return true;
  }
}

  private compareValues(a: any, b: any, type?: string): number {
    switch (type) {
      case 'number':
        return Number(a) - Number(b);
      
      case 'date':
        return new Date(a).getTime() - new Date(b).getTime();
      
      case 'boolean':
        return (a === b) ? 0 : a ? -1 : 1;
      
      default:
        const aStr = String(a).toLowerCase();
        const bStr = String(b).toLowerCase();
        return aStr.localeCompare(bStr);
    }
  }
}