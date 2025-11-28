// src/gridie/gridie.ts
//Ultimos cambios de gridie donde faltan ajustar
import { SortingManager } from './sortingFunctions';
import type { SortDirection } from './sortingFunctions';
import { FilteringManager } from './filteringFunctions';
import type { FilterOperator } from './filteringFunctions';
import { getLanguage } from './lang';
import type { Language, LanguageStrings } from './lang';
import { gridieStyles, contextMenuStyles, filterRowStyles } from './styles';
import { getFilterIcon } from './assets/icons/filters';

export interface GridieFilterRowConfig {
  visible: boolean;
   operators?: readonly FilterOperator[] | FilterOperator[];
}

export interface GridieFiltersConfig {
  filterRow?: GridieFilterRowConfig;
  headerFilter?: any[]; // Para implementar después
}

export interface GridieHeaderConfig {
  label?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'string' | 'number' | 'date' | 'boolean';
  filters?: GridieFiltersConfig;
}

export interface GridieCellAction {
  content: string;
  event: string;
  funct: (rowData: any, rowIndex: number) => void;
}

export interface GridieConfig {
  id: string;
  headers: (string | GridieHeaderConfig)[];
  body: any[];
  enableSort?: boolean;
  enableFilter?: boolean;
  enablePagination?: boolean;
  language?: Language;
}

export class Gridie extends HTMLElement {
    private shadow: ShadowRoot;
  private _id: string = '';
  private _headers: (string | GridieHeaderConfig)[] = [];
  private _body: any[] = [];
  private _originalBody: any[] = [];
  private _filteredBody: any[] = [];
  private _config: Partial<GridieConfig> = {};
  private _eventHandlers: Map<string, GridieCellAction> = new Map();
  private _sortingManager: SortingManager = new SortingManager();
  private _filteringManager: FilteringManager = new FilteringManager();
  private _language: Language = 'es';
  private _lang: LanguageStrings;
  private _contextMenu: HTMLDivElement | null = null;
  private _globalStyleId = 'gridie-global-styles';
  private _activeOperatorDropdown: number | null = null;
  private _selectedOperators: Map<number, FilterOperator> = new Map(); 


  constructor(config?: GridieConfig) {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this._lang = getLanguage(this._language);
    this.injectGlobalStyles();
    
    if (config) {
      this._id = config.id;
      this._headers = config.headers;
      this._body = config.body;
      this._originalBody = [...config.body];
      this._filteredBody = [...config.body];
      this._language = config.language || 'es';
      this._lang = getLanguage(this._language);
      this._config = {
        enableSort: config.enableSort ?? true,
        enableFilter: config.enableFilter ?? false,
        enablePagination: config.enablePagination ?? false,
        language: this._language,
      };
    }
  }

  static get observedAttributes() {
    return ["id", "headers", "body", "config", "language"];
  }

  connectedCallback() {
    this.render();
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
    this.removeGlobalStyles();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === 'language') {
        this._language = newValue as Language;
        this._lang = getLanguage(this._language);
      }
      this.render();
    }
  }

  private injectGlobalStyles(): void {
    if (document.getElementById(this._globalStyleId)) return;

    const style = document.createElement('style');
    style.id = this._globalStyleId;
    style.textContent = contextMenuStyles;
    document.head.appendChild(style);
  }

  private removeGlobalStyles(): void {
    const style = document.getElementById(this._globalStyleId);
    if (style) {
      style.remove();
    }
  }

  setConfig(config: GridieConfig) {
  this._id = config.id;
  this._headers = config.headers;
  this._body = config.body;
  this._originalBody = [...config.body];
  this._filteredBody = [...config.body];
  this._language = config.language || 'es';
  this._lang = getLanguage(this._language);
  this._config = {
    enableSort: config.enableSort ?? true,
    enableFilter: config.enableFilter ?? false,
    enablePagination: config.enablePagination ?? false,
    language: this._language,
  };
  this._sortingManager.clearAll();
  this._filteringManager.clearAll();
  this._selectedOperators.clear(); 
  this.render();
}

