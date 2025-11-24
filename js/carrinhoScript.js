let carrinho = [];
let todosOsProdutos = [];

function carregarJson(){
    //Tenta múltiplos caminhos possíveis
    const caminhos = [
        '../json/produtos.json',
        './json/produtos.json',
        '/superbolaz/json/produtos.json'
    ];

    tentarCarregarJson(caminhos, 0);
}

function tentarCarregarJson(caminhos, indice){
    if (indice >= caminhos,length){
        console.error('Não foi possível carregar o produtos.json');
    return;
}

    const caminho = caminhos[indice];
    console.log('Tentando carregar de: ${caminho}');

    fetch(caminho)
        .then(response => {
            console.log('Status da resposta:', response.status);
        if(!response.ok){
            throw new Error('HTTP error! status: ${response.status}')
        }
        //Verifica se é realmente JSON
        const contentType = response.headers.get('content-type');
        if(!contentType || !contentType.includes('application/json')) {
                throw new Error('Resposta não é JSON válido');
            }
            return response.json();
        })
        .then(produtos => {
            todosOsProdutos = produtos;
            console.log('✓ Produtos carregados com sucesso:', todosOsProdutos.length);
            configurarBotoesAdicionar();
        })
        .catch(error => {
            console.error(`Erro ao carregar de ${caminho}:`, error);
            // Tenta o próximo caminho
            tentarCarregarJson(caminhos, indice + 1);
        });
}

function carregarCarrinho() {
    try {
        carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        console.log('Carrinho carregado:', carrinho.length, 'itens');
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        carrinho = [];
    }
    atualizarVisualizacaoCarrinho();
}

function configurarBotoesAdicionar() {
    const botoes = document.querySelectorAll('button.botao-comprar');
    console.log('Botões encontrados:', botoes.length);
    
    if (botoes.length === 0) {
        console.warn('Nenhum botão .botao-comprar encontrado na página');
    }
    
    botoes.forEach(botao => {
        botao.addEventListener('click', function(event) {
            event.preventDefault();
            const produtoId = Number(this.dataset.produtoId);
            console.log('Botão clicado, ID do produto:', produtoId);
            
            if (!produtoId || isNaN(produtoId)) {
                console.error('ID do produto inválido:', this.dataset.produtoId);
                return;
            }
            
            adicionarProduto(produtoId);
        });
    });
}

// Create
function adicionarProduto(produtoId) {
    console.log('Adicionando produto ID:', produtoId);
    
    if (todosOsProdutos.length === 0) {
        alert('Erro: Produtos ainda não foram carregados. Tente novamente em alguns segundos.');
        return;
    }
    
    const informacoesProduto = todosOsProdutos.find(p => p.id === produtoId);
    
    if (!informacoesProduto) {
        console.error('Produto não encontrado. ID:', produtoId);
        console.log('Produtos disponíveis:', todosOsProdutos.map(p => p.id));
        alert('Erro: Produto não encontrado!');
        return;
    }
    
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        console.log('Incrementando quantidade do item existente');
        itemExistente.quantidade++;
    } else {
        console.log('Adicionando novo item ao carrinho');
        carrinho.push({
            id: produtoId,
            nome: informacoesProduto.nome,
            preco: informacoesProduto.preco,
            quantidade: 1
        });
    }
    
    alert(`"${informacoesProduto.nome}" adicionado ao carrinho!`);
    
    try {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        console.log('Carrinho salvo no localStorage');
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
    
    atualizarVisualizacaoCarrinho();
}

function atualizarVisualizacaoCarrinho() {
    // Verifica se os elementos existem antes de tentar acessá-los
    const ItensCarrinho = document.getElementById('itens-carrinho');
    const CarrinhoVazio = document.getElementById('carrinho-vazio');
    
    // Só atualiza se os elementos existirem (página do carrinho)
    if (ItensCarrinho && CarrinhoVazio) {
        if (carrinho.length === 0) {
            ItensCarrinho.style.display = 'none';
            CarrinhoVazio.style.display = 'block';
        } else {
            ItensCarrinho.style.display = 'block';
            CarrinhoVazio.style.display = 'none';
        }
    }
    
    const carrinhoDiv = document.getElementById('carrinho-itens');
    if (!carrinhoDiv) {
        // Não está na página do carrinho, apenas atualiza o contador se existir
        atualizarContadorCarrinho();
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
    
    const totalElement = document.getElementById('total-carrinho');
    if (totalElement) {
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    atualizarContadorCarrinho();
}

// Função para atualizar contador do carrinho (se existir no header/navbar)
function atualizarContadorCarrinho() {
    const contador = document.getElementById('contador-carrinho');
    if (contador) {
        const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
        contador.textContent = totalItens;
    }
}

function limparCarrinho() {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        carrinho = [];
        localStorage.removeItem("carrinho");
        console.log('Carrinho limpo');
        atualizarVisualizacaoCarrinho();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM carregado, inicializando carrinho...');
    carregarJson();
    carregarCarrinho();
});
