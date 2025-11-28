// src/gridie/styles/index.ts

export const gridieStyles = `
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

.filter-operator {
  min-width: 110px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.85em;
  transition: border-color 0.2s;
  flex-shrink: 0;
}

.filter-operator:hover {
  border-color: #667eea;
}

.filter-operator:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filter-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-input,
.filter-select {
  flex: 1;
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

/* ✅ AJUSTADO: Estilos para between */
.filter-between-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
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