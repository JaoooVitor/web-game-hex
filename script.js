const svg = document.getElementById("hexTabuleiro");
const tamanho = 11; // tamanho do tabuleiro (linhas e colunas)
const raio = 20;   // raio do hexágono (do centro até a borda)
const alturaHex = Math.sqrt(3) * raio; // altura de um hexágono regular
let jogadorAtual = "azul"; // começa com o jogador azul


// Cria um único hexágono
function criarHexagono(cx, cy, linha, coluna) {
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

  hex.addEventListener("click", () => {
    if (!hex.classList.contains("azul") && !hex.classList.contains("vermelha")) {
      hex.classList.add(jogadorAtual);
      jogadorAtual = jogadorAtual === "azul" ? "vermelha" : "azul";
    }
  });

  svg.appendChild(hex);
}

// Gera o tabuleiro
for (let linha = 0; linha < tamanho; linha++) {
  for (let coluna = 0; coluna < tamanho; coluna++) {
    const cx = 100 + coluna * (raio * 1.5);
    const cy = 100 + linha * alturaHex + (coluna * alturaHex / 2);
    criarHexagono(cx, cy, linha, coluna);
  }
}
