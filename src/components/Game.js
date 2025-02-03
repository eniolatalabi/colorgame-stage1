import React, { useState, useEffect, useCallback } from "react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Game = ({ resetGame }) => {
  const [targetColor, setTargetColor] = useState(getRandomColor());
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStatus, setGameStatus] = useState("");
  const [isGameActive, setIsGameActive] = useState(true);
  const [animationClass, setAnimationClass] = useState("");

  const generateNewRound = useCallback(() => {
    const newColor = getRandomColor();
    setTargetColor(newColor);
    setAnimationClass("color-pop");

    let newOptions = [newColor];
    while (newOptions.length < 6) {
      const randomColor = getRandomColor();
      if (!newOptions.includes(randomColor)) newOptions.push(randomColor);
    }
    newOptions.sort(() => Math.random() - 0.5);
    setOptions(newOptions);

    const timeForStage = Math.max(8, 15 - Math.floor(stage / 2));
    setTimeLeft(timeForStage);
    setIsGameActive(true);
    setGameStatus("");
  }, [stage]);

  useEffect(() => {
    generateNewRound();
  }, [generateNewRound]);

  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive]);

  const handleGameOver = () => {
    setIsGameActive(false);
    setGameStatus(`Game Over! Final Score: ${score}`);
    setAnimationClass("game-over-scale");
  };

  const handleGuess = (selected) => {
    if (!isGameActive) return;

    if (selected === targetColor) {
      setAnimationClass("correct-bounce");
      setScore(prev => prev + 1);
      setStage(prev => prev + 1);
      setGameStatus("Correct! Next Stage...");
    } else {
      handleGameOver();
    }
  };

  return (
    <div className="game">
      <div className="stage-info">
        <h3 data-testid="stage">Stage: {stage}</h3>
        <div className="timer-bar">
          <div 
            className="timer-progress"
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      </div>

      <div 
        className={`color-box ${animationClass}`}
        style={{ backgroundColor: targetColor }}
        data-testid="colorBox"
        onAnimationEnd={() => setAnimationClass("")}
      ></div>

      <h2 data-testid="gameInstructions">Match the target color!</h2>

      <div className="options">
        {options.map((color, index) => (
          <button
            key={index}
            data-testid="colorOption"
            style={{ backgroundColor: color }}
            className={`color-button ${!isGameActive ? "disabled" : ""}`}
            onClick={() => handleGuess(color)}
            disabled={!isGameActive}
          ></button>
        ))}
      </div>

      <div className="status-container">
        <h3 data-testid="score">Score: {score}</h3>
        <h3 data-testid="gameStatus" className={`feedback ${animationClass}`}>
          {gameStatus}
        </h3>
      </div>

      <button 
        data-testid="newGameButton"
        onClick={resetGame} 
        className={`restart-btn ${!isGameActive ? 'game-over' : ''}`}
      >
        {isGameActive ? 'New Game' : 'Play Again'}
      </button>
    </div>
  );
};

export default Game;