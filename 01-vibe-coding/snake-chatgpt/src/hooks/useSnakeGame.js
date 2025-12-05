import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_SPEED = 150;

export function useSnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState([15, 15]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [wallMode, setWallMode] = useState(true);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ];
    } while (currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood([15, 15]);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(p => !p);
  }, []);

  const toggleWallMode = useCallback(() => {
    setWallMode(w => !w);
  }, []);

  const changeDirection = useCallback((newDirection) => {
    setDirection(newDirection);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      let newHead = [head[0] + direction.x, head[1] + direction.y];

      // Handle wall collision based on mode
      if (wallMode) {
        // Wall mode: game over on collision
        if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }
      } else {
        // Pass-through mode: wrap around
        if (newHead[0] < 0) newHead[0] = GRID_SIZE - 1;
        if (newHead[0] >= GRID_SIZE) newHead[0] = 0;
        if (newHead[1] < 0) newHead[1] = GRID_SIZE - 1;
        if (newHead[1] >= GRID_SIZE) newHead[1] = 0;
      }

      // Check self collision
      if (prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, gameStarted, generateFood, wallMode]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted && e.key === ' ') {
        resetGame();
        return;
      }

      if (e.key === ' ') {
        togglePause();
        return;
      }

      if (isPaused || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) changeDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPaused, gameOver, gameStarted, resetGame, togglePause, changeDirection]);

  // Game loop
  useEffect(() => {
    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return {
    snake,
    food,
    score,
    gameOver,
    isPaused,
    gameStarted,
    wallMode,
    resetGame,
    toggleWallMode,
    GRID_SIZE
  };
}
