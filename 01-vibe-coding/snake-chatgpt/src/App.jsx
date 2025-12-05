import React from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';

const CELL_SIZE = 20;

export default function SnakeGame() {
  const {
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
  } = useSnakeGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-green-700 p-8">
      <div className="bg-white rounded-lg shadow-2xl p-6 mb-4">
        <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">Snake Game</h1>
        <div className="text-xl font-semibold text-green-700 text-center mb-4">
          Score: {score}
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-gray-700 font-medium">Mode:</span>
          <button
            onClick={toggleWallMode}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              wallMode 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {wallMode ? '🧱 Walls' : '🌀 Pass-Through'}
          </button>
        </div>
      </div>

      <div 
        className="relative bg-gray-900 rounded-lg shadow-2xl"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
          border: '4px solid #065f46'
        }}
      >
        {/* Grid background */}
        <div className="absolute inset-0">
          {Array.from({ length: GRID_SIZE }).map((_, i) =>
            Array.from({ length: GRID_SIZE }).map((_, j) => (
              <div
                key={`${i}-${j}`}
                className="absolute border border-gray-800"
                style={{
                  left: j * CELL_SIZE,
                  top: i * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE
                }}
              />
            ))
          )}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-green-500 rounded-sm"
            style={{
              left: segment[0] * CELL_SIZE + 1,
              top: segment[1] * CELL_SIZE + 1,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              backgroundColor: i === 0 ? '#10b981' : '#34d399'
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: food[0] * CELL_SIZE + 2,
            top: food[1] * CELL_SIZE + 2,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4
          }}
        />

        {/* Overlays */}
        {!gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-white text-2xl font-bold mb-4">Press SPACE to Start</h2>
              <p className="text-gray-300">Use Arrow Keys to Move</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Game Over!</h2>
              <p className="text-gray-300 text-xl mb-4">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {isPaused && !gameOver && gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <h2 className="text-white text-3xl font-bold">Paused</h2>
          </div>
        )}
      </div>

      <div className="mt-6 text-white text-center">
        <p className="mb-2">🎮 Use Arrow Keys or WASD to move</p>
        <p>⏸️ Press SPACE to pause/resume</p>
      </div>
    </div>
  );
}