setData(config: { headers: (string | GridieHeaderConfig)[], data: any[] }) {
  this._headers = config.headers;
  this._body = config.data;
  this._originalBody = [...config.data];
  this._filteredBody = [...config.data];
  this._sortingManager.clearAll();
  this._filteringManager.clearAll();
  this._selectedOperators.clear(); 
  this.render();
}

  addRow(row: any) {
    this._originalBody.push(row);
    this.applyFiltersAndSorting();
  }

  removeRow(index: number) {
    const originalIndex = this._originalBody.findIndex(r => r === this._body[index]);
    if (originalIndex !== -1) {
      this._originalBody.splice(originalIndex, 1);
    }
    this.applyFiltersAndSorting();
  }

  updateRow(index: number, row: any) {
    if (index >= 0 && index < this._body.length) {
      const originalIndex = this._originalBody.findIndex(r => r === this._body[index]);
      if (originalIndex !== -1) {
        this._originalBody[originalIndex] = { ...this._originalBody[originalIndex], ...row };
      }
      this.applyFiltersAndSorting();
    }
  }

  get gridieId(): string {
    if (this._id) return this._id;
    const idAttr = this.getAttribute("id");
    return idAttr || '';
  }

  get headers(): GridieHeaderConfig[] {
    const headers = this._headers.length > 0 
      ? this._headers 
      : this.getAttributeHeaders();

    return headers.map((header, index) => this.normalizeHeader(header, index));
  }

  get body(): any[] {
    return this._body.length > 0 ? this._body : [];
  }



private getCurrentOperator(columnIndex: number): FilterOperator {
  const header = this.headers[columnIndex];
  
  // Primero intentar obtenerlo del filtro activo
  const currentFilter = this._filteringManager.getColumnFilter(columnIndex);
  if (currentFilter) {
    return currentFilter.operator;
  }
  
  // Si no hay filtro activo, buscar en los operadores seleccionados
  const selectedOperator = this._selectedOperators.get(columnIndex);
  if (selectedOperator) {
    return selectedOperator;
  }
  
  // Si no hay nada, usar el primer operador por defecto
  return this.getOperatorsForColumn(header)[0];
}
  private getAttributeHeaders(): (string | GridieHeaderConfig)[] {
    try {
      const headersAttr = this.getAttribute("headers");
      return headersAttr ? JSON.parse(headersAttr) : [];
    } catch {
      return [];
    }
  }

  private normalizeHeader(header: string | GridieHeaderConfig, position: number): GridieHeaderConfig {
    if (typeof header === 'string') {
      return {
        label: header,
        sortable: this._config.enableSort ?? true,
        filterable: false,
        type: 'string',
      };
    }
    return {
      label: header.label || `Column ${position + 1}`,
      sortable: header.sortable ?? (this._config.enableSort ?? true),
      filterable: header.filterable ?? false,
      type: header.type || 'string',
      width: header.width,
      filters: header.filters,
    };
  }

  private getCellValueByPosition(row: any, position: number): any {
    if (Array.isArray(row)) {
      return row[position];
    }
    const values = Object.values(row);
    return values[position];
  }

  private formatCellValue(value: any, type?: string): string {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'boolean':
        return value ? this._lang.filtering.booleanOptions.true : this._lang.filtering.booleanOptions.false;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      default:
        return String(value);
    }
  }

  private isActionCell(cell: any): cell is GridieCellAction[] {
    return Array.isArray(cell) && cell.length > 0 && cell[0] && 'content' in cell[0] && 'event' in cell[0] && 'funct' in cell[0];
  }

  private renderCell(row: any, header: GridieHeaderConfig, position: number, rowIndex: number): string {
    const cellValue = this.getCellValueByPosition(row, position);
    
    if (this.isActionCell(cellValue)) {
      return cellValue.map((action, actionIndex) => {
        const actionId = `action-${rowIndex}-${position}-${actionIndex}`;
        this._eventHandlers.set(actionId, action);
        return `<span data-action-id="${actionId}">${action.content}</span>`;
      }).join(' ');
    }
    
    return this.formatCellValue(cellValue, header.type);
  }

  private handleHeaderClick(columnIndex: number): void {
    const header = this.headers[columnIndex];
    if (!header.sortable) return;

    const currentSort = this._sortingManager.getColumnSort(columnIndex);
    let newDirection: SortDirection;

    if (!currentSort) {
      newDirection = 'asc';
    } else if (currentSort.direction === 'asc') {
      newDirection = 'desc';
    } else {
      newDirection = null;
    }

    this._sortingManager.addSort(columnIndex, newDirection);
    this.applyFiltersAndSorting();
  }

  private handleHeaderRightClick(event: MouseEvent, columnIndex: number): void {
    event.preventDefault();
    const header = this.headers[columnIndex];
    if (!header.sortable) return;

    this.showContextMenu(event.clientX, event.clientY, columnIndex);
  }

  private showContextMenu(x: number, y: number, columnIndex: number): void {
    this.hideContextMenu();

    const menu = document.createElement('div');
    menu.className = 'gridie-context-menu';
    menu.style.position = 'fixed';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const hasMultipleSorts = this._sortingManager.getAllSorts().length > 1;
    const hasColumnSort = this._sortingManager.getColumnSort(columnIndex) !== null;

    menu.innerHTML = `
      <div class="context-menu-item" data-action="sort-asc">
        ▲ ${this._lang.sorting.sortAscending}
      </div>
      <div class="context-menu-item" data-action="sort-desc">
        ▼ ${this._lang.sorting.sortDescending}
      </div>
      ${hasColumnSort ? `
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" data-action="clear-sort">
          ${this._lang.sorting.clearSorting}
        </div>
      ` : ''}
      ${hasMultipleSorts ? `
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" data-action="clear-all-sort">
          ${this._lang.sorting.clearAllSorting}
        </div>
      ` : ''}
    `;

    menu.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('context-menu-item')) {
        const action = target.dataset.action;
        this.handleContextMenuAction(action!, columnIndex);
        this.hideContextMenu();
      }
    });

    document.body.appendChild(menu);
    this._contextMenu = menu;
  }

  private hideContextMenu(): void {
    if (this._contextMenu) {
      document.body.removeChild(this._contextMenu);
      this._contextMenu = null;
    }
  }

  

  private handleContextMenuAction(action: string, columnIndex: number): void {
    switch (action) {
      case 'sort-asc':
        this._sortingManager.addSort(columnIndex, 'asc');
        break;
      case 'sort-desc':
        this._sortingManager.addSort(columnIndex, 'desc');
        break;
      case 'clear-sort':
        this._sortingManager.clearColumn(columnIndex);
        break;
      case 'clear-all-sort':
        this._sortingManager.clearAll();
        break;
    }
    this.applyFiltersAndSorting();
  }

