// src/components/menu/menu.ts

export interface MenuItem {
  id?: string;
  label: string;
  path: string;
  children?: MenuItem[];
}

export class Menu {
  private container: HTMLElement;
  private menuItems: MenuItem[];
  private contentContainer: HTMLElement;

  constructor(container: HTMLElement, contentContainer: HTMLElement) {
    this.container = container;
    this.contentContainer = contentContainer;
    this.menuItems = this.getMenuItems();
    this.generateIds(this.menuItems); // Generar IDs automáticamente
    this.render();
    this.setActiveFromUrl();
    
    // Escuchar cambios en la URL
    window.addEventListener('popstate', () => {
      this.setActiveFromUrl();
    });
  }

  private generateIds(items: MenuItem[], parentId: string = ''): void {
    items.forEach((item, index) => {
      // Generar ID basado en la posición
      item.id = parentId ? `${parentId}-${index + 1}` : `${index + 1}`;
      
      // Si tiene hijos, generar IDs recursivamente
      if (item.children && item.children.length > 0) {
        this.generateIds(item.children, item.id);
      }
    });
  }

  private getMenuItems(): MenuItem[] {
    return [
      {
        label: '1. Data Binding',
        path: '/1_DataBinding',
      },
      {
        label: '2. Filtering',
        path: '/2_Filtering',
      },
      {
        label: '3. Sorting',
        path: '/3_Sorting',
      },
      {
        label: '4. Editing',
        path: '/4_Editing',
        children: [
          {
            label: '4.1 Cell Editing',
            path: '/4_Editing/cell',
          },
          {
            label: '4.2 Row Editing',
            path: '/4_Editing/row',
          },
          {
            label: '4.3 Batch Editing',
            path: '/4_Editing/batch',
          },
        ],
      },
      {
        label: '5. Grouping',
        path: '/5_Grouping',
      },
      {
        label: '6. Selection',
        path: '/6_Selection',
        children: [
          {
            label: '6.1 Single Selection',
            path: '/6_Selection/single',
          },
          {
            label: '6.2 Multiple Selection',
            path: '/6_Selection/multiple',
          },
        ],
      },
      {
        label: '7. Focused Row',
        path: '/7_FocusedRow',
      },
      {
        label: '8. Paging',
        path: '/8_Paging',
      },
      {
        label: '9. Scrolling',
        path: '/9_Scrolling',
      },
      {
        label: '10. Columns',
        path: '/10_Columns',
        children: [
          {
            label: '10.1 Column Resizing',
            path: '/10_Columns/resizing',
          },
          {
            label: '10.2 Column Reordering',
            path: '/10_Columns/reordering',
          },
          {
            label: '10.3 Column Visibility',
            path: '/10_Columns/visibility',
          },
        ],
      },
      {
        label: '11. Data Summaries',
        path: '/11_DataSummaries',
      },
      {
        label: '12. Drag and Drop',
        path: '/12_DragAndDrop',
      },
      {
        label: '13. Export to PDF',
        path: '/13_ExportToPDF',
      },
      {
        label: '14. Export to Excel',
        path: '/14_ExportToExcel',
      },
      {
        label: '15. Export to CSV',
        path: '/15_ExportToCSV',
      },
      {
        label: '16. Export to JSON',
        path: '/16_ExportToJson',
      },
      {
        label: '17. Export All',
        path: '/17_ExportAll',
        children: [
          {
            label: '17.1 Export Configuration',
            path: '/17_ExportAll/configuration',
          },
          {
            label: '17.2 Export Templates',
            path: '/17_ExportAll/templates',
          },
        ],
      },
    ];
  }

