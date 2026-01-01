// 체스 게임 클래스
class ChessGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameMode = '2player';
        this.playerColor = 'white';
        this.aiDifficulty = 'beginner';
        this.beginnerMode = false;
        this.gameOver = false;
        this.capturedPieces = { white: [], black: [] };
        this.moveHistory = [];
        this.lastMove = null;

        // 체스 기물 유니코드
        this.pieces = {
            white: {
                king: '♔',
                queen: '♕',
                rook: '♖',
                bishop: '♗',
                knight: '♘',
                pawn: '♙'
            },
            black: {
                king: '♚',
                queen: '♛',
                rook: '♜',
                bishop: '♝',
                knight: '♞',
                pawn: '♟'
            }
        };
    }

    // 보드 초기화
    initializeBoard() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));

        // 흑 기물 배치
        this.board[0] = [
            { type: 'rook', color: 'black' },
            { type: 'knight', color: 'black' },
            { type: 'bishop', color: 'black' },
            { type: 'queen', color: 'black' },
            { type: 'king', color: 'black' },
            { type: 'bishop', color: 'black' },
            { type: 'knight', color: 'black' },
            { type: 'rook', color: 'black' }
        ];

        for (let i = 0; i < 8; i++) {
            this.board[1][i] = { type: 'pawn', color: 'black' };
            this.board[6][i] = { type: 'pawn', color: 'white' };
        }

        // 백 기물 배치
        this.board[7] = [
            { type: 'rook', color: 'white' },
            { type: 'knight', color: 'white' },
            { type: 'bishop', color: 'white' },
            { type: 'king', color: 'white' },
            { type: 'queen', color: 'white' },
            { type: 'bishop', color: 'white' },
            { type: 'knight', color: 'white' },
            { type: 'rook', color: 'white' }
        ];
    }

    // 보드 렌더링
    renderBoard() {
        const boardElement = document.getElementById('chessBoard');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.className += (row + col) % 2 === 0 ? ' light' : ' dark';
                square.dataset.row = row;
                square.dataset.col = col;

                // 마지막 이동 하이라이트
                if (this.lastMove) {
                    if ((row === this.lastMove.fromRow && col === this.lastMove.fromCol) ||
                        (row === this.lastMove.toRow && col === this.lastMove.toCol)) {
                        square.classList.add('last-move');
                    }
                }

                const piece = this.board[row][col];
                if (piece) {
                    square.textContent = this.pieces[piece.color][piece.type];
                    square.dataset.color = piece.color;
                    square.dataset.type = piece.type;
                }

                square.addEventListener('click', () => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }

        this.updateCapturedPieces();
    }

    // 칸 클릭 처리
    handleSquareClick(row, col) {
        if (this.gameOver) return;

        // 1인용 모드에서 AI 차례면 클릭 무시
        if (this.gameMode === '1player' && this.currentPlayer !== this.playerColor) {
            return;
        }

        const piece = this.board[row][col];

        if (this.selectedSquare) {
            // 이동 시도
            const [selectedRow, selectedCol] = this.selectedSquare;

            if (this.isValidMove(selectedRow, selectedCol, row, col)) {
                this.movePiece(selectedRow, selectedCol, row, col);
                this.selectedSquare = null;
                this.clearHighlights();

                this.switchPlayer();

                // 게임 종료 조건 확인
                if (this.isCheckmate(this.currentPlayer)) {
                    const winner = this.currentPlayer === 'white' ? '흑' : '백';
                    this.endGame(`체크메이트! ${winner}의 승리!`);
                    return;
                } else if (this.isStalemate(this.currentPlayer)) {
                    this.endGame('스테일메이트! 무승부입니다.');
                    return;
                } else if (this.isInCheck(this.currentPlayer)) {
                    this.highlightCheck();
                    this.updateStatus('체크!');
                }

                // AI 차례
                if (this.gameMode === '1player' && this.currentPlayer !== this.playerColor) {
                    setTimeout(() => this.makeAIMove(), 500);
                }
            } else {
                // 같은 편 기물 선택
                if (piece && piece.color === this.currentPlayer) {
                    this.selectedSquare = [row, col];
                    this.highlightSquare(row, col);
                    if (this.beginnerMode) {
                        this.highlightValidMoves(row, col);
                    }
                } else {
                    this.selectedSquare = null;
                    this.clearHighlights();
                }
            }
        } else {
            // 첫 번째 클릭
            if (piece && piece.color === this.currentPlayer) {
                this.selectedSquare = [row, col];
                this.highlightSquare(row, col);
                if (this.beginnerMode) {
                    this.highlightValidMoves(row, col);
                }
            }
        }
    }

    // 기물 이동
    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];

        // 기물 잡기
        if (capturedPiece) {
            this.capturedPieces[this.currentPlayer].push(capturedPiece);
        }

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // 폰 프로모션
        if (piece.type === 'pawn') {
            if ((piece.color === 'white' && toRow === 0) ||
                (piece.color === 'black' && toRow === 7)) {
                this.board[toRow][toCol] = { type: 'queen', color: piece.color };
            }
        }

        // 마지막 이동 저장
        this.lastMove = { fromRow, fromCol, toRow, toCol };

        this.moveHistory.push({ fromRow, fromCol, toRow, toCol, piece, capturedPiece });
        this.renderBoard();
    }

    // 유효한 이동인지 확인
    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (fromRow === toRow && fromCol === toCol) return false;

        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];

        if (!piece || piece.color !== this.currentPlayer) return false;
        if (targetPiece && targetPiece.color === this.currentPlayer) return false;

        let validMove = false;

        switch (piece.type) {
            case 'pawn':
                validMove = this.isValidPawnMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'rook':
                validMove = this.isValidRookMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'knight':
                validMove = this.isValidKnightMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'bishop':
                validMove = this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'queen':
                validMove = this.isValidQueenMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'king':
                validMove = this.isValidKingMove(fromRow, fromCol, toRow, toCol);
                break;
        }

        if (!validMove) return false;

        // 이동 후 체크 상태 확인
        return !this.wouldBeInCheck(fromRow, fromCol, toRow, toCol);
    }

    // 폰 이동 규칙
    isValidPawnMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;

        // 전진
        if (fromCol === toCol) {
            if (toRow === fromRow + direction && !this.board[toRow][toCol]) {
                return true;
            }
            // 첫 이동 시 2칸 전진
            if (fromRow === startRow && toRow === fromRow + 2 * direction &&
                !this.board[toRow][toCol] && !this.board[fromRow + direction][toCol]) {
                return true;
            }
        }

        // 대각선 공격
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
            if (this.board[toRow][toCol] && this.board[toRow][toCol].color !== piece.color) {
                return true;
            }
        }

        return false;
    }

    // 룩 이동 규칙
    isValidRookMove(fromRow, fromCol, toRow, toCol) {
        if (fromRow !== toRow && fromCol !== toCol) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }

    // 나이트 이동 규칙
    isValidKnightMove(fromRow, fromCol, toRow, toCol) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }

    // 비숍 이동 규칙
    isValidBishopMove(fromRow, fromCol, toRow, toCol) {
        if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }

    // 퀸 이동 규칙
    isValidQueenMove(fromRow, fromCol, toRow, toCol) {
        return this.isValidRookMove(fromRow, fromCol, toRow, toCol) ||
               this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
    }

    // 킹 이동 규칙
    isValidKingMove(fromRow, fromCol, toRow, toCol) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        return rowDiff <= 1 && colDiff <= 1;
    }

    // 경로가 비어있는지 확인
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;

        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.board[currentRow][currentCol]) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }

        return true;
    }

    // 체크 상태 확인
    isInCheck(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;

        const [kingRow, kingCol] = kingPos;
        const opponentColor = color === 'white' ? 'black' : 'white';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === opponentColor) {
                    const tempPlayer = this.currentPlayer;
                    this.currentPlayer = opponentColor;

                    let canAttack = false;
                    switch (piece.type) {
                        case 'pawn':
                            canAttack = this.isValidPawnMove(row, col, kingRow, kingCol) &&
                                       Math.abs(col - kingCol) === 1;
                            break;
                        case 'rook':
                            canAttack = this.isValidRookMove(row, col, kingRow, kingCol);
                            break;
                        case 'knight':
                            canAttack = this.isValidKnightMove(row, col, kingRow, kingCol);
                            break;
                        case 'bishop':
                            canAttack = this.isValidBishopMove(row, col, kingRow, kingCol);
                            break;
                        case 'queen':
                            canAttack = this.isValidQueenMove(row, col, kingRow, kingCol);
                            break;
                        case 'king':
                            canAttack = this.isValidKingMove(row, col, kingRow, kingCol);
                            break;
                    }

                    this.currentPlayer = tempPlayer;
                    if (canAttack) return true;
                }
            }
        }

        return false;
    }

    // 이동 후 체크 상태가 되는지 확인
    wouldBeInCheck(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        const inCheck = this.isInCheck(this.currentPlayer);

        this.board[fromRow][fromCol] = piece;
        this.board[toRow][toCol] = capturedPiece;

        return inCheck;
    }

    // 킹 위치 찾기
    findKing(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    // 체크메이트 확인
    isCheckmate(color) {
        if (!this.isInCheck(color)) return false;
        return !this.hasValidMoves(color);
    }

    // 스테일메이트 확인 (체크는 아니지만 이동할 수 없는 상태)
    isStalemate(color) {
        if (this.isInCheck(color)) return false;
        return !this.hasValidMoves(color);
    }

    // 유효한 이동이 있는지 확인
    hasValidMoves(color) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    // 모든 가능한 이동 가져오기
    getAllValidMoves(color) {
        const moves = [];

        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                                moves.push({ fromRow, fromCol, toRow, toCol });
                            }
                        }
                    }
                }
            }
        }

        return moves;
    }

    // AI 이동
    makeAIMove() {
        if (this.gameOver) return;

        const validMoves = this.getAllValidMoves(this.currentPlayer);

        // AI가 이동할 수 없으면 게임 종료
        if (validMoves.length === 0) {
            if (this.isInCheck(this.currentPlayer)) {
                const winner = this.currentPlayer === 'white' ? '흑' : '백';
                this.endGame(`체크메이트! ${winner}의 승리!`);
            } else {
                this.endGame('스테일메이트! 무승부입니다.');
            }
            return;
        }

        let selectedMove;

        switch (this.aiDifficulty) {
            case 'beginner':
                // 랜덤 이동
                selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                break;

            case 'intermediate':
                // 기물을 잡을 수 있으면 잡기, 아니면 랜덤
                selectedMove = this.findCapturingMove(validMoves) ||
                              validMoves[Math.floor(Math.random() * validMoves.length)];
                break;

            case 'advanced':
                // 평가 함수 사용
                selectedMove = this.findBestMove(validMoves);
                break;
        }

        const { fromRow, fromCol, toRow, toCol } = selectedMove;
        this.movePiece(fromRow, fromCol, toRow, toCol);

        this.switchPlayer();

        // 플레이어 차례에서 게임 종료 조건 확인
        if (this.isCheckmate(this.currentPlayer)) {
            const winner = this.currentPlayer === 'white' ? '흑' : '백';
            this.endGame(`체크메이트! ${winner}의 승리!`);
            return;
        } else if (this.isStalemate(this.currentPlayer)) {
            this.endGame('스테일메이트! 무승부입니다.');
            return;
        } else if (this.isInCheck(this.currentPlayer)) {
            this.highlightCheck();
            this.updateStatus('체크!');
        }
    }

    // 기물을 잡는 이동 찾기
    findCapturingMove(moves) {
        for (const move of moves) {
            if (this.board[move.toRow][move.toCol]) {
                return move;
            }
        }
        return null;
    }

    // 최선의 이동 찾기 (상급 AI)
    findBestMove(moves) {
        let bestMove = null;
        let bestScore = -Infinity;

        const pieceValues = {
            pawn: 1,
            knight: 3,
            bishop: 3,
            rook: 5,
            queen: 9,
            king: 1000
        };

        for (const move of moves) {
            let score = 0;

            // 기물 잡기 점수
            const targetPiece = this.board[move.toRow][move.toCol];
            if (targetPiece) {
                score += pieceValues[targetPiece.type] * 10;
            }

            // 중앙 제어 점수
            const centerDistance = Math.abs(move.toRow - 3.5) + Math.abs(move.toCol - 3.5);
            score += (7 - centerDistance) * 0.5;

            // 위협받는 기물 보호
            const movingPiece = this.board[move.fromRow][move.fromCol];
            if (this.isPieceUnderAttack(move.fromRow, move.fromCol)) {
                score += pieceValues[movingPiece.type] * 5;
            }

            // 랜덤 요소 추가
            score += Math.random() * 2;

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove || moves[0];
    }

    // 기물이 공격받고 있는지 확인
    isPieceUnderAttack(row, col) {
        const piece = this.board[row][col];
        if (!piece) return false;

        const opponentColor = piece.color === 'white' ? 'black' : 'white';
        const tempPlayer = this.currentPlayer;
        this.currentPlayer = opponentColor;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const attackingPiece = this.board[r][c];
                if (attackingPiece && attackingPiece.color === opponentColor) {
                    if (this.isValidMove(r, c, row, col)) {
                        this.currentPlayer = tempPlayer;
                        return true;
                    }
                }
            }
        }

        this.currentPlayer = tempPlayer;
        return false;
    }

    // 플레이어 교체
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateCurrentPlayer();
        this.updateStatus('');
    }

    // 하이라이트 관련
    highlightSquare(row, col) {
        this.clearHighlights();
        const squares = document.querySelectorAll('.square');
        const index = row * 8 + col;
        squares[index].classList.add('selected');
    }

    highlightValidMoves(row, col) {
        const squares = document.querySelectorAll('.square');

        for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
                if (this.isValidMove(row, col, toRow, toCol)) {
                    const index = toRow * 8 + toCol;
                    squares[index].classList.add('valid-move');
                    if (this.board[toRow][toCol]) {
                        squares[index].classList.add('has-piece');
                    }
                }
            }
        }
    }

    highlightCheck() {
        const kingPos = this.findKing(this.currentPlayer);
        if (kingPos) {
            const [row, col] = kingPos;
            const squares = document.querySelectorAll('.square');
            const index = row * 8 + col;
            squares[index].classList.add('in-check');
        }
    }

    clearHighlights() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('selected', 'valid-move', 'has-piece', 'in-check');
        });
    }

    // UI 업데이트
    updateCurrentPlayer() {
        const playerText = this.currentPlayer === 'white' ? '백' : '흑';
        document.getElementById('currentPlayer').textContent = `현재 차례: ${playerText}`;
    }

    updateStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    }

    updateCapturedPieces() {
        const capturedWhiteElement = document.getElementById('capturedWhite');
        const capturedBlackElement = document.getElementById('capturedBlack');

        capturedWhiteElement.innerHTML = this.capturedPieces.white
            .map(piece => `<span class="captured-piece">${this.pieces[piece.color][piece.type]}</span>`)
            .join('');

        capturedBlackElement.innerHTML = this.capturedPieces.black
            .map(piece => `<span class="captured-piece">${this.pieces[piece.color][piece.type]}</span>`)
            .join('');
    }

    endGame(message) {
        this.gameOver = true;
        this.updateStatus(message);
        this.clearHighlights();
    }

    // 게임 시작
    start(settings) {
        this.gameMode = settings.gameMode;
        this.playerColor = settings.playerColor;
        this.aiDifficulty = settings.aiDifficulty;
        this.beginnerMode = settings.beginnerMode;
        this.currentPlayer = 'white';
        this.gameOver = false;
        this.selectedSquare = null;
        this.capturedPieces = { white: [], black: [] };
        this.moveHistory = [];
        this.lastMove = null;

        this.initializeBoard();
        this.renderBoard();
        this.updateCurrentPlayer();
        this.updateStatus('');

        // AI가 백이면 먼저 이동
        if (this.gameMode === '1player' && this.playerColor === 'black') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
}

// UI 컨트롤
const game = new ChessGame();

document.getElementById('gameMode').addEventListener('change', (e) => {
    const difficultySection = document.getElementById('difficultySelection');
    const colorSection = document.getElementById('colorSelection');

    if (e.target.value === '1player') {
        difficultySection.style.display = 'block';
        colorSection.style.display = 'block';
    } else {
        difficultySection.style.display = 'none';
        colorSection.style.display = 'none';
    }
});

document.getElementById('startButton').addEventListener('click', () => {
    const settings = {
        gameMode: document.getElementById('gameMode').value,
        playerColor: document.getElementById('playerColor').value,
        aiDifficulty: document.getElementById('aiDifficulty').value,
        beginnerMode: document.getElementById('beginnerMode').checked
    };

    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';

    game.start(settings);
});

document.getElementById('resetButton').addEventListener('click', () => {
    document.getElementById('settingsPanel').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
});

// 규칙 모달 컨트롤
const modal = document.getElementById('rulesModal');
const rulesBtn = document.getElementById('rulesButton');
const closeBtn = document.querySelector('.close');

rulesBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
