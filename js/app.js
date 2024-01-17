class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if (this[i] === undefined || this[i] === '' || this[i] === null) {
                return false
            };

            this.mes = parseInt(this.mes)
            this.dia = parseInt(this.dia)

            if (this.mes === 2 && this.dia > 29) {
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoID(){
        let proximoID = localStorage.getItem('id')
        return parseInt(proximoID) + 1;
    }

    gravar(d) {
        let id = this.getProximoID()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        let despesas = Array()

        let id = localStorage.getItem('id')
        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i)) 

            if(despesa !== null){
                despesa.id =  i
                despesas.push(despesa)
            }
            
        }
        return despesas;
    }

    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(function(f) {
                return f.ano == despesa.ano
            }); 
        }
        
        //mes
        if (despesa.mes != '') {
            console.log(despesa.mes);
            despesasFiltradas = despesasFiltradas.filter(function(f) {
                return f.mes == despesa.mes
            }); 
        }
        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(function(f) {
                return f.dia == despesa.dia
            }); 
        }
        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(function(f) {
                return f.tipo == despesa.tipo
            }); 
        }
        //descrição
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(function(f) {
                return f.descricao == despesa.descricao
            }); 
        }
        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(function(f) {
                return f.valor == despesa.valor
            }); 
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value); 

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    /*VARIÁVEIS REFERENTES AO MODAL*/
    let cabecalhoModal = document.getElementById('cabecalho-modal')
    let tituloModal = document.getElementById('titulo-modal')
    let conteudoModal = document.getElementById('conteudo-modal')
    let botaoModal = document.getElementById('botao-modal')


    if(despesa.validarDados()){
       bd.gravar(despesa)
       //DIALOG DE SUCESSO

        $('#modalRegistraDespesa').modal('show')
        cabecalhoModal.className = 'modal-header text-success'
        tituloModal.innerText = `Dados inseridos com sucesso!`
        conteudoModal.innerText = `Despesa cadastrada com sucesso!`
        botaoModal.className = 'btn btn-success'
        botaoModal.innerText = `Fechar`
        
        /*Limpando inputs*/
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
       } else {
        //DIALOG DE ERRO

        $('#modalRegistraDespesa').modal('show')
        cabecalhoModal.className = 'modal-header text-danger'
        tituloModal.innerText = `Erro na Gravação!`
        conteudoModal.innerText = `Existem campos obrigatórios com dados inválidos!`
        botaoModal.className = 'btn btn-danger'
        botaoModal.innerText = `Voltar e corrigir`
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    //selecionando o tbody da pagina consulta.html e relatório.html
    let listaDespesas = document.getElementById('listaDespesas')
    //iniciando o carregamento com a tela vazia
    listaDespesas.innerHTML = ''

    //se o array de filto das despesas estiver vazio, carregar todas as despesas
    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //percorrer o array despesas, listando cada despesa de forma dinâmica (Página de consulta)
    despesas.forEach(function(d) {
        //criando a linha (tr)
        let linhaConsulta = listaDespesas.insertRow()
        //criando as colunas (td)
    
        linhaConsulta.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break;
            case '2':
                d.tipo = 'Educação'
                break;
            case '3':
                d.tipo = 'Lazer'
                break;
            case '4':
                d.tipo = 'Saúde'
                break;
            case '5':
                d.tipo = 'Transporte'
                break;
        }
        linhaConsulta.insertCell(1).innerHTML = `${d.tipo}`
        linhaConsulta.insertCell(2).innerHTML = `${d.descricao}`
        linhaConsulta.insertCell(3).innerHTML = `R$ ${d.valor}`

        //criando o botao de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_','')
            bd.remover(id)

            //MODAL CONFIRMANDO A EXCLUSÃO
            let cabecalhoModal = document.getElementById('cabecalho-modal')
            let tituloModal = document.getElementById('titulo-modal')
            let conteudoModal = document.getElementById('conteudo-modal')
            let botaoModal = document.getElementById('botao-modal')

            $('#modalExcluirDespesa').modal('show')
            cabecalhoModal.className = 'modal-header text-danger'
            tituloModal.innerText = `Excluído!`
            conteudoModal.innerText = `Despesa excluída com sucesso!`
            botaoModal.className = 'btn btn-danger'
            botaoModal.innerText = `Voltar`

            botaoModal.onclick = function () {
                window.location.reload()
            }
        }
        linhaConsulta.insertCell(4).append(btn)
        
    })
}

function pesquisarDespesa() {
    //define as variáveis de capa campo da página
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    //atribui a um objeto
    let despesa = new Despesa(
        ano,
        mes,
        dia,
        tipo,
        descricao,
        valor
    )
    
    //definindo a variavel despesas como o método de pesquisa de despesas que está dentro do objeto bd
    let despesas = bd.pesquisar(despesa)
    
    carregaListaDespesas(despesas, true)
}   

function carregaRelatorio(despesas = Array()) {

    despesas = bd.recuperarTodosRegistros()
    let valorTotalDespesas = 0
    //valida em despesas o total
    despesas.forEach(function(item){
        valorTotalDespesas += Number(item.valor)
    })

    let TotalDespesas = document.getElementById('TotalDespesas')

    let linha = TotalDespesas.insertRow()
        //criando as colunas (td)
    linha.insertCell(0).innerHTML = `Valor total de despesas:`
    let valorTotal = document.createElement("p")
    valorTotal.className = 'text-right'
    valorTotal.innerHTML = `R$ ${valorTotalDespesas}`

    linha.insertCell(1).append(valorTotal)
}

function carregaListaRelatorio(despesas = Array()) {

    despesas = bd.recuperarTodosRegistros()
    let listaRelatorio = document.getElementById('listaRelatorio')

    despesas.forEach(function(d){
        let linhaRelatório = listaRelatorio.insertRow()
        d.mes = parseInt(d.mes)
        switch (d.mes) {
            case 1:
                d.mes = 'Janeiro'
                break;
            case 2:
                d.mes = 'Fevereiro'
                break;
            case 3:
                d.mes = 'Março'
                break;
            case 4:
                d.mes = 'Abril'
                break;
            case 5:
                d.mes = 'Maio'
                break;
            case 6:
                d.mes = 'Junho'
                break;
            case 7:
                d.mes = 'Julho'
                break;
            case 8:
                d.mes = 'Agosto'
                break;
            case 9:
                d.mes = 'Setembro'
                break;
            case 10:
                d.mes = 'Outubro'
                break;
            case 11:
                d.mes = 'Novembro'
                break;
            case 12:
                d.mes = 'Dezembro'
                break;

        }
        linhaRelatório.insertCell(0).innerHTML = `${d.mes}`
        linhaRelatório.insertCell(1).innerHTML = `${d.valor}`
    })
}



