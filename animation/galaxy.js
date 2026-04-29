/**
 * 우주 배경 애니메이션을 캔버스에 렌더링하는 함수입니다.
 *
 * @param {string|HTMLCanvasElement} canvasElement - 애니메이션을 그릴 캔버스 DOM 요소 자체 또는 ID 문자열
 * @param {Object} [options={}] - 애니메이션 세부 설정 옵션 객체
 * @param {string[]} [options.starColors=['#ffffff', '#ffe9c4', '#d4fbff', '#f4d7ff', '#a3c2ff']] - 일반 별들이 가질 수 있는 색상 배열 (렌더링 시 랜덤 선택)
 * @param {number} [options.starDensity=3000] - 별의 밀도. (화면 넓이 / starDensity) 공식으로 별 개수를 산정하므로, 수치가 낮을수록 별이 더 촘촘히 렌더링됩니다.
 * @param {number} [options.maxShootingStars=3] - 화면에 동시에 렌더링 될 수 있는 별똥별의 최대 개수
 * @param {number[]} [options.shootingStarWaitTime=[200, 1000]] - 별똥별이 다시 등장하기까지의 프레임(Frame) 단위 대기 시간 범위 [최소, 최대]
 * @param {number[]} [options.shootingStarSpeed=[8, 23]] - 별똥별이 우하단으로 대각선 낙하하는 이동 속도 범위 [최소, 최대]
 * @param {number[]} [options.shootingStarLength=[50, 150]] - 별똥별 꼬리의 길이 범위 [최소, 최대]
 * @param {number[]} [options.starSize=[0.2, 1.7]] - 일반 별의 크기 범위 [최소, 최대] (기본값 [0.2, 1.7])
 * @param {number} [options.starSpeedMultiplier=1] - 일반 별들이 흘러가는 속도 배수 (예: 1.5 설정 시 기본 속도보다 1.5배 빠르게 이동)
 * @param {number} [options.starTwinkleSpeed=1] - 별들이 깜빡이는(반짝이는) 속도 배수. ( 0.01 ~ 1: 작을수록 느려짐)
 * @param {number} [options.starTwinkleDelay=1000] - 별이 완전히 어두워진 후 다시 밝아지기까지 대기하는 기본 시간(프레임) 값이 커질수록 별이 오랫동안 꺼져 있음
 * @param {number} [options.starMinAlpha=0.03] - 별이 깜빡이지 않고 대기할 때의 최소 투명도 (0 ~ 1, 기본값 0.03). 값이 0이면 완전히 안 보입니다.
 * @param {number} [options.crossStarSizeThreshold=0.7] - 십자가(+) 모양으로 빛나기 위한 최소 크기 비율 (0 ~ 1, 기본값 0.7: 상위 30% 크기)
 * @param {number} [options.crossStarProbability=0.3] - 크기 기준을 만족하는 별 중 십자가(+)로 빛날 확률 (0 ~ 1, 기본값 0.3: 30% 확률)
 * @param {number} [options.crossStarSizeMultiplier=1] - 십자가(+) 모양의 화면상 길이 배수 (기본값 1). 더 길게 하려면 1보다 큰 값 입력.
 * @param {string[]|null} [options.backgroundColors=null] - 우주 배경 그라디언트 색상 배열. null이면 캔버스 배경을 투명하게 비워두어 CSS로 배경을 제어할 수 있게 합니다.
 * @param {string} [options.backgroundType='radial'] - 배경 그라디언트 렌더링 타입. 'radial'(방사형) 또는 'linear'(선형) 선택.
 * @param {string} [options.starDistribution='uniform'] - 별들의 Y좌표(세로) 분포 형태. 'uniform'(균등 분포), 'top'(상단 밀집), 'bottom'(하단 밀집), 'center'(중앙 밀집) 중 선택.
 * @param {number} [options.starDistributionPower=1.5] - starDistribution이 'uniform'이 아닐 때 별들이 쏠리는 강도. 수치가 클수록 한쪽으로 더 극단적으로 몰립니다.
 * @returns {Object} { destroy: Function } - 캔버스 리사이즈 이벤트 리스너 제거 및 애니메이션 프레임 호출을 멈추는 메모리 해제용 정리(Clean-up) 객체를 반환합니다.
 */
