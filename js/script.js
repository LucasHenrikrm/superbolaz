function login(){
  fetch("../json/contas.json")
  .then(response => response.json())
  .then(contas => {
    handleLogin(contas)
  })
}

function login_validar(userTry, passTry, contas) {
  for (const conta of contas) {
    if (conta.user === userTry && conta.pass === passTry){
      return true
    }
  }
    return "Falha: Senha incorreta.";
}

// Uma função dedicada apenas a limpar os campos de input.
function limparCampos() {
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';
}

function handleLogin(contas) {
  const userTry = document.getElementById('usuario').value;
  const passTry = document.getElementById('senha').value;
  const resultado = login_validar(userTry, passTry, contas);

  if (resultado === true) {
    window.location.href = '../index.html';
  } else {
    alert(resultado);
    
    // Limpa os campos apenas se o login falhar.
    limparCampos();
    
  }
}
