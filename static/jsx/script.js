// ========== MAIN SCRIPT ==========

document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector(".content-slider");
    const tabActions = document.querySelector('.tab-actions');
    const sidebarSections = document.querySelectorAll(".sidebar-section");
    
    if (!slider || !tabActions) return;
    
    let isExpanded = false;
    let originalTabsHTML = tabActions.innerHTML;
    
    // Update sidebar based on page index
    function updateSidebar(pageIndex) {
        sidebarSections.forEach(section => {
            const showTabs = section.getAttribute('data-show');
            if (showTabs && showTabs.split(',').includes(String(pageIndex))) {
                section.style.display = 'block';
            } else if (showTabs) {
                section.style.display = 'none';
            }
        });
    }
    
    // Slide to page
    function slideToPage(pageIndex) {
        slider.style.transform = `translateX(-${pageIndex * 100}%)`;
        updateSidebar(pageIndex);
    }
    
    // Setup tab click handlers
    function setupTabClickHandlers() {
        const actionItems = document.querySelectorAll(".action-item");
        
        actionItems.forEach((item) => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });
        
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        document.querySelectorAll(".action-item").forEach((item) => {
            item.addEventListener("click", function(e) {

                //e.preventDefault();
                
                const target = this.getAttribute("data-target");
                const action = this.getAttribute("data-action");
                
                if (action === "expand" || this.classList.contains('docs-trigger')) {
                    if (!isExpanded) {
                        expandTabs();
                    }
                    return;
                }
                
                if (action === "collapse") {
                    collapseTabs();
                    return;
                }
                
                if (target !== null) {
                    document.querySelectorAll(".action-item").forEach(a => 
                        a.classList.remove("active")
                    );
                    this.classList.add("active");
                    slideToPage(parseInt(target));
                }
            });
        });
    }
    
    // Expand tabs (Docs → Name, Synopsis, Description)
    function expandTabs() {
        if (isExpanded) return;
        isExpanded = true;
        
        const currentButtons = document.querySelectorAll('.action-item');
        currentButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '0';
                btn.style.transform = 'scale(0.8) translateY(-10px)';
            }, index * 50);
        });
        
        setTimeout(() => {
            tabActions.innerHTML = `
                <div class="action-item expanded-item" data-action="collapse">
                    <span class="icon-wrapper"><i data-feather="arrow-left"></i></span>
                    <span>Back</span>
                </div>
                <div class="action-item expanded-item active" data-target="4">
                    <span class="icon-wrapper"><i data-feather="info"></i></span>
                    <span>Name</span>
                </div>
                <div class="action-item expanded-item" data-target="5">
                    <span class="icon-wrapper"><i data-feather="file-text"></i></span>
                    <span>Synopsis</span>
                </div>
                <div class="action-item expanded-item" data-target="6">
                    <span class="icon-wrapper"><i data-feather="align-left"></i></span>
                    <span>Description</span>
                </div>
            `;
            
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
            
            setupTabClickHandlers();
            
            const newButtons = document.querySelectorAll('.action-item.expanded-item');
            newButtons.forEach((btn, index) => {
                btn.style.opacity = '0';
                btn.style.transform = 'scale(0.8) translateY(10px)';
                btn.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    btn.style.opacity = '1';
                    btn.style.transform = 'scale(1) translateY(0)';
                }, index * 100);
            });
            
            setTimeout(() => {
                slideToPage(4);
            }, 50);
        }, 300);
    }
    
    // Collapse tabs (Back to original)
    function collapseTabs() {
        
        if (!isExpanded) return;
        isExpanded = false;
        
        const expandedButtons = document.querySelectorAll('.action-item.expanded-item');

        expandedButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '0';
                btn.style.transform = 'scale(0.8) translateY(10px)';
            }, index * 50);
        });
        
        setTimeout(() => {
            tabActions.innerHTML = originalTabsHTML;
            
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
            
            setupTabClickHandlers();
            setupDocsButtonHandler();
            
            const wikiBtn = document.querySelector('.action-item[data-target="0"]');
            if (wikiBtn) {
                wikiBtn.classList.add('active');
            }
            slideToPage(0);
            
            const originalButtons = document.querySelectorAll('.action-item');
            originalButtons.forEach((btn, index) => {
                btn.style.opacity = '0';
                btn.style.transform = 'scale(0.8) translateY(-10px)';
                btn.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    btn.style.opacity = '1';
                    btn.style.transform = 'scale(1) translateY(0)';
                }, index * 80);
            });
        }, 300);
    }
    
    // Setup Docs button handler
    function setupDocsButtonHandler() {
        const docsBtn = document.querySelector('.action-item[data-target="1"]');
        if (!docsBtn) return;
        
        docsBtn.addEventListener('click', function(e) {
            if (!isExpanded) {
                e.preventDefault();
                e.stopPropagation();
                expandTabs();
            }
        });
    }
    
    // Accordion for TOC
    const accordionItems = document.querySelectorAll('.contents-list .item');

    accordionItems.forEach((item) => {
        
        const title = item.querySelector('.item-title');
        if (!title) return;
        
        title.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = item.classList.contains('open');
            const icon = this.querySelector('.toggle-icon') || this.querySelector('i');
            if (!icon) return;
            
            accordionItems.forEach((otherItem) => {
                if (otherItem !== item && otherItem.classList.contains('open')) {
                    otherItem.classList.remove('open');
                    const otherIcon = otherItem.querySelector('.toggle-icon') || otherItem.querySelector('i');
                    if (otherIcon) {
                        const oldSvg = otherIcon.querySelector('svg');
                        if (oldSvg) oldSvg.remove();
                        otherIcon.setAttribute('data-feather', 'plus-circle');
                    }
                }
            });
            
            if (isOpen) {
                item.classList.remove('open');
                const oldSvg = icon.querySelector('svg');
                if (oldSvg) oldSvg.remove();
                icon.setAttribute('data-feather', 'plus-circle');
            } else {
                item.classList.add('open');
                const oldSvg = icon.querySelector('svg');
                if (oldSvg) oldSvg.remove();
                icon.setAttribute('data-feather', 'minus-circle');
            }
            
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    });
    
    // Article click handlers
    const articles = document.querySelectorAll('.article-item');
    articles.forEach((article) => {
        article.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
        article.style.cursor = 'pointer';
    });
    
    // Initial setup
    setupTabClickHandlers();
    setupDocsButtonHandler();
    updateSidebar(0);
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    feather.replace();
});