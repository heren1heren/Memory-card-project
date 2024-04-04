import { useEffect, useState } from 'react';
import './App.scss';
import { log } from 'console';
/**
 * * features That I need to implement:
 * * currently working on handleCardClick and display score
 * *
 *
 */

export function App() {
  const [bestScore, setBestScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  if (currentScore > bestScore && currentScore !== 0) {
    setBestScore(currentScore);
  }
  return (
    <div id="app">
      <Header currentScore={currentScore} bestScore={bestScore} />
      <Main setCurrentScore={setCurrentScore} currentScore={currentScore} />
    </div>
  );
}

function Header({ currentScore, bestScore }) {
  return (
    <header>
      <div className="introduction">
        <h1>Pokemon Memory Card Game</h1>
        <p>
          Try to click new card to earn point. Clicking a card more than once
          will result in losing.
        </p>
      </div>
      <div className="score-board">
        <p>Current Score: {currentScore}</p>
        <p>Best Score: {bestScore}</p>
      </div>
    </header>
  );
}

function Main({ currentScore, setCurrentScore }) {
  const [list, setList] = useState([]);

  const [pickedPokemon, setPickedPokemon] = useState(['']);
  const checkingExistingCard = (target: string) => {
    for (let i = 0; i < pickedPokemon.length; i++) {
      if (pickedPokemon[i] === target) {
        return true;
      }
    }
    return false;
  };
  const handleCardClick = (e) => {
    // shuffle the list -> re-render the main section
    setList(returnShuffleArray(list));

    if (checkingExistingCard(e.currentTarget.id)) {
      setCurrentScore(0);
      setPickedPokemon(['template']);
    } else {
      setPickedPokemon([...pickedPokemon, e.currentTarget.id]);
      setCurrentScore(currentScore + 1);
    }
  };
  const renderList = (list: object[]) => {
    return list.map((e) => {
      return (
        <li
          key={e.imgSrc}
          className={`card `}
          id={e.name}
          onClick={handleCardClick}
        >
          <img src={e.imgSrc} alt={e.name} className="card-img" />
          <p className="card-name"> {e.name}</p>
        </li>
      );
    });
  };

  useEffect(() => {
    const array = [];
    const checkingDuplicatedElement = (target) => {
      for (let i = 0; i < array.length; i++) {
        // console.log(array[i].id);

        if (array[i].id === target.id) {
          return true;
        }
      }
      return false;
    };
    const fetchPokemonImageAndName = async () => {
      for (let i = 0; i < 12; i++) {
        const randomSeed = Math.round(Math.random() * 200);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${randomSeed}/`
        );
        const result = await response.json();

        if (result && !checkingDuplicatedElement(result)) {
          array.push({
            name: result.name,
            id: result.id,
            imgSrc: result.sprites.front_default,
          });
        } else {
          console.log('duplicating');
        }
      }
      setList(array);
    };
    fetchPokemonImageAndName();
  }, []); // how to only call useEffect once

  return <main> {renderList(list)} </main>;
}

function returnShuffleArray(array) {
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
