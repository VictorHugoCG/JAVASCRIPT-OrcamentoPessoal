let ano, mes, dia, tipo, descricao, valor;

function inicia()
{
    
    //associando os elementos de cadastro da página
    ano = document.getElementById("ano");
    mes = document.getElementById("mes");
    dia = document.getElementById("dia");
    tipo = document.getElementById("tipo");
    descricao = document.getElementById("descricao");
    valor = document.getElementById("valor");

    //btn cadastrar
    //document.getElementById("btnCadastrar").addEventListener("click", function(){
      //  cadastrarDespesa();
    //})

    //btn pesquisar
    //document.getElementById("btnPesquisar").addEventListener("click", function(){
      //  pesquisarDespesa();
      //  console.log("ok");
    //});
}

window.addEventListener("load",inicia);

//classe para criação dos objetos de despesa
class Despesa {
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados()
    {
        //usando o for in para percorrer todos os atributos do próprio objeto
        for(let i in this)
        {
            //testanto se o atributo da vez é undefined, vázio ou nulo
            if(this[i] == undefined || this[i] == '' || this[i] == null)
            {
                //se for algumas das opções acima retorna false
                return false
            }
        }

        return true
    }
}

//classe responsável por controlar a comunicação com o localStorage
class Bd {

    constructor()
    {
        //verificando se existe a chave id no localStorage
        let id = localStorage.getItem("id");

       //senão existir o id será criado com o valor 0
       if(id === null)
        {
            localStorage.setItem("id", 0);
        }
    }
    
    //método para criar o próximo id
    getProximoId()
    {
        //recuperando o id atual
        let proximoId = localStorage.getItem("id");

        //retornando o próximo id
        return parseInt(proximoId) + 1;

    }

    //método para gravar despesa no localStorage
    gravar(d)
    { 
        //retornando o método getProximoId dentro do método gravar e atribuindo o valor retornando a uma variável
        let id = this.getProximoId();

        //setando o objeto no localStorage convertendo para JSON através do stringify(obj)
        localStorage.setItem(id, JSON.stringify(d));

        //atualizando o valor da chave id no localStorage com o valor da variável id
        localStorage.setItem("id", id);

    }


    recuperarTodosRegistros()
    {
        //array para receber todas as despesas
        let despesas = [];
        
        let id = localStorage.getItem('id');

        //recuperando todos os registros no localStorage
        for(let i=1; i <= id; i++)
        {
            //recuperando a despesa e convertendo para objeto através do JSON.parse()
            let despesa = JSON.parse(localStorage.getItem(i));

            //verificando se algum indice foi removido do localStorage
            //nesse caso o indice de iteração será pulado para não receber o valor null
            if(despesa === null)
            {
                //usando o continue para pular para a próxima iteração antes do push no array
                continue;
            }

            //criando um novo atributo para receber um id único
            despesa.id = i;

            //adicionando a despesa a um indice do array
            despesas.push(despesa);
        }

        //retornando o array de objetos de despesas
        return despesas
    }

