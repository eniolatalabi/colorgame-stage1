import React, { useState } from "react";
import Game from "./components/Game";
import "./styles.css";

function App() {
  const [gameKey, setGameKey] = useState(0); // Force re-render on reset

  const resetGame = () => {
    setGameKey(prevKey => prevKey + 1); // Reset game state by remounting
  };

  return (
    <div className="app">
      <Game 
        key={gameKey} 
        resetGame={resetGame} 
      />
    </div>
  );
}

export default App;