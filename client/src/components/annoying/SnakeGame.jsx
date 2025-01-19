import React, { useState, useEffect, useCallback } from 'react';
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const WIN_SCORE = 5;

const SnakeGame = ({ onClose, onWin }) => {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState([1, 0]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return [x, y];
  }, []);

  const checkCollision = useCallback((head) => {
    if (
      head[0] < 0 ||
      head[0] >= GRID_SIZE ||
      head[1] < 0 ||
      head[1] >= GRID_SIZE
    ) {
      return true;
    }
    return snake.slice(1).some(segment => 
      segment[0] === head[0] && segment[1] === head[1]
    );
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || score >= WIN_SCORE) {
      if (score >= WIN_SCORE) {
        // Call onWin callback when game is won
        setTimeout(() => {
          setIsOpen(false);
          onWin();
        }, 500);
      }
      return;
    }

    const newSnake = [...snake];
    const head = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1]
    ];

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(generateFood());
      setScore(prev => prev + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, score, checkCollision, generateFood, onWin]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      e.preventDefault();
      const keyMap = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
      };
      
      if (keyMap[e.key]) {
        const newDirection = keyMap[e.key];
        if (
          !(direction[0] === -newDirection[0] && direction[1] === -newDirection[1])
        ) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveSnake, INITIAL_SPEED);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [direction, moveSnake]);

  const resetGame = () => {
    setSnake([[0, 0]]);
    setFood(generateFood());
    setDirection([1, 0]);
    setScore(0);
    setGameOver(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Win the game to pass on this profile!</h2>
          <p className="text-lg">Score: {score}/{WIN_SCORE}</p>
          {score >= WIN_SCORE && (
            <p className="text-green-500 font-bold">You Won! Closing shortly...</p>
          )}
          {gameOver && (
            <div className="mt-2">
              <p className="text-red-500">Game Over!</p>
              <button 
                onClick={resetGame}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
        
        <div 
          className="border-2 border-gray-300 relative"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE
          }}
        >
          <div
            className="absolute bg-red-500 rounded-full"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: food[0] * CELL_SIZE,
              top: food[1] * CELL_SIZE
            }}
          />
          
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute bg-green-500"
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment[0] * CELL_SIZE,
                top: segment[1] * CELL_SIZE,
                borderRadius: index === 0 ? '4px' : '0'
              }}
            />
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Use arrow keys to control the snake. Reach 5 points to continue!
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SnakeGame;