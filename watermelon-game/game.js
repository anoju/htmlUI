// Matter.js 모듈 설정
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const Body = Matter.Body;

// 게임 상수 정의
const GAME_OVER_LINE_Y = 150;
const CANVAS_WIDTH = 620;
const CANVAS_HEIGHT = 850;
const FRUIT_SPAWN_Y = 40;
const CHECK_DELAY = 2000;

// 과일 정보 정의
const FRUITS = [
    { name: 'cherry', radius: 25 },
    { name: 'strawberry', radius: 35 },
    { name: 'grape', radius: 45 }, 
    { name: 'orange', radius: 55 },
    { name: 'apple', radius: 65 },
    { name: 'watermelon', radius: 75 }
];

// 게임 변수 초기화
let currentFruit = null;
let currentBody = null;
let gameOver = false;
let isDragging = false;
let dragStartX = 0;
let nextFruitReady = true;
let checkTimeout = null;

// Matter.js 엔진 설정
const engine = Engine.create();
const world = engine.world;

// 렌더러 설정
const render = Render.create({
    canvas: document.getElementById('canvas'),
    engine: engine,
    options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        wireframes: false,
        background: '#F7F4C8'
    }
});

// 게임 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: '#E6B143' }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: '#E6B143' }
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: '#E6B143' }
});

const topLine = Bodies.rectangle(310, GAME_OVER_LINE_Y, 620, 2, {
    name: 'topLine',
    isStatic: true,
    isSensor: true,
    render: { fillStyle: '#E6B143' }
});

// 월드에 벽 추가
World.add(world, [leftWall, rightWall, ground, topLine]);

// 새로운 과일 생성 함수
function addFruit() {
    if (!nextFruitReady || gameOver) return;
    
    const index = Math.floor(Math.random() * 5);
    const fruit = FRUITS[index];
    
    const img = new Image();
    img.src = `${fruit.name}.png`;
    
    currentBody = Bodies.circle(CANVAS_WIDTH/2, FRUIT_SPAWN_Y, fruit.radius, {
        index: index,
        isSleeping: true,
        render: {
            sprite: {
                texture: `${fruit.name}.png`,
                xScale: fruit.radius * 2 / img.width,
                yScale: fruit.radius * 2 / img.height
            }
        },
        restitution: 0.2,
        friction: 0.01
    });
    
    World.add(world, currentBody);
    currentFruit = fruit;
    nextFruitReady = false;
}

// 과일 드롭 함수
function dropFruit() {
    if (gameOver) return;
    
    currentBody.isSleeping = false;
    setTimeout(() => {
        nextFruitReady = true;
        addFruit();
    }, 1000);
}

// 게임 초기화 함수
function initGame() {
    gameOver = false;
    nextFruitReady = true;
    currentBody = null;
    currentFruit = null;
    addFruit();
}

// 게임 재시작 함수
function restartGame() {
    if (checkTimeout) {
        clearTimeout(checkTimeout);
        checkTimeout = null;
    }
    
    const bodies = Matter.Composite.allBodies(engine.world);
    bodies.forEach(body => {
        if (!body.isStatic) {
            World.remove(world, body);
        }
    });
    
    initGame();
}

// 터치 이벤트 리스너
canvas.addEventListener('touchstart', (e) => {
    if (gameOver) return;
    isDragging = true;
    dragStartX = e.touches[0].clientX;
});

canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || gameOver) return;
    
    const deltaX = e.touches[0].clientX - dragStartX;
    if (currentBody.position.x + deltaX > 30 && currentBody.position.x + deltaX < 590) {
        Body.setPosition(currentBody, {
            x: currentBody.position.x + deltaX,
            y: currentBody.position.y
        });
    }
    dragStartX = e.touches[0].clientX;
});

canvas.addEventListener('touchend', () => {
    if (gameOver) return;
    isDragging = false;
    dropFruit();
});

// 마우스 이벤트 리스너
canvas.addEventListener('mousedown', (e) => {
    if (gameOver) return;
    isDragging = true;
    dragStartX = e.clientX;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || gameOver) return;
    
    const deltaX = e.clientX - dragStartX;
    if (currentBody.position.x + deltaX > 30 && currentBody.position.x + deltaX < 590) {
        Body.setPosition(currentBody, {
            x: currentBody.position.x + deltaX,
            y: currentBody.position.y
        });
    }
    dragStartX = e.clientX;
});

canvas.addEventListener('mouseup', () => {
    if (gameOver) return;
    isDragging = false;
    dropFruit();
});

// 충돌 감지 이벤트
Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) {
            World.remove(world, [collision.bodyA, collision.bodyB]);
            
            const newFruit = FRUITS[collision.bodyA.index + 1];
            if (newFruit) {
                const img = new Image();
                img.src = `${newFruit.name}.png`;
                
                const newBody = Bodies.circle(
                    collision.collision.supports[0].x,
                    collision.collision.supports[0].y,
                    newFruit.radius,
                    {
                        index: collision.bodyA.index + 1,
                        render: {
                            sprite: {
                                texture: `${newFruit.name}.png`,
                                xScale: newFruit.radius * 2 / img.width,
                                yScale: newFruit.radius * 2 / img.height
                            }
                        }
                    }
                );
                World.add(world, newBody);
            }
        }
    });
});

// 게임오버 체크
Events.on(engine, 'afterUpdate', () => {
    if (gameOver) return;
    
    const bodies = Matter.Composite.allBodies(engine.world);
    let hasStableFruitAboveLine = false;

    bodies.forEach(body => {
        if (body.isStatic || body === currentBody) return;
        
        if (Math.abs(body.velocity.x) < 0.5 && 
            Math.abs(body.velocity.y) < 0.5 && 
            body.position.y < GAME_OVER_LINE_Y) {
            hasStableFruitAboveLine = true;
        }
    });

    if (hasStableFruitAboveLine) {
        if (!checkTimeout) {
            checkTimeout = setTimeout(() => {
                if (!gameOver) {
                    gameOver = true;
                    if (confirm('Game Over! 다시 시작하시겠습니까?')) {
                        restartGame();
                    }
                }
            }, CHECK_DELAY);
        }
    } else {
        if (checkTimeout) {
            clearTimeout(checkTimeout);
            checkTimeout = null;
        }
    }
});

// 엔진 실행
Engine.run(engine);
Render.run(render);
initGame();
