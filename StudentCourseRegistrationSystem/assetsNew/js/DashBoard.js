convertnumbertocomma();

function convertnumbertocomma() {

    var sale = $("#saletotal").text();
    var purchase = $("#purchasetotal").text();
    var resturant = $(".resturantorderTS").text();
    var resturant2 = $(".resturantorderCAS").text();
    var resturant3 = $(".resturantorderCRS").text();
    $("#saletotal").text(numberWithCommas(sale));
    $("#purchasetotal").text(numberWithCommas(purchase));
    $(".resturantorderTS").text(numberWithCommas(resturant));
    $(".resturantorderCAS").text(numberWithCommas(resturant2));
    $(".resturantorderCRS").text(numberWithCommas(resturant3));

    $(".apexcharts-yaxis-label tspan").each(function () {

        var salechart = $(this).text();
        //console.log(salechart);
        $(this).text(numberWithCommas(salechart));
        
    });

    
}

function numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
