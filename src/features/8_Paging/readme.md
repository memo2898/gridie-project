# Caso 1: CLIENT Mode con PaginaciónEscenario: Lista de empleados (500 registros en memoria)
const empleadosGrid = new Gridie({
  id: "empleados-table",
  headers: [
    { label: "ID", type: "number" },
    { label: "Nombre", type: "string" },
    { label: "Departamento", type: "string" },
    { label: "Salario", type: "number" },
    { label: "Fecha Ingreso", type: "date" }
  ],
  body: empleadosData, // Array de 500 empleados
  
  mode: "client", // ← Default
  
  enableSort: true,
  enableFilter: true,
  
  paging: {
    enabled: true,
    
    pageSize: {
      visible: true,
      default: 25,
      options: [10, 25, 50, 100]
    },
    
    showInfo: true,
    
    navigation: {
      visible: true,
      showPrevNext: true,
      maxButtons: 5
    }
  }
});

document.querySelector('#app').appendChild(empleadosGrid);


# Caso 2: CLIENT Mode SIN PaginaciónEscenario: Dashboard con pocas métricas

const metricsGrid = new Gridie({
  id: "metrics-table",
  headers: [
    { label: "Métrica", type: "string" },
    { label: "Valor", type: "number" },
    { label: "Tendencia", type: "string" }
  ],
  body: [
    ["Ventas Hoy", 12500, "↑ +15%"],
    ["Usuarios Activos", 450, "↑ +8%"],
    ["Tasa Conversión", 3.2, "↓ -2%"],
    ["Revenue", 85000, "↑ +22%"]
  ],
  
  mode: "client", // ← Default
  
  paging: {
    enabled: false // ← Sin footer, muestra todo
  }
});

document.querySelector('#dashboard').appendChild(metricsGrid);

# Caso 3: SERVER Mode con Paginación Escenario: Inventario de productos (50,000 registros en BD)

const productosGrid = new Gridie({
  id: "productos-table",
  headers: [
    { label: "SKU", type: "string" },
    { label: "Producto", type: "string" },
    { label: "Categoría", type: "string" },
    { label: "Stock", type: "number" },
    { label: "Precio", type: "number" }
  ],
  body: [], // ← Vacío inicial, se carga desde servidor
  
  mode: "server", // ← Modo servidor
  
  enableSort: true,
  enableFilter: true,
  
  paging: {
    enabled: true,
    
    pageSize: {
      visible: true,
      default: 50,
      options: [25, 50, 100, 200]
    },
    
    showInfo: true,
    
    navigation: {
      visible: true,
      showPrevNext: true,
      maxButtons: 7,
      
      jumpTo: {
        visible: true,
        position: "inline",
        buttonText: "→"
      }
    },
    
    position: "bottom"
  },
  
  server: {
    cache: true,
    preload: 2,
    
    onPageChange: async (page, pageSize, filters, sorts) => {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, pageSize, filters, sorts })
      });
      
      const json = await response.json();
      
      return {
        data: json.productos,
        total: json.totalCount
      };
    }
  }
});

document.querySelector('#app').appendChild(productosGrid);

//  Métodos públicos
productosGrid.goToPage(10);
productosGrid.setPageSize(100);
productosGrid.refreshPage();
productosGrid.clearCache();
```

**Footer resultante:**
```
[50 ▼]  Mostrando 1-50 de 50,000 items  < 1 [2] 3 4 5 ... 1000 >  Ir a: [__] [→]
```

**Flujo interno:**
```
Usuario abre tabla
  → onPageChange(1, 50) se ejecuta
  → API retorna { data: [...50 items...], total: 50000 }
  → Gridie calcula: totalPages = ceil(50000 / 50) = 1000
  → Muestra: "Mostrando 1-50 de 50,000 items"
  
Usuario hace clic en página 5
  → Verifica caché: ¿tiene página 5? No
  → onPageChange(5, 50) se ejecuta
  → API retorna { data: [...50 items...], total: 50000 }
  → Guarda en caché
  → Renderiza
  → Precarga páginas 6 y 7 en background
  
Usuario vuelve a página 5
  → Verifica caché: ¿tiene página 5? Sí
  → Renderiza directo (sin API call) ⚡


# Caso 4: SERVER Mode con Filtros Complejos Escenario: Admin de usuarios con búsqueda
const usuariosGrid = new Gridie({
  id: "usuarios-table",
  headers: [
    { 
      label: "Nombre", 
      type: "string",
      filters: {
        filterRow: { visible: true }
      }
    },
    { 
      label: "Email", 
      type: "string",
      filters: {
        filterRow: { visible: true }
      }
    },
    { 
      label: "Edad", 
      type: "number",
      filters: {
        filterRow: { visible: true }
      }
    },
    { 
      label: "Activo", 
      type: "boolean",
      filters: {
        filterRow: { visible: true }
      }
    }
  ],
  body: [],
  
  mode: "server",
  
  enableSort: true,
  enableFilter: true,
  
  paging: {
    enabled: true,
    
    pageSize: {
      visible: true,
      default: 25,
      options: [10, 25, 50]
    },
    
    showInfo: true,
    
    navigation: {
      visible: true,
      showPrevNext: true,
      maxButtons: 5
    }
  },
  
  server: {
    cache: false, // Sin caché, datos cambian frecuentemente
    
    onPageChange: async (page, pageSize, filters, sorts) => {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          pageSize,
          filters,
          sorts
        })
      });
      
      const json = await response.json();
      
      return {
        data: json.usuarios,
        total: json.totalCount
      };
    }
  }
});

