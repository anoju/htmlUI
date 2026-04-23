/**
 * 우주 배경 애니메이션을 캔버스에 렌더링하는 함수입니다.
 * 
 * @param {string|HTMLCanvasElement} canvasElement - 애니메이션을 그릴 캔버스 DOM 요소 자체 또는 ID 문자열
 * @param {Object} [options={}] - 애니메이션 세부 설정 옵션 객체
 * @param {string[]} [options.starColors=['#ffffff', '#ffe9c4', '#d4fbff', '#f4d7ff', '#a3c2ff']] - 일반 별들이 가질 수 있는 색상 배열 (렌더링 시 랜덤 선택)
 * @param {number} [options.starDensity=1200] - 별의 밀도. (화면 넓이 / starDensity) 공식으로 별 개수를 산정하므로, 수치가 낮을수록 별이 더 촘촘히 렌더링됩니다.
 * @param {number} [options.maxShootingStars=3] - 화면에 동시에 렌더링 될 수 있는 별똥별의 최대 개수
 * @param {number[]} [options.shootingStarWaitTime=[200, 1000]] - 별똥별이 다시 등장하기까지의 프레임(Frame) 단위 대기 시간 범위 [최소, 최대]
 * @param {number[]} [options.shootingStarSpeed=[8, 23]] - 별똥별이 우하단으로 대각선 낙하하는 이동 속도 범위 [최소, 최대]
 * @param {number[]} [options.shootingStarLength=[50, 150]] - 별똥별 꼬리의 길이 범위 [최소, 최대]
 * @param {number} [options.starSpeedMultiplier=1] - 일반 별들이 흘러가는 속도 배수 (예: 1.5 설정 시 기본 속도보다 1.5배 빠르게 이동)
 * @param {string[]} [options.backgroundColors=['#101525', '#050711', '#000000']] - 우주 배경 그라디언트를 구성하는 색상 배열. 길이에 맞춰 자동으로 균등 분배됩니다.
 * @param {string} [options.backgroundType='radial'] - 배경 그라디언트 렌더링 타입. 'radial'(방사형, 중심에서 퍼짐) 또는 'linear'(선형, 위에서 아래로) 선택.
 * @param {string} [options.starDistribution='uniform'] - 별들의 Y좌표(세로) 분포 형태. 'uniform'(균등 분포), 'top'(상단 밀집), 'bottom'(하단 밀집) 중 선택.
 * @param {number} [options.starDistributionPower=1.5] - starDistribution이 'top' 또는 'bottom'일 때 별들이 쏠리는 강도. 수치가 클수록 한쪽으로 더 극단적으로 몰립니다.
 * @returns {Object} { destroy: Function } - 캔버스 리사이즈 이벤트 리스너 제거 및 애니메이션 프레임 호출을 멈추는 메모리 해제용 정리(Clean-up) 객체를 반환합니다.
 */
