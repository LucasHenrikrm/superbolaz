let carrinho = [];
let todosOsProdutos = [];

function carregarJson(){
  fetch("../json/produtos.json")
  .then(response => response.json())
  .then(produtos => {
    todosOsProdutos = produtos;
    configurarBotoesAdicionar();
  })
  .catch(error => console.error ("Erro ao carregar o banco de dados dos produtos:", error))
}

function carregarCarrinho() {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    atualizarVisualizacaoCarrinho();
}

function configurarBotoesAdicionar() {
    document.querySelectorAll('button.botao-comprar').forEach(botao => {
        botao.addEventListener('click', function(event) {
            adicionarProduto(Number(this.dataset.produtoId));
        })
    });
}


//Create
function adicionarProduto(produtoId) {
    const itemExistente = carrinho.find(item => item.id === produtoId)

    const informacoesProduto = todosOsProdutos.find(p => p.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: produtoId,
            nome: informacoesProduto.nome,
            preco: informacoesProduto.preco,
            quantidade: 1
        });
    }

    alert(`"${informacoesProduto.nome}" adicionado ao carrinho!`);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarVisualizacaoCarrinho() {
    const ItensCarrinho = document.getElementById('itens-carrinho');
    const CarrinhoVazio = document.getElementById('carrinho-vazio');

    if(carrinho.length === 0){
        ItensCarrinho.style.display = 'none';
        CarrinhoVazio.style.display = 'block';
    }
    else{
        ItensCarrinho.style.display = 'block';
        CarrinhoVazio.style.display = 'none';
    }

    const carrinhoDiv = document.getElementById('carrinho-itens');
    if (!carrinhoDiv) {
        return;
    }

    carrinhoDiv.innerHTML = '<h2>Itens no Carrinho</h2>';

    let total = 0.00;
    carrinho.forEach(item => {
        const p = document.createElement('p');
        const valorTotalItem = item.preco * item.quantidade;

        total += valorTotalItem;
        p.textContent = `${item.quantidade}x ${item.nome} - R$ ${valorTotalItem.toFixed(2)}`;
        carrinhoDiv.appendChild(p);
    });

    document.getElementById('total-carrinho').textContent = `R$ ${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', (event) => {
    carregarJson();
    carregarCarrinho();
});

function limparCarrinho(carrinho){
    localStorage.removeItem("carrinho");
    carregarCarrinho();
}