private applyFiltersAndSorting(): void {
  // Primero aplicar filtros
  this._filteredBody = this._filteringManager.applyFilters(this._originalBody, this.headers);
  // Luego aplicar sorting sobre los datos filtrados
  this._body = this._sortingManager.applySorts(this._filteredBody, this.headers);
  
  // ✅ FIX: Actualizar tanto tbody como thead (para sort indicators)
  this.updateTableContent();
}

private updateTableContent(): void {
  // Actualizar thead (sort indicators)
  const thead = this.shadow.querySelector('thead tr:first-child');
  if (thead) {
    const headers = this.headers;
    thead.innerHTML = headers.map((header, index) => `
      <th 
        class="${header.sortable ? 'sortable' : ''}" 
        data-column-index="${index}"
      >
        ${header.label}${this.getSortIndicator(index)}
      </th>
    `).join('');
    
    // Re-attach header events después de actualizar
    this.attachHeaderEvents();
  }
  
  // Actualizar tbody
  this.renderTableBody();
}


private renderTableBody(): void {
  const tbody = this.shadow.querySelector('tbody');
  if (!tbody) {
    this.render(); // Fallback si no existe tbody
    return;
  }

  const headers = this.headers;
  const body = this.body;

  tbody.innerHTML = body.length > 0 
    ? body.map((row, rowIndex) => `
        <tr data-index="${rowIndex}">
          ${headers.map((header, colIndex) => 
            `<td>${this.renderCell(row, header, colIndex, rowIndex)}</td>`
          ).join('')}
        </tr>
      `).join('')
    : `<tr><td colspan="${headers.length}" class="no-data">${this._lang.table.noData}</td></tr>`;

  this.attachActionEvents();
}

// Reemplaza este método en gridie.ts:

