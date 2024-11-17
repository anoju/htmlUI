class MazeGame {
  constructor(width, height, cellSize) {
    this.canvas = document.getElementById('mazeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.cellSize = cellSize;
    this.cols = width;
    this.rows = height;

    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;

    this.maze = Array(this.rows).fill().map(() => Array(this.cols).fill(1));
    this.path = Array(this.rows).fill().map(() => Array(this.cols).fill(0));

    this.start = {
      x: 0,
      y: 0
    };
    this.end = {
      x: 0,
      y: 0
    };
    this.playerX = 0;
    this.playerY = 0;
    this.playerDirection = 'right'; // 캐릭터 방향

    // 이미지 로드
    this.playerAngle = 0;
    this.loadImages();

    this.isDragging = false;
    this.setupEventListeners();
  }

  generateMaze() {
    // 재귀적 백트래킹을 사용한 미로 생성
    const stack = [];
    const startX = 1;
    const startY = 1;

    this.maze[startY][startX] = 0;
    stack.push([startX, startY]);

    while (stack.length > 0) {
      const [currentX, currentY] = stack[stack.length - 1];
      const neighbors = this.getUnvisitedNeighbors(currentX, currentY);

      if (neighbors.length === 0) {
        stack.pop();
      } else {
        const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.maze[nextY][nextX] = 0;
        this.maze[(currentY + nextY) / 2][(currentX + nextX) / 2] = 0;
        stack.push([nextX, nextY]);
      }
    }
  }
  getUnvisitedNeighbors(x, y) {
    const neighbors = [];
    const directions = [
      [0, -2], // 상
      [2, 0], // 우
      [0, 2], // 하
      [-2, 0] // 좌
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      // 범위 체크를 수정하여 더 넓은 영역 허용
      if (newX > 0 && newX < this.cols - 1 &&
        newY > 0 && newY < this.rows - 1 &&
        this.maze[newY][newX] === 1) {

        // 중간 벽이 아직 뚫리지 않았는지 확인
        const wallY = (y + newY) / 2;
        const wallX = (x + newX) / 2;
        if (this.maze[wallY][wallX] === 1) {
          neighbors.push([newX, newY]);
        }
      }
    }
    return neighbors;
  }

  initializeNewMaze() {
    // 미로 초기화
    this.maze = Array(this.rows).fill().map(() => Array(this.cols).fill(1));
    this.path = Array(this.rows).fill().map(() => Array(this.cols).fill(0));

    // 미로 생성
    this.generateMaze();

    // 시작점과 도착점 랜덤 설정
    this.setRandomStartEnd();

    // 플레이어 시작점으로 이동
    this.playerX = this.start.x;
    this.playerY = this.start.y;

    this.draw();
  }

  setRandomStartEnd() {
    // 가장자리에서 시작점과 도착점 랜덤 선택
    const sides = ['top', 'right', 'bottom', 'left'];
    const startSide = sides[Math.floor(Math.random() * sides.length)];
    let endSide;
    do {
      endSide = sides[Math.floor(Math.random() * sides.length)];
    } while (startSide === endSide);

    // 시작점 설정
    switch (startSide) {
      case 'top':
        this.start.x = this.findPassageInRow(1);
        this.start.y = 1;
        break;
      case 'right':
        this.start.x = this.cols - 2;
        this.start.y = this.findPassageInColumn(this.cols - 2);
        break;
      case 'bottom':
        this.start.x = this.findPassageInRow(this.rows - 2);
        this.start.y = this.rows - 2;
        break;
      case 'left':
        this.start.x = 1;
        this.start.y = this.findPassageInColumn(1);
        break;
    }

    // 도착점 설정
    switch (endSide) {
      case 'top':
        this.end.x = this.findPassageInRow(1);
        this.end.y = 1;
        break;
      case 'right':
        this.end.x = this.cols - 2;
        this.end.y = this.findPassageInColumn(this.cols - 2);
        break;
      case 'bottom':
        this.end.x = this.findPassageInRow(this.rows - 2);
        this.end.y = this.rows - 2;
        break;
      case 'left':
        this.end.x = 1;
        this.end.y = this.findPassageInColumn(1);
        break;
    }
  }

  findPassageInRow(row) {
    const passages = [];
    for (let x = 1; x < this.cols - 1; x++) {
      if (this.maze[row][x] === 0) {
        passages.push(x);
      }
    }
    return passages[Math.floor(Math.random() * passages.length)];
  }

  findPassageInColumn(col) {
    const passages = [];
    for (let y = 1; y < this.rows - 1; y++) {
      if (this.maze[y][col] === 0) {
        passages.push(y);
      }
    }
    return passages[Math.floor(Math.random() * passages.length)];
  }

  loadImages() {
    this.images = {
      character: new Image(),
      start: new Image(),
      end: new Image()
    };

    // 이미지 경로 설정
    this.images.character.src = 'character.png';
    this.images.start.src = 'start.png';
    this.images.end.src = 'end.png';

    // 모든 이미지가 로드되면 게임 시작
    let loadedImages = 0;
    const totalImages = Object.keys(this.images).length;

    const onImageLoad = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        this.initializeNewMaze();
      }
    };

    Object.values(this.images).forEach(img => {
      img.onload = onImageLoad;
    });
  }

  setRandomStartEnd() {
    // 왼쪽 벽 상단에 시작점 생성
    const startY = Math.floor(this.rows * 0.05); // 상단 25% 위치
    this.start.x = 0;
    this.start.y = startY;
    this.maze[startY][0] = 0; // 입구 뚫기
    this.maze[startY][1] = 0; // 입구 연결 통로

    // 오른쪽 벽 하단에 도착점 생성
    const endY = Math.floor(this.rows * 0.95); // 하단 75% 위치
    this.end.x = this.cols - 1;
    this.end.y = endY;
    this.maze[endY][this.cols - 1] = 0; // 출구 뚫기
    this.maze[endY][this.cols - 2] = 0; // 출구 연결 통로

    // 플레이어 시작 위치 설정
    this.playerX = this.start.x;
    this.playerY = this.start.y;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // const metaTag = document.createElement('meta');
    // metaTag.name = 'viewport';
    // metaTag.content = 'width=' + this.canvas.width;
    // document.head.appendChild(metaTag);
    const mazeEl = document.querySelector('.maze');
    mazeEl.style.width = this.canvas.width + 'px';
    mazeEl.style.height = this.canvas.height + 'px';

    // 미로와 경로 그리기
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.maze[y][x] === 1) {
          this.ctx.fillStyle = '#000';
          this.ctx.fillRect(x * this.cellSize, y * this.cellSize,
            this.cellSize, this.cellSize);
        }
        if (this.path[y][x] === 1) {
          this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
          this.ctx.fillRect(x * this.cellSize, y * this.cellSize,
            this.cellSize, this.cellSize);
        }
      }
    }

    // 시작점과 도착점 이미지 그리기
    this.ctx.drawImage(this.images.start,
      this.start.x * this.cellSize,
      this.start.y * this.cellSize,
      this.cellSize, this.cellSize);

    this.ctx.drawImage(this.images.end,
      this.end.x * this.cellSize,
      this.end.y * this.cellSize,
      this.cellSize, this.cellSize);

    // 캐릭터 이미지 회전하여 그리기
    this.drawRotatedCharacter();
  }

  drawRotatedCharacter() {
    const x = this.playerX * this.cellSize + this.cellSize / 2;
    const y = this.playerY * this.cellSize + this.cellSize / 2;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(this.playerAngle * Math.PI / 180);

    // 이미지의 중심을 기준으로 그리기
    this.ctx.drawImage(
      this.images.character,
      -this.cellSize / 2,
      -this.cellSize / 2,
      this.cellSize,
      this.cellSize
    );

    this.ctx.restore();
  }

  handleMove(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / this.cellSize);
    const y = Math.floor((clientY - rect.top) / this.cellSize);

    if (this.canMoveTo(x, y)) {
      // 부드러운 회전 애니메이션 추가
      this.animateRotation(x, y);

      this.playerX = x;
      this.playerY = y;
      this.path[y][x] = 1;
      this.draw();

      if (x === this.end.x && y === this.end.y) {
        setTimeout(() => {
          alert('도착! 새로운 미로를 생성합니다.');
          this.initializeNewMaze();
        }, 100);
      }
    }
  }

  animateRotation(newX, newY) {
    // 목표 각도 계산
    let targetAngle = this.playerAngle;
    if (newX > this.playerX) targetAngle = 0;
    else if (newX < this.playerX) targetAngle = 180;
    else if (newY > this.playerY) targetAngle = 90;
    else if (newY < this.playerY) targetAngle = 270;

    // 현재 각도와 목표 각도의 차이 계산
    let angleDiff = targetAngle - this.playerAngle;

    // 가장 짧은 회전 방향 선택
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    // 애니메이션 실행
    const steps = 10;
    const angleStep = angleDiff / steps;
    let currentStep = 0;

    const animate = () => {
      if (currentStep < steps) {
        this.playerAngle += angleStep;
        // 각도 정규화 (0-360 범위 유지)
        this.playerAngle = (this.playerAngle + 360) % 360;
        this.draw();
        currentStep++;
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  setupEventListeners() {
    // 마우스 이벤트
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.handleMove(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.handleMove(e.clientX, e.clientY);
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // 터치 이벤트
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.isDragging = true;
      const touch = e.touches[0];
      this.handleMove(touch.clientX, touch.clientY);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.isDragging) {
        const touch = e.touches[0];
        this.handleMove(touch.clientX, touch.clientY);
      }
    });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  handleMove(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / this.cellSize);
    const y = Math.floor((clientY - rect.top) / this.cellSize);

    // 현재 위치에서 목표 위치까지의 경로 확인
    if (this.canMoveTo(x, y)) {
      this.playerX = x;
      this.playerY = y;
      this.path[y][x] = 1; // 지나간 경로 표시
      this.draw();

      // 도착점 도달 확인
      if (x === this.end.x && y === this.end.y) {
        setTimeout(() => {
          alert('도착! 새로운 미로를 생성합니다.');
          this.initializeNewMaze();
        }, 100);
      }
    }
  }

  canMoveTo(x, y) {
    // 미로 범위 확인
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
      return false;
    }

    // 벽 확인
    if (this.maze[y][x] === 1) {
      return false;
    }

    // 현재 위치에서 인접한 칸으로만 이동 가능
    const dx = Math.abs(x - this.playerX);
    const dy = Math.abs(y - this.playerY);
    return dx + dy === 1;
  }
}