function createGalaxyAnimation(canvasElement, options = {}) {
  const canvas = typeof canvasElement === 'string' ? document.getElementById(canvasElement) : canvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');

  // 기본 옵션과 사용자 옵션 병합 (JSDoc에 명시된 기본값과 동일하게 유지)
  const config = {
    starColors: ['#ffffff', '#ffe9c4', '#d4fbff', '#f4d7ff', '#a3c2ff'],
    starDensity: 1200, 
    maxShootingStars: 3,
    shootingStarWaitTime: [200, 1000], 
    shootingStarSpeed: [8, 23], 
    shootingStarLength: [50, 150],
    starSpeedMultiplier: 1, 
    backgroundColors: ['#101525', '#050711', '#000000'],
    backgroundType: 'radial', 
    starDistribution: 'uniform', 
    starDistributionPower: 1.5, 
    ...options
  };

  let width, height;
  let stars = [];
  let shootingStars = [];
  let animationFrameId;

  // 별의 Y 좌표를 설정된 분포(starDistribution)에 따라 계산하는 함수
  function getDistributedY() {
    let rand = Math.random();
    
    // power 값이 0 이하가 되지 않도록 방어 코드
    const power = Math.max(1, config.starDistributionPower); 
    
    if (config.starDistribution === 'top') {
      // 0(위쪽)에 가깝게 몰림
      // 기존 Math.pow(rand, power)는 0에 무한대로 몰려 선이 생기는(Infinite Spike) 문제가 있었습니다.
      // 1 - Math.pow(rand, 1 / power)를 사용하면 가장자리 최대 밀도가 power 배수로 유한하게 제한되며 부드러운 그라데이션이 형성됩니다.
      rand = 1 - Math.pow(rand, 1 / power);
    } else if (config.starDistribution === 'bottom') {
      // 1(아래쪽)에 가깝게 몰림
      rand = Math.pow(rand, 1 / power);
    }
    
    return rand * height;
  }

  class Star {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : width + Math.random() * 100;
      this.y = getDistributedY();
      this.radius = Math.random() * 1.5 + 0.2;
      
      this.alpha = Math.random();
      this.alphaChange = (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? 1 : -1);
      this.depth = this.radius / 1.7; 
      
      this.vx = -this.depth * 0.15 * config.starSpeedMultiplier;
      this.vy = this.depth * 0.02 * config.starSpeedMultiplier;
      
      this.color = config.starColors[Math.floor(Math.random() * config.starColors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      this.alpha += this.alphaChange;
      if (this.alpha <= 0.1) {
        this.alphaChange = Math.abs(this.alphaChange);
      } else if (this.alpha >= 1) {
        this.alphaChange = -Math.abs(this.alphaChange);
      }

      if (this.x < -10 || this.y > height + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      
      if (this.radius > 1) {
        ctx.shadowBlur = this.radius * 3;
        ctx.shadowColor = this.color;
      }
      
      ctx.fill();
      ctx.restore();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * (width * 1.5);
      // 별똥별의 시작 Y 좌표도 어느 정도 분포를 따라가되 위에서 떨어지게 조정
      const topOffset = config.starDistribution === 'bottom' ? height * 0.5 : -500;
      this.y = config.starDistribution === 'bottom' ? getDistributedY() : -Math.random() * 500;
      
      this.len = Math.random() * (config.shootingStarLength[1] - config.shootingStarLength[0]) + config.shootingStarLength[0];
      this.speed = Math.random() * (config.shootingStarSpeed[1] - config.shootingStarSpeed[0]) + config.shootingStarSpeed[0];
      this.size = Math.random() * 1.5 + 0.5;
      
      this.waitTime = Math.random() * (config.shootingStarWaitTime[1] - config.shootingStarWaitTime[0]) + config.shootingStarWaitTime[0]; 
      this.active = false;
      
      this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); 
      this.vx = -Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
    }

    update() {
      if (this.active) {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < -this.len || this.y > height + this.len) {
          this.active = false;
          this.reset();
        }
      } else {
        if (this.waitTime > 0) {
          this.waitTime--;
        } else {
          this.active = true;
        }
      }
    }

    draw() {
      if (!this.active) return;
      
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      
      const tailX = this.x - this.vx * (this.len / this.speed);
      const tailY = this.y - this.vy * (this.len / this.speed);
      
      ctx.lineTo(tailX, tailY);
      ctx.lineWidth = this.size;
      
      const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffffff';
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }
  }

  function initStars() {
    stars = [];
    const numStars = Math.floor((width * height) / config.starDensity); 
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }

    shootingStars = [];
    for (let i = 0; i < config.maxShootingStars; i++) {
      shootingStars.push(new ShootingStar());
    }
  }

  function drawBackground() {
    let gradient;
    const colorStopsCount = config.backgroundColors.length;

    if (config.backgroundType === 'linear') {
      // 선형 그라디언트 (위에서 아래로)
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      config.backgroundColors.forEach((color, index) => {
        gradient.addColorStop(index / (colorStopsCount - 1), color);
      });
    } else {
      // 방사형 그라디언트
      gradient = ctx.createRadialGradient(
        width * 0.3, height * 0.3, 0, 
        width / 2, height / 2, Math.max(width, height)
      );
      config.backgroundColors.forEach((color, index) => {
        gradient.addColorStop(index / (colorStopsCount - 1), color);
      });
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function animate() {
    drawBackground();
    
    stars.forEach(star => {
      star.update();
      star.draw();
    });

    shootingStars.forEach(shootingStar => {
      shootingStar.update();
      shootingStar.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
  }

  window.addEventListener('resize', handleResize);
  handleResize();
  animate();

  return {
    destroy: () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    }
  };
}
