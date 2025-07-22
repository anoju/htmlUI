class MobileScrollSpy {
    constructor() {
        this.tabNav = document.getElementById('tabNav');
        this.tabLinks = document.querySelectorAll('.tab-link');
        this.sections = document.querySelectorAll('.content-section');
        this.activeSection = null;
        this.isScrolling = false;
        this.isClickScrolling = false; // 클릭으로 인한 스크롤인지 구분
        this.isMobile = this.checkMobile();
        this.sectionPositions = [];
        
        this.init();
    }

    checkMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    init() {
        this.calculateSectionPositions();
        this.bindEvents();
        this.setupScrollListener();
        
        // 초기 활성 탭 설정
        setTimeout(() => {
            this.setActiveTabByScrollPosition();
        }, 100);
    }

    calculateSectionPositions() {
        this.sectionPositions = [];
        this.sections.forEach(section => {
            this.sectionPositions.push({
                id: section.id,
                top: section.offsetTop,
                bottom: section.offsetTop + section.offsetHeight,
                height: section.offsetHeight
            });
        });
    }

    setActiveTabByScrollPosition() {
        // 클릭으로 스크롤 중일 때는 탭 활성화 제외
        if (this.isClickScrolling) return;
        
        const tabHeight = this.tabNav.offsetHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        
        // 스크롤이 마지막에 도달했는지 체크 (조기 종료)
        if (scrollTop + windowHeight >= documentHeight - 5) {
            return; // 조기 종료
        }
        
        // 스크롤이 맨 위에 있을 때 첫 번째 섹션 활성화
        if (scrollTop < 100) {
            this.setActiveTab(this.sections[0].id);
            return;
        }
        
        // 탭 하단과 섹션이 만나는 지점 계산
        const triggerPoint = scrollTop + tabHeight;
        let activeSection = null;
        let bestMatch = null;
        let minDistance = Infinity;
        
        // 각 섹션과의 거리 계산
        this.sectionPositions.forEach(section => {
            // 트리거 포인트가 섹션 영역 내에 있는 경우
            if (triggerPoint >= section.top && triggerPoint < section.bottom) {
                activeSection = section.id;
                return;
            }
            
            // 가장 가까운 섹션 찾기 (백업용)
            const distanceToTop = Math.abs(triggerPoint - section.top);
            const distanceToCenter = Math.abs(triggerPoint - (section.top + section.height / 2));
            const distance = Math.min(distanceToTop, distanceToCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = section.id;
            }
        });
        
        // 정확한 매치가 없으면 가장 가까운 섹션 사용
        if (!activeSection) {
            activeSection = bestMatch;
        }
        
        if (activeSection) {
            this.setActiveTab(activeSection);
        }
    }

    setupScrollListener() {
        let scrollTimeout;
        let rafId;
        
        const handleScroll = () => {
            this.isScrolling = true;
            
            // requestAnimationFrame으로 부드러운 업데이트
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                this.setActiveTabByScrollPosition();
            });
            
            // 스크롤 종료 감지
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                this.setActiveTabByScrollPosition();
            }, this.isMobile ? 150 : 100);
        };
        
        // 패시브 리스너로 성능 최적화
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // 모바일에서 터치 이벤트 추가
        if (this.isMobile) {
            let touchEndTimeout;
            
            document.addEventListener('touchend', () => {
                clearTimeout(touchEndTimeout);
                touchEndTimeout = setTimeout(() => {
                    this.isScrolling = false;
                    this.setActiveTabByScrollPosition();
                }, 200);
            }, { passive: true });
        }
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
                
                // 클릭으로 인한 스크롤임을 표시
                this.isClickScrolling = true;
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
                    
                    // 클릭으로 즉시 해당 탭 활성화
                    this.setActiveTab(targetId);
                    
                    // iOS에서 더 긴 대기 시간
                    const waitTime = this.isMobile ? 1200 : 800;
                    setTimeout(() => {
                        this.isScrolling = false;
                        this.isClickScrolling = false; // 클릭 스크롤 종료
                    }, waitTime);
                }
            });
        });

        window.addEventListener('resize', this.debounce(() => {
            this.calculateSectionPositions();
            this.setActiveTabByScrollPosition();
        }, 250));
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
        this.calculateSectionPositions();
        this.setActiveTabByScrollPosition();
    }

    updateSections() {
        this.sections = document.querySelectorAll('.content-section');
        this.calculateSectionPositions();
        this.setActiveTabByScrollPosition();
    }
}

// DOM이 로드되면 스크롤 스파이 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MobileScrollSpy();
});
