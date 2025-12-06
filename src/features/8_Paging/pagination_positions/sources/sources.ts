export const typescriptCode = `import { Gridie } from "./gridie/gridie";

const data = [
  { id: 1, name: "Alice", department: "IT", salary: 75000 },
  { id: 2, name: "Bob", department: "HR", salary: 65000 },
  // ... más datos
];

// ========== Position: TOP ==========
const gridieTop = new Gridie({
  id: "pagination-top",
  headers: [
    { label: "ID", type: "number" },
    { label: "Name", type: "string" },
    { label: "Department", type: "string" },
    { label: "Salary", type: "number" },
  ],
  body: data,
  paging: {
    enabled: true,
    position: "top", // ← Footer arriba de la tabla
    pageSize: {
      default: 10,
      options: [10, 25, 50],
    },
  },
});

document.getElementById("table-top")?.appendChild(gridieTop);

// ========== Position: BOTTOM (default) ==========
const gridieBottom = new Gridie({
  id: "pagination-bottom",
  headers: [
    { label: "ID", type: "number" },
    { label: "Name", type: "string" },
    { label: "Department", type: "string" },
    { label: "Salary", type: "number" },
  ],
  body: data,
  paging: {
    enabled: true,
    position: "bottom", // ← Footer abajo de la tabla
    pageSize: {
      default: 10,
      options: [10, 25, 50],
    },
  },
});

document.getElementById("table-bottom")?.appendChild(gridieBottom);

// ========== Position: BOTH ==========
const gridieBoth = new Gridie({
  id: "pagination-both",
  headers: [
    { label: "ID", type: "number" },
    { label: "Name", type: "string" },
    { label: "Department", type: "string" },
    { label: "Salary", type: "number" },
  ],
  body: data,
  paging: {
    enabled: true,
    position: "both", // ← Footer arriba Y abajo
    pageSize: {
      default: 10,
      options: [10, 25, 50],
    },
  },
});

document.getElementById("table-both")?.appendChild(gridieBoth);`;

export const javascriptCode = `const data = [
  { id: 1, name: "Alice", department: "IT", salary: 75000 },
  { id: 2, name: "Bob", department: "HR", salary: 65000 },
  // ... más datos
];

// Position: TOP
const gridieTop = new Gridie({
  id: "pagination-top",
  headers: [
    { label: "ID", type: "number" },
    { label: "Name", type: "string" },
    { label: "Department", type: "string" },
    { label: "Salary", type: "number" },
  ],
  body: data,
  paging: {
    enabled: true,
    position: "top",
    pageSize: {
      default: 10,
      options: [10, 25, 50],
    },
  },
});

// Position: BOTTOM (default)
const gridieBottom = new Gridie({
  id: "pagination-bottom",
  headers: [...],
  body: data,
  paging: {
    enabled: true,
    position: "bottom",
  },
});

// Position: BOTH
const gridieBoth = new Gridie({
  id: "pagination-both",
  headers: [...],
  body: data,
  paging: {
    enabled: true,
    position: "both",
  },
});`;

export const htmlCode = `<div id="table-top"></div>
<div id="table-bottom"></div>
<div id="table-both"></div>

<script type="module">
  import { Gridie } from './gridie.js';
  
  const data = [...];
  
  const gridieTop = new Gridie({
    id: "pagination-top",
    headers: [...],
    body: data,
    paging: {
      enabled: true,
      position: "top"
    }
  });
  
  document.getElementById("table-top").appendChild(gridieTop);
</script>`;