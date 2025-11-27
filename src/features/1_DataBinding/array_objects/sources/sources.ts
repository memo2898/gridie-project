// src/features/1_DataBinding/array_objects/sources/sources.ts
export const tsCode = `import { Gridie } from './gridie';

// Configuración con array de objetos
const config = {
  id: "tabla-usuarios",
  headers: [
    {
      field: "id",
      label: "ID",
      type: "number",
      sortable: true,
    },
    "nombre", // Header simple
    {
      field: "email",
      label: "Correo Electrónico",
      sortable: true,
      filterable: true,
    },
    {
      field: "activo",
      label: "Estado",
      type: "boolean",
    },
    {
      field: "edad",
      label: "Edad",
      type: "number",
    },
  ],
  body: [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", activo: true, edad: 30 },
    { id: 2, nombre: "María García", email: "maria@example.com", activo: false, edad: 25 },
    { id: 3, nombre: "Carlos López", email: "carlos@example.com", activo: true, edad: 35 },
  ],
};

// Crear instancia de Gridie
const gridie = new Gridie(config);
document.body.appendChild(gridie);

// Agregar nueva fila
gridie.addRow({
  id: 4,
  nombre: "Ana Martínez",
  email: "ana@example.com",
  activo: true,
  edad: 28,
});`;

export const jsCode = `// Configuración con array de objetos
const config = {
  id: "tabla-usuarios",
  headers: [
    {
      field: "id",
      label: "ID",
      type: "number",
      sortable: true,
    },
    "nombre",
    {
      field: "email",
      label: "Correo Electrónico",
      sortable: true,
      filterable: true,
    },
    {
      field: "activo",
      label: "Estado",
      type: "boolean",
    },
    {
      field: "edad",
      label: "Edad",
      type: "number",
    },
  ],
  body: [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", activo: true, edad: 30 },
    { id: 2, nombre: "María García", email: "maria@example.com", activo: false, edad: 25 },
    { id: 3, nombre: "Carlos López", email: "carlos@example.com", activo: true, edad: 35 },
  ],
};

// Crear instancia
const gridie = new Gridie(config);
document.body.appendChild(gridie);`;

export const htmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gridie - Array de Objetos</title>
  <script src="gridie.js"></script>
</head>
<body>
  <h1>Gridie con Array de Objetos</h1>
  
  <gridie-table id="mi-tabla"></gridie-table>

  <script>
    const gridie = document.getElementById('mi-tabla');
    
    gridie.setConfig({
      id: "tabla-usuarios",
      headers: [
        { field: "id", label: "ID", type: "number" },
        "nombre",
        { field: "email", label: "Correo Electrónico" },
        { field: "activo", label: "Estado", type: "boolean" },
        { field: "edad", label: "Edad", type: "number" },
      ],
      body: [
        { id: 1, nombre: "Juan Pérez", email: "juan@example.com", activo: true, edad: 30 },
        { id: 2, nombre: "María García", email: "maria@example.com", activo: false, edad: 25 },
      ],
    });
  </script>
</body>
</html>`;