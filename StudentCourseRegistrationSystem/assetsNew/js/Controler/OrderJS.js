



//if ($(".tableid").text() == 0) {

//    $('.demo').bootstrapSwitch('toggleState');
//    $("#Rtable").prop("disabled", true);
//    var o = new Option("option text", "1");
//    $(o).html("Take Away Selected");
//    $("#Rtable").append(o);
//    $("#Rtable").val(1);
//    $('#tableid').text(null);

//}
//if ($(".tableid").text() != 0) {

//}
var OrderJS = function () {
    typeSelect();
    paymentMode();


    

    function customerApend(CustomerFullListjson) {

        var customerId = $(".Customer").val();

        var cust = CustomerFullListjson.filter(function (p) {
            return p.Id == customerId;
        })[0];

        $("#phone").val(cust.PhoneNumber);
        $("#Address").val(cust.Address);

    }
    function typeSelect() {

        if ($("#typeId").text() == "") {
            //console.log("Id Is null");
        }

        $(".type").val();
        console.log($(".type").val());
        $(".Rtable").attr('disabled', 'disabled');

        if ($(".type").val() == "Dine In") {
            $('#Rtable').find('option:contains("Dine In Not Selected")').remove();
            $("#Rtable").prop("disabled", false);

        }
        if ($(".type").val() != "Dine In") {
            $("#Rtable").prop("disabled", true);
            var o = new Option("option text", "1");
            $(o).html("Dine In Not Selected");
            $("#Rtable").append(o);
            $("#Rtable").val(1);
            $('#tableid').text(null);
        }
    }

    function paymentMode() {

        if ($("#typeId").text() == "") {
            //console.log("Id Is null");
        }

        var val = $(".PaymentMode").val();


        if (val != 1) {

            $(".CustomCustomer").hide();
            $("#phone").prop("disabled", true);
            $("#Address").prop("disabled", true);
            $(".Customer").show();

        }
        if (val == 1) {

            $(".Customer").hide();
            $(".CustomCustomer").show();
            $("#phone").prop("disabled", false);
            $("#Address").prop("disabled", false);

        }

    }

    $(document).on('change', '.PaymentMode', function (e) {

        paymentMode();

    });
   
   
    $(document).on('change', '.type', function (e) {

        typeSelect();
        $('.Rtable').focus();
        if ($(".type").val() != "Dine In") {

            $('#CName').focus();

        }

    });

    //$('.type').keypress(function (event) {
    //    if (event.keyCode == 13) {

    //        $('.Rtable').focus();
    //        if ($(".type").val() != "Dine In") {

    //            $('#CName').focus();

    //        }
    //    }
    //});
    //$(document).on('input', '.type', function (e) {


    //    $('.Rtable').focus();
    //    if ($(".type").val() != "Dine In") {

    //        $('#CName').focus();

    //    }

    //});

    $(document).on('change', '.Rtable', function (e) {

        $('#CName').focus();

    });

    $('.Address').keypress(function (event) {
        if (event.keyCode == 13) {
            $('#order').click();
        }
    });





    function Print(Id) {
        alert(Id);
        window.open("../../ReportsView/ReportViewer.aspx?Id=" + Id + "&ReportTag=" + "OrderInvoice");
    }

   

    return {
        customerApend: customerApend

    };


}();

