// main.js

let profundidadeIA = 3;
let jogadorAtual = "azul";

const vezTexto = document.getElementById("vezDoJogador");
const infoIA = document.getElementById("infoIA");

const seletorDificuldade = document.getElementById("dificuldade");
seletorDificuldade.addEventListener("change", (e) => {
  profundidadeIA = parseInt(e.target.value);
  atualizarInfoIA();
});

const seletorTipo = document.getElementById("tipoIA");
seletorTipo.addEventListener("change", atualizarInfoIA);

function onHexClick(hex, linha, coluna) {
  if (!hex.classList.contains("azul") && !hex.classList.contains("vermelha")) {
    hex.classList.add(jogadorAtual);
    estado[linha][coluna] = jogadorAtual;

    if (verificaVitoria(jogadorAtual)) {
      mostrarVitoria(jogadorAtual);
      return;
    }

    jogadorAtual = jogadorAtual === "azul" ? "vermelha" : "azul";
    atualizarVez();

    if (jogadorAtual === "vermelha") {
      setTimeout(() => jogadaIA(), 300);
    }
  }
}

gerarTabuleiro(onHexClick);
atualizarVez();
atualizarInfoIA();

document.getElementById("reiniciar").addEventListener("click", () => {
  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      estado[i][j] = null;
    }
  }
  document.querySelectorAll("polygon").forEach(hex => hex.classList.remove("azul", "vermelha"));
  jogadorAtual = "azul";
  atualizarVez();
  vezTexto.classList.remove("vitoria");
});

function jogadaIA() {
  const jogada = seletorTipo.value === "alphabeta"
    ? minimaxAlphaBeta(estado, profundidadeIA, true, -Infinity, +Infinity)
    : minimax(estado, profundidadeIA, true);

  if (!jogada) return;

  const [linha, coluna] = jogada.movimento;
  const hex = document.querySelector(`polygon[data-linha='${linha}'][data-coluna='${coluna}']`);
  if (hex) {
    hex.classList.add("vermelha");
    estado[linha][coluna] = "vermelha";

    if (verificaVitoria("vermelha")) {
      mostrarVitoria("vermelha");
      return;
    }

    jogadorAtual = "azul";
    atualizarVez();
  }
}

function atualizarVez() {
  if (vezTexto) {
    vezTexto.innerHTML = `Vez do jogador: <span style="color:${jogadorAtual === "azul" ? "blue" : "red"}">${jogadorAtual.toUpperCase()}</span>`;
  }
}

function atualizarInfoIA() {
  if (infoIA) {
    infoIA.textContent = `IA: ${seletorTipo.value.toUpperCase()} | Profundidade: ${profundidadeIA}`;
  }
}

function mostrarVitoria(vencedor) {
  if (vezTexto) {
    const cor = vencedor === "azul" ? "blue" : "red";
    vezTexto.innerHTML = `<span style="color:${cor}; font-weight:bold">${vencedor.toUpperCase()}</span> venceu o jogo! 🎉`;
    vezTexto.classList.add("vitoria");
  }
}

function gerarJogadasVizinhas(estadoAtual) {
  const jogadas = new Set();
  let temPeca = false;
  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      if (estadoAtual[i][j] !== null) {
        temPeca = true;
        for (const [l, c] of getVizinhos(i, j)) {
          if (estadoAtual[l][c] === null) jogadas.add(`${l},${c}`);
        }
      }
    }
  }
  if (!temPeca) {
    for (let i = 0; i < tamanho; i++) {
      for (let j = 0; j < tamanho; j++) {
        jogadas.add(`${i},${j}`);
      }
    }
  }
  return Array.from(jogadas).map(str => str.split(",").map(Number));
}

function minimax(estadoAtual, profundidadeMax, ehIA) {
  if (verificaVitoria("vermelha")) return { valor: +Infinity };
  if (verificaVitoria("azul")) return { valor: -Infinity };
  if (profundidadeMax === 0) {
    const valor = avaliarEstado("vermelha") - avaliarEstado("azul");
    return { valor };
  }

  const jogadas = gerarJogadasVizinhas(estadoAtual);
  let melhorValor = ehIA ? -Infinity : +Infinity;
  let melhorMovimento = null;

  for (const [linha, coluna] of jogadas) {
    const novoEstado = estadoAtual.map(row => [...row]);
    novoEstado[linha][coluna] = ehIA ? "vermelha" : "azul";
    const resultado = minimax(novoEstado, profundidadeMax - 1, !ehIA);

    if (ehIA && resultado.valor > melhorValor) {
      melhorValor = resultado.valor;
      melhorMovimento = [linha, coluna];
    } else if (!ehIA && resultado.valor < melhorValor) {
      melhorValor = resultado.valor;
      melhorMovimento = [linha, coluna];
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

  const jogadas = gerarJogadasVizinhas(estadoAtual);
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
