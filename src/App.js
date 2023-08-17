//css
import './App.css';

//React
import { useCallBack, useState, useEffect } from "react";


//data
import { wordList } from "./data/Words";

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [ 
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

const guessedQty = 3
function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordList)

  const [pickedWord, setPikedWord] = useState("")
  const [pickedCategory, setPikedCaregory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessedQty)
  const [score, setScore] = useState(0)


  const pickWordAndCategory = () => {
    //pick a random category
    const catogories = Object.keys(words)
    const category = catogories[Math.floor(Math.random() * Object.keys(catogories).length)]

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { category, word }
  }


  //starts the secret word game
  const startGame = () => {
    //pick word and pick category
    const { word, category } = pickWordAndCategory()

    // create an array of letters 
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l)=> l.toLowerCase())

    // fill States
    setPikedCaregory(category)
    setPikedWord(word)
    setLetters(wordLetters)

    setGameStage(stages[1].name)

    clearLetterStates()
  }

  //process the letter input
  const verifyLetter = (letter) => {
    const normalizeLetter = letter.toLowerCase()

    //check if letter has already been utilized
    if (guessedLetters.includes(normalizeLetter) || wrongLetters.includes(normalizeLetter)) {
      return
    }

    //push guessed letter or remove a guess 
    if (letters.includes(normalizeLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizeLetter])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizeLetter])
      setGuesses((actualGuessedLetters) => actualGuessedLetters - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //check if guess ended
  useEffect(() => {
    if (guesses <= 0) {

      //reset all states
      clearLetterStates()
      setGameStage(stages[2].name)
    }

  }, [guesses])

  //check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    //win condition
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      //add score
      setScore((actualScore) => (actualScore += 100))
      //restart game with new word
      startGame()
      setGuesses(guessedQty)
      
    }
  }, [gameStage, guessedLetters, letters])

  //restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(guessedQty)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}

      {gameStage === "game" && <Game verifyLetter={verifyLetter}
        pickedWord={pickedWord} pickedCategory={pickedCategory}
        letters={letters} guessedLetters={guessedLetters}
        wrongLetters={wrongLetters} guesses={guesses}
        score={score} />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
