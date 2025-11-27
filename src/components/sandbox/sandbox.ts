// src/components/sandbox/sandbox.ts
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
import { getIconForFile } from 'vscode-icons-js';

export interface SandboxFile {
  fileName: string;
  code: string;
  language: string;
}

export interface SandboxOptions {
  files: SandboxFile[];
  activeFile?: number;
}

export class Sandbox {
  private container: HTMLElement;
  private options: SandboxOptions;
  private activeFileIndex: number;

  constructor(containerId: string, options: SandboxOptions) {
    const container = document.querySelector(`#${containerId}`);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container as HTMLElement;
    this.options = options;
    this.activeFileIndex = options.activeFile || 0;
    
    if (!this.options.files || this.options.files.length === 0) {
      throw new Error('At least one file is required');
    }
    
    this.render();
  }

  private render(): void {
    const activeFile = this.options.files[this.activeFileIndex];
    
    // Generar las pestañas
    const tabsHTML = this.options.files.map((file, index) => {
      const iconName = getIconForFile(file.fileName);
      const activeClass = index === this.activeFileIndex ? 'active' : '';
      return `
        <div class="sandbox-tab ${activeClass}" data-tab-index="${index}">
          <img class="tab-icon" src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${iconName}" alt="${file.fileName}">
          <span class="tab-name">${file.fileName}</span>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="code-sandbox">
        <div class="sandbox-header">
          <div class="sandbox-tabs">
            ${tabsHTML}
          </div>
          <button class="copy-button" data-sandbox-copy>
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span class="copy-text">Copiar Código</span>
          </button>
        </div>
        <div class="code-editor">
          <pre><code class="hljs language-${activeFile.language}">${this.escapeHtml(activeFile.code)}</code></pre>
        </div>
      </div>
    `;

    // Aplicar syntax highlighting
    const codeBlock = this.container.querySelector('code') as HTMLElement;
    if (codeBlock) {
      hljs.highlightElement(codeBlock);
    }

    // Event listeners para las pestañas
    const tabs = this.container.querySelectorAll('[data-tab-index]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const index = parseInt((e.currentTarget as HTMLElement).dataset.tabIndex || '0');
        this.switchTab(index);
      });
    });

    // Event listener para copiar
    const copyBtn = this.container.querySelector('[data-sandbox-copy]') as HTMLButtonElement;
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyCode());
    }
  }

  private switchTab(index: number): void {
    if (index < 0 || index >= this.options.files.length) {
      return;
    }
    
    this.activeFileIndex = index;
    const activeFile = this.options.files[index];

    // Actualizar pestañas activas
    const tabs = this.container.querySelectorAll('.sandbox-tab');
    tabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Actualizar código
    const codeEditor = this.container.querySelector('.code-editor');
    if (codeEditor) {
      codeEditor.innerHTML = `
        <pre><code class="hljs language-${activeFile.language}">${this.escapeHtml(activeFile.code)}</code></pre>
      `;

      // Aplicar syntax highlighting
      const codeBlock = codeEditor.querySelector('code') as HTMLElement;
      if (codeBlock) {
        hljs.highlightElement(codeBlock);
      }
    }
  }

  private async copyCode(): Promise<void> {
    const copyBtn = this.container.querySelector('[data-sandbox-copy]') as HTMLButtonElement;
    const copyIcon = copyBtn.querySelector('.copy-icon') as SVGElement;
    const copyText = copyBtn.querySelector('.copy-text') as HTMLElement;
    const activeFile = this.options.files[this.activeFileIndex];
    
    try {
      await navigator.clipboard.writeText(activeFile.code);
      
      // Cambiar icono a check
      copyIcon.innerHTML = `
        <polyline points="20 6 9 17 4 12"></polyline>
      `;
      copyText.textContent = '¡Copiado!';
      copyBtn.classList.add('copied');

      setTimeout(() => {
        copyIcon.innerHTML = `
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        `;
        copyText.textContent = 'Copiar Código';
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Error al copiar código:', err);
      alert('No se pudo copiar el código');
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  public updateFiles(files: SandboxFile[]): void {
    this.options.files = files;
    this.activeFileIndex = 0;
    this.render();
  }

  public addFile(file: SandboxFile): void {
    this.options.files.push(file);
    this.render();
  }

  public destroy(): void {
    this.container.innerHTML = '';
  }
}