private handleOperatorChange(columnIndex: number): void {
  // Guardar scroll
  const container = this.shadow.querySelector('.gridie-container') as HTMLElement;
  const scrollLeft = container?.scrollLeft || 0;
  const scrollTop = container?.scrollTop || 0;
  
  const operatorSelect = this.shadow.querySelector(
    `select.filter-operator[data-column-index="${columnIndex}"]`
  ) as HTMLSelectElement;
  
  if (!operatorSelect) return;
  
  const newOperator = operatorSelect.value as FilterOperator;
  
  // Obtener el filtro actual ANTES de cambiar
  const currentFilter = this._filteringManager.getColumnFilter(columnIndex);
  const oldOperator = currentFilter?.operator || this.getOperatorsForColumn(this.headers[columnIndex])[0];
  
  // ✅ CRITICAL: Detectar si cambió entre "between" y otro operador
  const wasBetween = oldOperator === 'between';
  const isNowBetween = newOperator === 'between';
  
  // ✅ CRITICAL: Si cambió el layout, re-renderizar INMEDIATAMENTE
  if (wasBetween !== isNowBetween) {
    // ✅ FIX: Actualizar el operador en el manager con el nuevo operador
    if (isNowBetween) {
      // Cambió A "between"
      this._filteringManager.addFilter(columnIndex, newOperator, '', '');
    } else {
      // Cambió DESDE "between" a otro operador
      const currentValue = currentFilter?.value || '';
      if (currentValue) {
        // Mantener el primer valor si existe
        this._filteringManager.addFilter(columnIndex, newOperator, currentValue);
      } else {
        // Limpiar si no hay valor
        this._filteringManager.clearFilterValue(columnIndex);
      }
    }
    
    // Re-renderizar la fila de filtros
    this.renderFilterRowOnly();
    this.attachFilterEvents();
    
    // Restaurar scroll y foco
    setTimeout(() => {
      if (container) {
        container.scrollLeft = scrollLeft;
        container.scrollTop = scrollTop;
      }
      
      const newSelect = this.shadow.querySelector(
        `select.filter-operator[data-column-index="${columnIndex}"]`
      ) as HTMLSelectElement;
      if (newSelect) {
        newSelect.focus();
      }
    }, 0);
    
    // ✅ FIX: Aplicar filtros después de cambiar el layout
    this.applyFiltersAndSorting();
    
    return; // ← Salir aquí
  }
  
  // Si no cambió el layout, aplicar el filtro normalmente
  this.handleFilterChange(columnIndex, false);
}
private renderFilterRowOnly(): void {
  const filterRow = this.shadow.querySelector('.filter-row');
  if (!filterRow) return;

  const headers = this.headers;
  
  filterRow.innerHTML = headers.map((header, index) => {
    if (!header.filters?.filterRow?.visible) {
      return `<td></td>`;
    }

    const operators = this.getOperatorsForColumn(header);
    const currentFilter = this._filteringManager.getColumnFilter(index);
    const currentOperator = this.getCurrentOperator(index);
    const currentValue = currentFilter?.value || '';
    const currentValue2 = currentFilter?.value2 || '';

    // Layout especial para "between"
    if (currentOperator === 'between') {
      return `
        <td>
          <div class="filter-cell">
            <div class="filter-cell-row">
              ${this.renderOperatorDropdown(index, operators, currentOperator)}
              <div class="filter-between-container">
                <div class="filter-between-row">
                  <span class="filter-between-label">${this._lang.filtering.placeholders.betweenFrom}</span>
                  ${this.renderFilterInput(header, index, currentOperator, currentValue, false)}
                </div>
                <div class="filter-between-row">
                  <span class="filter-between-label">${this._lang.filtering.placeholders.betweenTo}</span>
                  ${this.renderFilterInput(header, index, currentOperator, currentValue2, true)}
                </div>
              </div>
            </div>
          </div>
        </td>
      `;
    }

    // Layout normal para otros operadores
    return `
      <td>
        <div class="filter-cell">
          <div class="filter-cell-row">
            ${this.renderOperatorDropdown(index, operators, currentOperator)}
            ${this.renderFilterInput(header, index, currentOperator, currentValue, false)}
          </div>
        </div>
      </td>
    `;
  }).join('');
}


private toggleOperatorDropdown(columnIndex: number): void {
  if (this._activeOperatorDropdown === columnIndex) {
    this.closeOperatorDropdown();
  } else {
    this.openOperatorDropdown(columnIndex);
  }
}

private openOperatorDropdown(columnIndex: number): void {
  // Cerrar cualquier dropdown abierto
  this.closeOperatorDropdown();
  
  this._activeOperatorDropdown = columnIndex;
  
  const trigger = this.shadow.querySelector(
    `.filter-operator-trigger[data-column-index="${columnIndex}"]`
  ) as HTMLElement;
  const menu = this.shadow.querySelector(
    `.filter-operator-menu[data-column-index="${columnIndex}"]`
  ) as HTMLElement;
  
  if (trigger && menu) {
    trigger.classList.add('active');
    menu.classList.add('active');
  }
}

private closeOperatorDropdown(): void {
  if (this._activeOperatorDropdown === null) return;
  
  const trigger = this.shadow.querySelector(
    `.filter-operator-trigger[data-column-index="${this._activeOperatorDropdown}"]`
  ) as HTMLElement;
  const menu = this.shadow.querySelector(
    `.filter-operator-menu[data-column-index="${this._activeOperatorDropdown}"]`
  ) as HTMLElement;
  
  if (trigger && menu) {
    trigger.classList.remove('active');
    menu.classList.remove('active');
  }
  
  this._activeOperatorDropdown = null;
}