    pesquisar(despesa)
    {
        //criando array para receber recuperarTodosRegistros
        let despesasFiltradas = [];
        
        //chamando o método recuperarTodosRegistros() da mesma classe que retorna um array e atribuindo como valor do array criado anteriormente
        despesasFiltradas = this.recuperarTodosRegistros();

        console.log(despesasFiltradas);
        console.log(despesa);     


        //aplicando filtros aos registros
        //ano
        if(despesa.ano != '')
        {
            //o método filter() não atua sobre o array original, para atualizar o valor é preciso atribuir o resultado ao array original
            despesasFiltradas = despesasFiltradas.filter(function(d) { return d.ano == despesa.ano} );
        }

        //mes
        if(despesa.mes != '')
        {
            //o método filter() não atua sobre o array original, para atualizar o valor é preciso atribuir o resultado ao array original
            despesasFiltradas = despesasFiltradas.filter(function(d) { return d.mes == despesa.mes} );
        }

        //dia
        if(despesa.dia != '')
        {
            //o método filter() não atua sobre o array original, para atualizar o valor é preciso atribuir o resultado ao array original
            despesasFiltradas = despesasFiltradas.filter(function(d) { return d.dia == despesa.dia} );
        }

        //tipo
        if(despesa.tipo != '')
        {
            //o método filter() não atua sobre o array original, para atualizar o valor é preciso atribuir o resultado ao array original
            despesasFiltradas = despesasFiltradas.filter(function(d) { return d.tipo == despesa.tipo} );
        }

        //descrição
        if(despesa.descricao != '')
        {
            //o método filter() não atua sobre o array original, para atualizar o valor é preciso atribuir o resultado ao array original
            despesasFiltradas = despesasFiltradas.filter(function(d) { return d.descricao == despesa.descricao} );
        }

        //valor
        if(despesa.valor != '')
        {
            //o método filter() não atua sobre o array original, para atualizar o valor é preciso atribuir o resultado ao array original
            despesasFiltradas = despesasFiltradas.filter(function(d) { return d.valor == despesa.valor} );
        }


        console.log(despesasFiltradas);

        //retornando o array com as despesas filtradas
        return despesasFiltradas

    }

    remover(id)
    {
        localStorage.removeItem(id);
    }
}

//criando uma instância global da classe Bd
let bd = new Bd();


function cadastrarDespesa()
{
    
    //criando um objeto com base na classe e recebendo os valores dos elementos página html
    let despesa = new Despesa(ano.value,mes.value,dia.value,tipo.value,descricao.value,valor.value);

    

    if(despesa.validarDados() == true)
    {
        //chamando o método gravar da classe Bd instanciada na variável bd
        bd.gravar(despesa);

        $('#sucessoGravacao').modal('show');

        //limpando os campos do formulário após um novo registro de despesa
        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    }
    else
    {
        $('#erroGravacao').modal('show');
    }
}


function carregarListaDespesas()
{
    //criando array para recuperar o array de despesas do método recuperarTodosRegistros()
    let despesas = [];
    despesas = bd.recuperarTodosRegistros();

    let listaDespesas = document.getElementById("listaDespesas");

    //percorrer o array despesas listando cada despesa de forma dinâmica
    despesas.forEach(function(d){
        
        //criando a linha (tr) para cada despesa através do método insertRow()
        let linha = listaDespesas.insertRow();

        //criando as colunas (td) na linha através do método insertCell()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        //ajustar o tipo
        switch(d.tipo)
        {
            case '1': d.tipo = "Alimentação";
                break;
            case '2': d.tipo = "Educação";
                break;
            case '3': d.tipo = "Lazer";
                break;
            case '4': d.tipo = "Saúde";
                break;
            case '5': d.tipo = "Transporte";
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        //criando botão de exclusão
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"</i>';
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function(){

            //eliminando o texto que vem antes do id, para sobra só o número
            let id = this.id.replace('id_despesa_', '');
            
            //remover a despesa
            bd.remover(id);

            //recarregando a página para atualizar a remoção em tempo real
            window.location.reload();
            
        }
        //criando mais uma coluna e inserindo o botão nela
        linha.insertCell(4).append(btn);

        console.log(d);
    })
}

function pesquisarDespesa()
{
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    //criando uma nova instância da classe Despesa para realizar a pesquisa
    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor);

    //atribuindo o retorno do método pesquisar a variável
    let despesas = bd.pesquisar(despesa);


    let listaDespesas = document.getElementById("listaDespesas");
    listaDespesas.innerHTML = ''

    //percorrer o array despesas listando cada despesa de forma dinâmica
    despesas.forEach(function(d){
        
        //criando a linha (tr) para cada despesa através do método insertRow()
        let linha = listaDespesas.insertRow();

        //criando as colunas (td) na linha através do método insertCell()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        //ajustar o tipo
        switch(d.tipo)
        {
            case '1': d.tipo = "Alimentação";
                break;
            case '2': d.tipo = "Educação";
                break;
            case '3': d.tipo = "Lazer";
                break;
            case '4': d.tipo = "Saúde";
                break;
            case '5': d.tipo = "Transporte";
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;
    })
}



