const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const estoquePath = path.join(__dirname, "estoque.json");
const movimentacoesPath = path.join(__dirname, "movimentacoes.json");

// Funções para facilitar a lógica nas rotas - lembrar de dar mais segurança no futuro
function pegarEstoque() {
  return JSON.parse(fs.readFileSync(estoquePath, "utf8"));
}

function salvarEstoque(estoque) {
  fs.writeFileSync(estoquePath, JSON.stringify(estoque, null, 2));
}

function pegarMovimentacoes() {
  return JSON.parse(fs.readFileSync(movimentacoesPath, "utf8"));
}

function salvarMovimentacoes(mov) {
  fs.writeFileSync(movimentacoesPath, JSON.stringify(mov, null, 2));
}

app.get("/api/produtos", (req, res) => {
  const dados = pegarEstoque();
  res.json(dados.estoque);
});

app.get("/api/movimentacoes", (req, res) => {
  res.json(pegarMovimentacoes());
});

app.post("/api/movimentacoes", (req, res) => {
  const body = req.body;

  // Validação simples, pode ser melhorado 
  if (!body.codigoProduto || !body.tipo || !body.quantidade) {
    return res.status(400).json({ erro: "Faltou alguma coisa" });
  }

  const estoque = pegarEstoque();
  const prod = estoque.estoque.find(p => p.codigoProduto == body.codigoProduto);

  if (!prod) {
    return res.status(404).json({ erro: "Produto não existe" });
  }

  let movs = pegarMovimentacoes();

  // Vai gerar o ID, e resolver um bug chato que acontecia - mexer no futuro
  const id = movs.length + 1;

  // Cálculo de estoque
  let novoEstoque = prod.estoque;
  if (body.tipo === "entrada") {
    novoEstoque += body.quantidade;
  } else if (body.tipo === "saida") {
    if (novoEstoque - body.quantidade < 0) {
      return res.status(400).json({ erro: "Estoque insuficiente" });
    }
    novoEstoque -= body.quantidade;
  } else {
    return res.status(400).json({ erro: "Tipo errado" });
  }

  // Atualizando produto
  prod.estoque = novoEstoque;
  salvarEstoque(estoque);

  const mov = {
    id,
    codigoProduto: body.codigoProduto,
    tipo: body.tipo,
    quantidade: body.quantidade,
    descricao: body.descricao || "",
    data: new Date().toISOString()
  };

  movs.push(mov);
  salvarMovimentacoes(movs);

  res.json({ ok: true, mov });
});

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});