private handleOperatorSelect(columnIndex: number, newOperator: FilterOperator): void {
  this.closeOperatorDropdown();
  
  // Guardar scroll
  const container = this.shadow.querySelector('.gridie-container') as HTMLElement;
  const scrollLeft = container?.scrollLeft || 0;
  const scrollTop = container?.scrollTop || 0;
  
  // Obtener el operador actual
  const oldOperator = this.getCurrentOperator(columnIndex);
  
  // Si no cambió, no hacer nada
  if (oldOperator === newOperator) return;
  
  // ✅ SIEMPRE guardar el operador seleccionado
  this._selectedOperators.set(columnIndex, newOperator);
  
  const currentFilter = this._filteringManager.getColumnFilter(columnIndex);
  const wasBetween = oldOperator === 'between';
  const isNowBetween = newOperator === 'between';
  const currentValue = currentFilter?.value || '';
  const currentValue2 = currentFilter?.value2 || '';
  
  // Actualizar el filtro en el manager solo si hay valor
  if (isNowBetween) {
    // Cambió A "between" - inicializar con valores vacíos si no hay filtro
    if (!currentFilter) {
      // No agregamos al manager aún, solo guardamos la selección
    } else {
      this._filteringManager.addFilter(columnIndex, newOperator, '', '');
    }
  } else if (wasBetween) {
    // Cambió DESDE "between" - mantener primer valor si existe
    if (currentValue) {
      this._filteringManager.addFilter(columnIndex, newOperator, currentValue);
    } else {
      this._filteringManager.clearFilterValue(columnIndex);
    }
  } else {
    // Cambió entre operadores normales - mantener valor si existe
    if (currentValue) {
      this._filteringManager.addFilter(columnIndex, newOperator, currentValue, currentValue2);
    }
    // Si no hay valor, no hacemos nada en el manager (ya guardamos en _selectedOperators)
  }
  
  // ✅ CRÍTICO: SIEMPRE re-renderizar para actualizar el icono
  this.renderFilterRowOnly();
  this.attachFilterEvents();
  
  // Solo aplicar filtros si hay valor
  if (currentValue) {
    this.applyFiltersAndSorting();
  }
  
  // Restaurar scroll
  setTimeout(() => {
    if (container) {
      container.scrollLeft = scrollLeft;
      container.scrollTop = scrollTop;
    }
  }, 0);
}

private handleDocumentClick(event: Event): void {
  const target = event.target as HTMLElement;
  
  // Cerrar context menu
  if (this._contextMenu && !this._contextMenu.contains(target)) {
    this.hideContextMenu();
  }
  
  // ✅ NUEVO: Cerrar operator dropdown si se hace clic fuera
  if (this._activeOperatorDropdown !== null) {
    const dropdown = this.shadow.querySelector(
      `.filter-operator-dropdown[data-column-index="${this._activeOperatorDropdown}"]`
    );
    if (dropdown && !dropdown.contains(target)) {
      this.closeOperatorDropdown();
    }
  }
}




