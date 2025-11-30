// src/gridie/styles/index.ts

export const gridieStyles = `
.gridie-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  font-family: Arial, sans-serif;
  position: relative; 
}

.gridie-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: visible;
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
  user-select: none;
  position: relative;
}

.gridie-table th.sortable {
  cursor: pointer;
}

.gridie-table th.sortable:hover {
  background: #f0f0f0;
}

.sort-indicator {
  margin-left: 8px;
  color: #667eea;
  font-size: 0.9em;
  font-weight: bold;
}

/* ✅ NUEVO: Header Filter Icon */
.header-filter-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 8px; /* ✅ Cambio: de margin-left a margin-right */
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
  vertical-align: middle;
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
`;

export const contextMenuStyles = `
.gridie-context-menu {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 200px;
  font-family: Arial, sans-serif;
  z-index: 10000;
}

.gridie-context-menu .context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
  user-select: none;
}

.gridie-context-menu .context-menu-item:hover {
  background: #f0f0f0;
}

.gridie-context-menu .context-menu-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 4px 0;
}




`;

export const filterRowStyles = `
.filter-row {
  background: #f9fafb;
  border-bottom: 2px solid #e0e0e0;
}

.filter-row td {
  padding: 8px 12px;
  vertical-align: top;
}

.filter-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.filter-cell-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

/* ✅ IMPORTANTE: position relative para que el dropdown se posicione correctamente */
.filter-operator-dropdown {
  position: relative;
  flex-shrink: 0;
}

.filter-operator-trigger {
  width: 36px;
  height: 32px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.filter-operator-trigger:hover {
  border-color: #667eea;
}

.filter-operator-trigger.active {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filter-operator-trigger .filter-operator-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.filter-operator-trigger.active .filter-operator-icon {
  color: #667eea;
}

.filter-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.filter-input,
.filter-select {
  flex: 1;
  min-width: 0;
  padding: 6px 28px 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85em;
  transition: border-color 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filter-input::placeholder {
  color: #999;
}

.filter-clear {
  position: absolute;
  right: 8px;
  cursor: pointer;
  color: #999;
  font-size: 1em;
  padding: 2px 4px;
  border-radius: 3px;
  transition: all 0.2s;
  user-select: none;
  display: none;
}

.filter-input-wrapper:hover .filter-clear,
.filter-clear.visible {
  display: block;
}

.filter-clear:hover {
  color: #666;
  background: #f0f0f0;
}

.filter-between-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.filter-between-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.filter-between-label {
  min-width: 60px;
  font-size: 0.8em;
  color: #666;
  text-align: right;
  flex-shrink: 0;
}
`;

//  Estilos para Header Filter
export const headerFilterStyles = `

.gridie-header-filter-menu {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  max-width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 10000;
  font-family: Arial, sans-serif;
  padding: 8px 0;
}

/* Campo de búsqueda interno */
.header-filter-search {
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 4px;
}

.header-filter-search input {
  width: 100%;
  padding: 6px 8px 6px 28px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85em;
  outline: none;
  transition: border-color 0.2s;
}

.header-filter-search input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.header-filter-search-icon {
  position: absolute;
  left: 20px;
  top: 14px;
  width: 14px;
  height: 14px;
  color: #999;
  pointer-events: none;
}

/* Opción "Seleccionar todos" */
.header-filter-select-all {
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.85em;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 4px;
  transition: background 0.2s;
}

.header-filter-select-all:hover {
  background: #f0f0f0;
}

/* Lista de opciones */
.header-filter-options {
  max-height: 300px;
  overflow-y: auto;
}

/* Opción individual */
.header-filter-option {
  padding: 6px 12px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85em;
  transition: background 0.2s;
}

.header-filter-option:hover {
  background: #f0f0f0;
}

.header-filter-option.selected {
  background: #e8edff;
}

/* Checkbox */
.header-filter-checkbox {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
}

/* Texto de la opción */
.header-filter-option-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Count */
.header-filter-option-count {
  color: #999;
  font-size: 0.8em;
  flex-shrink: 0;
}

/* Mensaje "Sin resultados" */
.header-filter-no-results {
  padding: 16px 12px;
  text-align: center;
  color: #999;
  font-size: 0.85em;
}

/* ===== JERARQUÍA (para fechas) ===== */

/* Opción con hijos (expandible) */
.header-filter-option-parent {
  padding: 6px 12px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85em;
  transition: background 0.2s;
}

.header-filter-option-parent:hover {
  background: #f0f0f0;
}

/* Icono expand/collapse */
.header-filter-expand-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #666;
  transition: transform 0.2s;
}

.header-filter-expand-icon.collapsed {
  transform: rotate(0deg);
}

.header-filter-expand-icon.expanded {
  transform: rotate(90deg);
}

/* Hijos (indentados) */
.header-filter-children {
  padding-left: 24px;
}

.header-filter-children.collapsed {
  display: none;
}

.header-filter-children.expanded {
  display: block;
}
`;