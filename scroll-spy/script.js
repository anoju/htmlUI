class MobileScrollSpy {
    constructor() {
        this.tabNav = document.getElementById('tabNav');
        this.tabLinks = document.querySelectorAll('.tab-link');
        this.sections = document.querySelectorAll('.content-section');
        this.observer = null;
        this.activeSection = null;
        this.isScrolling = false;
        this.isMobile = this.checkMobile();
        
        this.init();
    }

    checkMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
        this.observeSections();
        this.setupScrollListener();
    }

    setupIntersectionObserver() {
        const tabHeight = this.tabNav.offsetHeight;
        
        const options = {
            root: null,
            rootMargin: `-${tabHeight}px 0px -50% 0px`,
            threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0] // 더 세밀한 임계값
        };

        this.observer = new IntersectionObserver((entries) => {
            this.handleIntersection(entries);
        }, options);
    }

    handleIntersection(entries) {
        if (this.isScrolling) return;
        
        // 현재 뷰포트에서 가장 많이 보이는 섹션 찾기
        let maxVisibility = 0;
        let mostVisibleSection = null;
        
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
                maxVisibility = entry.intersectionRatio;
                mostVisibleSection = entry.target;
            }
        });
        
        if (mostVisibleSection) {
            this.setActiveTab(mostVisibleSection.id);
        } else {
            // 대안: 스크롤 위치 기반으로 활성 탭 결정
            this.setActiveTabByScrollPosition();
        }
    }

    setActiveTabByScrollPosition() {
        const tabHeight = this.tabNav.offsetHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        
        // 스크롤이 마지막에 도달했는지 체크 (5px 여유분 포함)
        if (scrollTop + windowHeight >= documentHeight - 5) {
            return; // 조기 종료
        }
        
        const triggerPoint = scrollTop + tabHeight + 50;
        
        let activeSection = null;
        
        // 각 섹션의 위치를 확인하여 가장 가까운 섹션 찾기
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (triggerPoint >= sectionTop && triggerPoint < sectionBottom) {
                activeSection = section.id;
            }
        });
        
        // 스크롤이 맨 아래에 있을 때 마지막 섹션 활성화
        if (!activeSection && 
            scrollTop + window.innerHeight >= document.documentElement.scrollHeight) {
            const lastSection = this.sections[this.sections.length - 1];
            activeSection = lastSection.id;
        }
        
        // 스크롤이 맨 위에 있을 때 첫 번째 섹션 활성화
        if (!activeSection && scrollTop < 100) {
            activeSection = this.sections[0].id;
        }
        
        if (activeSection) {
            this.setActiveTab(activeSection);
        }
    }

    setupScrollListener() {
        let scrollTimeout;
        
        const handleScroll = () => {
            this.isScrolling = true;
            
            // 스크롤 종료 감지
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                this.setActiveTabByScrollPosition();
            }, this.isMobile ? 150 : 100); // iOS에서 더 긴 대기 시간
        };
        
        // 패시브 리스너로 성능 최적화
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setActiveTab(sectionId) {
        if (this.activeSection === sectionId) return;
        
        this.activeSection = sectionId;
        
        // 모든 탭에서 active 클래스 제거
        this.tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 해당 섹션의 탭에 active 클래스 추가
        const activeTab = document.querySelector(`[data-target="${sectionId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            this.scrollTabIntoView(activeTab);
        }
    }

    scrollTabIntoView(activeTab) {
        const tabList = activeTab.parentElement.parentElement;
        const tabRect = activeTab.getBoundingClientRect();
        const listRect = tabList.getBoundingClientRect();
        
        if (tabRect.left < listRect.left || tabRect.right > listRect.right) {
            // iOS에서 더 부드러운 스크롤
            activeTab.scrollIntoView({
                behavior: this.isMobile ? 'auto' : 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    bindEvents() {
        this.tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 클릭 시 스크롤 감지 일시 중단
                this.isScrolling = true;
                
                const targetId = link.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const tabHeight = this.tabNav.offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + 
                                         window.pageYOffset - tabHeight;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                    
                    // 즉시 해당 탭 활성화
                    this.setActiveTab(targetId);
                    
                    // iOS에서 더 긴 대기 시간
                    const waitTime = this.isMobile ? 1200 : 800;
                    setTimeout(() => {
                        this.isScrolling = false;
                    }, waitTime);
                }
            });
        });

        window.addEventListener('resize', this.debounce(() => {
            this.observer.disconnect();
            this.setupIntersectionObserver();
            this.observeSections();
        }, 250));
    }

    observeSections() {
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    refresh() {
        this.observer.disconnect();
        this.sections = document.querySelectorAll('.content-section');
        this.setupIntersectionObserver();
        this.observeSections();
    }
}

// DOM이 로드되면 스크롤 스파이 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MobileScrollSpy();
});