document.querySelector('#app').appendChild(usuariosGrid);
{
  "page": 1,
  "pageSize": 25,
  "filters": [
    {
      "columnIndex": 0,
      "operator": "contains",
      "value": "juan"
    },
    {
      "columnIndex": 2,
      "operator": ">",
      "value": 25
    }
  ],
  "sorts": [
    {
      "columnIndex": 2,
      "direction": "desc",
      "order": 1
    }
  ]
}

# Caso 5: INFINITE SCROLL Mode Escenario: Feed de logs del sistema (crecimiento continuo)

const logsGrid = new Gridie({
  id: "logs-table",
  headers: [
    { label: "Timestamp", type: "date", timeFormat: "24h" },
    { label: "Nivel", type: "string" },
    { label: "Mensaje", type: "string" },
    { label: "Usuario", type: "string" }
  ],
  body: [], // ← Vacío inicial, se carga progresivamente
  
  mode: "infinite-scroll", // ← Modo scroll infinito
  
  enableFilter: true,
  enableSort: false, // Normalmente en feeds no se ordena
  
  paging: {
    enabled: false // ← SIN footer de paginación
  },
  
  infiniteScroll: {
    threshold: 150,       // Cargar cuando falten 150px del final
    pageSize: 30,         // Cargar de 30 en 30 items
    initialLoad: 50,      // Cargar 50 items al inicio
    
    onLoadMore: async (page, pageSize) => {
      const response = await fetch(
        `/api/logs?page=${page}&limit=${pageSize}&sort=desc`
      );
      
      const json = await response.json();
      
      return {
        data: json.logs,           // Array de nuevos logs
        hasMore: json.hasNextPage  // ¿Hay más páginas disponibles?
      };
    }
  }
});

document.querySelector('#app').appendChild(logsGrid);
```

**Resultado visual:**

**Estado inicial (después del primer load):**
```
┌──────────────────────────────────────────────────────────────┐
│ Timestamp           │ Nivel │ Mensaje                │ Usuario│
├─────────────────────┼───────┼────────────────────────┼───────┤
│ 2025-12-03 14:23:45 │ INFO  │ Usuario logged in      │ jperez│
│ 2025-12-03 14:22:30 │ WARN  │ Cache miss detected    │ system│
│ 2025-12-03 14:21:15 │ ERROR │ DB connection failed   │ admin │
│ ...                 │ ...   │ ...                    │ ...   │
│ 2025-12-03 13:50:00 │ INFO  │ Service restarted      │ admin │
└─────────────────────┴───────┴────────────────────────┴───────┘
← 50 items cargados (initialLoad) →
```

**Usuario scrollea hacia abajo:**
```
┌──────────────────────────────────────────────────────────────┐
│ ...                 │ ...   │ ...                    │ ...   │
│ 2025-12-03 13:50:00 │ INFO  │ Service restarted      │ admin │
├─────────────────────┴───────┴────────────────────────┴───────┤
│                    ⏳ Cargando más logs...                    │
└──────────────────────────────────────────────────────────────┘
```

**Cuando ya no hay más datos:**
```
┌──────────────────────────────────────────────────────────────┐
│ ...                 │ ...   │ ...                    │ ...   │
│ 2025-12-03 12:00:00 │ INFO  │ Application launched   │ system│
├─────────────────────┴───────┴────────────────────────┴───────┤
│                   No hay más logs disponibles               │
└──────────────────────────────────────────────────────────────┘


# Caso 6: INFINITE SCROLL con Total y Progreso Escenario: Feed de actividad con barra de progreso
const actividadGrid = new Gridie({
  id: "actividad-table",
  headers: [
    { label: "Fecha", type: "date" },
    { label: "Usuario", type: "string" },
    { label: "Acción", type: "string" },
    { label: "Detalles", type: "string" }
  ],
  body: [],
  
  mode: "infinite-scroll",
  
  paging: {
    enabled: false
  },
  
  infiniteScroll: {
    threshold: 200,
    pageSize: 50,
    initialLoad: 100,
    
    showProgress: true,      // ← Mostrar barra de progreso
    progressPosition: "top", // ← Posición arriba de la tabla
    
    onLoadMore: async (page, pageSize) => {
      const response = await fetch(
        `/api/actividad?page=${page}&limit=${pageSize}`
      );
      
      const json = await response.json();
      
      return {
        data: json.actividades,
        hasMore: json.hasMore,
        total: json.total  // ← Total opcional para mostrar progreso
      };
    }
  }
});

document.querySelector('#app').appendChild(actividadGrid);

// Escuchar eventos de carga
actividadGrid.addEventListener('loadmore', (event) => {
  console.log('Items cargados:', event.detail.itemsLoaded);
  console.log('Total cargado:', event.detail.totalLoaded);
  console.log('Total disponible:', event.detail.totalAvailable);
  console.log('Porcentaje:', event.detail.percentage);
  
  if (event.detail.percentage >= 80) {
    console.warn('Has cargado el 80% de los datos.');
  }
});

actividadGrid.addEventListener('nomore', () => {
  const total = actividadGrid.getTotalItemsAvailable();
  console.log(` Se cargaron todos los ${total} registros`);
});
```

**Resultado visual con progreso:**
```
┌──────────────────────────────────────────────────────────────┐
│  Cargados 120 de 1,500 items (8%)                            │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 8%    │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ Fecha      │ Usuario │ Acción           │ Detalles           │
├────────────┼─────────┼──────────────────┼────────────────────┤
│ 2025-12-03 │ jperez  │ Login            │ IP: 192.168.1.1    │
│ 2025-12-03 │ mgarcia │ Update Profile   │ Changed email      │
│ ...        │ ...     │ ...              │ ...                │
└────────────┴─────────┴──────────────────┴────────────────────┘
                    ⏳ Cargando más...