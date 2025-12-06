export const typescriptCode = `import { Gridie } from "./gridie/gridie";

const data = [...]; // 200 items

// ========== Jump To: INLINE (default) ==========
const gridieInline = new Gridie({
  id: "pagination-inline",
  headers: [
    { label: "ID", type: "number" },
    { label: "Name", type: "string" },
    { label: "Department", type: "string" },
  ],
  body: data,
  paging: {
    enabled: true,
    pageSize: { default: 10, options: [10, 25, 50, 100] },
    navigation: {
      jumpTo: {
        visible: true,
        position: "inline", // ← En la misma línea
        buttonText: "→",
      },
    },
  },
});

document.getElementById("table-inline")?.appendChild(gridieInline);

// ========== Jump To: BELOW ==========
const gridieBelow = new Gridie({
  id: "pagination-below",
  headers: [...],
  body: data,
  paging: {
    enabled: true,
    navigation: {
      jumpTo: {
        visible: true,
        position: "below", // ← Línea separada debajo
        buttonText: "Go",
      },
    },
  },
});

document.getElementById("table-below")?.appendChild(gridieBelow);

// ========== Jump To: DISABLED ==========
const gridieDisabled = new Gridie({
  id: "pagination-disabled",
  headers: [...],
  body: data,
  paging: {
    enabled: true,
    navigation: {
      jumpTo: {
        visible: false, // ← Sin control "Ir a"
      },
    },
  },
});

document.getElementById("table-disabled")?.appendChild(gridieDisabled);`;

export const javascriptCode = `const data = [...]; // 200 items

// Jump To: INLINE
const gridieInline = new Gridie({
  id: "pagination-inline",
  headers: [...],
  body: data,
  paging: {
    enabled: true,
    navigation: {
      jumpTo: {
        visible: true,
        position: "inline",
        buttonText: "→",
      },
    },
  },
});

// Jump To: BELOW
const gridieBelow = new Gridie({
  id: "pagination-below",
  headers: [...],
  body: data,
  paging: {
    enabled: true,
    navigation: {
      jumpTo: {
        visible: true,
        position: "below",
        buttonText: "Go",
      },
    },
  },
});

// Jump To: DISABLED
const gridieDisabled = new Gridie({
  id: "pagination-disabled",
  headers: [...],
  body: data,
  paging: {
    enabled: true,
    navigation: {
      jumpTo: {
        visible: false,
      },
    },
  },
});`;

export const htmlCode = `<div id="table-inline"></div>
<div id="table-below"></div>
<div id="table-disabled"></div>

<script type="module">
  import { Gridie } from './gridie.js';
  
  const data = [...];
  
  const gridieInline = new Gridie({
    id: "pagination-inline",
    headers: [...],
    body: data,
    paging: {
      enabled: true,
      navigation: {
        jumpTo: {
          visible: true,
          position: "inline"
        }
      }
    }
  });
  
  document.getElementById("table-inline").appendChild(gridieInline);
</script>`;