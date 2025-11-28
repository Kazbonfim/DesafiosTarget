import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [formData, setFormData] = useState({
    codigoProduto: '',
    tipo: 'entrada',
    quantidade: '',
    descricao: ''
  });
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarProdutos();
    carregarMovimentacoes();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await axios.get(`${API_URL}/produtos`);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const carregarMovimentacoes = async () => {
    try {
      const response = await axios.get(`${API_URL}/movimentacoes`);
      setMovimentacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const response = await axios.post(`${API_URL}/movimentacoes`, {
        codigoProduto: parseInt(formData.codigoProduto),
        tipo: formData.tipo,
        quantidade: parseInt(formData.quantidade),
        descricao: formData.descricao
      });

      setMensagem(`Movimentação realizada! Estoque final: ${response.data.estoqueFinal}`);
      setFormData({
        codigoProduto: '',
        tipo: 'entrada',
        quantidade: '',
        descricao: ''
      });
      
      carregarProdutos();
      carregarMovimentacoes();
    } catch (error) {
      setMensagem(error.response?.data?.erro || 'Erro ao realizar movimentação');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const produtoSelecionado = produtos.find(p => p.codigoProduto === parseInt(formData.codigoProduto));

  return (
    <div className="app">
      <h1>Movimentações de Estoque</h1>

      <div className="container">
        <div className="form-section">
          <h2>Nova Movimentação</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Produto:</label>
              <select
                name="codigoProduto"
                value={formData.codigoProduto}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                  <option key={produto.codigoProduto} value={produto.codigoProduto}>
                    {produto.codigoProduto} - {produto.descricaoProduto} (Estoque: {produto.estoque})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo:</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantidade:</label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição:</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Ex: Compra de fornecedor, Venda para cliente..."
                required
              />
            </div>

            {produtoSelecionado && (
              <div className="info-box">
                <p>Estoque atual: <strong>{produtoSelecionado.estoque}</strong></p>
                <p>Estoque após movimentação: <strong>
                  {formData.tipo === 'entrada' 
                    ? produtoSelecionado.estoque + parseInt(formData.quantidade || 0)
                    : produtoSelecionado.estoque - parseInt(formData.quantidade || 0)
                  }
                </strong></p>
              </div>
            )}

            <button type="submit">Registrar Movimentação</button>
          </form>

          {mensagem && (
            <div className={`mensagem ${mensagem.includes('Erro') ? 'erro' : 'sucesso'}`}>
              {mensagem}
            </div>
          )}
        </div>

        <div className="movimentacoes-section">
          <h2>Histórico de Movimentações</h2>
          <div className="movimentacoes-list">
            {movimentacoes.length === 0 ? (
              <p>Nenhuma movimentação registrada</p>
            ) : (
              movimentacoes.slice().reverse().map(mov => (
                <div key={mov.id} className="movimentacao-card">
                  <div className="movimentacao-header">
                    <span className="mov-id">#{mov.id}</span>
                    <span className={`mov-tipo ${mov.tipo}`}>
                      {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </div>
                  <p><strong>{mov.descricaoProduto}</strong></p>
                  <p>{mov.descricao}</p>
                  <p>Quantidade: {mov.quantidade}</p>
                  <p>Estoque anterior: {mov.estoqueAnterior} → Estoque final: <strong>{mov.estoqueFinal}</strong></p>
                  <p className="mov-data">{new Date(mov.data).toLocaleString('pt-BR')}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

