/**
 * Smart Form Designer Guide Dashboard Script
 * Follows defensive programming, memory optimization, and modern standards.
 */

(function () {
    'use strict';

    // Global App Configuration & State
    const AppState = {
        themeKey: 'smart-form-guide-theme',
        activeSectionClass: 'active',
        expandedAccordionClass: 'active'
    };

    // DOM Elements Cache
    const DOM = {
        html: document.documentElement,
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        searchInput: document.getElementById('searchInput'),
        navLinks: document.querySelectorAll('.nav-link'),
        sections: document.querySelectorAll('.content-section'),
        accordionTriggers: document.querySelectorAll('.accordion-trigger')
    };

    /**
     * Theme Toggle System
     */
    function initTheme() {
        if (!DOM.themeToggleBtn) return;

        // Load saved theme or system preference
        const savedTheme = localStorage.getItem(AppState.themeKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        DOM.html.setAttribute('data-theme', initialTheme);
        updateThemeAccessibility(initialTheme);

        // Event Listener
        DOM.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    function toggleTheme() {
        const currentTheme = DOM.html.getAttribute('data-theme') ?? 'light';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        DOM.html.setAttribute('data-theme', nextTheme);
        localStorage.setItem(AppState.themeKey, nextTheme);
        updateThemeAccessibility(nextTheme);
    }

    function updateThemeAccessibility(theme) {
        if (!DOM.themeToggleBtn) return;
        const isDark = theme === 'dark';
        DOM.themeToggleBtn.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
    }

    /**
     * Accordion Logic
     */
    function initAccordions() {
        if (!DOM.accordionTriggers) return;

        DOM.accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', function () {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const targetId = this.getAttribute('aria-controls');
                const targetContent = document.getElementById(targetId);

                if (!targetContent) return;

                // Toggle attributes
                this.setAttribute('aria-expanded', !isExpanded);
                if (isExpanded) {
                    targetContent.setAttribute('hidden', '');
                } else {
                    targetContent.removeAttribute('hidden');
                }
            });
        });
    }

    /**
     * ScrollSpy with IntersectionObserver
     */
    function initScrollSpy() {
        if (!DOM.sections || !DOM.navLinks) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Detects section primarily in middle-upper viewport
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    updateActiveNavLink(sectionId);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        DOM.sections.forEach(section => observer.observe(section));
    }

    function updateActiveNavLink(activeId) {
        DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add(AppState.activeSectionClass);
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove(AppState.activeSectionClass);
                link.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Real-time Text Search / Filter System
     */
    function initSearch() {
        if (!DOM.searchInput || !DOM.sections) return;

        DOM.searchInput.addEventListener('input', function (e) {
            const query = (e.target.value ?? '').trim().toLowerCase();

            DOM.sections.forEach(section => {
                const text = (section.textContent ?? '').toLowerCase();
                const title = section.querySelector('.section-title');
                const titleText = (title?.textContent ?? '').toLowerCase();

                if (query === '') {
                    // Reset filter
                    section.style.opacity = '1';
                    section.style.transform = 'scale(1)';
                    section.style.display = 'block';
                    removeHighlight(section);
                } else if (text.includes(query)) {
                    // Show matching sections
                    section.style.opacity = '1';
                    section.style.transform = 'scale(1)';
                    section.style.display = 'block';
                    highlightQuery(section, query);
                } else {
                    // Hide or fade out non-matching sections
                    section.style.opacity = '0.15';
                    section.style.transform = 'scale(0.98)';
                }
            });
        });
    }

    function highlightQuery(container, query) {
        // Remove previous highlights
        removeHighlight(container);

        const textNodes = [];
        const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walk.nextNode()) {
            if (node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'STYLE' && node.parentNode.nodeName !== 'CODE') {
                textNodes.push(node);
            }
        }

        textNodes.forEach(node => {
            const textValue = node.nodeValue ?? '';
            const index = textValue.toLowerCase().indexOf(query);
            if (index >= 0) {
                const parent = node.parentNode;
                if (!parent) return;

                const fragment = document.createDocumentFragment();
                let remainingText = textValue;

                while (remainingText.toLowerCase().indexOf(query) >= 0) {
                    const matchIndex = remainingText.toLowerCase().indexOf(query);
                    const before = remainingText.substring(0, matchIndex);
                    const match = remainingText.substring(matchIndex, matchIndex + query.length);
                    
                    if (before) {
                        fragment.appendChild(document.createTextNode(before));
                    }

                    const mark = document.createElement('mark');
                    mark.className = 'search-highlight';
                    mark.textContent = match;
                    fragment.appendChild(mark);

                    remainingText = remainingText.substring(matchIndex + query.length);
                }

                if (remainingText) {
                    fragment.appendChild(document.createTextNode(remainingText));
                }

                parent.replaceChild(fragment, node);
            }
        });
    }

    function removeHighlight(container) {
        const highlights = container.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(highlight.textContent ?? ''), highlight);
                parent.normalize(); // Normalize text nodes
            }
        });
    }

    /**
     * Initialization Life Cycle
     */
    function init() {
        initTheme();
        initAccordions();
        initScrollSpy();
        initSearch();
    }

    // Run when DOM Content is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
