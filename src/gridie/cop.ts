private handleOperatorSelect(columnIndex: number, newOperator: FilterOperator): void {
  this.closeOperatorDropdown();
  
  // Guardar scroll
  const container = this.shadow.querySelector('.gridie-container') as HTMLElement;
  const scrollLeft = container?.scrollLeft || 0;
  const scrollTop = container?.scrollTop || 0;
  
  // Obtener el filtro actual
  const currentFilter = this._filteringManager.getColumnFilter(columnIndex);
  const oldOperator = currentFilter?.operator || this.getOperatorsForColumn(this.headers[columnIndex])[0];
  
  // Si no cambió, no hacer nada
  if (oldOperator === newOperator) return;
  
  const wasBetween = oldOperator === 'between';
  const isNowBetween = newOperator === 'between';
  const currentValue = currentFilter?.value || '';
  const currentValue2 = currentFilter?.value2 || '';
  
  // ✅ Actualizar el operador en el manager
  if (isNowBetween) {
    // Cambió A "between" - inicializar con valores vacíos
    this._filteringManager.addFilter(columnIndex, newOperator, '', '');
  } else if (wasBetween) {
    // Cambió DESDE "between" - solo mantener primer valor si existe
    if (currentValue) {
      this._filteringManager.addFilter(columnIndex, newOperator, currentValue);
    } else {
      this._filteringManager.clearFilterValue(columnIndex);
    }
  } else {
    // Cambió entre operadores normales - mantener valor
    if (currentValue) {
      this._filteringManager.addFilter(columnIndex, newOperator, currentValue, currentValue2);
    } else {
      // ✅ IMPORTANTE: Aunque no hay valor, guardamos el operador para que se muestre
      // No lo agregamos al manager porque no hay nada que filtrar aún
    }
  }
  
  // ✅ CRÍTICO: SIEMPRE re-renderizar para actualizar el icono y layout
  this.renderFilterRowOnly();
  this.attachFilterEvents();
  
  // ✅ Solo aplicar filtros si hay valor Y cambió el layout o el operador afecta el filtro
  const shouldApplyFilters = currentValue && (wasBetween !== isNowBetween || !wasBetween);
  
  if (shouldApplyFilters) {
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