// Actualiza attachFilterEvents():...
private attachFilterEvents(): void {
  // ✅ NUEVO: Dropdown triggers
  this.shadow.querySelectorAll('.filter-operator-trigger').forEach(trigger => {
    const columnIndex = parseInt((trigger as HTMLElement).dataset.columnIndex!);
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleOperatorDropdown(columnIndex);
    });
  });

  // ✅ NUEVO: Dropdown options
  this.shadow.querySelectorAll('.filter-operator-option').forEach(option => {
    const columnIndex = parseInt((option as HTMLElement).dataset.columnIndex!);
    const operator = (option as HTMLElement).dataset.operator as FilterOperator;
    
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleOperatorSelect(columnIndex, operator);
    });
  });

  // Input change (text, number, date)
  this.shadow.querySelectorAll('input.filter-input').forEach(input => {
    const columnIndex = parseInt((input as HTMLElement).dataset.columnIndex!);
    const isSecond = (input as HTMLElement).dataset.isSecond === 'true';
    
    input.addEventListener('input', () => {
      this.handleFilterChange(columnIndex, isSecond);
    });
  });

  // Select change (boolean)
  this.shadow.querySelectorAll('select.filter-select').forEach(select => {
    const columnIndex = parseInt((select as HTMLElement).dataset.columnIndex!);
    const isSecond = (select as HTMLElement).dataset.isSecond === 'true';
    
    select.addEventListener('change', () => {
      this.handleFilterChange(columnIndex, isSecond);
    });
  });

  // Clear buttons
  this.shadow.querySelectorAll('span.filter-clear').forEach(clearBtn => {
    const columnIndex = parseInt((clearBtn as HTMLElement).dataset.columnIndex!);
    const isSecond = (clearBtn as HTMLElement).dataset.isSecond === 'true';
    
    clearBtn.addEventListener('click', () => {
      this.handleFilterClear(columnIndex, isSecond);
    });
  });
}


  private getSortIndicator(columnIndex: number): string {
    const sortState = this._sortingManager.getColumnSort(columnIndex);
    if (!sortState) return '';

    const arrow = sortState.direction === 'asc' ? '▲' : '▼';
    const order = this._sortingManager.getAllSorts().length > 1 ? ` ${sortState.order}` : '';
    
    return `<span class="sort-indicator">${arrow}${order}</span>`;
  }

  // ============= FILTER ROW METHODS =============

  private hasFilterRow(): boolean {
    return this.headers.some(header => header.filters?.filterRow?.visible === true);
  }

  private getDefaultOperators(type: string): FilterOperator[] {
    switch (type) {
      case 'string':
        return ['contains', 'notcontains', 'startswith', 'endswith', 'equals', 'notequal'];
      case 'number':
      case 'date':
        return ['=', '<>', '<', '>', '<=', '>=', 'between'];
      case 'boolean':
        return ['=', '<>'];
      default:
        return ['contains', 'notcontains', 'startswith', 'endswith', 'equals', 'notequal'];
    }
  }

 private getOperatorsForColumn(header: GridieHeaderConfig): FilterOperator[] {
  if (header.filters?.filterRow?.operators) {
    return [...header.filters.filterRow.operators]; // ← Crea una copia
  }
  return this.getDefaultOperators(header.type || 'string');
}
private renderFilterRow(): string {
  if (!this.hasFilterRow()) return '';

  const headers = this.headers;

  return `
    <tr class="filter-row">
      ${headers.map((header, index) => {
        if (!header.filters?.filterRow?.visible) {
          return `<td></td>`;
        }

        const operators = this.getOperatorsForColumn(header);
        const currentFilter = this._filteringManager.getColumnFilter(index);
        const currentOperator = this.getCurrentOperator(index);
        const currentValue = currentFilter?.value || '';
        const currentValue2 = currentFilter?.value2 || '';

        // Layout especial para "between"
        if (currentOperator === 'between') {
          return `
            <td>
              <div class="filter-cell">
                <div class="filter-cell-row">
                  ${this.renderOperatorDropdown(index, operators, currentOperator)}
                  <div class="filter-between-container">
                    <div class="filter-between-row">
                      <span class="filter-between-label">${this._lang.filtering.placeholders.betweenFrom}</span>
                      ${this.renderFilterInput(header, index, currentOperator, currentValue, false)}
                    </div>
                    <div class="filter-between-row">
                      <span class="filter-between-label">${this._lang.filtering.placeholders.betweenTo}</span>
                      ${this.renderFilterInput(header, index, currentOperator, currentValue2, true)}
                    </div>
                  </div>
                </div>
              </div>
            </td>
          `;
        }

        // Layout normal para otros operadores
        return `
          <td>
            <div class="filter-cell">
              <div class="filter-cell-row">
                ${this.renderOperatorDropdown(index, operators, currentOperator)}
                ${this.renderFilterInput(header, index, currentOperator, currentValue, false)}
              </div>
            </div>
          </td>
        `;
      }).join('')}
    </tr>
  `;
}
private renderOperatorDropdown(
  columnIndex: number, 
  operators: FilterOperator[], 
  currentOperator: FilterOperator
): string {
  const isActive = this._activeOperatorDropdown === columnIndex;
  
  return `
    <div class="filter-operator-dropdown" data-column-index="${columnIndex}">
      <div class="filter-operator-trigger ${isActive ? 'active' : ''}" data-column-index="${columnIndex}">
        <span class="filter-operator-icon">${getFilterIcon(currentOperator)}</span>
      </div>
      <div class="filter-operator-menu ${isActive ? 'active' : ''}" data-column-index="${columnIndex}">
        ${operators.map(op => `
          <div 
            class="filter-operator-option ${op === currentOperator ? 'selected' : ''}" 
            data-operator="${op}"
            data-column-index="${columnIndex}"
          >
            <span class="filter-operator-icon">${getFilterIcon(op)}</span>
            <span class="filter-operator-text">${this._lang.filtering.operators[op]}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}


