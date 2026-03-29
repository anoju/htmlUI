/**
 * ScrollInteractor - A lightweight library for Apple-style scroll interactive effects.
 * Designed for responsiveness and ease of use.
 *
 * @author Antigravity
 */

class ScrollInteractor {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || "body");
    this.scenes = options.scenes || [];
    this.acc = options.inertia || 0.1; // Smoothness factor

    this.yOffset = 0;
    this.delayedYOffset = 0;
    this.currentScene = 0;
    this.prevScrollHeight = 0;
    this.enterNewScene = false;
    this.rafId = null;
    this.rafState = false;

    this.init();
  }

  init() {
    this.yOffset = window.pageYOffset;
    this.delayedYOffset = this.yOffset;

    this.setLayout();
    this.bindEvents();
    this.loadImages();

    // Initial draw to show content for all scenes immediately
    const savedActive = this.currentScene;
    this.scenes.forEach((_, i) => {
      this.currentScene = i;
      this.prevScrollHeight = 0;
      for (let j = 0; j < i; j++) {
        this.prevScrollHeight += this.scenes[j].scrollHeight;
      }
      this.draw();
    });
    this.currentScene = savedActive;
    this.updateScroll(this.delayedYOffset);
    this.draw();
  }

  async loadImages() {
    for (const scene of this.scenes) {
      if (scene.imageSequence) {
        const { path, count, prefix, extension, startNum } =
          scene.imageSequence;
        scene.images = [];
        const promises = [];

        for (let i = 0; i < count; i++) {
          const img = new Image();
          const num = (startNum + i).toString();
          img.src = `${path}${prefix}${num}${extension}`;
          scene.images.push(img);

          promises.push(
            new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve; // Continue even if some images fail
            }),
          );
        }
        await Promise.all(promises);
      }
    }
    document.body.classList.remove("si-before-load");
    this.draw();
  }

  setLayout() {
    let totalHeight = 0;
    this.scenes.forEach((scene, i) => {
      const el = document.querySelector(scene.selector);
      if (!el) return;

      scene.el = el;
      if (scene.type === "sticky") {
        // height can be specified in vh (e.g., '500vh') or pixels
        const h =
          typeof scene.height === "string" && scene.height.endsWith("vh")
            ? (parseInt(scene.height) * window.innerHeight) / 100
            : scene.height || window.innerHeight * 5;
        scene.scrollHeight = h;
      } else {
        scene.scrollHeight = el.offsetHeight;
      }
      el.style.height = `${scene.scrollHeight}px`;

      // Auto-assign sticky class if it has a sticky container
      const stickyCont = el.querySelector(".si-sticky-container");
      if (stickyCont) el.classList.add("si-sticky-section");
    });

    this.yOffset = window.pageYOffset;
    let accumulatedHeight = 0;
    for (let i = 0; i < this.scenes.length; i++) {
      accumulatedHeight += this.scenes[i].scrollHeight;
      if (accumulatedHeight >= this.yOffset) {
        this.currentScene = i;
        break;
      }
    }
    this.updateBodyId();
  }

  bindEvents() {
    window.addEventListener("scroll", () => {
      this.yOffset = window.pageYOffset;
      this.updateScroll();
      if (!this.rafState) {
        this.rafId = requestAnimationFrame(() => this.loop());
        this.rafState = true;
      }
    });

    window.addEventListener("resize", () => {
      this.setLayout();
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.setLayout(), 500);
    });
  }

  updateScroll(pos = this.delayedYOffset) {
    this.enterNewScene = false;
    this.prevScrollHeight = 0;

    for (let i = 0; i < this.currentScene; i++) {
      this.prevScrollHeight += this.scenes[i].scrollHeight;
    }

    const currentSceneHeight = this.scenes[this.currentScene].scrollHeight;

    if (pos > this.prevScrollHeight + currentSceneHeight) {
      if (this.currentScene < this.scenes.length - 1) {
        this.currentScene++;
        this.enterNewScene = true;
        this.updateBodyId();
      }
    }

    if (pos < this.prevScrollHeight) {
      if (this.currentScene > 0) {
        this.currentScene--;
        this.enterNewScene = true;
        this.updateBodyId();
      }
    }
  }

  updateBodyId() {
    this.scenes.forEach((_, i) => {
      this.scenes[i].el?.classList.toggle(
        "si-show-scene",
        i === this.currentScene,
      );
    });
  }

  calcValue(values, currentYOffset, sceneHeight) {
    let rv;
    const scrollRatio = currentYOffset / sceneHeight;

    if (values.length === 3) {
      // [startValue, endValue, { start: 0.1, end: 0.2 }]
      const start = values[2].start * sceneHeight;
      const end = values[2].end * sceneHeight;
      const partHeight = end - start;

      if (currentYOffset >= start && currentYOffset <= end) {
        rv =
          ((currentYOffset - start) / partHeight) * (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < start) {
        rv = values[0];
      } else {
        rv = values[1];
      }
    } else {
      // [startValue, endValue]
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return rv;
  }

  loop() {
    this.delayedYOffset = this.delayedYOffset + (this.yOffset - this.delayedYOffset) * this.acc;

    // Ensure scene switching follows the inertia position
    this.updateScroll(this.delayedYOffset);

    if (Math.abs(this.yOffset - this.delayedYOffset) < 0.1) {
      this.delayedYOffset = this.yOffset;
      this.drawAll(); // Ensure final state is consistent for all
      this.rafState = false;
      cancelAnimationFrame(this.rafId);
      return;
    }

    this.drawAll();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  // Draw current and adjacent scenes to prevent flickers at boundaries
  drawAll() {
    this.draw(this.currentScene);
    if (this.currentScene > 0) this.draw(this.currentScene - 1);
    if (this.currentScene < this.scenes.length - 1) this.draw(this.currentScene + 1);
  }

  draw(sceneIndex = this.currentScene) {
    const scene = this.scenes[sceneIndex];
    if (!scene) return;

    // Calculate scene specific offsets for any index passed
    let prevScrollH = 0;
    for (let i = 0; i < sceneIndex; i++) {
      prevScrollH += this.scenes[i].scrollHeight;
    }

    const currentYOffset = this.delayedYOffset - prevScrollH;
    const rawYOffset = this.yOffset - prevScrollH;
    const sceneHeight = scene.scrollHeight;
    const scrollRatio = currentYOffset / sceneHeight;

    // Handle standard animations
    if (scene.animations) {
      Object.keys(scene.animations).forEach((selector) => {
        const animationSet = scene.animations[selector];
        const el = scene.el.querySelector(selector);
        if (!el) return;

        let opacity = 1;
        let translateY = 0;
        let translateX = 0;
        let scale = 1;
        let blur = 0;

        // Track if specific properties are being animated
        let hasOpacity = false;
        let hasTranslateY = false;
        let hasScale = false;

        Object.keys(animationSet).forEach((propKey) => {
          const values = animationSet[propKey];
          const val = this.calcValue(values, currentYOffset, sceneHeight);

          if (propKey.startsWith("opacity")) {
            opacity = hasOpacity ? opacity * val : val;
            hasOpacity = true;
          } else if (propKey.startsWith("translateY")) {
            translateY += val;
            hasTranslateY = true;
          } else if (propKey.startsWith("translateX")) {
            translateX += val;
          } else if (propKey.startsWith("scale")) {
            scale = hasScale ? scale * val : val;
            hasScale = true;
          } else if (propKey.startsWith("filter")) {
            blur += val;
          }
        });

        if (hasOpacity) el.style.opacity = opacity;

        let transformStr = "translate3d(-50%, -50%, 0)";
        if (hasTranslateY || translateX !== 0) {
          transformStr = `translate3d(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px), 0)`;
        }
        if (hasScale) {
          transformStr += ` scale(${scale})`;
        }
        el.style.transform = transformStr;

        if (blur > 0) el.style.filter = `blur(${blur}px)`;
      });
    }

    // Handle image sequence (Canvas)
    if (scene.imageSequence && scene.images && scene.images.length > 0) {
      const canvas = scene.el.querySelector("canvas");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const imgCount = scene.images.length;
        const sequence = Math.min(
          Math.floor(
            this.calcValue([0, imgCount - 1], currentYOffset, sceneHeight),
          ),
          imgCount - 1,
        );

        const img = scene.images[sequence];
        if (img && img.complete) {
          // Check for canvas opacity in animations
          let canvasOpacity = 1;
          if (scene.animations && scene.animations["canvas"]) {
            const anim = scene.animations["canvas"];
            Object.keys(anim).forEach((key) => {
              canvasOpacity *= this.calcValue(
                anim[key],
                currentYOffset,
                sceneHeight,
              );
            });
          }
          canvas.style.opacity = canvasOpacity;

          // Responsive canvas draw
          const canvasAspect = canvas.width / canvas.height;
          const imgAspect = img.width / img.height;

          // Cover effect
          let drawWidth, drawHeight, offsetX, offsetY;
          if (canvasAspect > imgAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * imgAspect;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      }
    }

    // Custom update callback
    if (scene.onUpdate) {
      scene.onUpdate({
        currentYOffset,
        rawYOffset,
        sceneHeight,
        scrollRatio,
        scene,
        interactor: this,
      });
    }
  }
}

window.ScrollInteractor = ScrollInteractor;
