// src/gridie/gridie.ts
//Ultimos cambios de gridie donde faltan ajustar
import { SortingManager } from "./sortingFunctions";
import type { SortDirection } from "./sortingFunctions";
import { FilteringManager } from "./filteringFunctions";
import type { FilterOperator, FilterState } from "./filteringFunctions";
import { getLanguage } from "./lang";
import type { Language, LanguageStrings } from "./lang";

import {
  gridieStyles,
  //contextMenuStyles,
  filterRowStyles,
  //headerFilterStyles,
} from "./styles";

import { getFilterIcon } from "./assets/icons/filters";

export interface GridieFilterRowConfig {
  visible: boolean;
  operators?: readonly FilterOperator[] | FilterOperator[];
}

export interface GridieHeaderConfig {
  label?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: "string" | "number" | "date" | "boolean";
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

export interface HeaderFilterParameter {
  text: string;
  operator: FilterOperator;
  value: any;
  value2?: any;
  unit?: "days" | "months" | "years";
  year?: number;
}

export interface GridieHeaderFilterConfig {
  visible: boolean;
  values?: any[];
  parameters?: HeaderFilterParameter[];
  showCount?: boolean;
  search?: boolean;
  dateHierarchy?: ("year" | "month" | "day" | "hour")[];
  timeFormat?: "12h" | "24h";
  locale?: "es" | "en";
}

// Actualizar GridieFiltersConfig
export interface GridieFiltersConfig {
  filterRow?: GridieFilterRowConfig;
  headerFilter?: GridieHeaderFilterConfig;
}

export class Gridie extends HTMLElement {
  private shadow: ShadowRoot;
  private _id: string = "";
  private _headers: (string | GridieHeaderConfig)[] = [];
  private _body: any[] = [];
  private _originalBody: any[] = [];
  private _filteredBody: any[] = [];
  private _config: Partial<GridieConfig> = {};
  private _eventHandlers: Map<string, GridieCellAction> = new Map();
  private _sortingManager: SortingManager = new SortingManager();
  private _filteringManager: FilteringManager = new FilteringManager();
  private _language: Language = "es";
  private _lang: LanguageStrings;
  private _contextMenu: HTMLDivElement | null = null;
  private _globalStyleId = "gridie-global-styles";
  private _activeOperatorDropdown: number | null = null;
  private _selectedOperators: Map<number, FilterOperator> = new Map();
  private _operatorDropdownMenu: HTMLDivElement | null = null;
  private _activeHeaderFilterDropdown: number | null = null;
  private _headerFilterMenu: HTMLDivElement | null = null;
  private _headerFilterSearchValues: Map<number, string> = new Map(); // Para búsqueda interna
  // private _headerFilterSearchTerm: string = "";
  private _headerFilterSelections: Map<number, Set<any>> = new Map();
  private _headerFilterExpandedState: Map<string, boolean> = new Map();

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
      this._language = config.language || "es";
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
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleDocumentClick.bind(this));
    //this.removeGlobalStyles();

    if (this._operatorDropdownMenu) {
      document.body.removeChild(this._operatorDropdownMenu);
      this._operatorDropdownMenu = null;
    }

    // ✅ Cerrar context menu si está abierto
    this.hideContextMenu();