private renderFilterInput(
  header: GridieHeaderConfig, 
  columnIndex: number, 
  operator: FilterOperator,
  value: any,
  isSecondInput: boolean
): string {
  const inputId = `filter-input-${columnIndex}${isSecondInput ? '-2' : ''}`;
  const hasValue = value !== null && value !== undefined && value !== '';

  if (header.type === 'boolean') {
    return `
      <div class="filter-input-wrapper">
        <select 
          class="filter-select" 
          data-column-index="${columnIndex}"
          data-is-second="${isSecondInput}"
        >
          <option value="">${this._lang.filtering.placeholders.boolean}</option>
          <option value="true" ${value === true || value === 'true' ? 'selected' : ''}>
            ${this._lang.filtering.booleanOptions.true}
          </option>
          <option value="false" ${value === false || value === 'false' ? 'selected' : ''}>
            ${this._lang.filtering.booleanOptions.false}
          </option>
        </select>
        <span 
          class="filter-clear ${hasValue ? 'visible' : ''}" 
          data-column-index="${columnIndex}"
          data-is-second="${isSecondInput}"
        >✕</span>
      </div>
    `;
  }

 
  let inputType = 'text';
  let placeholder: string = this._lang.filtering.placeholders.string;
  let inputMode = '';

  switch (header.type) {
    case 'number':
      inputType = 'text'; // Cambiado de 'number' a 'text'
      inputMode = 'inputmode="decimal"'; // Sugerencia para teclado móvil
      placeholder = this._lang.filtering.placeholders.number;
      break;
    case 'date':

      inputType = 'date';
      placeholder = this._lang.filtering.placeholders.date;
      break;
  }

  return `
    <div class="filter-input-wrapper">
      <input 
        type="${inputType}"
        ${inputMode}
        class="filter-input"
        id="${inputId}"
        placeholder="${placeholder}"
        value="${value || ''}"
        data-column-index="${columnIndex}"
        data-is-second="${isSecondInput}"
      />
      <span 
        class="filter-clear ${hasValue ? 'visible' : ''}" 
        data-column-index="${columnIndex}"
        data-is-second="${isSecondInput}"
      >✕</span>
    </div>
  `;
}
 







private handleFilterChange(columnIndex: number, isSecondInput: boolean = false): void {
  const header = this.headers[columnIndex];
  
  // ✅ Usar getCurrentOperator() en lugar de buscar solo en el filtro activo
  const operator = this.getCurrentOperator(columnIndex);

  let input: HTMLInputElement | HTMLSelectElement | null;
  
  if (header.type === 'boolean') {
    input = this.shadow.querySelector(
      `select.filter-select[data-column-index="${columnIndex}"][data-is-second="${isSecondInput}"]`
    ) as HTMLSelectElement;
  } else {
    input = this.shadow.querySelector(
      `input.filter-input[data-column-index="${columnIndex}"][data-is-second="${isSecondInput}"]`
    ) as HTMLInputElement;
  }

  if (!input) return;

  const value = input.value;

  if (operator === 'between') {
    const input1 = this.shadow.querySelector(
      `input.filter-input[data-column-index="${columnIndex}"][data-is-second="false"]`
    ) as HTMLInputElement;
    const input2 = this.shadow.querySelector(
      `input.filter-input[data-column-index="${columnIndex}"][data-is-second="true"]`
    ) as HTMLInputElement;

    if (input1 && input2) {
      const value1 = input1.value;
      const value2 = input2.value;

      if (value1 || value2) {
        this._filteringManager.addFilter(columnIndex, operator, value1, value2);
      } else {
        this._filteringManager.clearFilterValue(columnIndex);
      }
    }
  } else {
    if (value) {
      this._filteringManager.addFilter(columnIndex, operator, value);
    } else {
      this._filteringManager.clearFilterValue(columnIndex);
    }
  }

  this.applyFiltersAndSorting();
  
  // Restaurar foco y posición de scroll
  this.restoreFocusAndScroll(input);
}

