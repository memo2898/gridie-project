// src/gridie/gridie.ts

import { SortingManager } from './sortingFunctions';
import type { SortDirection } from './sortingFunctions';
import { getLanguage } from './lang';
import type { Language, LanguageStrings } from './lang';
import { gridieStyles, contextMenuStyles } from './styles';

export interface GridieHeaderConfig {
  label?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'boolean';
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
  private _config: Partial<GridieConfig> = {};
  private _eventHandlers: Map<string, GridieCellAction> = new Map();
  private _sortingManager: SortingManager = new SortingManager();
  private _language: Language = 'es';
  private _lang: LanguageStrings;
  private _contextMenu: HTMLDivElement | null = null;
  private _globalStyleId = 'gridie-global-styles';

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
    this._language = config.language || 'es';
    this._lang = getLanguage(this._language);
    this._config = {
      enableSort: config.enableSort ?? true,
      enableFilter: config.enableFilter ?? false,
      enablePagination: config.enablePagination ?? false,
      language: this._language,
    };
    this._sortingManager.clearAll();
    this.render();
  }

  setData(config: { headers: (string | GridieHeaderConfig)[], data: any[] }) {
    this._headers = config.headers;
    this._body = config.data;
    this._originalBody = [...config.data];
    this._sortingManager.clearAll();
    this.render();
  }

  addRow(row: any) {
    this._originalBody.push(row);
    this.applySorting();
  }

  removeRow(index: number) {
    const originalIndex = this._originalBody.findIndex(r => r === this._body[index]);
    if (originalIndex !== -1) {
      this._originalBody.splice(originalIndex, 1);
    }
    this.applySorting();
  }

  updateRow(index: number, row: any) {
    if (index >= 0 && index < this._body.length) {
      const originalIndex = this._originalBody.findIndex(r => r === this._body[index]);
      if (originalIndex !== -1) {
        this._originalBody[originalIndex] = { ...this._originalBody[originalIndex], ...row };
      }
      this.applySorting();
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
      };
    }
    return {
      label: header.label || `Column ${position + 1}`,
      sortable: header.sortable ?? (this._config.enableSort ?? true),
      filterable: header.filterable ?? false,
      type: header.type,
      width: header.width,
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
        return value ? 'Sí' : 'No';
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
    this.applySorting();
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

  private handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (this._contextMenu && !this._contextMenu.contains(target)) {
      this.hideContextMenu();
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
    this.applySorting();
  }

  private applySorting(): void {
    this._body = this._sortingManager.applySorts(this._originalBody, this.headers);
    this.render();
  }

  private getSortIndicator(columnIndex: number): string {
    const sortState = this._sortingManager.getColumnSort(columnIndex);
    if (!sortState) return '';

    const arrow = sortState.direction === 'asc' ? '▲' : '▼';
    const order = this._sortingManager.getAllSorts().length > 1 ? ` ${sortState.order}` : '';
    
    return `<span class="sort-indicator">${arrow}${order}</span>`;
  }

  render() {
    const headers = this.headers;
    const body = this.body;
    const gridieId = this.gridieId;

    this._eventHandlers.clear();

    this.shadow.innerHTML = `
      <style>
        ${gridieStyles}
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