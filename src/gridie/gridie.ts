export class Gridie extends HTMLElement {
  private shadow: ShadowRoot;
  private _headers: string[] = [];
  private _data: any[] = [];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["headers", "data"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Método público para setear datos
  setData(config: { headers: string[], data: any[] }) {
    this._headers = config.headers;
    this._data = config.data;
    this.render();
  }

  // Método público para agregar fila
  addRow(row: any) {
    this._data.push(row);
    this.render();
  }

  // Método público para eliminar fila
  removeRow(index: number) {
    this._data.splice(index, 1);
    this.render();
  }

  get headers(): string[] {
    // Primero intentar usar datos internos
    if (this._headers.length > 0) return this._headers;
    
    // Si no, usar atributos
    try {
      const headersAttr = this.getAttribute("headers");
      return headersAttr ? JSON.parse(headersAttr) : [];
    } catch {
      return [];
    }
  }

  get data(): any[] {
    // Primero intentar usar datos internos
    if (this._data.length > 0) return this._data;
    
    // Si no, usar atributos
    try {
      const dataAttr = this.getAttribute("data");
      return dataAttr ? JSON.parse(dataAttr) : [];
    } catch {
      return [];
    }
  }

  render() {
    const headers = this.headers;
    const data = this.data;

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
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

        .btn-action {
          padding: 6px 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85em;
          margin-right: 5px;
        }

        .btn-action:hover {
          background: #5568d3;
        }

        .btn-danger {
          background: #e74c3c;
        }

        .btn-danger:hover {
          background: #c0392b;
        }
      </style>

      <div class="gridie-container">
        <table class="gridie-table">
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.length > 0 
              ? data.map((row, index) => `
                  <tr data-index="${index}">
                    ${Object.keys(row).map(key => `<td>${row[key]}</td>`).join('')}
                    <td>
                      <button class="btn-action btn-edit" data-index="${index}">Editar</button>
                      <button class="btn-action btn-danger btn-delete" data-index="${index}">Eliminar</button>
                    </td>
                  </tr>
                `).join('')
              : `<tr><td colspan="${headers.length}" class="no-data">No hay datos disponibles</td></tr>`
            }
          </tbody>
        </table>
      </div>
    `;

    this.addEventListeners();
  }

  private addEventListeners() {
    this.shadow.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = (e.target as HTMLElement).dataset.index;
        this.dispatchEvent(new CustomEvent('edit', {
          detail: { index: parseInt(index!), row: this.data[parseInt(index!)] },
          bubbles: true,
          composed: true
        }));
      });
    });

    this.shadow.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = (e.target as HTMLElement).dataset.index;
        const confirmed = confirm('¿Estás seguro?');
        if (confirmed) {
          this.removeRow(parseInt(index!));
          this.dispatchEvent(new CustomEvent('delete', {
            detail: { index: parseInt(index!) },
            bubbles: true,
            composed: true
          }));
        }
      });
    });
  }
}

customElements.define("gridie-table", Gridie);