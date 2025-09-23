const contas = new Map();
contas.set('admin', 'admin123');

function cadastro(usuario, senha) {
  if (!usuario || !senha) {
    return "Erro: Usuário e senha são obrigatórios.";
  }
  if (contas.has(usuario)) {
    return "Falha: Usuário já existe.";
  }
  contas.set(usuario, senha);
  return "Cadastro realizado com sucesso.";
}

function login(usuario, senha) {
  if (!contas.has(usuario)) {
    return "Falha: Usuário não encontrado.";
  }
  if (contas.get(usuario) === senha) {
    return true;
  } else {
    return "Falha: Senha incorreta.";
  }
}

// Uma função dedicada apenas a limpar os campos de input.
function limparCampos() {
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';
}

function handleCadastro() {
  const usuarioInput = document.getElementById('usuario').value;
  const senhaInput = document.getElementById('senha').value;
  const mensagem = cadastro(usuarioInput, senhaInput);
  
  alert(mensagem);

  // Limpa os campos após exibir o alerta de cadastro.
  limparCampos();
}

function handleLogin() {
  const usuarioInput = document.getElementById('usuario').value;
  const senhaInput = document.getElementById('senha').value;
  const resultado = login(usuarioInput, senhaInput);

  if (resultado === true) {
    window.location.href = '../Public/index.html';
  } else {
    alert(resultado);
    
    // Limpa os campos apenas se o login falhar.
    limparCampos();
  }
}
