import { useState, useCallback, useEffect } from "react";
import Grid from "./components/grid/Grid";
import { guessRandom } from "./services";
import { WORDS } from "./constants/wordList";
import "./App.css";

function App() {
  const [seed, setSeed] = useState(null);
  const [result, setResult] = useState([]);

  const guessRandomWord = useCallback(async (word) => {
    const chars = await guessRandom(word);

    const detectedChars = {
      correct: [],
      present: [],
      absent: [],
      chars,
    };

    return chars.reduce((detectedChars, char) => {
      const { guess, result, slot } = char;
      detectedChars[result].push({ guess, slot });
      return detectedChars;
    }, detectedChars);
  }, []);

  const isMatchSlot = (correct, word) => {
    let isMatch = true;

    correct.forEach((correctChar) => {
      if (!isMatch) return;
      if (word.indexOf(correctChar.guess) !== correctChar.slot) isMatch = false;
    });
    return isMatch;
  };

  const isIncluded = (present, word) => {
    let isIncluded = true;

    present.forEach((presentChar) => {
      if (!isIncluded) return;
      if (
        !word.includes(presentChar.guess) ||
        word.indexOf(presentChar.guess) === presentChar.slot
      )
        isIncluded = false;
    });
    return isIncluded;
  };

  const isExcluded = (absent, word) => {
    let isExcluded = true;

    absent.forEach((absentChar) => {
      if (!isExcluded) return;
      if (word.includes(absentChar.guess)) isExcluded = false;
    });
    return isExcluded;
  };

  const wordListFilter = useCallback(
    ({ correct, present, absent, previousGuess }, wordList) => {
      return wordList
        .filter((word) => isMatchSlot(correct, word))
        .filter((word) => isIncluded(present, word))
        .filter((word) => isExcluded(absent, word))
        .filter((word) => word !== previousGuess);
    },
    []
  );

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const findMatchWord = useCallback(
    async (seed, wordList, resultChars) => {
      const guess = wordList[Math.floor(Math.random() * wordList.length)];

      const { correct, present, absent, chars } = await guessRandomWord({
        seed,
        guess,
      });

      const resultAppended = [...resultChars, ...chars];
      setResult(resultAppended);

      const wordListFiltered = await wordListFilter(
        { correct, present, absent, previousGuess: guess },
        wordList
      );

      await timeout(500);

      if (
        correct.length < 5 &&
        wordList.length > 1 &&
        wordListFiltered.length
      ) {
        findMatchWord(seed, wordListFiltered, resultAppended);
      } else {
        correct.length < 5 && window.alert("Can't find the word!");
      }
    },
    [guessRandomWord, wordListFilter, setResult]
  );

  const handleAutoPlay = useCallback(() => {
    const seed = Math.floor(Math.random() * 9000 + 1000);
    setSeed(seed);

    findMatchWord(seed, WORDS, []);
  }, [findMatchWord]);

  useEffect(() => {
    if (result.length < 30)
      setResult([
        ...result,
        ...Array(30 - result.length).fill({ result: "", guess: "" }),
      ]);
  }, [result]);

  return (
    <div className="App">
      <div className="controls">
        <button className="button" onClick={handleAutoPlay}>
          Auto play
        </button>
        {seed && <p className="seed">Seed: {seed}</p>}
      </div>
      <Grid chars={result} />
    </div>
  );
}

export default App;
