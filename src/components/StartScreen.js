import "./SrtarScreen.css"

const StartScreen = ({startGame}) => {
  return (
    <div className="start"> 
        <h1>Secret World</h1>
        <p>Clique no botao abaixo para iniciar</p>
        <button onClick={startGame}>Iniciar jogo</button>
    </div>
  )
}

export default StartScreen