function createGalaxyAnimation(canvasElement, options = {}) {
  const canvas =
    typeof canvasElement === "string"
      ? document.getElementById(canvasElement)
      : canvasElement;
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  // 기본 옵션과 사용자 옵션 병합 (JSDoc에 명시된 기본값과 동일하게 유지)
  const config = {
    starColors: ["#ffffff", "#ffe9c4", "#d4fbff", "#f4d7ff", "#a3c2ff"],
    starDensity: 3000,
    maxShootingStars: 3,
    shootingStarWaitTime: [200, 1000],
    shootingStarSpeed: [8, 23],
    shootingStarLength: [50, 150],
    starSize: [0.2, 1.7],
    starSpeedMultiplier: 1,
    starTwinkleSpeed: 1,
    starTwinkleDelay: 1000,
    starMinAlpha: 0.03,
    crossStarSizeThreshold: 0.7,
    crossStarProbability: 0.3,
    crossStarSizeMultiplier: 1,
    backgroundColors: null,
    backgroundType: "radial",
    starDistribution: "uniform",
    starDistributionPower: 1.5,
    ...options,
  };

  let width, height;
  let stars = [];
  let shootingStars = [];
  let animationFrameId;
  let backgroundGradient = null;
  let dpr = window.devicePixelRatio || 1;

  // 별의 Y 좌표를 설정된 분포(starDistribution)에 따라 계산하는 함수
  function getDistributedY() {
    let rand = Math.random();

    // power 값이 0 이하가 되지 않도록 방어 코드
    const power = Math.max(1, config.starDistributionPower);

    if (config.starDistribution === "top") {
      // 0(위쪽)에 가깝게 몰림
      rand = 1 - Math.pow(rand, 1 / power);
    } else if (config.starDistribution === "bottom") {
      // 1(아래쪽)에 가깝게 몰림
      rand = Math.pow(rand, 1 / power);
    } else if (config.starDistribution === "center") {
      // 0.5(중앙)에 가깝게 몰림
      const sign = rand < 0.5 ? -1 : 1;
      const shiftedRand = Math.abs(rand - 0.5) * 2; // 0 ~ 1
      const val = 1 - Math.pow(shiftedRand, 1 / power); // 0 근처로 몰림
      rand = 0.5 + sign * val * 0.5;
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

      // 설정된 크기 범위 내에서 랜덤 크기 할당
      this.radius =
        Math.random() * (config.starSize[1] - config.starSize[0]) +
        config.starSize[0];

      // 로딩/실행 초기에는 별이 완전히 안 켜진(어두운) 상태로 시작
      this.alpha = config.starMinAlpha;
      // 어두운 상태에서 시작하므로 무조건 점차 밝아지는 방향(양수)으로 설정
      this.alphaChange =
        (Math.random() * 0.015 + 0.005) * config.starTwinkleSpeed;

      // 원근감(depth)은 최대 크기 대비 현재 크기의 비율로 계산
      this.depth = this.radius / config.starSize[1];

      this.vx = -this.depth * 0.15 * config.starSpeedMultiplier;
      this.vy = this.depth * 0.02 * config.starSpeedMultiplier;

      this.color =
        config.starColors[Math.floor(Math.random() * config.starColors.length)];

      this.twinkleWait = Math.random() * config.starTwinkleDelay; // 초기 랜덤 대기 시간 부여

      // 설정된 크기 비율과 확률에 따라 십자가 모양 별로 지정
      const sizeThreshold =
        config.starSize[0] +
        (config.starSize[1] - config.starSize[0]) *
          config.crossStarSizeThreshold;
      this.isCrossStar =
        this.radius > sizeThreshold &&
        Math.random() < config.crossStarProbability;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // 빛이 최소 밝기 이하로 내려간 상태에서 대기 시간이 남았다면 대기
      if (this.alpha <= config.starMinAlpha && this.twinkleWait > 0) {
        this.twinkleWait--;
      } else {
        this.alpha += this.alphaChange;

        if (this.alpha <= config.starMinAlpha) {
          this.alpha = config.starMinAlpha;
          this.alphaChange = Math.abs(this.alphaChange);
          this.twinkleWait = Math.random() * config.starTwinkleDelay; // 다시 밝아지기 전 대기 시간 재설정
        } else if (this.alpha >= 1) {
          this.alpha = 1;
          this.alphaChange = -Math.abs(this.alphaChange);
        }
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

      // 밝아질 때(alpha > 0.5) 십자가 모양 렌더링 (Lens flare 효과)
      if (this.isCrossStar && this.alpha > 0.5) {
        const glowRatio = (this.alpha - 0.5) / 0.5; // 0 ~ 1
        const crossSize =
          this.radius * 7 * glowRatio * config.crossStarSizeMultiplier; // 십자가 길이
        const thickness = Math.max(0.2, this.radius * 0.15); // 십자가 두께

        ctx.globalAlpha = this.alpha * glowRatio;

        ctx.beginPath();
        // 정중앙 정렬 보장을 위해 직선(stroke)으로 십자가 그림
        ctx.moveTo(this.x - crossSize, this.y);
        ctx.lineTo(this.x + crossSize, this.y);
        ctx.moveTo(this.x, this.y - crossSize);
        ctx.lineTo(this.x, this.y + crossSize);

        ctx.lineWidth = thickness * 2;
        ctx.strokeStyle = this.color;
        ctx.lineCap = "round";
        ctx.stroke();
      }

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
      const topOffset =
        config.starDistribution === "bottom" ? height * 0.5 : -500;
      this.y =
        config.starDistribution === "bottom"
          ? getDistributedY()
          : -Math.random() * 500;

      this.len =
        Math.random() *
          (config.shootingStarLength[1] - config.shootingStarLength[0]) +
        config.shootingStarLength[0];
      this.speed =
        Math.random() *
          (config.shootingStarSpeed[1] - config.shootingStarSpeed[0]) +
        config.shootingStarSpeed[0];
      this.size = Math.random() * 1.5 + 0.5;

      this.waitTime =
        Math.random() *
          (config.shootingStarWaitTime[1] - config.shootingStarWaitTime[0]) +
        config.shootingStarWaitTime[0];
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
      ctx.shadowColor = "#ffffff";
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
    if (backgroundGradient) {
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      // 배경 그라디언트가 없으면 투명하게 캔버스를 지워서 CSS 배경이 보이도록 함
      ctx.clearRect(0, 0, width, height);
    }
  }

  function animate() {
    drawBackground();

    stars.forEach((star) => {
      star.update();
      star.draw();
    });

    shootingStars.forEach((shootingStar) => {
      shootingStar.update();
      shootingStar.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    // 고해상도(Retina) 디스플레이 대응
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 매 프레임 생성하던 배경 그라디언트를 리사이즈 시점에 1회 캐싱 (성능 대폭 최적화)
    if (config.backgroundColors && config.backgroundColors.length > 0) {
      const colorStopsCount = config.backgroundColors.length;
      if (config.backgroundType === "linear") {
        backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
        config.backgroundColors.forEach((color, index) => {
          backgroundGradient.addColorStop(index / (colorStopsCount - 1), color);
        });
      } else {
        backgroundGradient = ctx.createRadialGradient(
          width * 0.3,
          height * 0.3,
          0,
          width / 2,
          height / 2,
          Math.max(width, height),
        );
        config.backgroundColors.forEach((color, index) => {
          backgroundGradient.addColorStop(index / (colorStopsCount - 1), color);
        });
      }
    } else {
      backgroundGradient = null;
    }

    initStars();
  }

  window.addEventListener("resize", handleResize);
  handleResize();
  animate();

  return {
    destroy: () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    },
  };
}