  private render(): void {
    const nav = document.createElement('nav');
    nav.className = 'navigation-menu';

    const ul = document.createElement('ul');
    ul.className = 'menu-list';

    this.menuItems.forEach((item) => {
      const li = this.createMenuItem(item);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    this.container.appendChild(nav);
  }

  private createMenuItem(item: MenuItem, isSubmenu: boolean = false): HTMLLIElement {
    const li = document.createElement('li');
    li.className = isSubmenu ? 'submenu-item' : 'menu-item';

    const button = document.createElement('button');
    button.className = isSubmenu ? 'submenu-button' : 'menu-button';
    button.textContent = item.label;
    button.dataset.path = item.path;
    button.dataset.id = item.id;

    // Si tiene hijos, agregar indicador
    if (item.children && item.children.length > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'menu-arrow';
      arrow.textContent = '▼';
      button.appendChild(arrow);
      li.classList.add('has-children');
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Si tiene hijos, toggle del submenu
      if (item.children && item.children.length > 0) {
        this.toggleSubmenu(li);
      } else {
        // Navegar a la ruta
        this.navigateTo(item.path);
      }
    });

    li.appendChild(button);

    // Si tiene hijos, crear submenu
    if (item.children && item.children.length > 0) {
      const subUl = document.createElement('ul');
      subUl.className = 'submenu-list';

      item.children.forEach((child) => {
        const subLi = this.createMenuItem(child, true);
        subUl.appendChild(subLi);
      });

      li.appendChild(subUl);
    }

    return li;
  }

  private toggleSubmenu(li: HTMLElement): void {
    const isOpen = li.classList.contains('open');
    
    // Cerrar otros submenus del mismo nivel
    const siblings = li.parentElement?.children;
    if (siblings) {
      Array.from(siblings).forEach((sibling) => {
        if (sibling !== li && sibling.classList.contains('has-children')) {
          sibling.classList.remove('open');
        }
      });
    }

    // Toggle del submenu actual
    if (isOpen) {
      li.classList.remove('open');
    } else {
      li.classList.add('open');
    }
  }

  private navigateTo(path: string): void {
    // Actualizar la URL sin recargar la página
    window.history.pushState({}, '', path);
    
    // Actualizar el estado activo
    this.setActive(path);
    
    // Cargar el contenido
    this.loadContent(path);
  }

  private async loadContent(path: string): Promise<void> {
    console.log(`Cargando contenido para: ${path}`);
    
    // Limpiar contenido anterior
    this.contentContainer.innerHTML = '';
    
    // Crear título
    const title = document.createElement('h2');
    title.textContent = `Feature: ${path.replace('/', '').replace(/_/g, ' ')}`;
    title.className = 'content-title';
    
    // Crear contenedor del feature
    const featureContainer = document.createElement('div');
    featureContainer.className = 'feature-container';
    
    this.contentContainer.appendChild(title);
    this.contentContainer.appendChild(featureContainer);
    
    // Intentar cargar el módulo del feature
    const modulePath = `/src/features${path}/index.ts`;
    
    try {
      featureContainer.innerHTML = '<p>Cargando...</p>';
      
      // Importar dinámicamente el módulo
      const module = await import(/* @vite-ignore */ modulePath);
      
      if (module.render && typeof module.render === 'function') {
        module.render(featureContainer);
      } else if (module.default && typeof module.default === 'function') {
        module.default(featureContainer);
      } else {
        throw new Error('El módulo no tiene función render o export default');
      }
    } catch (error) {
      console.warn(`No se pudo cargar el módulo para ${path}:`, error);
      featureContainer.innerHTML = `
        <p>Ruta: <strong>${path}</strong></p>
        <p>Contenido pendiente de implementar.</p>
        <p>Crea el archivo: <code>src/features${path}/index.ts</code></p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">
// src/features${path}/index.ts

export function render(container: HTMLElement): void {
  container.innerHTML = \`
    &lt;h3&gt;${path.replace('/', '').replace(/_/g, ' ')}&lt;/h3&gt;
    &lt;p&gt;Contenido de la feature&lt;/p&gt;
  \`;
  
  // Tu código aquí
  console.log('Feature ${path} inicializada');
}
        </pre>
      `;
    }
  }

  private setActive(path: string): void {
    // Remover todas las clases active
    const buttons = this.container.querySelectorAll('.menu-button, .submenu-button');
    buttons.forEach((button) => {
      button.classList.remove('active');
    });

    // Agregar clase active al botón con el path correspondiente
    const activeButton = this.container.querySelector(
      `[data-path="${path}"]`
    ) as HTMLElement;
    
    if (activeButton) {
      activeButton.classList.add('active');
      
      // Si es un submenu item, abrir el padre
      const parentLi = activeButton.closest('.has-children');
      if (parentLi) {
        parentLi.classList.add('open');
      }
    }
  }

  private setActiveFromUrl(): void {
    const currentPath = window.location.pathname;
    
    // Si es la raíz, cargar el primer item
    if (currentPath === '/' || currentPath === '') {
      this.navigateTo(this.menuItems[0].path);
    } else {
      this.setActive(currentPath);
      this.loadContent(currentPath);
    }
  }

  public destroy(): void {
    this.container.innerHTML = '';
  }
}

// Auto-inicialización cuando se carga el script
document.addEventListener('DOMContentLoaded', () => {
  // Importar estilos

  
  const menuContainer = document.querySelector<HTMLElement>('.menu');
  const contentContainer = document.querySelector<HTMLElement>('.content');
  
  if (menuContainer && contentContainer) {
    new Menu(menuContainer, contentContainer);
    console.log('Menú inicializado correctamente');
  } else {
    console.error('No se encontraron los contenedores .menu y .content');
  }
});