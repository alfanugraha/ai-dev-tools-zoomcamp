import React, { useEffect, useRef, useState } from "react";

// Default export React component that renders a playable Snake game.
// Tailwind classes are used for styling. If you don't use Tailwind,
// basic inline styles are included so it still looks fine.

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

export default function SnakeGame({
  rows = 20,
  cols = 20,
  initialSpeed = 120, // ms per step
  cellSize = 18,
}) {
  const [snake, setSnake] = useState([
    { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
  ]);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(null);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const touchStartRef = useRef(null);
  const lastMoveRef = useRef({ x: 1, y: 0 });
  const moveQueuedRef = useRef(null);

  // Place food not on snake
  useEffect(() => {
    if (!food) spawnFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [food, snake]);

  function spawnFood() {
    const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
    let tries = 0;
    while (tries < 1000) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (!occupied.has(`${x},${y}`)) {
        setFood({ x, y });
        return;
      }
      tries++;
    }
    // fallback - no place left
    setFood(null);
  }

  // Controls (keyboard)
  useEffect(() => {
    function onKey(e) {
      const d = DIRECTIONS[e.key];
      if (!d) return;
      // prevent 180-degree reverse
      if (d.x === -dir.x && d.y === -dir.y) return;
      moveQueuedRef.current = d;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dir]);

  // Touch swipe detection for mobile
  function onTouchStart(e) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e) {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < 20) return; // ignore tiny swipes
    let chosen;
    if (absX > absY) chosen = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    else chosen = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
    if (chosen.x === -dir.x && chosen.y === -dir.y) return;
    moveQueuedRef.current = chosen;
    touchStartRef.current = null;
  }

  // Game loop
  useEffect(() => {
    if (!running) return;
    setGameOver(false);

    const interval = setInterval(() => {
      setSnake((prev) => {
        const nextDir = moveQueuedRef.current || lastMoveRef.current;
        if (moveQueuedRef.current) {
          lastMoveRef.current = moveQueuedRef.current;
          moveQueuedRef.current = null;
        }
        const head = prev[0];
        const newHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

        // check collisions with walls
        if (
          newHead.x < 0 ||
          newHead.x >= cols ||
          newHead.y < 0 ||
          newHead.y >= rows
        ) {
          clearInterval(interval);
          setRunning(false);
          setGameOver(true);
          return prev;
        }

        // check self collision
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].x === newHead.x && prev[i].y === newHead.y) {
            clearInterval(interval);
            setRunning(false);
            setGameOver(true);
            return prev;
          }
        }

        const ate = food && newHead.x === food.x && newHead.y === food.y;
        let newSnake = [newHead, ...prev];
        if (!ate) newSnake.pop();
        else {
          setScore((s) => s + 1);
          setFood(null);
          // speed up slightly every 5 points
          setSpeed((sp) => Math.max(40, sp - (score + 1) % 5 === 0 ? 5 : 0));
        }
        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, speed, food]);

  // Keep dir state in sync with lastMoveRef for rendering
  useEffect(() => {
    const current = lastMoveRef.current;
    setDir(current);
  }, [snake]);

  function startGame() {
    setSnake([{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }]);
    lastMoveRef.current = { x: 1, y: 0 };
    moveQueuedRef.current = null;
    setDir({ x: 1, y: 0 });
    setFood(null);
    setScore(0);
    setSpeed(initialSpeed);
    setGameOver(false);
    setRunning(true);
  }

  function pauseGame() {
    setRunning(false);
  }

  function resumeGame() {
    if (gameOver) return;
    setRunning(true);
  }

  // Draw grid using inline divs for simple preview (no canvas)
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
  };

  const cellKey = (x, y) => `${x},${y}`;

  const snakeSet = new Set(snake.map((p) => cellKey(p.x, p.y)));

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">React Snake</div>
        <div className="text-sm text-gray-600">Score: {score}</div>
        <div className="text-sm text-gray-600">Speed: {Math.round(1000 / speed)} steps/sec</div>
      </div>

      <div
        className="bg-gray-800/10 p-2 rounded-lg touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        <div
          className="bg-white rounded-md overflow-hidden border border-gray-200"
          style={{ ...gridStyle, display: "grid" }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const k = cellKey(c, r);
              const isSnake = snakeSet.has(k);
              const isHead = snake[0] && snake[0].x === c && snake[0].y === r;
              const isFood = food && food.x === c && food.y === r;
              return (
                <div
                  key={k}
                  className={`w-${cellSize} h-${cellSize} flex items-center justify-center`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    boxSizing: "border-box",
                    borderRight: "1px solid rgba(0,0,0,0.03)",
                    borderBottom: "1px solid rgba(0,0,0,0.03)",
                    background: isHead
                      ? "linear-gradient(180deg,#065f46,#10b981)"
                      : isSnake
                      ? "linear-gradient(180deg,#065f46,#34d399)"
                      : isFood
                      ? "radial-gradient(circle at 40% 30%, #ef4444 0,#ef4444 40%, transparent 41%)"
                      : "transparent",
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {!running && !gameOver && (
          <button
            onClick={startGame}
            className="px-3 py-1 bg-green-500 text-white rounded shadow"
          >
            Start
          </button>
        )}
        {!running && gameOver && (
          <button
            onClick={startGame}
            className="px-3 py-1 bg-red-500 text-white rounded shadow"
          >
            Restart
          </button>
        )}
        {running && (
          <button
            onClick={pauseGame}
            className="px-3 py-1 bg-yellow-400 text-black rounded shadow"
          >
            Pause
          </button>
        )}
        {!running && !gameOver && (
          <button
            onClick={resumeGame}
            className="px-3 py-1 bg-blue-500 text-white rounded shadow"
          >
            Resume
          </button>
        )}

        <button
          onClick={() => {
            setScore(0);
            setSnake([{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }]);
            setFood(null);
            setRunning(false);
            setGameOver(false);
          }}
          className="px-3 py-1 bg-gray-200 text-black rounded shadow"
        >
          Reset
        </button>
      </div>

      {gameOver && (
        <div className="mt-2 text-sm text-red-600">Game Over — score: {score}</div>
      )}

      <div className="mt-3 text-xs text-gray-500">Controls: Arrow keys or WASD. Swipe on mobile.</div>
    </div>
  );
}
