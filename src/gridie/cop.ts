
// Reemplaza estos métodos:

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

// ✅ FIX: Corregir handleOperatorChange
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
  const oldOperator = currentFilter?.operator;
  
  // Detectar si cambió entre "between" y otro operador
  const wasBetween = oldOperator === 'between';
  const isNowBetween = newOperator === 'between';
  
  // Si cambió el tipo de layout (between vs no-between), re-renderizar
  if (wasBetween !== isNowBetween) {
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
  }
  
  // Siempre aplicar el filtro con el nuevo operador
  this.handleFilterChange(columnIndex, false);
}

private handleFilterChange(columnIndex: number, isSecondInput: boolean = false): void {
  const header = this.headers[columnIndex];
  const operatorSelect = this.shadow.querySelector(
    `select.filter-operator[data-column-index="${columnIndex}"]`
  ) as HTMLSelectElement;
  
  if (!operatorSelect) return;
  
  const operator = operatorSelect.value as FilterOperator;

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
  
  // ✅ Restaurar foco y posición de scroll
  this.restoreFocusAndScroll(input);
}