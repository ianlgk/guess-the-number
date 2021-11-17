import { useState, useEffect } from 'react';
import './App.css';
import refresh_icon from './assets/refresh_icon.svg';

function App() {
  // Estado para gerenciar o palpite do número
  const [input, setInput] = useState('');
  // Estado para gerenciar o número a ser advinhado
  const [number, setNumber] = useState(undefined);
  // Estado para gerenciar o botão de 'nova partida'
  const [button, setButton] = useState(true)
  // Estado para gerenciar a mensagem de feedback para o usuário
  const [message, setMessage] = useState('');
  // Estado para gerenciar estado da mensagem de feedback
  const [situation, setSituation] = useState(0);

  // Configuração do XMLHTTP e do que fazer quando obtém a resposta, uma vez que não posso usar a biblioteca 'axios'
  const http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (http.readyState === XMLHttpRequest.DONE) {
      if (http.status === 200) {
        if (number === undefined) {
          console.log(http.responseText);
          setNumber(JSON.parse(http.responseText).value);
        }
      } else {
        setNumber(http.status);
        setMessage('ERRO');
        setSituation(3);
      }
    }
  }

  // Requisição pelo link informado no PDF
  http.open('GET', 'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300', true);

  // Chamada da requisição ao renderizar o componente, executa quando o estado da 'button' é alterado
  useEffect(() => {
    if (button === true) {
      http.send();
      setButton(false);
    }
  // desativado para evitar warning no console
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [button]);

  // Função chamada quando clica no botão "ENVIAR"
  function handleTryNumber() {
    // Verifica se houve erro na requisição
    if (number === 502) {
      return;
    }

    // Verifica se o input é válido e qual o status será exibido para o usuário
    if (parseInt(input) >= 0 && parseInt(input) < 1000) {
      if (parseInt(input) === number) {
        setMessage('Acertou!!!!');
        setSituation(2);
      } else if (parseInt(input) >= number) {
        setMessage('É menor');
        setSituation(1);
      } else if (parseInt(input) <= number) {
        setMessage('É maior')
        setSituation(1);
      }
    } else {
      setMessage('Valor Inválido')
      setSituation(3);
    }

    // Atualiza o componente DisplayLED
    DisplayLED();

    // Reseta o input
    setInput('');
  }

  // Componente do Display de LED, incluindo mensagem de feedback e botão de 'nova
  function DisplayLED() {
    if (situation === 1) {
        return (
          <div className="led-display">
            <span className="normal">
              {message}
            </span>
            {input}
          </div>
        );
    }

    if (situation === 2) {
        return (
          <div className="led-display">
            <span className="sucess">
              {message}
            </span>
            {input}
            <button
              type="button"
              className="btnReSubmit"
              onClick={() => {
                  setNumber(undefined);
                  setMessage('');
                  setSituation(0);
                  setButton(true);
                }
              }
            >
              <img src={refresh_icon} alt="Icon" />
              NOVA PARTIDA
            </button>
          </div>
        );
    }

    if (number === 502 || situation === 3) {
        return (
          <div className="led-display">
            <span className="error">
              {message}
            </span>
            {input}
            <button
              type="button"
              className="btnReSubmit"
              onClick={() => {
                  setNumber(undefined);
                  setMessage('');
                  setSituation(0);
                  setButton(true);
                }
              }
            >
              <img src={refresh_icon} alt="Icon" />
              NOVA PARTIDA
            </button>
          </div>
        );
    }

    return (
      <div className="led-display">
        {input}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="column">
        <div className="header">
          <h1>QUAL É O NÚMERO?</h1>
          <hr />
        </div>
        <DisplayLED />
        <div className="data-input">
          <input
            type="text"
            placeholder="Digite o palpite"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={(situation === 2 || situation === 3) ? true : false }
            className={(situation === 2 || situation === 3) ? "inputDisabled" : "" }
          />
          <button
            type="button"
            onClick={handleTryNumber}
            disabled={(situation === 2 || situation === 3) ? true : false }
            className={(situation === 2 || situation === 3) ? "buttonDisabled" : "btnSubmit" }
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
