// src/features/1_DataBinding/simple_array/sources/sources.ts
export const tsCode = `import { Gridie } from './gridie';

// Configuración simple con headers como strings
const config = {
  id: "tabla-simple",
  headers: ["Nombre", "Email", "Teléfono", "Ciudad"],
  body: [
    { 
      Nombre: "Juan Pérez", 
      Email: "juan@example.com", 
      Teléfono: "809-555-1234", 
      Ciudad: "Santo Domingo" 
    },
    { 
      Nombre: "María García", 
      Email: "maria@example.com", 
      Teléfono: "809-555-5678", 
      Ciudad: "Santiago" 
    },
    { 
      Nombre: "Carlos López", 
      Email: "carlos@example.com", 
      Teléfono: "809-555-9012", 
      Ciudad: "La Vega" 
    },
  ],
};

// Crear instancia de Gridie
const gridie = new Gridie(config);
document.body.appendChild(gridie);`;

export const jsCode = `// Configuración simple
const config = {
  id: "tabla-simple",
  headers: ["Nombre", "Email", "Teléfono", "Ciudad"],
  body: [
    { 
      Nombre: "Juan Pérez", 
      Email: "juan@example.com", 
      Teléfono: "809-555-1234", 
      Ciudad: "Santo Domingo" 
    },
    { 
      Nombre: "María García", 
      Email: "maria@example.com", 
      Teléfono: "809-555-5678", 
      Ciudad: "Santiago" 
    },
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
  <title>Gridie - Headers Simples</title>
  <script src="gridie.js"></script>
</head>
<body>
  <h1>Gridie con Headers Simples</h1>
  
  <gridie-table id="mi-tabla"></gridie-table>

  <script>
    const gridie = document.getElementById('mi-tabla');
    
    gridie.setConfig({
      id: "tabla-simple",
      headers: ["Nombre", "Email", "Teléfono", "Ciudad"],
      body: [
        { Nombre: "Juan Pérez", Email: "juan@example.com", Teléfono: "809-555-1234", Ciudad: "Santo Domingo" },
        { Nombre: "María García", Email: "maria@example.com", Teléfono: "809-555-5678", Ciudad: "Santiago" },
      ],
    });
  </script>
</body>
</html>`;