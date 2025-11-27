// src/gridie/gridie.ts

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
}

export class Gridie extends HTMLElement {
  private shadow: ShadowRoot;
  private _id: string = '';
  private _headers: (string | GridieHeaderConfig)[] = [];
  private _body: any[] = [];
  private _config: Partial<GridieConfig> = {};
  private _eventHandlers: Map<string, GridieCellAction> = new Map();

  constructor(config?: GridieConfig) {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    
    if (config) {
      this._id = config.id;
      this._headers = config.headers;
      this._body = config.body;
      this._config = {
        enableSort: config.enableSort ?? false,
        enableFilter: config.enableFilter ?? false,
        enablePagination: config.enablePagination ?? false,
      };
    }
  }

  static get observedAttributes() {
    return ["id", "headers", "body", "config"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  setConfig(config: GridieConfig) {
    this._id = config.id;
    this._headers = config.headers;
    this._body = config.body;
    this._config = {
      enableSort: config.enableSort ?? false,
      enableFilter: config.enableFilter ?? false,
      enablePagination: config.enablePagination ?? false,
    };
    this.render();
  }

  setData(config: { headers: (string | GridieHeaderConfig)[], data: any[] }) {
    this._headers = config.headers;
    this._body = config.data;
    this.render();
  }

  addRow(row: any) {
    this._body.push(row);
    this.render();
  }

  removeRow(index: number) {
    this._body.splice(index, 1);
    this.render();
  }

  updateRow(index: number, row: any) {
    if (index >= 0 && index < this._body.length) {
      this._body[index] = { ...this._body[index], ...row };
      this.render();
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
    if (this._body.length > 0) return this._body;
    
    try {
      const bodyAttr = this.getAttribute("body");
      return bodyAttr ? JSON.parse(bodyAttr) : [];
    } catch {
      return [];
    }
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
        sortable: false,
        filterable: false,
      };
    }
    return {
      label: header.label || `Column ${position + 1}`,
      sortable: header.sortable ?? false,
      filterable: header.filterable ?? false,
      type: header.type,
      width: header.width,
    };
  }

  // Obtener el valor de una celda por POSICIÓN
  private getCellValueByPosition(row: any, position: number): any {
    // Si el row es un array, acceder directamente por índice
    if (Array.isArray(row)) {
      return row[position];
    }
    
    // Si el row es un objeto, obtener el valor por posición de las keys
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
    // Obtener el valor por POSICIÓN, no por nombre de field
    const cellValue = this.getCellValueByPosition(row, position);
    
    // Si es una celda con acciones
    if (this.isActionCell(cellValue)) {
      return cellValue.map((action, actionIndex) => {
        const actionId = `action-${rowIndex}-${position}-${actionIndex}`;
        
        // Guardar el handler para usarlo después
        this._eventHandlers.set(actionId, action);
        
        return `<span data-action-id="${actionId}">${action.content}</span>`;
      }).join(' ');
    }
    
    // Formatear el valor según el tipo
    return this.formatCellValue(cellValue, header.type);
  }

  render() {
    const headers = this.headers;
    const body = this.body;
    const gridieId = this.gridieId;

    // Limpiar handlers anteriores
    this._eventHandlers.clear();

    this.shadow.innerHTML = `
      <style>
        .gridie-container {
          width: 100%;
          overflow-x: auto;
          font-family: Arial, sans-serif;
        }

        .gridie-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .gridie-table thead {
         border-bottom: 1px solid #e0e0e0;
        }

        .gridie-table th {
          padding: 15px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85em;
          letter-spacing: 0.5px;
        }

        .gridie-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .gridie-table tbody tr:hover {
          background: #f5f5f5;
          transition: background 0.2s;
        }

        .gridie-table tbody tr:last-child td {
          border-bottom: none;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #999;
          font-style: italic;
        }

        .gridie-id {
          font-size: 0.75em;
          color: #999;
          margin-bottom: 8px;
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 4px;
          display: inline-block;
        }
      </style>

      <div class="gridie-container" data-gridie-id="${gridieId}">
        ${gridieId ? `<div class="gridie-id">ID: ${gridieId}</div>` : ''}
        <table class="gridie-table">
          <thead>
            <tr>
              ${headers.map(header => `<th>${header.label}</th>`).join('')}
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
              : `<tr><td colspan="${headers.length}" class="no-data">No hay datos disponibles</td></tr>`
            }
          </tbody>
        </table>
      </div>
    `;

    this.attachActionEvents();
  }

  private attachActionEvents() {
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