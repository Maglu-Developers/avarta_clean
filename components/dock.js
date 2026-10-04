/**
 * APPLE STYLE DOCK (Home, Collection, About, Explore)
 * Features Lucide icons (HomeIcon, LayoutGrid, Info, Compass),
 * floating DockLabel tooltips, and macOS dock spring magnification wave.
 */

(function () {
  'use strict';

  function navigateToRoute(route) {
    // 1. If Collection Detail View is currently open, smoothly close it
    if (window.CollectionDetailView && typeof window.CollectionDetailView.close === 'function' && window.CollectionDetailView.isOpen) {
      window.CollectionDetailView.close(true);
    }

    // 2. Trigger the page transition to the desired route
    if (typeof window.avartaNavigate === 'function') {
      window.avartaNavigate(route);
    } else {
      window.location.hash = '#' + route;
    }

    // 3. Update active state across all docks
    if (window.avartaDock && typeof window.avartaDock.setActive === 'function') {
      window.avartaDock.setActive(route);
    }
  }

  const DOCK_DATA = [
    {
      title: 'Home',
      id: 'home',
      href: '#home',
      iconSvg: '<svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      action: (e) => {
        e.preventDefault();
        navigateToRoute('home');
      }
    },
    {
      title: 'Collection',
      id: 'collection',
      href: '#collection',
      iconSvg: '<svg viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/></svg>',
      action: (e) => {
        e.preventDefault();
        navigateToRoute('collection');
      }
    },
    {
      title: 'About',
      id: 'about',
      href: '#about',
      iconSvg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
      action: (e) => {
        e.preventDefault();
        navigateToRoute('about');
      }
    },
    {
      title: 'Explore',
      id: 'explore',
      href: '#explore',
      iconSvg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
      action: (e) => {
        e.preventDefault();
        navigateToRoute('explore');
      }
    }
  ];

  class AppleDock {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) return;

      this.options = Object.assign({
        maxScale: 1.25,
        minScale: 1.0,
        distance: 140,
        lerpSpeed: 0.24,
        items: DOCK_DATA
      }, options);

      this.mouseX = Infinity;
      this.mouseY = Infinity;
      this.isHovered = false;
      this.scales = [];
      this.animating = false;

      this._render();
      this._bindEvents();
      this._syncActiveRoute();
      this.container._appleDockInstance = this;
    }

    _render() {
      this.container.innerHTML = `
        <div class="apple-dock-wrapper">
          <div class="apple-dock" role="toolbar" aria-label="Application dock">
            ${this.options.items.map((item) => `
              <a href="${item.href}" 
                 class="apple-dock-item ${item.id === 'collection' ? 'active' : ''}" 
                 data-id="${item.id}" 
                 role="button" 
                 aria-label="${item.title}">
                <div class="apple-dock-label">${item.title}</div>
                <div class="apple-dock-icon">${item.iconSvg}</div>
              </a>
            `).join('')}
          </div>
        </div>
      `;

      this.dockEl = this.container.querySelector('.apple-dock');
      this.itemEls = Array.from(this.container.querySelectorAll('.apple-dock-item'));
      this.scales = this.itemEls.map(() => 1.0);
    }

    _bindEvents() {
      if (!this.dockEl) return;

      this.dockEl.addEventListener('mousemove', (e) => {
        this.isHovered = true;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        if (!this.animating) {
          this.animating = true;
          this._tick();
        }
      }, { passive: true });

      this.dockEl.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.mouseX = Infinity;
        this.mouseY = Infinity;
        if (!this.animating) {
          this.animating = true;
          this._tick();
        }
      });

      this.itemEls.forEach((el, idx) => {
        const item = this.options.items[idx];
        if (item && item.action) {
          el.addEventListener('click', (e) => {
            this.setActive(item.id);
            item.action(e);
          });
        }
      });

      window.addEventListener('hashchange', () => this._syncActiveRoute());
      window.addEventListener('popstate', () => this._syncActiveRoute());
    }

    _syncActiveRoute() {
      let hash = (window.location.hash || '').replace('#', '') || 'home';
      if (hash === 'detail' || (window.CollectionDetailView && window.CollectionDetailView.isOpen)) {
        hash = 'collection';
      }
      this.setActive(hash);
    }

    setActive(id) {
      if (!this.itemEls || this.itemEls.length === 0) return;
      this.itemEls.forEach((el) => {
        if (el.getAttribute('data-id') === id) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    }

    _tick() {
      if (this.itemEls.length === 0) {
        this.animating = false;
        return;
      }

      let stillMoving = false;
      const { minScale, maxScale, distance, lerpSpeed } = this.options;

      for (let i = 0; i < this.itemEls.length; i++) {
        const el = this.itemEls[i];
        let targetScale = minScale;

        if (this.isHovered && this.mouseX !== Infinity) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = this.mouseX - centerX;
          const dy = (this.mouseY - centerY) * 1.3;
          const dist = Math.hypot(dx, dy);

          if (dist < distance) {
            const ratio = dist / distance;
            const factor = Math.cos((ratio * Math.PI) / 2);
            targetScale = minScale + (maxScale - minScale) * factor;
          }
        }

        const diff = targetScale - this.scales[i];
        if (Math.abs(diff) > 0.001) {
          this.scales[i] += diff * lerpSpeed;
          stillMoving = true;
        } else {
          this.scales[i] = targetScale;
        }

        const scale = this.scales[i];
        if (scale > 1.002) {
          el.style.transform = `scale(${scale.toFixed(3)})`;
          el.style.zIndex = Math.round(scale * 10);
        } else {
          el.style.transform = '';
          el.style.zIndex = '';
        }
      }

      if (stillMoving) {
        requestAnimationFrame(() => this._tick());
      } else {
        this.animating = false;
      }
    }
  }

  window.AppleDock = AppleDock;

  function syncCdvActiveRoute(route) {
    let hash = route || (window.location.hash || '').replace('#', '') || 'collection';
    if (hash === 'detail' || (window.CollectionDetailView && window.CollectionDetailView.isOpen)) {
      hash = 'collection';
    }
    const cdvLinks = document.querySelectorAll('.cdv-nav-link');
    cdvLinks.forEach((el) => {
      if (el.getAttribute('data-route') === hash) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  window.avartaDock = {
    setActive: syncCdvActiveRoute
  };

  window.addEventListener('hashchange', () => syncCdvActiveRoute());
  window.addEventListener('popstate', () => syncCdvActiveRoute());
  window.addEventListener('cdvOpened', () => syncCdvActiveRoute('collection'));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => syncCdvActiveRoute());
  } else {
    syncCdvActiveRoute();
  }

})();
