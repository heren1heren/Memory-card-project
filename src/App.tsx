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
      <Main
        setCurrentScore={setCurrentScore}
        currentScore={currentScore}
        setBestScore={setBestScore}
      />
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

function Main({ currentScore, setCurrentScore, setBestScore }) {
  const [list, setList] = useState([]);

  const [pickedPokemon, setPickedPokemon] = useState([]);

  const handleCardClick = () => {
    // shuffle the list -> re-render the main section
    // add clicked pokemon inside pickedPokemon.
    // if the current clicked pokemon is inside pickedPokemon -> reset score
    setCurrentScore(currentScore + 1);
  };
  const renderList = (array: object[]) => {
    return array.map((e) => {
      return (
        <li key={e.name} className="card" onClick={handleCardClick}>
          <img src={e.imgId} alt={e.name} className="card-img" />
          <p className="card-name"> {e.name}</p>
        </li>
      );
    });
  };

  useEffect(() => {
    let array = [];
    const fetchPokemonImageAndName = async () => {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=10'
      );
      const result = await response.json();
      if (result) {
        array = result.results;

        const promiseArray = array.map(async (pokemon) => {
          const name = pokemon.name;
          const IdResponse = await fetch(pokemon.url);
          const IdResult = await IdResponse.json();
          const imgId = IdResult.sprites.front_default;

          return { name, imgId }; // return promises list
        });
        const extractedArray = await Promise.all(promiseArray);

        // after extracting name and image
        setList(extractedArray);
      }
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