private restoreFocusAndScroll(previousInput: HTMLElement): void {
  const container = this.shadow.querySelector('.gridie-container') as HTMLElement;
  const scrollLeft = container?.scrollLeft || 0;
  const scrollTop = container?.scrollTop || 0;
  
  // Restaurar después del re-render
  setTimeout(() => {
    // Restaurar scroll
    if (container) {
      container.scrollLeft = scrollLeft;
      container.scrollTop = scrollTop;
    }
    
    // Restaurar foco
    const columnIndex = previousInput.dataset.columnIndex;
    const isSecond = previousInput.dataset.isSecond;
    
    if (columnIndex) {
      const selector = previousInput.classList.contains('filter-select')
        ? `select.filter-select[data-column-index="${columnIndex}"][data-is-second="${isSecond}"]`
        : `input.filter-input[data-column-index="${columnIndex}"][data-is-second="${isSecond}"]`;
      
      const newInput = this.shadow.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
      if (newInput) {
        newInput.focus();
        
        // Restaurar posición del cursor en inputs de texto
        if (newInput instanceof HTMLInputElement && newInput.type === 'text') {
          const cursorPos = newInput.value.length;
          newInput.setSelectionRange(cursorPos, cursorPos);
        }
      }
    }
  }, 0);
}


private handleFilterClear(columnIndex: number, isSecondInput: boolean = false): void {
  const header = this.headers[columnIndex];
  
  // Guardar posición de scroll antes de limpiar
  const container = this.shadow.querySelector('.gridie-container') as HTMLElement;
  const scrollLeft = container?.scrollLeft || 0;
  const scrollTop = container?.scrollTop || 0;
  
  if (header.type === 'boolean') {
    const select = this.shadow.querySelector(
      `select.filter-select[data-column-index="${columnIndex}"][data-is-second="${isSecondInput}"]`
    ) as HTMLSelectElement;
    if (select) select.value = '';
  } else {
    const input = this.shadow.querySelector(
      `input.filter-input[data-column-index="${columnIndex}"][data-is-second="${isSecondInput}"]`
    ) as HTMLInputElement;
    if (input) input.value = '';
  }

  this.handleFilterChange(columnIndex, isSecondInput);
  
  // ✅ SOLUCIÓN 2: Restaurar scroll después de limpiar
  setTimeout(() => {
    if (container) {
      container.scrollLeft = scrollLeft;
      container.scrollTop = scrollTop;
    }
  }, 0);
}






  // ============= END FILTER ROW METHODS =============

  render() {
    const headers = this.headers;
    const body = this.body;
    const gridieId = this.gridieId;

    this._eventHandlers.clear();

    this.shadow.innerHTML = `
      <style>
        ${gridieStyles}
        ${filterRowStyles}
      </style>

      <div class="gridie-container" data-gridie-id="${gridieId}">
        ${gridieId ? `<div class="gridie-id">ID: ${gridieId}</div>` : ''}
        <table class="gridie-table">
          <thead>
            <tr>
              ${headers.map((header, index) => `
                <th 
                  class="${header.sortable ? 'sortable' : ''}" 
                  data-column-index="${index}"
                >
                  ${header.label}${this.getSortIndicator(index)}
                </th>
              `).join('')}
            </tr>
            ${this.renderFilterRow()}
          </thead>
          <tbody>
            ${body.length > 0 
              ? body.map((row, rowIndex) => `
                  <tr data-index="${rowIndex}">
                    ${headers.map((header, colIndex) => 
                      `<td>${this.renderCell(row, header, colIndex, rowIndex)}</td>`
                    ).join('')}
                  </tr>
                `).join('')
              : `<tr><td colspan="${headers.length}" class="no-data">${this._lang.table.noData}</td></tr>`
            }
          </tbody>
        </table>
      </div>
    `;

    this.attachActionEvents();
    this.attachHeaderEvents();
    this.attachFilterEvents();
  }

  private attachHeaderEvents(): void {
    this.shadow.querySelectorAll('th[data-column-index]').forEach(th => {
      const columnIndex = parseInt((th as HTMLElement).dataset.columnIndex!);
      
      th.addEventListener('click', () => {
        this.handleHeaderClick(columnIndex);
      });

      th.addEventListener('contextmenu', (e) => {
        this.handleHeaderRightClick(e as MouseEvent, columnIndex);
      });
    });
  }

  private attachActionEvents(): void {
    this._eventHandlers.forEach((action, actionId) => {
      const element = this.shadow.querySelector(`[data-action-id="${actionId}"]`);
      
      if (element) {
        const parts = actionId.split('-');
        const rowIndex = parseInt(parts[1]);
        const rowData = this.body[rowIndex];

        element.addEventListener(action.event, (e) => {
          e.stopPropagation();
          action.funct(rowData, rowIndex);
        });
      }
    });
  }
}

customElements.define("gridie-table", Gridie);