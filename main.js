// main.js

let profundidadeIA = 3;
let jogadorAtual = "azul";

// Atualiza profundidade
const seletorDificuldade = document.getElementById("dificuldade");
seletorDificuldade.addEventListener("change", (e) => {
  profundidadeIA = parseInt(e.target.value);
});

// Atualiza tipo de IA
const seletorTipo = document.getElementById("tipoIA");

// Evento de clique do jogador humano
function onHexClick(hex, linha, coluna) {
  if (!hex.classList.contains("azul") && !hex.classList.contains("vermelha")) {
    hex.classList.add(jogadorAtual);
    estado[linha][coluna] = jogadorAtual;

    if (verificaVitoria(jogadorAtual)) {
      setTimeout(() => {
        alert(`${jogadorAtual.toUpperCase()} venceu o jogo!`);
      }, 10);
      return;
    }

    jogadorAtual = jogadorAtual === "azul" ? "vermelha" : "azul";

    if (jogadorAtual === "vermelha") {
      setTimeout(() => {
        jogadaIA();
      }, 300);
    }
  }
}

// Inicia o tabuleiro
gerarTabuleiro(onHexClick);

// Reiniciar jogo
const btnReiniciar = document.getElementById("reiniciar");
btnReiniciar.addEventListener("click", () => {
  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      estado[i][j] = null;
    }
  }
  const hexes = document.querySelectorAll("polygon");
  hexes.forEach(hex => hex.classList.remove("azul", "vermelha"));
  jogadorAtual = "azul";
});

function jogadaIA() {
  let melhorJogada;

  if (seletorTipo.value === "alphabeta") {
    melhorJogada = minimaxAlphaBeta(estado, profundidadeIA, true, -Infinity, +Infinity);
  } else {
    melhorJogada = minimax(estado, profundidadeIA, true);
  }

  if (!melhorJogada) return;

  const [linha, coluna] = melhorJogada.movimento;
  const hex = document.querySelector(`polygon[data-linha='${linha}'][data-coluna='${coluna}']`);
  if (hex) {
    hex.classList.add("vermelha");
    estado[linha][coluna] = "vermelha";

    if (verificaVitoria("vermelha")) {
      setTimeout(() => {
        alert("VERMELHA venceu o jogo!");
      }, 10);
      return;
    }

    jogadorAtual = "azul";
  }
}

function minimax(estadoAtual, profundidadeMax, ehIA) {
  if (verificaVitoria("vermelha")) return { valor: +Infinity };
  if (verificaVitoria("azul")) return { valor: -Infinity };
  if (profundidadeMax === 0) {
    const valor = avaliarEstado("vermelha") - avaliarEstado("azul");
    return { valor };
  }

  const jogadas = [];
  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      if (estadoAtual[i][j] === null) jogadas.push([i, j]);
    }
  }

  let melhorValor = ehIA ? -Infinity : +Infinity;
  let melhorMovimento = null;

  for (const [linha, coluna] of jogadas) {
    const novoEstado = estadoAtual.map(row => [...row]);
    novoEstado[linha][coluna] = ehIA ? "vermelha" : "azul";
    const resultado = minimax(novoEstado, profundidadeMax - 1, !ehIA);

    if (ehIA) {
      if (resultado.valor > melhorValor) {
        melhorValor = resultado.valor;
        melhorMovimento = [linha, coluna];
      }
    } else {
      if (resultado.valor < melhorValor) {
        melhorValor = resultado.valor;
        melhorMovimento = [linha, coluna];
      }
    }
  }

  return { valor: melhorValor, movimento: melhorMovimento };
}

function minimaxAlphaBeta(estadoAtual, profundidadeMax, ehIA, alfa, beta) {
  if (verificaVitoria("vermelha")) return { valor: +Infinity };
  if (verificaVitoria("azul")) return { valor: -Infinity };
  if (profundidadeMax === 0) {
    const valor = avaliarEstado("vermelha") - avaliarEstado("azul");
    return { valor };
  }

  const jogadas = [];
  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      if (estadoAtual[i][j] === null) jogadas.push([i, j]);
    }
  }

  let melhorValor = ehIA ? -Infinity : +Infinity;
  let melhorMovimento = null;

  for (const [linha, coluna] of jogadas) {
    const novoEstado = estadoAtual.map(row => [...row]);
    novoEstado[linha][coluna] = ehIA ? "vermelha" : "azul";

    const resultado = minimaxAlphaBeta(novoEstado, profundidadeMax - 1, !ehIA, alfa, beta);

    if (ehIA) {
      if (resultado.valor > melhorValor) {
        melhorValor = resultado.valor;
        melhorMovimento = [linha, coluna];
      }
      alfa = Math.max(alfa, melhorValor);
      if (beta <= alfa) break;
    } else {
      if (resultado.valor < melhorValor) {
        melhorValor = resultado.valor;
        melhorMovimento = [linha, coluna];
      }
      beta = Math.min(beta, melhorValor);
      if (beta <= alfa) break;
    }
  }

  return { valor: melhorValor, movimento: melhorMovimento };
}
