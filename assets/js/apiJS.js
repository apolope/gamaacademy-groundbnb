//Criação do array de categorias
let categorias = [];
//Definição da URL da API
const urlApi = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";
//Definição da quantidade de itens da Páginação
const itensPaginacao = 5;
//Criaação da variavel de controle de paginação
let paginacaoAtual = 1;
//Elemento HTML do carrossel de imagens
let itensDoCarousel = document.querySelector("#itensDoCarousel");
//Elemento HTML do controle de Páginação
let botAnt = document.querySelector("#botaoAnterior");
//Elemento HTML do controle de Páginação
let botProx = document.querySelector("#botaoProximo");
//Elemento HTML do controle de Páginação
let pagAatual = document.querySelector("#pagAtual");

//
let GOOGLE_MAP_KEY = "&callback=initMap";

//Variaveis de controle de diarias
let diarias = 0;
let dataInicio = new Date();
let dataFim = new Date();

//Criando Variavel de Paginação $_GET.pag
//LINK?pag=x onde x é o valor a ser recebido
let parts = window.location.search.substr(1).split("&");
let $_GET = {}; //Criando a variavel $_GET[]

//Recuperando a paginação da varivel $_GET caso exista
for (let i = 0; i < parts.length; i++) {
    let temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}

//Verifica se a varivael $_GET.pag existe, se não define indicice da $paginacaoAtualcomo 1
paginacaoAtual = $_GET.pag > 0 ? parseInt($_GET.pag) : 1;


const resposta = [{}];
const apiItens = fetch(urlApi)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        data.forEach((local, i) => {
            resposta.push(
                {
                    photo : local.photo,
                    name : local.name,
                    property_type : local.property_type,
                    price : local.price,
                }
            );
            //Criar array de categorias
            let exist = false;
            for (let i = 0; i < categorias.length; i++) {
                if (categorias[i] == local.property_type) {
                    exist = true;
                }
            }
            if (!exist) {
                categorias.push(local.property_type);
            }
        });
        desenharCards();
    });


function desenharCards() {


    //Limpando conteudo do carrossel de imagens
    itensDoCarousel.innerHTML = "";

    //Controle de overflow, caso a páginação atinja um número maior que o tamanho da lista ou menor que 1
    if (paginacaoAtual * itensPaginacao > resposta.length) {
        paginacaoAtual = 1;
    }
    if (paginacaoAtual < 1) {
        paginacaoAtual = Math.floor(parseInt(resposta.length) / itensPaginacao);
    }

    let inicioPag = paginacaoAtual * itensPaginacao - 4;
    let fimPag = inicioPag + itensPaginacao > resposta.length ? resposta.length - 1 : Math.floor(parseInt(resposta.length) / itensPaginacao) * paginacaoAtual;

    for (let i = 1 ; i < resposta.length ; i++) {

        if (i >= inicioPag && i <= fimPag) {

            let carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item", "col-md-4");
            i == inicioPag ? carouselItem.classList.add("active") : "";
            let card = document.createElement("div");
            card.setAttribute("class", "card");
            let cardImgTop = document.createElement("img");
            cardImgTop.classList.add("card-img-top", "img-fluid");
            cardImgTop.src = resposta[i].photo;
            cardImgTop.alt = resposta[i].name;
            let cardBody = document.createElement("div");
            cardBody.setAttribute("class", "card-body");
            let cardTitle = document.createElement("h4");
            cardTitle.setAttribute("class", "card-title");
            cardTitle.innerHTML = resposta[i].name;
            let cardText = document.createElement("p");
            cardText.setAttribute("class", "card-text");
            cardText.innerHTML = resposta[i].property_type;

            let cardTextMuted = document.createElement("p");
            cardTextMuted.setAttribute("class", "card-text");
            let cardTextMutedSmall = document.createElement("small");
            cardTextMutedSmall.setAttribute("class", "text-muted");
            let cardTextMutedSmallStrong = document.createElement("strong");

            cardTextMutedSmallStrong.innerHTML =
                diarias > 0 ?
                        diarias == 1 ? "1 diaria R$ " + resposta[i].price + ",00" : diarias + " x diarias R$ " + resposta[i].price * diarias + ",00"
                    : "R$ " + resposta[i].price + ",00";

            cardTextMutedSmall.appendChild(cardTextMutedSmallStrong);
            cardTextMuted.appendChild(cardTextMutedSmall);
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardTextMuted);
            card.appendChild(cardImgTop);
            card.appendChild(cardBody);
            carouselItem.appendChild(card);
            itensDoCarousel.appendChild(carouselItem);
        }
        paginar();
        //Preencher os itens de categoria no select do selectize
        let category = $("select");
        let selectize0 = category[0].selectize;
        let selectize1 = category[0].selectize;
        for (let i = 0 ; i < categorias.length ; i++) {
            selectize0.addOption({value: i + 1, text: categorias[i]});
            selectize1.addOption({value: i + 1, text: categorias[i]});
        }
    }
}

