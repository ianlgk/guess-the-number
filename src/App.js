import { useState, useEffect } from 'react';
import './App.css';
import refresh_icon from './assets/refresh_icon.svg';

function App() {
  // Estado para gerenciar o palpite do número
  const [input, setInput] = useState('');
  // Estado para gerenciar o número a ser advinhado
  const [number, setNumber] = useState(undefined);
  // Estado para gerenciar quando fazer ou refazer o request para a API
  const [apiRequest, setApiRequest] = useState(true)
  // Estado para gerenciar a mensagem de feedback para o usuário
  const [message, setMessage] = useState('invisible');
  // Estado para gerenciar a classe do span de mensagem
  const [spanClass, setSpanClass] = useState('invisible');
  // Estado para gerenciar o botão 'nova partida'
  const [button, setButton] = useState(false);
  // Estado para gerenciar o valor exibido no painel de LED
  const [led, setLed] = useState('0');
  // Estado para gerenciar a cor dos números exibidos no painel de LED
  const [color, setColor] = useState('');

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
        setLed('502');
        setMessage('ERRO');
        setButton(true);
      }
    }
  }

  // Requisição pelo link informado no PDF
  http.open('GET', 'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300', true);

  // Chamada da requisição ao renderizar o componente, executa quando o estado da 'button' é alterado
  useEffect(() => {
    if (apiRequest === true) {
      http.send();
      setApiRequest(false);
      setButton(false);
    }
  // desativado para evitar warning no console
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRequest]);

  // Hook para atualizar a classe do span e cor do número do led que gerencia o feedback para o usuário,
  // executa quando o estado da 'message' é alterado
  useEffect(() => {
    let spanClassName = '';
    let numberColor = '';
    switch (message) {
      case 'Acertou!!!!':
        spanClassName = 'sucess';
        numberColor = 'sucess';
        break;
      case 'ERRO':
        spanClassName = 'error';
        numberColor = 'error';
        break;
      case 'Valor Inválido':
        spanClassName = 'error';
        numberColor = 'error';
        break;
      case 'invisible':
        spanClassName = 'invisible';
        break;
      default:
        spanClassName = 'normal';
        break;
    }
    setSpanClass(spanClassName);
    setColor(numberColor);
  }, [message]);

  // Função chamada quando clica no botão "ENVIAR"
  function handleTryNumber() {
    // Verifica se o input é válido e qual o status será exibido para o usuário
    if (parseInt(input) >= 0 && parseInt(input) < 1000 && input.indexOf('-') === -1) {
      if (parseInt(input) === number) {
        setMessage('Acertou!!!!');
        setButton(true);
      } else if (parseInt(input) >= number) {
        setMessage('É menor');
      } else if (parseInt(input) <= number) {
        setMessage('É maior');
      }
      // Atualiza o valor que aparece no LED
      setLed(input);
    }

    // Reseta o input
    setInput('');
  }

  // Componente que representa os segmentos do número exibido no painel de LED, colorido de acordo com o feedback do sistema (error, sucess)
  // e o valor do número, para manter a mesma cor de fundo do painel de LED, visto que ela é definida pela diminuição da opacidade da borda
  function LEDNumber({ position }) {
    switch (parseInt(led[position])) {
      case 0:
        return (
          <>
            <div className={`segment-x segment-a ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-b ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-e ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-f ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-g`}><span className={`segment-border`}></span></div>
          </>
        );
      case 1:
        return (
          <>
            <div className={`segment-x segment-a`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-b ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-e`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-f`}><span className={`segment-border`}></span></div>
            <div className={`segment-x segment-g`}><span className={`segment-border`}></span></div>
          </>
        );
      case 2:
        return (
          <>
            <div className={`segment-x segment-a ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-b ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-c`}><span className={`segment-border`}></span></div>
            <div className={`segment-x segment-d ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-e ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-f`}><span className={`segment-border`}></span></div>
            <div className={`segment-x segment-g ${color}`}><span className={`segment-border ${color}`}></span></div>
          </>
        );
      case 3:
        return (
          <>
            <div className={`segment-x segment-a ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-b ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-e`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-f`}><span className={`segment-border`}></span></div>
            <div className={`segment-x segment-g ${color}`}><span className={`segment-border ${color}`}></span></div>
          </>
        );
      case 4:
        return (
          <>
            <div className={`segment-x segment-a`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-b ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-e`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-f ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-g ${color}`}><span className={`segment-border ${color}`}></span></div>
          </>
        );
      case 5:
        return (
          <>
            <div className={`segment-x segment-a ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-b`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-e`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-f ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-g ${color}`}><span className={`segment-border ${color}`}></span></div>
          </>
        );
      case 6:
        return (
          <>
            <div className={`segment-x segment-a ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-b`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-e ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-f ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-g ${color}`}><span className={`segment-border ${color}`}></span></div>
          </>
        );
      case 7:
        return (
          <>
            <div className={`segment-x segment-a ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-b ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-e`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-f`}><span className={`segment-border`}></span></div>
            <div className={`segment-x segment-g`}><span className={`segment-border`}></span></div>
          </>
        );
      case 8:
        return (
          <>
            <div className={`segment-x segment-a ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-b ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-e ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-f ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-g ${color}`}><span className={`segment-border ${color}`}></span></div>
          </>
        );
      case 9:
        return (
          <>
            <div className={`segment-x segment-a ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-b ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-c ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-d ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-y segment-e`}><span className={`segment-border`}></span></div>
            <div className={`segment-y segment-f ${color}`}><span className={`segment-border ${color}`}></span></div>
            <div className={`segment-x segment-g ${color}`}><span className={`segment-border ${color}`}></span></div>
          </>
        );
      default:
        return (
          <>
            <div className="segment-x segment-a"><span className="segment-border"></span></div>
            <div className="segment-y segment-b"><span className="segment-border"></span></div>
            <div className="segment-y segment-c"><span className="segment-border"></span></div>
            <div className="segment-x segment-d"><span className="segment-border"></span></div>
            <div className="segment-y segment-e"><span className="segment-border"></span></div>
            <div className="segment-y segment-f"><span className="segment-border"></span></div>
            <div className="segment-x segment-g"><span className="segment-border"></span></div>
          </>
        );
    }
  }

  // Componente 'display' que é o display dos números de LED
  // A lógica utilizada foi criar um componente exclusivo para tratar o caso do display, caso o valor seja 502, ou seja, erro na request
  // ele retorna a estrutura que printará o valor 502, no entanto, quando o valor no painel for menor que 999 e maior que -1
  // ele retorna a estrutura que irá aprensetar o valor printado em formatado de LED, utilizando de arestas com bordas configuradas
  // e cada aresta tem uma classe de acordo com o algarismo que deve ser printado (0 - 9), além disso, de acordo com o tamanho da string
  // digitada, ou seja, o número de caracteres digitados pelo usuário, ele varia a quantidade de algarismos, variando de 1 a 3 algarismos
  // para que seja mais compreensível a lógica de design, acesse o arquivo App.css
  function Display() {
    if (parseInt(number) === 502) {
      return (
        <div id="display">
          <div className="number-container number-size number-no-5">
            <div className="segment-x segment-a error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-b"><span className="segment-border"></span></div>
            <div className="segment-y segment-c error"><span className="segment-border error"></span></div>
            <div className="segment-x segment-d error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-e"><span className="segment-border"></span></div>
            <div className="segment-y segment-f error"><span className="segment-border error"></span></div>
            <div className="segment-x segment-g error"><span className="segment-border error"></span></div>
          </div>
          <div className="number-container number-size number-no-0">
            <div className="segment-x segment-a error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-b error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-c error"><span className="segment-border error"></span></div>
            <div className="segment-x segment-d error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-e error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-f error"><span className="segment-border error"></span></div>
            <div className="segment-x segment-g"><span className="segment-border"></span></div>
          </div>
          <div className="number-container number-size number-no-2">
            <div className="segment-x segment-a error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-b error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-c"><span className="segment-border"></span></div>
            <div className="segment-x segment-d error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-e error"><span className="segment-border error"></span></div>
            <div className="segment-y segment-f"><span className="segment-border"></span></div>
            <div className="segment-x segment-g error"><span className="segment-border error"></span></div>
          </div>
        </div>
      );
    }

    switch (led.length) {
      case 1:
        return (
          <div id="display">
            <div className={`number-container number-size number-no-${led[0]}`}>
              <LEDNumber position={0} />
            </div>
          </div>
        );
      case 2:
        return (
          <div id="display">
            <div className={`number-container number-size number-no-${led[0]}`}>
              <LEDNumber position={0} />
            </div>
            <div className={`number-container number-size number-no-${led[1]}`}>
              <LEDNumber position={1} />
            </div>
          </div>
        );
      case 3:
        return (
          <div id="display">
            <div className={`number-container number-size number-no-${led[0]}`}>
              <LEDNumber position={0} />
            </div>
            <div className={`number-container number-size number-no-${led[1]}`}>
              <LEDNumber position={1} />
            </div>
            <div className={`number-container number-size number-no-${led[2]}`}>
              <LEDNumber position={2} />
            </div>
          </div>
        );
      default:
        return (
          <div id="display">
            <div className="number-container number-size number-no-0">
              <LEDNumber position={0} />
            </div>
          </div>
        );
    }
  }

  return (
    <div className="container">
      <div className="column">
        <div className="header">
          <h1>QUAL É O NÚMERO?</h1>
          <hr />
        </div>
        <div className="led-display">
            <span 
              className={spanClass}
            >
              {message}
            </span>
            <Display />
            <button
              type="button"
              className={(button) ? "btnReSubmit" : "btnReSubmit invisible"}
              onClick={() => {
                  if (button) {
                    setNumber(undefined);
                    setMessage('invisible');
                    setApiRequest(true);
                    setLed('0');
                  }
                }
              }
            >
              <img src={refresh_icon} alt="Icon" />
              NOVA PARTIDA
            </button>
          </div>
        <div className="data-input">
          <input
            type="text"
            placeholder="Digite o palpite"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={(message === 'ERRO' || message === 'Acertou!!!!' || message === 'Valor Inválido') ? true : false }
            className={(message === 'ERRO' || message === 'Acertou!!!!' || message === 'Valor Inválido') ? "inputDisabled" : "" }
          />
          <button
            type="button"
            onClick={() => {
                handleTryNumber();
              }
            }
            disabled={(message === 'ERRO' || message === 'Acertou!!!!' || message === 'Valor Inválido') ? true : false }
            className={(message === 'ERRO' || message === 'Acertou!!!!' || message === 'Valor Inválido') ? "buttonDisabled" : "btnSubmit" }
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
