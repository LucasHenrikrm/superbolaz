//Inicializa o banco de dados se não existir
function carregarDados(){
    //Verifica se  já existe dados no localStorage
    if (!localStorage.getItem("dados")){
        let ds = [
                    {id: 1, user:"admin", pass:"123"},
                    {id: 2, user:"midorin", pass:"1234"},
                    {id: 3, user:"michael", pass:"12345"},
                    {id: 4, user:"Allanis", pass:"MrPenis"},
                    {id: 5, user:"LuluGobetti", pass:"Herbert123"},
                    {id: 6, user:"pirocoptero", pass:"Yey"}
                  ];
        //Transforma os dados acima em JSON
        let json = JSON.stringify(ds);
        
        //Carrega os dados do banco de dados
        localStorage.setItem("dados",json);
    }
}

//Chama a inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', carregarDados);

//Limpa os campos do formulário
function limparCampos(){
    document.querySelector('#usuario').value = '';
    document.querySelector('#senha').value = '';
}

function conferirExist(nUsuario, ds){
    for(let i=0;i<ds.length;i++){
        if(nUsuario === ds[i].user){
            return "Nome do usuário já existe na plataforma.";
        }
    }
    
    return true;
}

//(C)reate da sigla CRUD
//Cria um registro do usuário
function cadastrar(event) {
    // Impedir o recarregamento da página se for um evento de formulário
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    //Inicializar dados se necessárui
    carregarDados();

    //Puxa o banco de dados
    let ds = JSON.parse(localStorage.getItem("dados"));

    //Coleta os dados do form de cadastro
    let nUsuario = document.querySelector('#usuario').value.trim();
    let sen = document.querySelector('#senha').value;
    const exist = conferirExist(nUsuario, ds);

    if(exist === true){
        let cadastro = {id:Date.now(), user:nUsuario, pass:sen};

        ds.push(cadastro);

        let json = JSON.stringify(ds);

        localStorage.setItem("dados", json);

        console.log("Sucesso!");
        function alertaCadastro(){
            Swal.fire({
            title: "Sucesso!",
            text: "Usuário cadastrado com sucesso!",
            icon: "success",
            confirmButtonColor: "#F2541B",
        }).then((result) => {
        // Redireciona quando o usuário clicar em OK
            window.location.href = "login-pag.html";
        });
        }
        alertaCadastro();
    }
    else {
        console.log(exist);
        console.log(ds);
        function alertaUsuarioExiste(){
            Swal.fire({
            title: "Ops!",
            text: "Já existe um usuário com este nome.",
            icon: "error",
            confirmButtonColor: "#F2541B"
        });
    }
        alertaUsuarioExiste();
        limparCampos;
    }

  }


function validarLogin(usuario, senha, ds) {
    // Impedir o recarregamento da página se for um evento de formulário
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    for(let i=0;i<ds.length;i++){
        if((usuario == ds[i].user) && senha == ds[i].pass) {
            console.log("Validado");
            //Salva os dados do usuário logado
            sessionStorage.setItem("usuarioLogado", JSON.stringify(ds[i]));
            return true;
        }
    }
    
    return "Usuário ou senha incorreto.";
}


function login(event) {
    // Impedir o recarregamento da página se for um evento de formulário
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    //Inicializa dados se necessário
    carregarDados();

    //Puxa o banco de dados
    let ds = JSON.parse(localStorage.getItem("dados"));

    if(!ds){
        alert("Erro ao carregar dados. Tente novamente.");
        return false;
    }
    
    //Coleta os dados do form de login
    let usuario = document.querySelector('#usuario').value.trim();
    let senha = document.querySelector('#senha').value;
    //valida os dados com o BD
    const resultado = validarLogin(usuario, senha, ds);

    if(resultado === true){
        function alerta(){
            Swal.fire({
            title: "Sucesso!",
            text: "Login efetuado com sucesso!",
            icon: "success",
            confirmButtonColor: "#F2541B"
        });
    }
        alerta();
        setTimeout(function(){
            window.location.href = "../index.html";
        }, 3000)
        return true;
    }
    else {
        console.log(resultado, usuario, senha);
        function alerta(){
            Swal.fire({
            title: "Ops!",
            text: "Usuário ou senha errado.",
            icon: "error",
            confirmButtonColor: "#F2541B"
        });
    }
        alerta();
        //limpa os campos se o login falhar
        limparCampos();
        return false;
    }
}

//Função para verificar se o usuário está logado
function verificarLogin(){
    const usuarioLogado = sessionStorage.getItem("usuarioLogado");
    if(!usuarioLogado){
        window.location.href = "./public/Login/Logon.html";
        return null;
    }
    return JSON.parse(usuarioLogado);
}

//Função para fazer logout
function logout(){
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "./public/Login/Logon.html";
}