function carregarProx() {
    paginacaoAtual++;
    desenharCards();
}
function carregarAnt() {
    paginacaoAtual--;
    desenharCards();
}

function paginar() {
    botAnt.innerHTML = `< -${itensPaginacao}`;
    botProx.innerHTML = `+${itensPaginacao} >`;
    pagAatual.innerHTML = paginacaoAtual;
}

$(document).ready(function() {

    paginar();

    $("#myCarousel").on("slide.bs.carousel", function(e) {
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 3;
        var totalItems = $(".carousel-item").length;

        if (idx >= totalItems - (itemsPerSlide - 1)) {
            var it = itemsPerSlide - (totalItems - idx);
            for (var i = 0; i < it; i++) {
                // append slides to end
                if (e.direction == "left") {
                    $(".carousel-item")
                        .eq(i)
                        .appendTo(".carousel-inner");
                } else {
                    $(".carousel-item")
                        .eq(0)
                        .appendTo($(this).find(".carousel-inner"));
                }
            }
        }
    });

    //Datepicker inicial
    $("#quandoInicio").datepicker({
        //Customizações Datepicker
        autoclose: true,
        language: "pt-BR",
        format: "dd/mm/yyyy",
        todayHighlight: true,
        todayBtn: true,
        startDate: 'now',
        toggleActive: true,
        daysOfWeekHighlighted: "0,6",
        //Evento de controle de mudança de data que interfere no datepicker de data final
    }).on('changeDate', function (selected) {
        let dataMinima = new Date(selected.date.valueOf());
        dataMinima.setDate(dataMinima.getDate() + 1);
        $('#quandoFim').datepicker('setStartDate', dataMinima);
    });

    //Datepicker final
    $("#quandoFim").datepicker({
        //Customizações Datepicker
        language: "pt-BR",
        format: "dd/mm/yyyy",
        todayHighlight: true,
        todayBtn: true,
        startDate: "+1d",
        toggleActive: true,
        daysOfWeekHighlighted: "0,6",
        //Evento de controle de mudança de data que interfere no datepicker de data inicial
    }).on('changeDate', function (selected) {
        let dataMaxima = new Date(selected.date.valueOf());
        $('#quandoInicio').datepicker('setEndDate', dataMaxima);

        dataInicio = moment($("#quandoInicio").val(), "DD/MM/YYYY");
        dataFim = moment($("#quandoFim").val(), "DD/MM/YYYY");

        const diferencaTempo = Math.abs(dataFim.toDate() - dataInicio.toDate());
        diarias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

        desenharCards();
    });
});






function preencherLocalizacao(){
    document.querySelector("#inputLocation").value = "Carregando!";

    $.ajax('http://ip-api.com/json')
        .then(
            function success(response) {
                document.querySelector("#inputLocation").value  = response.city + ", " + response.regionName + ", " + response.country;
            },

            function fail(data, status) {
                document.querySelector("#inputLocation").value  = "Infelizmente não foi possível";
            }
        );
}
