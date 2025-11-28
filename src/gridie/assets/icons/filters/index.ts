// src/gridie/assets/icons/filters/index.ts

// src/gridie/
// ├── assets/
// │   └── icons/
// │       └── filters/
// │           ├── contains.svg
// │           ├── notcontains.svg
// │           ├── startswith.svg
// │           ├── endswith.svg
// │           ├── equals.svg
// │           ├── notequal.svg

// │           ├── equal.svg
// │           ├── notequal-number.svg
// │           ├── lessthan.svg lista
// │           ├── greaterthan.svg


// │           ├── lessequal.svg
// │           ├── greaterequal.svg
// │           └── between.svg

export const filterIcons: Record<string, string> = {
  // String operators
  contains: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.6 15.96">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <path
        class="cls-1"
        d="M6.42,8.65V13.1H5.15v-1a2.74,2.74,0,0,1-2.42,1.06C1.06,13.19,0,12.29,0,11S.77,8.86,3,8.86H5.08V8.59c0-1.12-.65-1.78-2-1.78A3.76,3.76,0,0,0,.77,7.6l-.56-1a4.9,4.9,0,0,1,3.05-.94C5.27,5.66,6.42,6.63,6.42,8.65Zm-1.34,2.2v-1H3c-1.32,0-1.7.51-1.7,1.14s.61,1.2,1.63,1.2A2.14,2.14,0,0,0,5.08,10.85Z"
      />
      <path
        class="cls-1"
        d="M17.7,9.35A3.68,3.68,0,0,1,21.6,5.6a3.27,3.27,0,0,1,3,1.57l-1,.65a2.31,2.31,0,0,0-2-1.06,2.45,2.45,0,0,0-2.53,2.59A2.45,2.45,0,0,0,21.58,12a2.31,2.31,0,0,0,2-1.06l1,.64a3.28,3.28,0,0,1-3,1.58A3.7,3.7,0,0,1,17.7,9.35Z"
      />
      <path
        class="cls-1"
        d="M7.44,0V16H17V0Zm4.87,13.18a3.14,3.14,0,0,1-2.63-1.25V13.1H8.4V2.77H9.74V6.84a3.12,3.12,0,0,1,2.57-1.19A3.58,3.58,0,0,1,16,9.41,3.59,3.59,0,0,1,12.31,13.18Z"
      />
      <path
        class="cls-1"
        d="M12.2,6.82A2.43,2.43,0,0,0,9.73,9.41a2.48,2.48,0,1,0,5,0A2.43,2.43,0,0,0,12.2,6.82Z"
      />
    </g>
  </g>
</svg>
`,
  
  notcontains: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.71 15.96">
  <defs>
    <style>
      .cls-1 {
        fill: #010201;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <path
        class="cls-1"
        d="M0,0V7.71H5.13V7.56c0-1.13-.65-1.78-2-1.78a3.71,3.71,0,0,0-2.34.79l-.56-1a5,5,0,0,1,3.05-1c2,0,3.16,1,3.16,3v.09H9v-6h1.33V5.81a3.14,3.14,0,0,1,2.58-1.19,3.55,3.55,0,0,1,3.67,3.09h1.29a3.68,3.68,0,0,1,3.83-3.09,3.31,3.31,0,0,1,3,1.58l-1,.65a2.3,2.3,0,0,0-2-1.06,2.4,2.4,0,0,0-2.45,1.92h5.52V0Z"
      />
      <path
        class="cls-1"
        d="M12.75,5.79a2.37,2.37,0,0,0-2.4,1.92h4.81A2.38,2.38,0,0,0,12.75,5.79Z"
      />
      <path
        class="cls-1"
        d="M0,8.78V16H24.71V8.78H0Zm19.14,0a2.41,2.41,0,0,0,2.5,2.2,2.29,2.29,0,0,0,2-1.05l1,.64a3.31,3.31,0,0,1-3,1.58,3.68,3.68,0,0,1-3.86-3.37ZM9,8.78H10.3a2.46,2.46,0,0,0,4.9,0h1.35a3.55,3.55,0,0,1-3.69,3.37,3.12,3.12,0,0,1-2.63-1.25v1.17H9Zm-8.54,0H3.07c-1.32,0-1.69.52-1.69,1.15S2,11.12,3,11.12A2.13,2.13,0,0,0,5.13,9.81v-1H6.47v3.29H5.2v-1a2.72,2.72,0,0,1-2.42,1.06C1.11,12.15.05,11.26.05,10A2,2,0,0,1,.41,8.78Z"
      />
    </g>
  </g>
</svg>
`,
  
  startswith: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.66 15.96">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <path
        class="cls-1"
        d="M1.38,9.93c0,.73.61,1.19,1.62,1.19A2.13,2.13,0,0,0,5.13,9.81v-1H3.07C1.75,8.78,1.38,9.3,1.38,9.93Z"
      />
      <path
        class="cls-1"
        d="M12.75,5.79a2.43,2.43,0,0,0-2.48,2.59,2.49,2.49,0,1,0,5,0A2.43,2.43,0,0,0,12.75,5.79Z"
      />
      <path
        class="cls-1"
        d="M0,0V16H16.59V8.38a3.59,3.59,0,0,1-3.73,3.77,3.12,3.12,0,0,1-2.63-1.25v1.17H9V1.74h1.33V5.81a3.14,3.14,0,0,1,2.58-1.19,3.59,3.59,0,0,1,3.73,3.76V0ZM6.47,12.07H5.2v-1a2.72,2.72,0,0,1-2.42,1.06C1.11,12.15.05,11.26.05,10S.82,7.82,3,7.82H5.13V7.56c0-1.13-.65-1.78-2-1.78a3.71,3.71,0,0,0-2.34.79l-.56-1a5,5,0,0,1,3.05-1c2,0,3.16,1,3.16,3Z"
      />
      <path
        class="cls-1"
        d="M17.76,8.38a3.68,3.68,0,0,1,3.89-3.76,3.31,3.31,0,0,1,3,1.58l-1,.65a2.3,2.3,0,0,0-2-1.06,2.45,2.45,0,0,0-2.53,2.59A2.44,2.44,0,0,0,21.64,11a2.29,2.29,0,0,0,2-1.05l1,.64a3.31,3.31,0,0,1-3,1.58A3.69,3.69,0,0,1,17.76,8.38Z"
      />
    </g>
  </g>
</svg>
`,
  
  endswith: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.66 15.96">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <path
        class="cls-1"
        d="M6.42,7.62v4.45H5.15v-1a2.74,2.74,0,0,1-2.42,1.06C1.06,12.15,0,11.26,0,10S.77,7.82,3,7.82H5.08V7.56c0-1.13-.65-1.78-2-1.78a3.7,3.7,0,0,0-2.33.79l-.56-1a4.91,4.91,0,0,1,3.05-1C5.27,4.62,6.42,5.6,6.42,7.62ZM5.08,9.81v-1H3c-1.32,0-1.7.52-1.7,1.15S1.93,11.12,3,11.12A2.14,2.14,0,0,0,5.08,9.81Z"
      />
      <path
        class="cls-1"
        d="M12.69,5.79a2.44,2.44,0,0,0-2.48,2.59,2.49,2.49,0,1,0,5,0A2.43,2.43,0,0,0,12.69,5.79Z"
      />
      <path
        class="cls-1"
        d="M8.28,0V16H24.66V0ZM12.8,12.15a3.14,3.14,0,0,1-2.63-1.25v1.17H8.89V1.74h1.34V5.81A3.12,3.12,0,0,1,12.8,4.62a3.58,3.58,0,0,1,3.73,3.76A3.59,3.59,0,0,1,12.8,12.15ZM21.58,11a2.3,2.3,0,0,0,2-1.05l1,.64a3.28,3.28,0,0,1-3,1.58,3.7,3.7,0,0,1-3.9-3.77,3.69,3.69,0,0,1,3.9-3.76,3.28,3.28,0,0,1,3,1.58l-1,.65a2.31,2.31,0,0,0-2-1.06,2.45,2.45,0,0,0-2.53,2.59A2.44,2.44,0,0,0,21.58,11Z"
      />
    </g>
  </g>
</svg>
`,
  
  equals: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.84 4.93">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <rect class="cls-1" width="17.84" height="1.41" />
      <rect class="cls-1" y="3.52" width="17.84" height="1.41" />
    </g>
  </g>
</svg>
`,
  
  notequal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.84 17.18">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <polygon
        class="cls-1"
        points="17.84 7.24 17.84 5.83 10.89 5.83 14.26 0 12.6 0.05 9.27 5.83 0 5.83 0 7.24 8.45 7.24 7.24 9.35 0 9.35 0 10.76 6.42 10.76 2.71 17.18 4.34 17.18 8.05 10.76 17.84 10.76 17.84 9.35 8.86 9.35 10.08 7.24 17.84 7.24"
      />
    </g>
  </g>
</svg>
`,
  
  // Number/Date operators
  '=': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.84 4.93">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <rect class="cls-1" width="17.84" height="1.41" />
      <rect class="cls-1" y="3.52" width="17.84" height="1.41" />
    </g>
  </g>
</svg>
`,
  
  '<>': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.84 17.18">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <polygon
        class="cls-1"
        points="17.84 7.24 17.84 5.83 10.89 5.83 14.26 0 12.6 0.05 9.27 5.83 0 5.83 0 7.24 8.45 7.24 7.24 9.35 0 9.35 0 10.76 6.42 10.76 2.71 17.18 4.34 17.18 8.05 10.76 17.84 10.76 17.84 9.35 8.86 9.35 10.08 7.24 17.84 7.24"
      />
    </g>
  </g>
</svg>
`,
  
  '<': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.77 13.52">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <path
        class="cls-1"
        d="M13.77,2.55,2.86,6.76,13.77,11v2.55L0,8.08V5.44L13.77,0Z"
      />
    </g>
  </g>
</svg>
`,
  
  '>': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.77 13.52">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <path
        class="cls-1"
        d="M0,11,10.91,6.76,0,2.55V0L13.77,5.44V8.08L0,13.52Z"
      />
    </g>
  </g>
</svg>
`,
  
  '<=': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.77 18.26">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <path
        class="cls-1"
        d="M13.77,2.55,2.86,6.76,13.77,11v2.55L0,8.08V5.44L13.77,0Z"
      />
      <polygon
        class="cls-1"
        points="13.77 18.26 0 12.27 0 10.09 13.77 15.8 13.77 18.26"
      />
    </g>
  </g>
</svg>
`,
  
  '>=': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.77 18.26">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <path
        class="cls-1"
        d="M0,0,13.77,5.44V8.08L0,13.52V11L10.91,6.76,0,2.55Z"
      />
      <polygon
        class="cls-1"
        points="0 18.26 13.77 12.27 13.77 10.09 0 15.8 0 18.26"
      />
    </g>
  </g>
</svg>
`,
  
  between: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.61 6.51">
  <defs>
    <style>
      .cls-1 {
        fill: #161615;
      }
    </style>
  </defs>
  <g id="Capa_2" data-name="Capa 2">
    <g id="Capa_2-2" data-name="Capa 2">
      <polygon
        class="cls-1"
        points="14.04 0 14.04 2.37 1.56 2.37 1.56 0 0 0 0 2.37 0 4.08 0 6.51 1.56 6.51 1.56 4.08 14.04 4.08 14.04 6.51 15.61 6.51 15.61 4.08 15.61 2.37 15.61 0 14.04 0"
      />
    </g>
  </g>
</svg>
`,
};

export function getFilterIcon(operator: string): string {
  return filterIcons[operator] || '';
}