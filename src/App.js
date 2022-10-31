import { useState, useCallback } from "react";
import "./App.css";
import Grid from "./components/grid/Grid";
import { guessRandom } from "./services";
import { WORDS } from "./constants/wordList";

function App() {
  const [seed, setSeed] = useState(null);
  const [result, setResult] = useState(
    Array(35).fill({ result: "", guess: "" })
  );

  const guessRandomWord = useCallback(
    async (word) => {
      const chars = await guessRandom(word);
      setResult([...result, ...chars]);

      const wordFiltered = chars.reduce(
        (chars, char) => {
          let [absent, present, correct] = chars;
          const { guess, result, slot } = char;
          if (result === "correct") {
            correct = [...correct, { guess, slot }];
          } else if (result === "present") {
            present = [...present, guess];
          } else {
            absent = [...absent, guess];
          }

          return [absent, present, correct];
        },
        [[], [], []]
      );

      return wordFiltered;
    },
    [result]
  );

  const handleAutoPlay = useCallback(async () => {
    const seed = Math.floor(Math.random() * 9000 + 1000);
    setSeed(seed);

    const guess = WORDS[Math.floor(Math.random() * WORDS.length)];

    const [absentChars, presentChars, correctChars] = await guessRandomWord({
      guess,
      seed,
    });

    console.log({ absentChars, presentChars, correctChars });
  }, [guessRandomWord]);

  return (
    <div className="App">
      <button className="button" onClick={handleAutoPlay}>
        Auto play
      </button>
      {seed && <p className="seed">Seed: {seed}</p>}
      <Grid chars={result} />
    </div>
  );
}

export default App;
