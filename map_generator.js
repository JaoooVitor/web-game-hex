
// Geração do mapa HEX - tabuleiro base
const svg = document.getElementById("hexTabuleiro");
const tamanho = 6;
const raio = 20;
const alturaHex = Math.sqrt(3) * raio;

// Estado lógico do jogo
const estado = [];
for (let i = 0; i < tamanho; i++) {
  estado[i] = new Array(tamanho).fill(null);
}

function criarHexagono(cx, cy, linha, coluna, onClick) {
  const pontos = [];
  for (let i = 0; i < 6; i++) {
    const angulo = Math.PI / 3 * i;
    const x = cx + raio * Math.cos(angulo);
    const y = cy + raio * Math.sin(angulo);
    pontos.push(`${x},${y}`);
  }

  const hex = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  hex.setAttribute("points", pontos.join(" "));
  hex.setAttribute("data-linha", linha);
  hex.setAttribute("data-coluna", coluna);
  hex.addEventListener("click", () => onClick(hex, linha, coluna));
  svg.appendChild(hex);
}

function gerarTabuleiro(onClickHexagono) {
  for (let linha = 0; linha < tamanho; linha++) {
    for (let coluna = 0; coluna < tamanho; coluna++) {
      const cx = 100 + coluna * (raio * 1.5);
      const cy = 100 + linha * alturaHex + (coluna * alturaHex / 2);
      criarHexagono(cx, cy, linha, coluna, onClickHexagono);
    }
  }
}

function getVizinhos(linha, coluna) {
  const direcoes = [
    [-1, 0], [1, 0],
    [0, -1], [0, 1],
    [-1, 1], [1, -1]
  ];

  const vizinhos = [];
  for (const [dl, dc] of direcoes) {
    const nl = linha + dl;
    const nc = coluna + dc;
    if (nl >= 0 && nl < tamanho && nc >= 0 && nc < tamanho) {
      vizinhos.push([nl, nc]);
    }
  }
  return vizinhos;
}

function verificaVitoria(jogador) {
  const visitado = new Set();

  function dfs(linha, coluna) {
    const chave = `${linha},${coluna}`;
    if (visitado.has(chave)) return false;
    visitado.add(chave);

    if (jogador === "vermelha" && linha === tamanho - 1) return true;
    if (jogador === "azul" && coluna === tamanho - 1) return true;

    const vizinhos = getVizinhos(linha, coluna);
    for (const [l, c] of vizinhos) {
      if (estado[l][c] === jogador && dfs(l, c)) return true;
    }

    return false;
  }

  for (let i = 0; i < tamanho; i++) {
    if (jogador === "vermelha" && estado[0][i] === "vermelha" && dfs(0, i)) return true;
    if (jogador === "azul" && estado[i][0] === "azul" && dfs(i, 0)) return true;
  }

  return false;
}

function avaliarEstado(jogador) {
  const visitado = new Set();
  const fila = [];
  const distancia = [];

  for (let i = 0; i < tamanho; i++) {
    distancia[i] = new Array(tamanho).fill(Infinity);
  }

  // inicia da borda correta
  if (jogador === "vermelha") {
    for (let col = 0; col < tamanho; col++) {
      if (estado[0][col] !== "azul") {
        fila.push([0, col]);
        distancia[0][col] = 0;
      }
    }
  } else {
    for (let lin = 0; lin < tamanho; lin++) {
      if (estado[lin][0] !== "vermelha") {
        fila.push([lin, 0]);
        distancia[lin][0] = 0;
      }
    }
  }

  while (fila.length > 0) {
    const [linha, coluna] = fila.shift();
    const chave = `${linha},${coluna}`;
    if (visitado.has(chave)) continue;
    visitado.add(chave);

    for (const [l, c] of getVizinhos(linha, coluna)) {
      const peso = estado[l][c] === jogador ? 0 : estado[l][c] === null ? 1 : 5;
      const novaDist = distancia[linha][coluna] + peso;
      if (novaDist < distancia[l][c]) {
        distancia[l][c] = novaDist;
        fila.push([l, c]);
      }
    }
  }

  let menor = Infinity;
  if (jogador === "vermelha") {
    for (let col = 0; col < tamanho; col++) {
      menor = Math.min(menor, distancia[tamanho - 1][col]);
    }
  } else {
    for (let lin = 0; lin < tamanho; lin++) {
      menor = Math.min(menor, distancia[lin][tamanho - 1]);
    }
  }

  return -menor;
}



