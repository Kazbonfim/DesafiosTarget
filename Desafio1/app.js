// Considerando que o json abaixo tem registros de vendas de um time comercial, faça um programa que leia os dados e calcule a comissão de cada vendedor, seguindo a seguinte regra para cada venda:
// Vendas abaixo de R$100,00 não gera comissão
// Vendas abaixo de R$500,00 gera 1 % de comissão
// A partir de R$500,00 gera 5 % de comissão


// Arquivo JSON com dados de vendas
const dados = require('./vendas.json'); // ou coloque o JSON direto no código

// Calcular comissões com base nos valores propostos
function calcularComissao(valor) {
    if (valor < 100) return 0;
    if (valor < 500) return valor * 0.01;
    return valor * 0.05;
}

// Armazenar os dados para listagem
function processarVendas(dados) {
    const total = {};

    dados.vendas.forEach(venda => {
        const comissao = calcularComissao(venda.valor);
        total[venda.vendedor] = (total[venda.vendedor] || 0) + comissao;
    });

    return total;
}

// Processar os dados
const resultado = processarVendas(dados);

// Saída
console.log("\nComissão por Vendedor");
Object.entries(resultado).forEach(([vendedor, valor]) => {
    console.log(`Nome: ${vendedor}, Total: R$ ${valor.toFixed(2)}`);
});
