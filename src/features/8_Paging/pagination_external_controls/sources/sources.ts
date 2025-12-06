export const typescriptCode = `import { Gridie } from "./gridie/gridie";

const data = [...]; // 100 items

const gridie = new Gridie({
  id: "pagination-external",
  headers: [
    { label: "ID", type: "number" },
    { label: "Name", type: "string" },
    { label: "Department", type: "string" },
  ],
  body: data,
  paging: {
    enabled: true,
    pageSize: { default: 10, options: [10, 25, 50] },
  },
});

document.getElementById("table")?.appendChild(gridie);

// ========== MÉTODOS PÚBLICOS DISPONIBLES ==========

// Navegación
gridie.firstPage();           // Ir a primera página
gridie.previousPage();        // Página anterior
gridie.nextPage();            // Página siguiente
gridie.lastPage();            // Ir a última página
gridie.goToPage(5);           // Ir a página específica

// Cambiar tamaño de página
gridie.setPageSize(25);       // Cambiar a 25 items por página

// Obtener información
const currentPage = gridie.getCurrentPage();     // Página actual
const totalPages = gridie.getTotalPages();       // Total de páginas
const pageSize = gridie.getPageSize();           // Tamaño actual
const totalItems = gridie.getTotalItems();       // Total de items

// ========== EVENTOS ==========
gridie.addEventListener('pagechange', (e: CustomEvent) => {
  console.log('Cambió de página:', e.detail);
  // e.detail = { page, pageSize, totalPages, totalItems }
});

// ========== EJEMPLO: BOTONES EXTERNOS ==========
document.getElementById('btn-first')?.addEventListener('click', () => {
  gridie.firstPage();
});

document.getElementById('btn-next')?.addEventListener('click', () => {
  gridie.nextPage();
});

document.getElementById('btn-size-25')?.addEventListener('click', () => {
  gridie.setPageSize(25);
});`;

export const javascriptCode = `const data = [...];

const gridie = new Gridie({
  id: "pagination-external",
  headers: [...],
  body: data,
  paging: {
    enabled: true,
    pageSize: { default: 10 },
  },
});

// Métodos públicos
gridie.firstPage();
gridie.previousPage();
gridie.nextPage();
gridie.lastPage();
gridie.goToPage(5);
gridie.setPageSize(25);

// Obtener info
const page = gridie.getCurrentPage();
const total = gridie.getTotalPages();

// Eventos
gridie.addEventListener('pagechange', (e) => {
  console.log('Nueva página:', e.detail.page);
});

// Botones externos
document.getElementById('btn-first').addEventListener('click', () => {
  gridie.firstPage();
});`;

export const htmlCode = `<div id="table"></div>

<button id="btn-first">Primera</button>
<button id="btn-next">Siguiente</button>
<button id="btn-size-25">25 por página</button>

<script type="module">
  import { Gridie } from './gridie.js';
  
  const gridie = new Gridie({
    id: "pagination-external",
    headers: [...],
    body: [...],
    paging: { enabled: true }
  });
  
  document.getElementById('table').appendChild(gridie);
  
  // Control externo
  document.getElementById('btn-first').addEventListener('click', () => {
    gridie.firstPage();
  });
  
  gridie.addEventListener('pagechange', (e) => {
    console.log('Página:', e.detail.page);
  });
</script>`;