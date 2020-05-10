let categorias = [];

const urlApi = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";

const apiItens = fetch(urlApi)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        data.forEach((room, i) => {

            let itensDoCarousel = document.querySelector("#itensDoCarousel");

            let carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item", "col-md-4");
            i == 0 ? carouselItem.classList.add("active") : "";

            let card = document.createElement("div");
            card.setAttribute("class", "card");

            let cardImgTop = document.createElement("img");
            cardImgTop.classList.add("card-img-top", "img-fluid");
            cardImgTop.src = room.photo;
            cardImgTop.alt = room.name;

            let cardBody = document.createElement("div");
            cardBody.setAttribute("class", "card-body");

            let cardTitle = document.createElement("h4");
            cardTitle.setAttribute("class", "card-title");
            cardTitle.innerHTML = room.name;

            let cardText = document.createElement("p");
            cardText.setAttribute("class", "card-text");
            cardText.innerHTML = room.property_type;

            let exist = false;
            for (let i = 0 ; i < categorias.length ; i++) {
                if (categorias[i] == room.property_type) {
                    exist = true;
                }
            }
            if (!exist) {
                categorias.push(room.property_type);
            }


            let cardTextMuted = document.createElement("p");
            cardTextMuted.setAttribute("class", "card-text");

            let cardTextMutedSmall = document.createElement("small");
            cardTextMutedSmall.setAttribute("class", "text-muted");
            cardTextMutedSmall.innerHTML = "R$ " + room.price + ",00";


            cardTextMuted.appendChild(cardTextMutedSmall);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardTextMuted);

            card.appendChild(cardImgTop);
            card.appendChild(cardBody);
            carouselItem.appendChild(card);
            itensDoCarousel.appendChild(carouselItem);



        });

        //Preencher os itens de categoria no select do selectize
        let category = $("select");
        let selectize0 = category[0].selectize;
        let selectize1 = category[0].selectize;
        for (let i = 0 ; i < categorias.length ; i++) {
            selectize0.addOption({value: i + 1, text: categorias[i]});
            selectize1.addOption({value: i + 1, text: categorias[i]});
        }


    })







$(document).ready(function() {
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
});