    // ✅ Remover header filter menu del shadow DOM
    if (this._headerFilterMenu) {
      const container = this.shadow.querySelector(
        ".gridie-container"
      ) as HTMLElement;
      if (container && container.contains(this._headerFilterMenu)) {
        container.removeChild(this._headerFilterMenu);
      }
      this._headerFilterMenu = null;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === "language") {
        this._language = newValue as Language;
        this._lang = getLanguage(this._language);
      }
      this.render();
    }
  }

  private injectGlobalStyles(): void {
    if (document.getElementById(this._globalStyleId)) return;

    const style = document.createElement("style");
    style.id = this._globalStyleId;
    // ✅ Ya no necesitamos contextMenuStyles aquí
    style.textContent = "";

    // Si el string está vacío, podemos omitir la inyección
    if (style.textContent.trim()) {
      document.head.appendChild(style);
    }
  }

  setConfig(config: GridieConfig) {
    this._id = config.id;
    this._headers = config.headers;
    this._body = config.body;
    this._originalBody = [...config.body];
    this._filteredBody = [...config.body];
    this._language = config.language || "es";
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
    this._headerFilterSearchValues.clear(); // ✅ AGREGADO
    this._headerFilterSelections.clear();
    this._headerFilterExpandedState.clear();
    this.render();
  }

  setData(config: { headers: (string | GridieHeaderConfig)[]; data: any[] }) {
    this._headers = config.headers;
    this._body = config.data;
    this._originalBody = [...config.data];
    this._filteredBody = [...config.data];
    this._sortingManager.clearAll();
    this._filteringManager.clearAll();
    this._selectedOperators.clear();
    this._headerFilterSearchValues.clear();
    this._headerFilterSelections.clear();
    this._headerFilterExpandedState.clear();
    this.render();
  }

  addRow(row: any) {
    this._originalBody.push(row);
    this.applyFiltersAndSorting();
  }

  removeRow(index: number) {
    const originalIndex = this._originalBody.findIndex(
      (r) => r === this._body[index]
    );
    if (originalIndex !== -1) {
      this._originalBody.splice(originalIndex, 1);
    }
    this.applyFiltersAndSorting();
  }

  updateRow(index: number, row: any) {
    if (index >= 0 && index < this._body.length) {
      const originalIndex = this._originalBody.findIndex(
        (r) => r === this._body[index]
      );
      if (originalIndex !== -1) {
        this._originalBody[originalIndex] = {
          ...this._originalBody[originalIndex],
          ...row,
        };
      }
      this.applyFiltersAndSorting();
    }
  }

  get gridieId(): string {
    if (this._id) return this._id;
    const idAttr = this.getAttribute("id");
    return idAttr || "";
  }

  get headers(): GridieHeaderConfig[] {
    const headers =
      this._headers.length > 0 ? this._headers : this.getAttributeHeaders();

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

  private normalizeHeader(
    header: string | GridieHeaderConfig,
    position: number
  ): GridieHeaderConfig {
    if (typeof header === "string") {
      return {
        label: header,
        sortable: this._config.enableSort ?? true,
        filterable: false,
        type: "string",
      };
    }
    return {
      label: header.label || `Column ${position + 1}`,
      sortable: header.sortable ?? this._config.enableSort ?? true,
      filterable: header.filterable ?? false,
      type: header.type || "string",
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
    if (value === null || value === undefined) return "";

    switch (type) {
      case "boolean":
        return value
          ? this._lang.filtering.booleanOptions.true
          : this._lang.filtering.booleanOptions.false;
      case "date":
        // ✅ FIX: Para strings YYYY-MM-DD, formatear directamente sin Date
        const str = String(value);
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
          // Parsear manualmente para evitar zona horaria
          const [year, month, day] = str.split("-");
          const date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );
          return date.toLocaleDateString(
            this._language === "es" ? "es-ES" : "en-US"
          );
        }
        // Para otros formatos, usar Date normal
        return new Date(value).toLocaleDateString(
          this._language === "es" ? "es-ES" : "en-US"
        );
      case "number":
        return typeof value === "number"
          ? value.toLocaleString()
          : String(value);
      default:
        return String(value);
    }
  }

  private isActionCell(cell: any): cell is GridieCellAction[] {
    return (
      Array.isArray(cell) &&
      cell.length > 0 &&
      cell[0] &&
      "content" in cell[0] &&
      "event" in cell[0] &&
      "funct" in cell[0]
    );
  }

  private renderCell(
    row: any,
    header: GridieHeaderConfig,
    position: number,
    rowIndex: number
  ): string {
    const cellValue = this.getCellValueByPosition(row, position);

    if (this.isActionCell(cellValue)) {
      return cellValue
        .map((action, actionIndex) => {
          const actionId = `action-${rowIndex}-${position}-${actionIndex}`;
          this._eventHandlers.set(actionId, action);
          return `<span data-action-id="${actionId}">${action.content}</span>`;
        })
        .join(" ");
    }

    return this.formatCellValue(cellValue, header.type);
  }

  private handleHeaderClick(columnIndex: number): void {
    const header = this.headers[columnIndex];
    if (!header.sortable) return;

    const currentSort = this._sortingManager.getColumnSort(columnIndex);
    let newDirection: SortDirection;

    if (!currentSort) {
      newDirection = "asc";
    } else if (currentSort.direction === "asc") {
      newDirection = "desc";
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

    // ✅ CAMBIO: Crear dentro del shadow DOM con posición absoluta
    const container = this.shadowRoot!.querySelector(
      ".gridie-container"
    ) as HTMLElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // Calcular posición relativa al contenedor
    const relativeX = x - containerRect.left + container.scrollLeft;
    const relativeY = y - containerRect.top + container.scrollTop;

    const menu = document.createElement("div");
    menu.className = "gridie-context-menu";
    menu.style.position = "absolute";
    menu.style.left = `${relativeX}px`;
    menu.style.top = `${relativeY}px`;

    const hasMultipleSorts = this._sortingManager.getAllSorts().length > 1;
    const hasColumnSort =
      this._sortingManager.getColumnSort(columnIndex) !== null;

    menu.innerHTML = `
    <div class="context-menu-item" data-action="sort-asc">
      ▲ ${this._lang.sorting.sortAscending}
    </div>
    <div class="context-menu-item" data-action="sort-desc">
      ▼ ${this._lang.sorting.sortDescending}
    </div>
    ${
      hasColumnSort
        ? `
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="clear-sort">
        ${this._lang.sorting.clearSorting}
      </div>
    `
        : ""
    }
    ${
      hasMultipleSorts
        ? `
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="clear-all-sort">
        ${this._lang.sorting.clearAllSorting}
      </div>
    `
        : ""
    }
  `;

    menu.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("context-menu-item")) {
        const action = target.dataset.action;
        this.handleContextMenuAction(action!, columnIndex);
        this.hideContextMenu();
      }
    });

    // ✅ CAMBIO: Agregar al contenedor en lugar de document.body
    container.appendChild(menu);
    this._contextMenu = menu;

    // ✅ Ajustar posición si se sale del contenedor
    setTimeout(() => {
      const menuRect = menu.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Si se sale por la derecha
      if (menuRect.right > containerRect.right) {
        const overflow = menuRect.right - containerRect.right;
        menu.style.left = `${relativeX - overflow - 10}px`;
      }

      // Si se sale por abajo
      if (menuRect.bottom > containerRect.bottom) {
        const overflow = menuRect.bottom - containerRect.bottom;
        menu.style.top = `${relativeY - overflow - 10}px`;
      }
    }, 0);
  }

  private hideContextMenu(): void {
    if (this._contextMenu) {
      // ✅ CAMBIO: Remover del contenedor en lugar de document.body
      const container = this.shadow.querySelector(
        ".gridie-container"
      ) as HTMLElement;
      if (container && container.contains(this._contextMenu)) {
        container.removeChild(this._contextMenu);
      }
      this._contextMenu = null;
    }
  }

  private handleContextMenuAction(action: string, columnIndex: number): void {
    switch (action) {
      case "sort-asc":
        this._sortingManager.addSort(columnIndex, "asc");
        break;
      case "sort-desc":
        this._sortingManager.addSort(columnIndex, "desc");
        break;
      case "clear-sort":
        this._sortingManager.clearColumn(columnIndex);
        break;
      case "clear-all-sort":
        this._sortingManager.clearAll();
        break;
    }
    this.applyFiltersAndSorting();
  }



  private applyFiltersAndSorting(): void {
    let filtered = this._filteringManager.applyFilters(
      this._originalBody,
      this.headers
    );

    if (this._headerFilterSelections.size > 0) {
      filtered = filtered.filter((row: any) => {
        for (const [
          colIndex,
          selections,
        ] of this._headerFilterSelections.entries()) {
          if (selections.size === 0) continue;

          const cellValue = this.getCellValueByPosition(row, colIndex);
          const header = this.headers[colIndex];

          let matchFound = false;

          for (const selection of selections) {
            if (typeof selection === "object" && selection.operator) {
              const date = new Date(cellValue);
              if (isNaN(date.getTime())) continue;

              switch (selection.operator) {
                case "year":
                  if (date.getUTCFullYear() === selection.value)
                    matchFound = true;
                  break;
                case "month":
                  if (
                    date.getUTCFullYear() === selection.year &&
                    date.getUTCMonth() === selection.value
                  ) {
                    matchFound = true;
                  }
                  break;
              }
            } else {
              if (header.type === "date") {
                // ✅ DETECTAR: Si la selección incluye hora (tiene 'T' y hora)
                const selectionStr = String(selection);
                const isHourFilter = /T\d{2}:\d{2}/.test(selectionStr);

               if (isHourFilter) {
  // Comparar fecha + hora (hasta minutos, sin segundos/milisegundos)
  const normalizedCell = this.normalizeDateTimeToISO(cellValue); // ✅ USAR ESTE
  const normalizedSelection = this.normalizeDateTimeToISO(selection); // ✅ USAR ESTE
  
  if (normalizedCell === normalizedSelection) {
    matchFound = true;
    break;
  }
}
                
                else {
                  // Comparar solo fechas (sin hora)
                  const normalizedCell =
                    this.normalizeDateToYYYYMMDD(cellValue);
                  const normalizedSelection =
                    this.normalizeDateToYYYYMMDD(selection);

                  if (normalizedCell === normalizedSelection) {
                    matchFound = true;
                    break;
                  }
                }
              } else {
                if (
                  cellValue === selection ||
                  String(cellValue) === String(selection)
                ) {
                  matchFound = true;
                  break;
                }
              }
            }
          }

          if (!matchFound) return false;
        }

        return true;
      });
    }

    this._filteredBody = filtered;
    this._body = this._sortingManager.applySorts(
      this._filteredBody,
      this.headers
    );

    this.updateTableContent();
  }

  private normalizeDateToISOString(value: any): string {
    if (!value) return "";

    const str = String(value);

    // Si ya es ISO string completo, retornar
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str)) {
      // Asegurar que termine con 'Z' o tenga timezone
      if (!str.endsWith("Z") && !str.includes("+") && !str.includes("GMT")) {
        return str + "Z";
      }
      return str;
    }

    // Convertir a Date y obtener ISO string
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (error) {
      // Ignorar
    }

    return "";
  }
  private normalizeDateToYYYYMMDD(value: any): string {
    if (!value) return "";

    const str = String(value);

    console.log(
      `🔍 normalizeDateToYYYYMMDD input:`,
      value,
      `(type: ${typeof value})`
    );

    // ✅ Caso 1: Ya es "YYYY-MM-DD" exacto → retornar directo
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      console.log(`  ✅ Already normalized:`, str);
      return str;
    }

    // ✅ Caso 2: Es ISO con hora "YYYY-MM-DDTHH:mm:ss" → extraer fecha
    if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
      const result = str.split("T")[0];
      console.log(`  ✅ Extracted from ISO:`, result);
      return result;
    }

    // ✅ Caso 3: Es un Date object o timestamp → convertir USANDO UTC
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        console.log(`  📅 Date object:`, date);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        const result = `${year}-${month}-${day}`;
        console.log(`  ✅ Converted to:`, result);
        return result;
      }
    } catch (error) {
      console.log(`  ❌ Error:`, error);
    }

    console.log(`  ❌ Could not normalize`);
    return "";
  }

  private updateTableContent(): void {
    const thead = this.shadow.querySelector("thead tr:first-child");
    if (thead) {
      const headers = this.headers;
      thead.innerHTML = headers
        .map(
          (header, index) => `
      <th 
        class="${header.sortable ? "sortable" : ""}" 
        data-column-index="${index}"
      >
        ${this.renderHeaderFilterIcon(index, header)}
        ${header.label}
        ${this.getSortIndicator(index)}
      </th>
    `
        )
        .join("");

      this.attachHeaderEvents();
      this.attachHeaderFilterEvents();
    }

    this.renderTableBody();
  }

  private renderTableBody(): void {
    const tbody = this.shadow.querySelector("tbody");
    if (!tbody) {
      this.render(); // Fallback si no existe tbody
      return;
    }

    const headers = this.headers;
    const body = this.body;

    tbody.innerHTML =
      body.length > 0
        ? body
            .map(
              (row, rowIndex) => `
        <tr data-index="${rowIndex}">
          ${headers
            .map(
              (header, colIndex) =>
                `<td>${this.renderCell(row, header, colIndex, rowIndex)}</td>`
            )
            .join("")}
        </tr>
      `
            )
            .join("")
        : `<tr><td colspan="${headers.length}" class="no-data">${this._lang.table.noData}</td></tr>`;

    this.attachActionEvents();
  }

  // Reemplaza este método en gridie.ts:

  private handleOperatorChange(columnIndex: number): void {
    // Guardar scroll
    const container = this.shadow.querySelector(
      ".gridie-container"
    ) as HTMLElement;
    const scrollLeft = container?.scrollLeft || 0;
    const scrollTop = container?.scrollTop || 0;

    const operatorSelect = this.shadow.querySelector(
      `select.filter-operator[data-column-index="${columnIndex}"]`
    ) as HTMLSelectElement;

    if (!operatorSelect) return;

    const newOperator = operatorSelect.value as FilterOperator;

    // Obtener el filtro actual ANTES de cambiar
    const currentFilter = this._filteringManager.getColumnFilter(columnIndex);
    const oldOperator =
      currentFilter?.operator ||
      this.getOperatorsForColumn(this.headers[columnIndex])[0];

    // ✅ CRITICAL: Detectar si cambió entre "between" y otro operador
    const wasBetween = oldOperator === "between";
    const isNowBetween = newOperator === "between";

    // ✅ CRITICAL: Si cambió el layout, re-renderizar INMEDIATAMENTE
    if (wasBetween !== isNowBetween) {
      // ✅ FIX: Actualizar el operador en el manager con el nuevo operador
      if (isNowBetween) {
        // Cambió A "between"
        this._filteringManager.addFilter(columnIndex, newOperator, "", "");
      } else {
        // Cambió DESDE "between" a otro operador
        const currentValue = currentFilter?.value || "";
        if (currentValue) {
          // Mantener el primer valor si existe
          this._filteringManager.addFilter(
            columnIndex,
            newOperator,
            currentValue
          );
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
    const filterRow = this.shadow.querySelector(".filter-row");
    if (!filterRow) return;

    const headers = this.headers;

    filterRow.innerHTML = headers
      .map((header, index) => {
        if (!header.filters?.filterRow?.visible) {
          return `<td></td>`;
        }

        const operators = this.getOperatorsForColumn(header);
        const currentFilter = this._filteringManager.getColumnFilter(index);
        const currentOperator = this.getCurrentOperator(index);
        const currentValue = currentFilter?.value || "";
        const currentValue2 = currentFilter?.value2 || "";

        // Layout especial para "between"
        if (currentOperator === "between") {
          return `
        <td>
          <div class="filter-cell">
            <div class="filter-cell-row">
              ${this.renderOperatorDropdown(index, operators, currentOperator)}
              <div class="filter-between-container">
                <div class="filter-between-row">
                  <span class="filter-between-label">${
                    this._lang.filtering.placeholders.betweenFrom
                  }</span>
                  ${this.renderFilterInput(
                    header,
                    index,
                    currentOperator,
                    currentValue,
                    false
                  )}
                </div>
                <div class="filter-between-row">
                  <span class="filter-between-label">${
                    this._lang.filtering.placeholders.betweenTo
                  }</span>
                  ${this.renderFilterInput(
                    header,
                    index,
                    currentOperator,
                    currentValue2,
                    true
                  )}
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
            ${this.renderFilterInput(
              header,
              index,
              currentOperator,
              currentValue,
              false
            )}
          </div>
        </div>
      </td>
    `;
      })
      .join("");
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
      trigger.classList.add("active");
      menu.classList.add("active");
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
      trigger.classList.remove("active");
      menu.classList.remove("active");
    }

    this._activeOperatorDropdown = null;
  }

  private handleOperatorSelect(
    columnIndex: number,
    newOperator: FilterOperator
  ): void {
    this.closeOperatorDropdown();

    // Guardar scroll
    const container = this.shadow.querySelector(
      ".gridie-container"
    ) as HTMLElement;
    const scrollLeft = container?.scrollLeft || 0;
    const scrollTop = container?.scrollTop || 0;

    // Obtener el operador actual
    const oldOperator = this.getCurrentOperator(columnIndex);

    // Si no cambió, no hacer nada
    if (oldOperator === newOperator) return;

    // ✅ SIEMPRE guardar el operador seleccionado
    this._selectedOperators.set(columnIndex, newOperator);

    const currentFilter = this._filteringManager.getColumnFilter(columnIndex);
    const wasBetween = oldOperator === "between";
    const isNowBetween = newOperator === "between";
    const currentValue = currentFilter?.value || "";
    const currentValue2 = currentFilter?.value2 || "";

    // Actualizar el filtro en el manager solo si hay valor
    if (isNowBetween) {
      // Cambió A "between" - inicializar con valores vacíos si no hay filtro
      if (!currentFilter) {
        // No agregamos al manager aún, solo guardamos la selección
      } else {
        this._filteringManager.addFilter(columnIndex, newOperator, "", "");
      }
    } else if (wasBetween) {
      // Cambió DESDE "between" - mantener primer valor si existe
      if (currentValue) {
        this._filteringManager.addFilter(
          columnIndex,
          newOperator,
          currentValue
        );
      } else {
        this._filteringManager.clearFilterValue(columnIndex);
      }
    } else {
      // Cambió entre operadores normales - mantener valor si existe
      if (currentValue) {
        this._filteringManager.addFilter(
          columnIndex,
          newOperator,
          currentValue,
          currentValue2
        );
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

    // Cerrar operator dropdown si se hace clic fuera
    if (this._activeOperatorDropdown !== null) {
      const operatorMenu = this.shadow.querySelector(
        `.filter-operator-menu[data-column-index="${this._activeOperatorDropdown}"]`
      );
      const operatorTrigger = this.shadow.querySelector(
        `.filter-operator-trigger[data-column-index="${this._activeOperatorDropdown}"]`
      );

      if (
        operatorMenu &&
        !operatorMenu.contains(target) &&
        operatorTrigger &&
        !operatorTrigger.contains(target)
      ) {
        this.closeOperatorDropdown();
      }
    }

    // ✅ CORREGIDO: Cerrar header filter dropdown si se hace clic fuera
    if (this._headerFilterMenu && this._activeHeaderFilterDropdown !== null) {
      const clickedInsideMenu = this._headerFilterMenu.contains(target);
      const clickedIcon = this.shadow.querySelector(
        `.header-filter-icon[data-header-filter-column="${this._activeHeaderFilterDropdown}"]`
      );
      const clickedInsideIcon = clickedIcon && clickedIcon.contains(target);

      // Solo cerrar si el clic fue FUERA del menú Y del icono
      if (!clickedInsideMenu && !clickedInsideIcon) {
        this.closeHeaderFilterDropdown();
      }
    }
  }

  // Generar opciones para el Header Filter
  private generateHeaderFilterOptions(
    columnIndex: number,
    header: GridieHeaderConfig
  ): any[] {
    const config = header.filters?.headerFilter;
    if (!config) return [];

    const options: any[] = [];

    // Si hay parameters definidos, agregarlos primero
    if (config.parameters && config.parameters.length > 0) {
      config.parameters.forEach((param) => {
        const count = this.countMatchingRows(columnIndex, param);
        options.push({
          text: param.text,
          value: param, // El parameter completo con operator, value, etc.
          count: count,
          isParameter: true,
        });
      });

      // Agregar separador si también hay values
      if (config.values && config.values.length > 0) {
        options.push({ separator: true });
      }
    }

    // Si hay values definidos, agregarlos
    if (config.values && config.values.length > 0) {
      config.values.forEach((val) => {
        const count = this.countValueOccurrences(columnIndex, val);
        options.push({
          text: this.formatValueForDisplay(val, header.type),
          value: val,
          count: count,
          isParameter: false,
        });
      });
    } else if (!config.parameters) {
      // Si no hay ni parameters ni values, extraer valores únicos automáticamente
      const uniqueValues = this.extractUniqueValues(columnIndex);

      // Si hay jerarquía de fechas, procesar diferente
      if (config.dateHierarchy && config.dateHierarchy.length > 0) {
        return this.generateDateHierarchy(columnIndex, uniqueValues, config);
      }

      // Valores únicos normales
      uniqueValues.forEach((val) => {
        const count = this.countValueOccurrences(columnIndex, val);
        options.push({
          text: this.formatValueForDisplay(val, header.type),
          value: val,
          count: count,
          isParameter: false,
        });
      });
    }

    return options;
  }

  // Extraer valores únicos de una columna
  private extractUniqueValues(columnIndex: number): any[] {
    const values = new Set<any>();

    this._originalBody.forEach((row) => {
      const cellValue = this.getCellValueByPosition(row, columnIndex);
      if (cellValue !== null && cellValue !== undefined) {
        values.add(cellValue);
      }
    });

    const result = Array.from(values).sort();

    // ✅ AGREGAR ESTO
    console.log(
      `🔍 extractUniqueValues for column ${columnIndex} (${this.headers[columnIndex]?.label}):`,
      result
    );

    return result;
  }

  // Contar cuántas filas coinciden con un parameter
  private countMatchingRows(
    columnIndex: number,
    parameter: HeaderFilterParameter
  ): number {
    let count = 0;
    const header = this.headers[columnIndex];

    this._originalBody.forEach((row) => {
      const cellValue = this.getCellValueByPosition(row, columnIndex);

      // Crear un FilterState temporal para evaluar
      const tempFilter: FilterState = {
        columnIndex: columnIndex,
        operator: parameter.operator,
        value: parameter.value,
        value2: parameter.value2,
        unit: parameter.unit,
        year: parameter.year,
      };

      if (
        this._filteringManager["evaluateFilter"](
          cellValue,
          tempFilter,
          header.type
        )
      ) {
        count++;
      }
    });

    return count;
  }

  // Contar cuántas veces aparece un valor en la columna
  private countValueOccurrences(columnIndex: number, value: any): number {
    let count = 0;

    this._originalBody.forEach((row) => {
      const cellValue = this.getCellValueByPosition(row, columnIndex);
      if (cellValue === value || String(cellValue) === String(value)) {
        count++;
      }
    });

    return count;
  }

  // Formatear valor para mostrar en el menú
  private formatValueForDisplay(value: any, type?: string): string {
    if (value === null || value === undefined || value === "") {
      return "(Vacío)";
    }

    switch (type) {
      case "boolean":
        return value
          ? this._lang.filtering.booleanOptions.true
          : this._lang.filtering.booleanOptions.false;
      case "date":
        return new Date(value).toLocaleDateString(
          this._language === "es" ? "es-ES" : "en-US"
        );
      case "datetime":
        return new Date(value).toLocaleString(
          this._language === "es" ? "es-ES" : "en-US"
        );
      case "number":
        return typeof value === "number"
          ? value.toLocaleString()
          : String(value);
      default:
        return String(value);
    }
  }

  // Generar jerarquía de fechas (para después)
  // ✅ IMPLEMENTACIÓN COMPLETA: Generar jerarquía de fechas
  //   private generateDateHierarchy(
  //     columnIndex: number,
  //     uniqueValues: any[],
  //     config: GridieHeaderFilterConfig
  //   ): any[] {
  //     console.log("=== generateDateHierarchy START ===");
  //     console.log("columnIndex:", columnIndex);
  //     console.log("hierarchy:", config.dateHierarchy);
  //     console.log("uniqueValues count:", uniqueValues.length);

  //     const hierarchy = config.dateHierarchy || [];
  //     if (hierarchy.length === 0) return [];

  //     const options: any[] = [];

  //     // ✅ Funciones auxiliares para contar filas
  //     const countRowsForYear = (year: number): number => {
  //   return this._originalBody.filter((row: any) => {
  //     const cellValue = String(this.getCellValueByPosition(row, columnIndex));
  //     return cellValue.startsWith(String(year));
  //   }).length;
  // };

  //   const countRowsForMonth = (year: number, month: number): number => {
  //   const monthStr = String(month + 1).padStart(2, '0');
  //   const prefix = `${year}-${monthStr}`;
  //   return this._originalBody.filter((row: any) => {
  //     const cellValue = String(this.getCellValueByPosition(row, columnIndex));
  //     return cellValue.startsWith(prefix);
  //   }).length;
  // };

  //     const countRowsForDay = (
  //       year: number,
  //       month: number,
  //       day: number
  //     ): number => {
  //       return this._originalBody.filter((row: any) => {
  //         const cellValue = this.getCellValueByPosition(row, columnIndex);
  //         if (!cellValue) return false;
  //         const date = new Date(cellValue);
  //         return (
  //           !isNaN(date.getTime()) &&
  //           date.getFullYear() === year &&
  //           date.getMonth() === month &&
  //           date.getDate() === day
  //         );
  //       }).length;
  //     };

  //     const countRowsForHour = (
  //       year: number,
  //       month: number,
  //       day: number,
  //       hour: number
  //     ): number => {
  //       return this._originalBody.filter((row: any) => {
  //         const cellValue = this.getCellValueByPosition(row, columnIndex);
  //         if (!cellValue) return false;
  //         const date = new Date(cellValue);
  //         return (
  //           !isNaN(date.getTime()) &&
  //           date.getFullYear() === year &&
  //           date.getMonth() === month &&
  //           date.getDate() === day &&
  //           date.getHours() === hour
  //         );
  //       }).length;
  //     };

  //     // Convertir todos los valores a fechas
  //     const dates = uniqueValues
  //       .map((val: any) => new Date(val))
  //       .filter((date: Date) => !isNaN(date.getTime()))
  //       .sort((a: Date, b: Date) => a.getTime() - b.getTime());

  //     if (dates.length === 0) return [];

  //     // Agrupar por año
  //     const yearGroups = new Map<number, Date[]>();
  //     dates.forEach((date: Date) => {
  //       const year = date.getFullYear();
  //       if (!yearGroups.has(year)) {
  //         yearGroups.set(year, []);
  //       }
  //       yearGroups.get(year)!.push(date);
  //     });

  //     // Ordenar años (más reciente primero)
  //     const sortedYears = Array.from(yearGroups.keys()).sort((a, b) => b - a);

  //     sortedYears.forEach((year: number) => {
  //       const yearDates = yearGroups.get(year)!;
  //       const yearId = `${columnIndex}-year-${year}`;
  //       const yearCount = countRowsForYear(year);

  //       if (hierarchy.length === 1 && hierarchy[0] === "year") {
  //         // Solo año
  //         options.push({
  //           text: String(year),
  //           value: { operator: "year", value: year },
  //           count: yearCount,
  //           isParameter: true,
  //           level: 0,
  //           id: yearId,
  //         });
  //       } else if (hierarchy.includes("month")) {
  //         // Año → Mes (o más niveles)
  //         const monthGroups = new Map<number, Date[]>();
  //         yearDates.forEach((date: Date) => {
  //           const month = date.getMonth();
  //           if (!monthGroups.has(month)) {
  //             monthGroups.set(month, []);
  //           }
  //           monthGroups.get(month)!.push(date);
  //         });

  //         // Parent: Año
  //         const yearExpanded =
  //           this._headerFilterExpandedState.get(yearId) || false;
  //         const yearOption: any = {
  //           text: String(year),
  //           value: null,
  //           count: yearCount,
  //           isParameter: false,
  //           level: 0,
  //           expandable: true,
  //           expanded: yearExpanded,
  //           id: yearId,
  //           children: [],
  //         };
  //         options.push(yearOption);

  //         // Ordenar meses
  //         const sortedMonths = Array.from(monthGroups.keys()).sort(
  //           (a, b) => a - b
  //         );

  //         sortedMonths.forEach((month: number) => {
  //           const monthDates = monthGroups.get(month)!;
  //           const monthNames = [
  //             "Enero",
  //             "Febrero",
  //             "Marzo",
  //             "Abril",
  //             "Mayo",
  //             "Junio",
  //             "Julio",
  //             "Agosto",
  //             "Septiembre",
  //             "Octubre",
  //             "Noviembre",
  //             "Diciembre",
  //           ];
  //           const monthName = monthNames[month];
  //           const monthId = `${columnIndex}-month-${year}-${month}`;
  //           const monthCount = countRowsForMonth(year, month);

  //           if (hierarchy.length === 2) {
  //             // Año → Mes (sin día)
  //             yearOption.children.push({
  //               text: monthName,
  //               value: { operator: "month", value: month, year: year },
  //               count: monthCount,
  //               isParameter: true,
  //               level: 1,
  //               id: monthId,
  //             });
  //           } else if (hierarchy.includes("day")) {
  //             // Año → Mes → Día (o más niveles)
  //             const dayGroups = new Map<number, Date[]>();
  //             monthDates.forEach((date: Date) => {
  //               const day = date.getDate();
  //               if (!dayGroups.has(day)) {
  //                 dayGroups.set(day, []);
  //               }
  //               dayGroups.get(day)!.push(date);
  //             });

  //             // Parent: Mes
  //             const monthExpanded =
  //               this._headerFilterExpandedState.get(monthId) || false;
  //             const monthOption: any = {
  //               text: monthName,
  //               value: null,
  //               count: monthCount,
  //               isParameter: false,
  //               level: 1,
  //               expandable: true,
  //               expanded: monthExpanded,
  //               id: monthId,
  //               children: [],
  //             };
  //             yearOption.children.push(monthOption);

  //             // Ordenar días
  //             const sortedDays = Array.from(dayGroups.keys()).sort(
  //               (a, b) => a - b
  //             );

  //             sortedDays.forEach((day: number) => {
  //               const dayDates = dayGroups.get(day)!;
  //               const dayId = `${columnIndex}-day-${year}-${month}-${day}`;
  //               const dayCount = countRowsForDay(year, month, day);

  //               if (hierarchy.length === 3 || !hierarchy.includes("hour")) {
  //                 // Año → Mes → Día (sin hora)
  //                 const dateStr = `${year}-${String(month + 1).padStart(
  //                   2,
  //                   "0"
  //                 )}-${String(day).padStart(2, "0")}`;
  //                 monthOption.children.push({
  //                   text: `${day} de ${monthName}`,
  //                   value: dateStr,
  //                   count: dayCount,
  //                   isParameter: false,
  //                   expandable: false, // ✅ AGREGADO: Asegurar que sea false
  //                   level: 2,
  //                   id: dayId,
  //                 });
  //               } else if (hierarchy.includes("hour")) {
  //                 // Año → Mes → Día → Hora
  //                 const hourGroups = new Map<number, Date[]>();
  //                 dayDates.forEach((date: Date) => {
  //                   const hour = date.getHours();
  //                   if (!hourGroups.has(hour)) {
  //                     hourGroups.set(hour, []);
  //                   }
  //                   hourGroups.get(hour)!.push(date);
  //                 });

  //                 // Parent: Día
  //                 const dayExpanded =
  //                   this._headerFilterExpandedState.get(dayId) || false;
  //                 const dayOption: any = {
  //                   text: `${day} de ${monthName}`,
  //                   value: null,
  //                   count: dayCount,
  //                   isParameter: false,
  //                   level: 2,
  //                   expandable: true,
  //                   expanded: dayExpanded,
  //                   id: dayId,
  //                   children: [],
  //                 };
  //                 monthOption.children.push(dayOption);

  //                 // Ordenar horas
  //                 const sortedHours = Array.from(hourGroups.keys()).sort(
  //                   (a, b) => a - b
  //                 );

  //                 sortedHours.forEach((hour: number) => {
  //                   const hourDates = hourGroups.get(hour)!;
  //                   const timeFormat = config.timeFormat || "24h";
  //                   let hourText: string;

  //                   if (timeFormat === "12h") {
  //                     const ampm = hour >= 12 ? "PM" : "AM";
  //                     const hour12 = hour % 12 || 12;
  //                     hourText = `${String(hour12).padStart(2, "0")}:00 ${ampm}`;
  //                   } else {
  //                     hourText = `${String(hour).padStart(2, "0")}:00`;
  //                   }

  //                   const hourId = `${columnIndex}-hour-${year}-${month}-${day}-${hour}`;
  //                   const hourCount = countRowsForHour(year, month, day, hour);

  //                   // Usar la primera fecha del grupo como valor
  //                   dayOption.children.push({
  //                     text: hourText,
  //                     value: hourDates[0].toISOString(),
  //                     count: hourCount,
  //                     isParameter: false,
  //                     level: 3,
  //                     id: hourId,
  //                   });
  //                 });
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });

  //     console.log("Generated options:", JSON.stringify(options, null, 2));
  //     console.log("=== generateDateHierarchy END ===");

  //     return options;
  //   }

private generateDateHierarchy(
  columnIndex: number,
  uniqueValues: any[],
  config: GridieHeaderFilterConfig
): any[] {
  const hierarchy = config.dateHierarchy || [];
  if (hierarchy.length === 0) return [];

  const options: any[] = [];

  // ✅ SOLUCIÓN: Usar getUTC* en lugar de get* para evitar problemas de zona horaria
  const countRowsForYear = (year: number): number => {
    return this._originalBody.filter((row: any) => {
      const cellValue = this.getCellValueByPosition(row, columnIndex);
      if (!cellValue) return false;
      const date = new Date(cellValue);
      return !isNaN(date.getTime()) && date.getUTCFullYear() === year;
    }).length;
  };

  const countRowsForMonth = (year: number, month: number): number => {
    return this._originalBody.filter((row: any) => {
      const cellValue = this.getCellValueByPosition(row, columnIndex);
      if (!cellValue) return false;
      const date = new Date(cellValue);
      return (
        !isNaN(date.getTime()) &&
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month
      );
    }).length;
  };

  const countRowsForDay = (
    year: number,
    month: number,
    day: number
  ): number => {
    return this._originalBody.filter((row: any) => {
      const cellValue = this.getCellValueByPosition(row, columnIndex);
      if (!cellValue) return false;
      const date = new Date(cellValue);
      return (
        !isNaN(date.getTime()) &&
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month &&
        date.getUTCDate() === day
      );
    }).length;
  };

  const countRowsForHour = (
    year: number,
    month: number,
    day: number,
    hour: number
  ): number => {
    return this._originalBody.filter((row: any) => {
      const cellValue = this.getCellValueByPosition(row, columnIndex);
      if (!cellValue) return false;
      const date = new Date(cellValue);
      return (
        !isNaN(date.getTime()) &&
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month &&
        date.getUTCDate() === day &&
        date.getUTCHours() === hour
      );
    }).length;
  };

  // Convertir todos los valores a fechas
  const dates = uniqueValues
    .map((val: any) => new Date(val))
    .filter((date: Date) => !isNaN(date.getTime()))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());

  if (dates.length === 0) return [];

  // Agrupar por año (UTC)
  const yearGroups = new Map<number, Date[]>();
  dates.forEach((date: Date) => {
    const year = date.getUTCFullYear();
    if (!yearGroups.has(year)) {
      yearGroups.set(year, []);
    }
    yearGroups.get(year)!.push(date);
  });

  // Ordenar años (más reciente primero)
  const sortedYears = Array.from(yearGroups.keys()).sort((a, b) => b - a);

  sortedYears.forEach((year: number) => {
    const yearDates = yearGroups.get(year)!;
    const yearId = `${columnIndex}-year-${year}`;
    const yearCount = countRowsForYear(year);

    if (hierarchy.length === 1 && hierarchy[0] === "year") {
      options.push({
        text: String(year),
        value: { operator: "year", value: year },
        count: yearCount,
        isParameter: true,
        level: 0,
        id: yearId,
      });
    } else if (hierarchy.includes("month")) {
      // Agrupar por mes (UTC)
      const monthGroups = new Map<number, Date[]>();
      yearDates.forEach((date: Date) => {
        const month = date.getUTCMonth();
        if (!monthGroups.has(month)) {
          monthGroups.set(month, []);
        }
        monthGroups.get(month)!.push(date);
      });

      const yearExpanded =
        this._headerFilterExpandedState.get(yearId) || false;
      const yearOption: any = {
        text: String(year),
        value: null,
        count: yearCount,
        isParameter: false,
        level: 0,
        expandable: true,
        expanded: yearExpanded,
        id: yearId,
        children: [],
      };
      options.push(yearOption);

      const sortedMonths = Array.from(monthGroups.keys()).sort(
        (a, b) => a - b
      );

      sortedMonths.forEach((month: number) => {
        const monthDates = monthGroups.get(month)!;
        const monthNames = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        const monthName = monthNames[month];
        const monthId = `${columnIndex}-month-${year}-${month}`;
        const monthCount = countRowsForMonth(year, month);

        if (hierarchy.length === 2) {
          yearOption.children.push({
            text: monthName,
            value: { operator: "month", value: month, year: year },
            count: monthCount,
            isParameter: true,
            level: 1,
            id: monthId,
          });
        } else if (hierarchy.includes("day")) {
          // Agrupar por día (UTC)
          const dayGroups = new Map<number, Date[]>();
          monthDates.forEach((date: Date) => {
            const day = date.getUTCDate();
            if (!dayGroups.has(day)) {
              dayGroups.set(day, []);
            }
            dayGroups.get(day)!.push(date);
          });

          const monthExpanded =
            this._headerFilterExpandedState.get(monthId) || false;
          const monthOption: any = {
            text: monthName,
            value: null,
            count: monthCount,
            isParameter: false,
            level: 1,
            expandable: true,
            expanded: monthExpanded,
            id: monthId,
            children: [],
          };
          yearOption.children.push(monthOption);

          const sortedDays = Array.from(dayGroups.keys()).sort(
            (a, b) => a - b
          );

          sortedDays.forEach((day: number) => {
            const dayDates = dayGroups.get(day)!;
            const dayId = `${columnIndex}-day-${year}-${month}-${day}`;
            const dayCount = countRowsForDay(year, month, day);

            if (hierarchy.length === 3 || !hierarchy.includes("hour")) {
              const dateStr = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              monthOption.children.push({
                text: `${day} de ${monthName}`,
                value: dateStr,
                count: dayCount,
                isParameter: false,
                expandable: false,
                level: 2,
                id: dayId,
              });
            } else if (hierarchy.includes("hour")) {
              // Agrupar por hora (UTC)
              const hourGroups = new Map<number, Date[]>();
              dayDates.forEach((date: Date) => {
                const hour = date.getUTCHours();
                if (!hourGroups.has(hour)) {
                  hourGroups.set(hour, []);
                }
                hourGroups.get(hour)!.push(date);
              });

              const dayExpanded =
                this._headerFilterExpandedState.get(dayId) || false;
              const dayOption: any = {
                text: `${day} de ${monthName}`,
                value: null,
                count: dayCount,
                isParameter: false,
                level: 2,
                expandable: true,
                expanded: dayExpanded,
                id: dayId,
                children: [],
              };
              monthOption.children.push(dayOption);

              const sortedHours = Array.from(hourGroups.keys()).sort(
                (a, b) => a - b
              );

              sortedHours.forEach((hour: number) => {
                const hourDates = hourGroups.get(hour)!;
                const timeFormat = config.timeFormat || "24h";
                let hourText: string;

                if (timeFormat === "12h") {
                  const ampm = hour >= 12 ? "PM" : "AM";
                  const hour12 = hour % 12 || 12;
                  hourText = `${String(hour12).padStart(2, "0")}:00 ${ampm}`;
                } else {
                  hourText = `${String(hour).padStart(2, "0")}:00`;
                }

                const hourId = `${columnIndex}-hour-${year}-${month}-${day}-${hour}`;
                const hourCount = countRowsForHour(year, month, day, hour);

                // ✅ FIX: Buscar el valor ORIGINAL que corresponde a esta hora UTC
                const matchingRow = this._originalBody.find((row: any) => {
                  const cellValue = this.getCellValueByPosition(row, columnIndex);
                  if (!cellValue) return false;
                  const date = new Date(cellValue);
                  return (
                    !isNaN(date.getTime()) &&
                    date.getUTCFullYear() === year &&
                    date.getUTCMonth() === month &&
                    date.getUTCDate() === day &&
                    date.getUTCHours() === hour
                  );
                });

                const valueToUse = matchingRow 
                  ? this.getCellValueByPosition(matchingRow, columnIndex)
                  : hourDates[0].toISOString();

                dayOption.children.push({
                  text: hourText,
                  value: valueToUse, // ✅ Usar valor original
                  count: hourCount,
                  isParameter: false,
                  level: 3,
                  id: hourId,
                });
              });
            }
          });
        }
      });
    }
  });

  return options;
}


// ✅ NUEVO: Normalizar datetime completo (para filtros de hora)
private normalizeDateTimeToISO(value: any): string {
  if (!value) return '';
  
  const str = String(value);
  
  // Si ya es un ISO string con hora
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str)) {
    // Normalizar: remover milisegundos y timezone para comparar solo hasta minutos
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      // Formato: YYYY-MM-DDTHH:mm
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  }
  
  return '';
}

  private applyHeaderFilters(): void {
    console.log("🔍 Applying header filters...");
    console.log(
      "🔍 Active selections:",
      Array.from(this._headerFilterSelections.entries())
    );

    this.applyFiltersAndSorting();
    // Filtrar _originalBody basado en selecciones
    this._filteredBody = this._originalBody.filter((row: any) => {
      // Por cada columna que tiene filtros activos
      for (const [
        colIndex,
        selections,
      ] of this._headerFilterSelections.entries()) {
        if (selections.size === 0) continue;

        const cellValue = this.getCellValueByPosition(row, colIndex);

        let matchFound = false;
        for (const selection of selections) {
          if (typeof selection === "object" && selection.operator) {
            // Es un parameter de fecha - evaluar
            const date = new Date(cellValue);
            if (isNaN(date.getTime())) continue;

            switch (selection.operator) {
              case "year":
                if (date.getFullYear() === selection.value) matchFound = true;
                break;
              case "month":
                if (
                  date.getFullYear() === selection.year &&
                  date.getMonth() === selection.value
                ) {
                  matchFound = true;
                }
                break;
            }
          } else {
            // Es un valor simple o fecha específica
            if (
              cellValue === selection ||
              String(cellValue) === String(selection)
            ) {
              matchFound = true;
              break;
            }
          }
        }

        if (!matchFound) return false;
      }

      return true;
    });

    console.log(
      "✅ Filtered from",
      this._originalBody.length,
      "to",
      this._filteredBody.length,
      "rows"
    );

    // Aplicar sorting
    this._body = this._sortingManager.applySorts(
      this._filteredBody,
      this.headers
    );

    // Re-renderizar
    this.updateTableContent();
  }

  // ✅ NUEVO: Aplanar jerarquía para renderizado
  // private flattenHierarchy(
  //   options: any[],
  //   parentExpanded: boolean = true
  // ): any[] {
  //   const flattened: any[] = [];

  //   options.forEach((option: any) => {
  //     // Siempre agregar la opción actual
  //     flattened.push(option);

  //     // Si tiene hijos Y está expandida Y el padre está expandido
  //     if (
  //       option.children &&
  //       option.children.length > 0 &&
  //       option.expanded &&
  //       parentExpanded
  //     ) {
  //       // Recursivamente aplanar los hijos
  //       const childrenFlattened = this.flattenHierarchy(
  //         option.children,
  //         option.expanded
  //       );
  //       flattened.push(...childrenFlattened);
  //     }
  //   });

  //   return flattened;
  // }

  private flattenHierarchy(
    options: any[],
    parentExpanded: boolean = true
  ): any[] {
    const flattened: any[] = [];

    options.forEach((option: any) => {
      // Siempre agregar la opción actual
      flattened.push(option);

      console.log("🔍 flattenHierarchy - Processing:", {
        text: option.text,
        expandable: option.expandable,
        expanded: option.expanded,
        hasChildren: option.children?.length,
        parentExpanded: parentExpanded,
        willShowChildren:
          option.children &&
          option.children.length > 0 &&
          option.expanded &&
          parentExpanded,
      });

      // ✅ FIX: Si tiene hijos Y está expandida Y el padre está expandido
      if (
        option.children &&
        option.children.length > 0 &&
        option.expanded &&
        parentExpanded
      ) {
        console.log(
          '  ➡️ Expanding children of "' +
            option.text +
            '" (' +
            option.children.length +
            " children)"
        );
        // Recursivamente aplanar los hijos
        const childrenFlattened = this.flattenHierarchy(option.children, true);
        console.log(
          "  ➡️ Added " + childrenFlattened.length + " flattened children"
        );
        flattened.push(...childrenFlattened);
      }
    });

    console.log("🔍 flattenHierarchy result: " + flattened.length + " items");
    return flattened;
  }

  private showHeaderFilterMenu(columnIndex: number, icon: HTMLElement): void {
    const container = this.shadowRoot!.querySelector(
      ".gridie-container"
    ) as HTMLElement;
    if (!container) return;

    const headers = this.headers;

    if (!headers || columnIndex >= headers.length) {
      console.error(
        "Header index out of bounds:",
        columnIndex,
        "headers:",
        headers
      );
      return;
    }

    if (!this._originalBody || this._originalBody.length === 0) {
      console.error("No data available");
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();

    const header = headers[columnIndex];
    const headerFilterConfig = header.filters?.headerFilter;
    if (!headerFilterConfig || !headerFilterConfig.visible) return;

    const selectedValues =
      this._headerFilterSelections.get(columnIndex) || new Set<any>();

    // Generar opciones
    let allOptions: any[] = [];

    // 1. Parameters (si existen)
    if (headerFilterConfig.parameters) {
      allOptions = allOptions.concat(
        headerFilterConfig.parameters.map((param: HeaderFilterParameter) => ({
          text: param.text,
          value: param,
          count: null,
          isParameter: true,
        }))
      );
    }

    // 2. Jerarquía de fechas (si existe)
    if (headerFilterConfig.dateHierarchy && header.type === "date") {
      const uniqueValues = this.extractUniqueValues(columnIndex);
      const dateOptions = this.generateDateHierarchy(
        columnIndex,
        uniqueValues,
        headerFilterConfig
      );
      allOptions = allOptions.concat(dateOptions);
    }
    // 3. Values predefinidos (si existen y NO hay jerarquía de fechas)
    else if (headerFilterConfig.values) {
      allOptions = allOptions.concat(
        headerFilterConfig.values.map((val: any) => {
          const count = this._originalBody.filter(
            (row: any) => this.getCellValueByPosition(row, columnIndex) === val
          ).length;
          return { text: String(val), value: val, count, isParameter: false };
        })
      );
    }
    // 4. Valores únicos automáticos (si NO hay values ni jerarquía)
    else if (!headerFilterConfig.dateHierarchy) {
      const uniqueValues = this.extractUniqueValues(columnIndex);
      allOptions = allOptions.concat(
        Array.from(uniqueValues).map((val: any) => {
          const displayValue = this.formatCellValue(val, header.type);
          const count = this._originalBody.filter(
            (row: any) => this.getCellValueByPosition(row, columnIndex) === val
          ).length;
          return {
            text: displayValue,
            value: val,
            count: headerFilterConfig.showCount !== false ? count : null,
            isParameter: false,
          };
        })
      );
    }

    // Filtrar opciones según búsqueda
    let filteredOptions = allOptions;
    const searchTerm = (
      this._headerFilterSearchValues.get(columnIndex) || ""
    ).toLowerCase();
    if (searchTerm) {
      filteredOptions = allOptions.filter((opt: any) =>
        this.normalizeStringForSearch(opt.text).includes(
          this.normalizeStringForSearch(searchTerm)
        )
      );
    }

    // Aplanar jerarquía si existe
    const hasHierarchy = allOptions.some((opt: any) => opt.expandable);

    console.log("🔍 hasHierarchy:", hasHierarchy);
    console.log("🔍 allOptions before flatten:", allOptions.length);

    if (hasHierarchy) {
      filteredOptions = this.flattenHierarchy(filteredOptions);
      console.log("🔍 filteredOptions after flatten:", filteredOptions.length);
      console.log("🔍 filteredOptions sample:", filteredOptions.slice(0, 5));
    }

    const showSelectAll = !hasHierarchy;

    // Calcular estados de checkboxes
    const selectableOptions = filteredOptions.filter(
      (opt: any) => !opt.expandable
    );
    const allSelected =
      selectableOptions.length > 0 &&
      selectableOptions.every((opt: any) => {
        if (opt.isParameter) {
          return Array.from(selectedValues).some(
            (val: any) =>
              typeof val === "object" &&
              val.operator === opt.value.operator &&
              JSON.stringify(val) === JSON.stringify(opt.value)
          );
        }
        return selectedValues.has(opt.value);
      });

    const someSelected = selectableOptions.some((opt: any) => {
      if (opt.isParameter) {
        return Array.from(selectedValues).some(
          (val: any) =>
            typeof val === "object" &&
            val.operator === opt.value.operator &&
            JSON.stringify(val) === JSON.stringify(opt.value)
        );
      }
      return selectedValues.has(opt.value);
    });

    // Crear menú
    const menu = document.createElement("div");
    menu.className = "header-filter-menu";
    menu.dataset.columnIndex = String(columnIndex);

    // Calcular posición
    const x = iconRect.left - containerRect.left + container.scrollLeft;
    const y = iconRect.bottom - containerRect.top + container.scrollTop + 4;

    menu.style.position = "absolute";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    let menuHTML = "";

    // Campo de búsqueda (si está habilitado)
    if (headerFilterConfig.search) {
      const searchValue = this._headerFilterSearchValues.get(columnIndex) || "";
      menuHTML += `
      <div class="header-filter-search">
        <input 
          type="text" 
          placeholder="Buscar..." 
          data-search-column="${columnIndex}"
          value="${searchValue}"
        />
      </div>
    `;
    }

    // Checkbox "Seleccionar todos" (solo si no hay jerarquía)
    if (showSelectAll) {
      menuHTML += `
      <div class="header-filter-option header-filter-select-all" data-action="select-all">
        <input 
          type="checkbox" 
          ${allSelected ? "checked" : ""} 
          ${someSelected && !allSelected ? "data-indeterminate='true'" : ""}
        />
        <span>Seleccionar todos</span>
      </div>
      ${
        headerFilterConfig.parameters &&
        allOptions.some((opt: any) => !opt.isParameter)
          ? '<div class="header-filter-separator"></div>'
          : ""
      }
    `;
    }

    // Opciones
    // Opciones
    filteredOptions.forEach((option: any, index: number) => {
      const isSelected = (() => {
        if (option.expandable) return false;

        if (option.isParameter) {
          return Array.from(selectedValues).some(
            (val: any) =>
              typeof val === "object" &&
              val.operator === option.value.operator &&
              JSON.stringify(val) === JSON.stringify(option.value)
          );
        }
        return selectedValues.has(option.value);
      })();

      const level = option.level || 0;
      const indent = level * 16;

      if (option.expandable) {
        const expandIcon = option.expanded ? "collapse-icon" : "expand-icon";
        console.log(
          `🔍 Rendering expandable [${index}]:`,
          option.text,
          "expanded:",
          option.expanded,
          "id:",
          option.id
        );

        menuHTML += `
      <div class="header-filter-option-parent" 
           data-option-index="${index}" 
           data-option-id="${option.id || ""}"
           style="padding-left: ${indent + 12}px;"
           title="ID: ${option.id || "NO-ID"}">
        <span class="header-filter-expand-icon">${getFilterIcon(
          expandIcon
        )}</span>
        <span>${option.text}${
          option.count !== null && option.count !== undefined
            ? ` (${option.count})`
            : ""
        }</span>
      </div>
    `;
      } else {
        console.log(
          `🔍 Rendering selectable [${index}]:`,
          option.text,
          "value:",
          option.value
        );

        menuHTML += `
      <div class="header-filter-option" 
           data-option-index="${index}"
           data-option-value="${
             typeof option.value === "object"
               ? JSON.stringify(option.value)
               : option.value
           }"
           style="padding-left: ${indent + 12}px;">
        <input type="checkbox" ${isSelected ? "checked" : ""} />
        <span>${option.text}${
          option.count !== null && option.count !== undefined
            ? ` (${option.count})`
            : ""
        }</span>
      </div>
    `;
      }
    });

    menu.innerHTML = menuHTML;

    if (showSelectAll) {
      setTimeout(() => {
        const selectAllCheckbox = menu.querySelector(
          '.header-filter-select-all input[type="checkbox"]'
        ) as HTMLInputElement;
        if (
          selectAllCheckbox &&
          selectAllCheckbox.dataset.indeterminate === "true"
        ) {
          selectAllCheckbox.indeterminate = true;
        }
      }, 0);
    }

    this._headerFilterMenu = menu;
    container.appendChild(menu);

    setTimeout(() => {
      const menuRect = menu.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (menuRect.bottom > containerRect.bottom) {
        const overflow = menuRect.bottom - containerRect.bottom;
        container.style.minHeight = `${
          container.offsetHeight + overflow + 20
        }px`;
      }
    }, 0);

    this.attachHeaderFilterMenuEvents(
      columnIndex,
      filteredOptions,
      allOptions,
      hasHierarchy
    );
  }

  // Normalizar string para búsqueda
  private normalizeStringForSearch(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Adjuntar eventos al menú del Header Filter
  // Adjuntar eventos al menú del Header Filter
  private attachHeaderFilterMenuEvents(
    columnIndex: number,
    filteredOptions: any[],
    allOptions: any[],
    hasHierarchy: boolean
  ): void {
    const menu = this._headerFilterMenu;
    if (!menu) return;

    console.log("🔍🔍🔍 attachHeaderFilterMenuEvents called");
    console.log("🔍 filteredOptions:", filteredOptions);
    console.log("🔍 filteredOptions.length:", filteredOptions.length);
    console.log(
      "🔍 filteredOptions map:",
      filteredOptions.map(
        (o, i) => `[${i}] ${o.text} (expandable: ${o.expandable})`
      )
    );

    // ✅ CRÍTICO: Prevenir que clics dentro del menú lo cierren
    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Evento: Campo de búsqueda
    const searchInput = menu.querySelector(
      "input[data-search-column]"
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        e.stopPropagation();
        const value = (e.target as HTMLInputElement).value;
        this._headerFilterSearchValues.set(columnIndex, value);

        const scrollTop = menu.scrollTop;
        this.reopenHeaderFilterMenu(columnIndex);

        setTimeout(() => {
          if (this._headerFilterMenu) {
            this._headerFilterMenu.scrollTop = scrollTop;
            const newSearchInput = this._headerFilterMenu.querySelector(
              "input[data-search-column]"
            ) as HTMLInputElement;
            if (newSearchInput) {
              newSearchInput.focus();
              newSearchInput.setSelectionRange(
                newSearchInput.value.length,
                newSearchInput.value.length
              );
            }
          }
        }, 0);
      });

      searchInput.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // Evento: Seleccionar todos
    const selectAllOption = menu.querySelector(".header-filter-select-all");
    if (selectAllOption) {
      selectAllOption.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleHeaderFilterSelectAll(columnIndex, allOptions);
      });
    }

    // ✅ Evento para expand/collapse de parents (jerarquías)
    const parentElements = menu.querySelectorAll(
      ".header-filter-option-parent"
    );
    console.log("🔍 Found parent elements:", parentElements.length);

    parentElements.forEach((parent, domIndex) => {
      const optionIndexStr = (parent as HTMLElement).dataset.optionIndex;
      const optionIndex = parseInt(optionIndexStr!);

      console.log(
        `🔍 Parent DOM[${domIndex}] → data-option-index="${optionIndexStr}" → parsed: ${optionIndex}`
      );

      // ✅ CRÍTICO: Usar el índice correcto del array aplanado
      const optionData = filteredOptions[optionIndex];

      if (!optionData) {
        console.error(`❌ No optionData at filteredOptions[${optionIndex}]`);
        console.log("❌ filteredOptions keys:", Object.keys(filteredOptions));
        console.log("❌ filteredOptions.length:", filteredOptions.length);
        return;
      }

      console.log(
        `   ✅ Found: "${optionData.text}" (id: ${optionData.id}, expandable: ${optionData.expandable})`
      );

      parent.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log(
          "🖱️ Parent clicked:",
          optionData.text,
          "ID:",
          optionData.id
        );
        this.handleHeaderFilterExpandToggle(columnIndex, optionData);
      });
    });

    // ✅ Evento: Opciones individuales (seleccionables)
    const selectableElements = menu.querySelectorAll(".header-filter-option");
    console.log("🔍 Found selectable elements:", selectableElements.length);

    selectableElements.forEach((option, domIndex) => {
      const optionIndexStr = (option as HTMLElement).dataset.optionIndex;
      const optionIndex = parseInt(optionIndexStr!);

      console.log(
        `🔍 Selectable DOM[${domIndex}] → data-option-index="${optionIndexStr}" → parsed: ${optionIndex}`
      );

      // ✅ CRÍTICO: Usar el índice correcto del array aplanado
      const optionData = filteredOptions[optionIndex];

      if (!optionData) {
        console.error(`❌ No optionData at filteredOptions[${optionIndex}]`);
        console.log("❌ filteredOptions keys:", Object.keys(filteredOptions));
        console.log("❌ filteredOptions.length:", filteredOptions.length);
        return;
      }

      if (optionData.separator) {
        console.log(`   ⏭️ Skipping separator at [${optionIndex}]`);
        return;
      }

      console.log(
        `   ✅ Found: "${optionData.text}" (value: ${
          typeof optionData.value === "object"
            ? JSON.stringify(optionData.value)
            : optionData.value
        })`
      );

      option.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log(
          "🖱️🖱️🖱️ Option clicked:",
          optionData.text,
          "value:",
          optionData.value
        );
        this.handleHeaderFilterOptionClick(columnIndex, optionData);
      });
    });

    console.log("🔍🔍🔍 attachHeaderFilterMenuEvents completed");
  }

  // ✅ NUEVO: Manejar expand/collapse de jerarquías
  // ✅ NUEVO: Manejar expand/collapse de jerarquías de fechas
  private handleHeaderFilterExpandToggle(
    columnIndex: number,
    optionData: any
  ): void {
    console.log("=== EXPAND TOGGLE ===");
    console.log("columnIndex:", columnIndex);
    console.log("optionData:", optionData);
    console.log("optionData.id:", optionData.id);
    console.log(
      "Current expanded state:",
      this._headerFilterExpandedState.get(optionData.id)
    );

    if (!optionData || !optionData.id) {
      console.error("❌ Option data missing or no ID:", optionData);
      return;
    }

    const currentState =
      this._headerFilterExpandedState.get(optionData.id) || false;
    const newState = !currentState;

    console.log(
      `✅ Setting ${optionData.id} from ${currentState} to ${newState}`
    );

    this._headerFilterExpandedState.set(optionData.id, newState);

    console.log(
      "All expanded states:",
      Array.from(this._headerFilterExpandedState.entries())
    );

    const scrollTop = this._headerFilterMenu?.scrollTop || 0;

    this.reopenHeaderFilterMenu(columnIndex);

    setTimeout(() => {
      if (this._headerFilterMenu) {
        this._headerFilterMenu.scrollTop = scrollTop;
      }
    }, 0);
  }
  // Manejar clic en "Seleccionar todos"
  private handleHeaderFilterSelectAll(
    columnIndex: number,
    allOptions: any[]
  ): void {
    const selectedValues =
      this._headerFilterSelections.get(columnIndex) || new Set<any>();
    const selectableOptions = allOptions.filter(
      (opt: any) => !opt.separator && !opt.expandable
    );

    // ✅ FIX: Verificar correctamente si todos están seleccionados
    const allSelected =
      selectableOptions.length > 0 &&
      selectableOptions.every((opt: any) => {
        if (opt.isParameter && typeof opt.value === "object") {
          return Array.from(selectedValues).some(
            (selected: any) =>
              typeof selected === "object" &&
              selected.operator === opt.value.operator &&
              JSON.stringify(selected) === JSON.stringify(opt.value)
          );
        }
        return selectedValues.has(opt.value);
      });

    if (allSelected) {
      // Deseleccionar todos
      this._headerFilterSelections.delete(columnIndex);
    } else {
      // Seleccionar todos
      const newSelection = new Set<any>();
      selectableOptions.forEach((opt: any) => {
        newSelection.add(opt.value);
      });
      this._headerFilterSelections.set(columnIndex, newSelection);
    }

    // ✅ APLICAR FILTROS
    this.applyHeaderFilters();

    this.reopenHeaderFilterMenu(columnIndex);
  }
  // Manejar clic en opción individual
  private handleHeaderFilterOptionClick(
    columnIndex: number,
    optionData: any
  ): void {
    const selectedValues =
      this._headerFilterSelections.get(columnIndex) || new Set<any>();
    const newSelection = new Set(selectedValues);

    // Toggle selección
    if (optionData.isParameter) {
      const existingParam = Array.from(newSelection).find(
        (val: any) =>
          typeof val === "object" &&
          val.operator === optionData.value.operator &&
          JSON.stringify(val) === JSON.stringify(optionData.value)
      );

      if (existingParam) {
        newSelection.delete(existingParam);
      } else {
        newSelection.add(optionData.value);
      }
    } else {
      if (newSelection.has(optionData.value)) {
        newSelection.delete(optionData.value);
      } else {
        newSelection.add(optionData.value);
      }
    }

    this._headerFilterSelections.set(columnIndex, newSelection);

    // ✅ Usar método centralizado
    this.applyHeaderFilters();

    this.reopenHeaderFilterMenu(columnIndex);
  }
  // Re-abrir el menú del Header Filter (mantener posición)
  private reopenHeaderFilterMenu(columnIndex: number): void {
    const icon = this.shadow.querySelector(
      `.header-filter-icon[data-header-filter-column="${columnIndex}"]`
    ) as HTMLElement;

    if (!icon) return;

    // ✅ GUARDAR SCROLL antes de cerrar
    const scrollTop = this._headerFilterMenu?.scrollTop || 0;

    const container = this.shadow.querySelector(
      ".gridie-container"
    ) as HTMLElement;
    if (!container) return;

    // Cerrar menú actual
    if (this._headerFilterMenu) {
      if (container.contains(this._headerFilterMenu)) {
        container.removeChild(this._headerFilterMenu);
      }
      this._headerFilterMenu = null;
    }

    // Volver a abrir (solo pasa columnIndex e icon)
    this._activeHeaderFilterDropdown = columnIndex;
    this.showHeaderFilterMenu(columnIndex, icon);

    // ✅ RESTAURAR SCROLL después de re-abrir
    setTimeout(() => {
      if (this._headerFilterMenu) {
        this._headerFilterMenu.scrollTop = scrollTop;
      }
    }, 0);
  }
  // Actualiza attachFilterEvents():...
  private attachFilterEvents(): void {
    // Dropdown triggers
    this.shadow
      .querySelectorAll(".filter-operator-trigger")
      .forEach((trigger) => {
        const columnIndex = parseInt(
          (trigger as HTMLElement).dataset.columnIndex!
        );
        trigger.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleOperatorDropdown(columnIndex);
        });
      });

    // Dropdown options
    this.shadow
      .querySelectorAll(".filter-operator-option")
      .forEach((option) => {
        const columnIndex = parseInt(
          (option as HTMLElement).dataset.columnIndex!
        );
        const operator = (option as HTMLElement).dataset
          .operator as FilterOperator;

        option.addEventListener("click", (e) => {
          e.stopPropagation();
          this.handleOperatorSelect(columnIndex, operator);
        });
      });

    // Input change (text, number, date)
    this.shadow.querySelectorAll("input.filter-input").forEach((input) => {
      const columnIndex = parseInt((input as HTMLElement).dataset.columnIndex!);
      const isSecond = (input as HTMLElement).dataset.isSecond === "true";

      input.addEventListener("input", () => {
        this.handleFilterChange(columnIndex, isSecond);
      });
    });

    // Select change (boolean)
    this.shadow.querySelectorAll("select.filter-select").forEach((select) => {
      const columnIndex = parseInt(
        (select as HTMLElement).dataset.columnIndex!
      );
      const isSecond = (select as HTMLElement).dataset.isSecond === "true";

      select.addEventListener("change", () => {
        this.handleFilterChange(columnIndex, isSecond);
      });
    });

    // Clear buttons
    this.shadow.querySelectorAll("span.filter-clear").forEach((clearBtn) => {
      const columnIndex = parseInt(
        (clearBtn as HTMLElement).dataset.columnIndex!
      );
      const isSecond = (clearBtn as HTMLElement).dataset.isSecond === "true";

      clearBtn.addEventListener("click", () => {
        this.handleFilterClear(columnIndex, isSecond);
      });
    });
  }

  private getSortIndicator(columnIndex: number): string {
    const sortState = this._sortingManager.getColumnSort(columnIndex);
    if (!sortState) return "";

    const arrow = sortState.direction === "asc" ? "▲" : "▼";
    const order =
      this._sortingManager.getAllSorts().length > 1
        ? ` ${sortState.order}`
        : "";

    return `<span class="sort-indicator">${arrow}${order}</span>`;
  }

  // ============= FILTER ROW METHODS =============

  private hasFilterRow(): boolean {
    return this.headers.some(
      (header) => header.filters?.filterRow?.visible === true
    );
  }

  private getDefaultOperators(type: string): FilterOperator[] {
    switch (type) {
      case "string":
        return [
          "contains",
          "notcontains",
          "startswith",
          "endswith",
          "equals",
          "notequal",
        ];
      case "number":
      case "date":
        return ["=", "<>", "<", ">", "<=", ">=", "between"];
      case "boolean":
        return ["=", "<>"];
      default:
        return [
          "contains",
          "notcontains",
          "startswith",
          "endswith",
          "equals",
          "notequal",
        ];
    }
  }

  private getOperatorsForColumn(header: GridieHeaderConfig): FilterOperator[] {
    if (header.filters?.filterRow?.operators) {
      return [...header.filters.filterRow.operators]; // ← Crea una copia
    }
    return this.getDefaultOperators(header.type || "string");
  }
  private renderFilterRow(): string {
    if (!this.hasFilterRow()) return "";

    const headers = this.headers;

    return `
    <tr class="filter-row">
      ${headers
        .map((header, index) => {
          if (!header.filters?.filterRow?.visible) {
            return `<td></td>`;
          }

          const operators = this.getOperatorsForColumn(header);
          const currentFilter = this._filteringManager.getColumnFilter(index);
          const currentOperator = this.getCurrentOperator(index);
          const currentValue = currentFilter?.value || "";
          const currentValue2 = currentFilter?.value2 || "";

          // Layout especial para "between"
          if (currentOperator === "between") {
            return `
            <td>
              <div class="filter-cell">
                <div class="filter-cell-row">
                  ${this.renderOperatorDropdown(
                    index,
                    operators,
                    currentOperator
                  )}
                  <div class="filter-between-container">
                    <div class="filter-between-row">
                      <span class="filter-between-label">${
                        this._lang.filtering.placeholders.betweenFrom
                      }</span>
                      ${this.renderFilterInput(
                        header,
                        index,
                        currentOperator,
                        currentValue,
                        false
                      )}
                    </div>
                    <div class="filter-between-row">
                      <span class="filter-between-label">${
                        this._lang.filtering.placeholders.betweenTo
                      }</span>
                      ${this.renderFilterInput(
                        header,
                        index,
                        currentOperator,
                        currentValue2,
                        true
                      )}
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
                ${this.renderOperatorDropdown(
                  index,
                  operators,
                  currentOperator
                )}
                ${this.renderFilterInput(
                  header,
                  index,
                  currentOperator,
                  currentValue,
                  false
                )}
              </div>
            </div>
          </td>
        `;
        })
        .join("")}
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
      <div class="filter-operator-trigger ${
        isActive ? "active" : ""
      }" data-column-index="${columnIndex}">
        <span class="filter-operator-icon">${getFilterIcon(
          currentOperator
        )}</span>
      </div>
      <div class="filter-operator-menu ${
        isActive ? "active" : ""
      }" data-column-index="${columnIndex}">
        ${operators
          .map(
            (op) => `
          <div 
            class="filter-operator-option ${
              op === currentOperator ? "selected" : ""
            }" 
            data-operator="${op}"
            data-column-index="${columnIndex}"
          >
            <span class="filter-operator-icon">${getFilterIcon(op)}</span>
            <span class="filter-operator-text">${
              this._lang.filtering.operators[op]
            }</span>
          </div>
        `
          )
          .join("")}
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
    const inputId = `filter-input-${columnIndex}${isSecondInput ? "-2" : ""}`;
    const hasValue = value !== null && value !== undefined && value !== "";

    if (header.type === "boolean") {
      return `
      <div class="filter-input-wrapper">
        <select 
          class="filter-select" 
          data-column-index="${columnIndex}"
          data-is-second="${isSecondInput}"
        >
          <option value="">${this._lang.filtering.placeholders.boolean}</option>
          <option value="true" ${
            value === true || value === "true" ? "selected" : ""
          }>
            ${this._lang.filtering.booleanOptions.true}
          </option>
          <option value="false" ${
            value === false || value === "false" ? "selected" : ""
          }>
            ${this._lang.filtering.booleanOptions.false}
          </option>
        </select>
        <span 
          class="filter-clear ${hasValue ? "visible" : ""}" 
          data-column-index="${columnIndex}"
          data-is-second="${isSecondInput}"
        >✕</span>
      </div>
    `;
    }

    let inputType = "text";
    let placeholder: string = this._lang.filtering.placeholders.string;
    let inputMode = "";

    switch (header.type) {
      case "number":
        inputType = "text"; // Cambiado de 'number' a 'text'
        inputMode = 'inputmode="decimal"'; // Sugerencia para teclado móvil
        placeholder = this._lang.filtering.placeholders.number;
        break;
      case "date":
        inputType = "date";
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
        value="${value || ""}"
        data-column-index="${columnIndex}"
        data-is-second="${isSecondInput}"
        autocomplete="off"

      />
      <span 
        class="filter-clear ${hasValue ? "visible" : ""}" 
        data-column-index="${columnIndex}"
        data-is-second="${isSecondInput}"
      >✕</span>
    </div>
  `;
  }

  private handleFilterChange(
    columnIndex: number,
    isSecondInput: boolean = false
  ): void {
    const header = this.headers[columnIndex];

    const operator = this.getCurrentOperator(columnIndex);

    let input: HTMLInputElement | HTMLSelectElement | null;

    if (header.type === "boolean") {
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

    if (operator === "between") {
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
          this._filteringManager.addFilter(
            columnIndex,
            operator,
            value1,
            value2
          );
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
    const container = this.shadow.querySelector(
      ".gridie-container"
    ) as HTMLElement;
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
        const selector = previousInput.classList.contains("filter-select")
          ? `select.filter-select[data-column-index="${columnIndex}"][data-is-second="${isSecond}"]`
          : `input.filter-input[data-column-index="${columnIndex}"][data-is-second="${isSecond}"]`;

        const newInput = this.shadow.querySelector(selector) as
          | HTMLInputElement
          | HTMLSelectElement;
        if (newInput) {
          newInput.focus();

          // Restaurar posición del cursor en inputs de texto
          if (
            newInput instanceof HTMLInputElement &&
            newInput.type === "text"
          ) {
            const cursorPos = newInput.value.length;
            newInput.setSelectionRange(cursorPos, cursorPos);
          }
        }
      }
    }, 0);
  }

  private handleFilterClear(
    columnIndex: number,
    isSecondInput: boolean = false
  ): void {
    const header = this.headers[columnIndex];

    // Guardar posición de scroll antes de limpiar
    const container = this.shadow.querySelector(
      ".gridie-container"
    ) as HTMLElement;
    const scrollLeft = container?.scrollLeft || 0;
    const scrollTop = container?.scrollTop || 0;

    if (header.type === "boolean") {
      const select = this.shadow.querySelector(
        `select.filter-select[data-column-index="${columnIndex}"][data-is-second="${isSecondInput}"]`
      ) as HTMLSelectElement;
      if (select) select.value = "";
    } else {
      const input = this.shadow.querySelector(
        `input.filter-input[data-column-index="${columnIndex}"][data-is-second="${isSecondInput}"]`
      ) as HTMLInputElement;
      if (input) input.value = "";
    }

    this.handleFilterChange(columnIndex, isSecondInput);

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
      


      .gridie-context-menu {
        position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 180px;
        z-index: 1000;
        font-family: Arial, sans-serif;
        padding: 4px 0;
      }

      .context-menu-item {
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
        user-select: none;
      }

      .context-menu-item:hover {
        background: #f0f0f0;
      }

      .context-menu-divider {
        height: 1px;
        background: #e0e0e0;
        margin: 4px 0;
      }




      /* Estilos para dropdown de operadores */
      .filter-operator-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        max-height: 250px;
        overflow-y: auto;
        z-index: 1000;
        font-family: Arial, sans-serif;
        display: none;
        margin-top: 2px;
      }

      .filter-operator-menu.active {
        display: block;
      }

      .filter-operator-option {
        padding: 8px 12px;
        cursor: pointer;
        font-size: 0.85em;
        transition: background 0.2s;
        user-select: none;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .filter-operator-option:hover {
        background: #f0f0f0;
      }

      .filter-operator-option.selected {
        background: #e8edff;
        color: #667eea;
      }

      .filter-operator-option .filter-operator-icon {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: inherit;
      }

      .filter-operator-option .filter-operator-text {
        flex: 1;
      }

      /* ✅ ESTILOS COMPLETOS DEL HEADER FILTER */
      .header-filter-menu {
        position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        max-height: 300px;
        min-width: 200px;
        overflow-y: auto;
        z-index: 1000;
        padding: 4px 0;
        font-family: Arial, sans-serif;
      }

      .header-filter-search {
        padding: 8px;
        border-bottom: 1px solid #eee;
      }

      .header-filter-search input {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
      }

      .header-filter-search input:focus {
        outline: none;
        border-color: #667eea;
      }

      .header-filter-select-all {
        font-weight: 600;
        border-bottom: 1px solid #eee;
        margin-bottom: 4px;
      }

      .header-filter-option {
        padding: 6px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        user-select: none;
        font-size: 14px;
      }

      .header-filter-option:hover {
        background-color: #f5f5f5;
      }

      .header-filter-option input[type="checkbox"] {
        cursor: pointer;
        margin: 0;
      }

      .header-filter-option span {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ✅ Estilos para opciones parent (expandibles) */
      .header-filter-option-parent {
        padding: 6px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        user-select: none;
        font-weight: 500;
        color: #333;
        font-size: 14px;
      }

      .header-filter-option-parent:hover {
        background-color: #f0f0f0;
      }

      .header-filter-expand-icon {
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .header-filter-expand-icon svg {
        width: 100%;
        height: 100%;
      }

      .header-filter-separator {
        height: 1px;
        background-color: #eee;
        margin: 4px 0;
      }

      .header-filter-option-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .header-filter-option-count {
        color: #999;
        font-size: 0.9em;
        flex-shrink: 0;
      }

      /* Icono del header filter */
      .header-filter-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        cursor: pointer;
        color: #999;
        transition: color 0.2s;
      }

      .header-filter-icon:hover {
        color: #667eea;
      }

      .header-filter-icon.active {
        color: #667eea;
      }

      .header-filter-icon svg {
        width: 100%;
        height: 100%;
      }
    </style>

    <div class="gridie-container" data-gridie-id="${gridieId}">
      ${gridieId ? `<div class="gridie-id">ID: ${gridieId}</div>` : ""}
      <table class="gridie-table">
        <thead>
          <tr>
            ${headers
              .map(
                (header, index) => `
              <th 
                class="${header.sortable ? "sortable" : ""}" 
                data-column-index="${index}"
              >
                ${this.renderHeaderFilterIcon(index, header)}
                ${header.label}
                ${this.getSortIndicator(index)}
              </th>
            `
              )
              .join("")}
          </tr>
          ${this.renderFilterRow()}
        </thead>
        <tbody>
          ${
            body.length > 0
              ? body
                  .map(
                    (row, rowIndex) => `
                <tr data-index="${rowIndex}">
                  ${headers
                    .map(
                      (header, colIndex) =>
                        `<td>${this.renderCell(
                          row,
                          header,
                          colIndex,
                          rowIndex
                        )}</td>`
                    )
                    .join("")}
                </tr>
              `
                  )
                  .join("")
              : `<tr><td colspan="${headers.length}" class="no-data">${this._lang.table.noData}</td></tr>`
          }
        </tbody>
      </table>
    </div>
  `;

    this.attachActionEvents();
    this.attachHeaderEvents();
    this.attachFilterEvents();
    this.attachHeaderFilterEvents();
  }

  // Renderizar icono del Header Filter
  private renderHeaderFilterIcon(
    columnIndex: number,
    header: GridieHeaderConfig
  ): string {
    if (!header.filters?.headerFilter?.visible) return "";

    // ✅ Verificar si hay filtros activos en esta columna
    const hasActiveFilter =
      this._headerFilterSelections.has(columnIndex) &&
      this._headerFilterSelections.get(columnIndex)!.size > 0;

    const iconClass = hasActiveFilter
      ? "header-filter-icon active"
      : "header-filter-icon";
    const iconKey = hasActiveFilter ? "filter-active" : "filter-header";

    return `
    <span 
      class="${iconClass}" 
      data-header-filter-column="${columnIndex}"
      title="${hasActiveFilter ? "Filtros activos" : "Filtrar"}"
    >
      ${getFilterIcon(iconKey)}
      ${hasActiveFilter ? '<span class="header-filter-badge"></span>' : ""}
    </span>
  `;
  }
  // Adjuntar eventos a los iconos de Header Filter
  private attachHeaderFilterEvents(): void {
    // Remover listeners anteriores clonando nodos
    this.shadow.querySelectorAll(".header-filter-icon").forEach((icon) => {
      const clone = icon.cloneNode(true);
      icon.parentNode?.replaceChild(clone, icon);
    });

    // Agregar nuevos listeners
    this.shadow.querySelectorAll(".header-filter-icon").forEach((icon) => {
      const columnIndex = parseInt(
        (icon as HTMLElement).dataset.headerFilterColumn!
      );

      icon.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.toggleHeaderFilterDropdown(columnIndex);
      });
    });
  }

  // Toggle Header Filter dropdown
  private toggleHeaderFilterDropdown(columnIndex: number): void {
    if (this._activeHeaderFilterDropdown === columnIndex) {
      this.closeHeaderFilterDropdown();
    } else {
      this.openHeaderFilterDropdown(columnIndex);
    }
  }

  // Abrir Header Filter dropdown
  private openHeaderFilterDropdown(columnIndex: number): void {
    this.closeHeaderFilterDropdown();

    this._activeHeaderFilterDropdown = columnIndex;

    const icon = this.shadow.querySelector(
      `.header-filter-icon[data-header-filter-column="${columnIndex}"]`
    ) as HTMLElement;

    if (!icon) return;

    // ✅ Llamar a showHeaderFilterMenu solo con columnIndex e icon
    this.showHeaderFilterMenu(columnIndex, icon);
  }

  // Cerrar Header Filter dropdown
  private closeHeaderFilterDropdown(): void {
    if (this._activeHeaderFilterDropdown === null) return;

    if (this._headerFilterMenu) {
      //  Remover del shadow DOM en lugar de document.body
      const container = this.shadow.querySelector(
        ".gridie-container"
      ) as HTMLElement;
      if (container && container.contains(this._headerFilterMenu)) {
        container.removeChild(this._headerFilterMenu);
      }
      this._headerFilterMenu = null;
    }

    this._activeHeaderFilterDropdown = null;
  }

  private attachHeaderEvents(): void {
    this.shadow.querySelectorAll("th[data-column-index]").forEach((th) => {
      const columnIndex = parseInt((th as HTMLElement).dataset.columnIndex!);

      th.addEventListener("click", () => {
        this.handleHeaderClick(columnIndex);
      });

      th.addEventListener("contextmenu", (e) => {
        this.handleHeaderRightClick(e as MouseEvent, columnIndex);
      });
    });
  }

  private attachActionEvents(): void {
    this._eventHandlers.forEach((action, actionId) => {
      const element = this.shadow.querySelector(
        `[data-action-id="${actionId}"]`
      );

      if (element) {
        const parts = actionId.split("-");
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
