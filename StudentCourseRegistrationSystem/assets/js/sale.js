var sale = function () {
    $(document).ready(function () {
        $("body").addClass("sidebar-enable vertical-collpsed");
    });

    $.fn.cloneItem = function (obj, cls) {
        var $tr = $(obj).closest('.' + cls);
        var $clone = $tr.clone();
        if ($clone.attr('id')) {
            $clone.attr('id', $clone.attr('id').replace(/\d+$/, function () { return $('.' + cls).length + 1 }));
        }
        $clone.find('[id]').each(function () {
            var newId = $(this).attr('id').replace(/\d+$/, function () { return $('.' + cls).length + 1 });
            $(this).attr('id', newId);
        });
        $clone.find('[for]').each(function () {

            var newId = $(this).attr('for').replace(/\d+$/, function () { return $('.' + cls).length + 1 });
            $(this).attr('for', newId);
        });
        $tr.after($clone);

        $($clone).find(".quantity").val('1');
        $($clone).find(".price").val('');
        $($clone).find(".textss").text('Rs. 0');
        $($clone).find(".discount").val('');
        $($clone).find(".code").val('');
        $($clone).find(".code").val('').focus();
        $($clone).find(".rowSubTotal").html('Rs. 0');
        $($clone).find(".stockInHandName").html('');
        $($clone).find(".StockinHand").html('');
        $($clone).find(".total").html('Rs. 0');

        // $($clone).find(".selUser").select2('destroy');
        //$(".selUser").select2();


        SetSerialNumber()
    };

    $.fn.removeDom = function (obj, cls, callback = null) {
        event.preventDefault();
        if ($('.' + cls).length > 1) {
            $(obj).closest("." + cls).remove();
        }
        SetSerialNumber();
    }


    function CalculatePrice(obj) {
        
        var GTotal = 0;
        let tr = $(obj).parents("tr");

        var Quantiy = $(tr).find(".quantity").val();
        var Price = $(tr).find(".price").val().split(",").join("");
        var Discount = $(tr).find(".discount").val();
        if (Quantiy != "" && Price != "") {
            var total = Number(Quantiy) * Number(Price);
            if (Discount > 0) {
                GTotal = total - Discount;
            }
            else {
                GTotal = total;
            }
            if ($(tr).find(".tax").val() != 0) {
                let subtotal = (Quantiy * Price);
                let taxPercentage = Number($(tr).find(".tax :selected").data("tax"));
                let totalTax = (taxPercentage / 100) * subtotal;
                GTotal += Number(totalTax.toFixed(2));
                $(tr).find(".taxPrice").html(" " + totalTax.toFixed(2));
            }
            else {
                $(tr).find(".taxPrice").html("0");
            }
            $(tr).find(".total").html(" " + numberWithCommas(GTotal));
            $(tr).find(".rowSubTotal").html(" " + numberWithCommas(Quantiy * Price));

        }
        GrandTotal();
    }

    function GrandTotal() {
        let total = 0;
        let subtotal = 0;
        let totdis = 0;
        let tottax = 0
        let shippingFee = Number($(".shipping-fee").val());
        $(".invoice-items tbody tr").each(function () {
            let tot = Number($(this).find(".total").text().split(",").join("").replace("Rs. ", ""));
            let subtot = Number($(this).find(".rowSubTotal").text().split(",").join("").replace("Rs. ", ""));
            let dis = Number($(this).find(".discount").val());
            let tax = Number($(this).find(".taxPrice").text().replace("Rs. ", ""));
            subtotal += subtot;
            total += Number(tot);
            totdis += dis;
            tottax += tax;
        });
        $(".subTotal").html("<b> " + numberWithCommas(subtotal) + "</b>");
        //$(".grandTotal").text(("Rs. " + (total + shippingFee));
        $(".grandTotal").html("<h5><b>" + (numberWithCommas(total + shippingFee)) + "</b></h5>")
        $(".netdiscount").html('<b>' + (totdis) + '</b>');
        $(".totaltax").html('<b>' + (tottax) + '</b>');

    }

    function ShowProductDetail(obj) {
        //debugger;
       // $.blockUI();
        let code = 0;
        let id = 0;
        let price = 0;
        let StockinHand = 0;
        if ($(obj).hasClass("code")) {
            code = $(obj).val();
        }
        else {
            id = Number($(obj).val());
            StockinHand = Number($(obj).val());
            
        }
        let tr = $(obj).parents("tr");
        if (id == 0 && code.length < 5) {
            $.unblockUI();
            return false;
        }
        $.ajax({
            type: "GET",
            url: "/Sales/GetProductDetail",
            dataType: "json",
            data: { id: id, code: code  },
            success: function (detail) {
     
                console.log(detail);
                if (detail.UnitName != null) {
                    $(tr).find(".units").text(detail.UnitName);
                    $(tr).find(".units").val(detail.MUnitId);
                    $(tr).find(".code").val(detail.Code);
                    $(tr).find(".product").val(detail.Id);
                    $(tr).find(".StockinHand").text(numberWithCommas(detail.StockinHand));
                    $(tr).find(".stockInHandName").text(detail.StockinHandName);
                    $(tr).find(".price").val(detail.Price);
                    $(tr).find(".quantity").focus();
                    $.unblockUI();

                }
                //else {
                //    showWarningProductNotFount("Error !", "Product Not Found Against This Code!");
                //}
                $.unblockUI();

             
             
              
                CalculatePrice($(tr).find(".price"));
            },
            error: function (err) {
                console.log(err);
                $.unblockUI();
            }
        });
    }

    function SetSerialNumber() {
        $('.invoice-items > tbody  > tr').each(function (index) {
            $(this).children("td:first").find(".sr").text(index + 1);
        });
    }

    function SaveInvoice(obj, status) {
        

        if (!$('#saleForm').parsley().validate()) {
            return false;
        }
        let invDate = new Date($('#DeadlineDate').val());
        let dueDate = new Date();
        if (dueDate < invDate) {
            showWarningToast("Warning !", "Due date must be greater than Invoice date");
            return false;
        }
        if ($("#saleForm").parsley().validate()) {
            var invoiceDetail = [];
            $('#invoice-items tbody tr').each(function () {
             
                let Code = $(this).find(".code").val(),
              

                    ProductId = Number($(this).find(".product").val().replace('','')),
                    MUnitId = $(this).find(".units").val(),
                    Qty = $(this).find(".quantity").val(),
                    Cost = $(this).find(".price").val().replace('',''),
              
                    ItemDiscount = $(this).find(".discount").val(),
                    SubTotal = $(this).find(".rowSubTotal").text().split(",").join("").replace('',''),
                    Tax = $(this).find(".taxPrice").text().replace('',''),
                    SlNo = $(this).find(".sr").text().replace('',''),
                    NetDiscount = $(this).find(".discount").val(),
                    TaxId = $(this).find(".tax").val(),
                    TotalValue = $(this).find(".total").text().split(",").join("").replace('', '');
                    
              


                invoiceDetail.push(
                    {

                        Code,
                        ProductId,
                        MUnitId,
                        Qty,
                        Cost,
                        ItemDiscount,
                        TaxId,
                        SubTotal,
                        Tax,
                        SlNo,
                        NetDiscount,
                        TotalValue,
                     
                    }
                );

            });
            let ab = 0;
            ab = $("#InvoicedSaved").val();

            let dc = 0;
            dc = $("#InvoicedDraft").val();

            var invoice = {

                CustomerId: $('#CustomerId').val(),
                InvoiceNo: 1,
                InvoiceDate: $("#DeadlineDate").val(),
                ReferenceNo: $('#refNo').val(),
                InvoiceNetDiscount: $("#netdiscount").text().replace("",""),
                InvoiceSubTotal: $("#SubTotal").text().split(",").join("").replace("", ""),
                InvoiceNetTotal: $("#GrandTotal").text().split(",").join("").replace("",""),
                InvoiceTax: $("#totaltax").text().replace("",""),
                Remarks: $("#remarks").val(),
                ShippingFee: $("#shippingfee").val(),
                Id: $("#InvoiceId").val(),
               
                Status: status,

                SaleInvoiceDetail: invoiceDetail
            };
    

            $(obj).prop("disabled", true);
            let a = 0;
            a = $("#Type").val();



            if (a == 5) {
                $.blockUI();
                $.ajax({
                    url: "/Sales/SaveInvoice",
                    type: "POST",
                    dataType: "json",
                    data: { invoice: invoice },
                    success: function (data) {

                        if (data.Success) {
                            showSuccessToast("Success !", "Invoice save succefully");
                            setTimeout(function () {
                                $.unblockUI();
                                location.reload();
                            });
                        }
                        else {
                            showDangerToast("Error !", data.ex);
                            $.unblockUI();
                            $(obj).prop("disabled", false);
                        }
                    },
                    error: function (xhr, error, status) {
                        $(obj).prop("disabled", false);
                        $.unblockUI();
                        showDangerToast("Error !", error);
                    }
                });
            }
            else if (a == 6) {
                $.blockUI();
                $.ajax({
                    url: "/Sales/SaveReturnInvoice",
                    type: "POST",
                    dataType: "json",
                    data: { invoice: invoice },
                    success: function (data) {

                        if (data.Success) {
                            showSuccessToast("Success !", "Invoice save succefully");
                            setTimeout(function () {
                                $.unblockUI();
                                location.reload();
                            });
                        }
                        else {
                            showDangerToast("Error !", data.ex);
                            $.unblockUI();
                            $(obj).prop("disabled", false);
                        }
                    },
                    error: function (xhr, error, status) {
                        $(obj).prop("disabled", false);
                        $.unblockUI();
                        showDangerToast("Error !", error);
                    }
                });
            }
        }
    }
    

    return {

        calculatePrice: CalculatePrice,
        grandTotal: GrandTotal,
        showProductDetail: ShowProductDetail,
        saveInvoice: SaveInvoice
    }

}();





$('input').keydown(function (e) {

    if (e.keyCode == 13) {
        if ($(':input:eq(' + ($(':input').index(this) + 1) + ')').attr('type') == 'submit') {
            return true;
        }
        $(':input:eq(' + ($(':input').index(this) + 1) + ')').focus();
        return false;
    }
});

function MoveFocusToQty(obj) {

    let tr = $(obj).parents("tr");
    var index = $('.price').index(this) + 1;
    $(tr).find('.quantity').eq(index).focus();
}

function MoveFocusToDisc(obj) {
    let tr = $(obj).parents("tr");
    var index = $('.quantity').index(this) + 1;
    $(tr).find('.discount').focus();
}

function MoveFocusTotax(obj) {

    let tr = $(obj).parents("tr");
    var index = $('.discount').index(this) + 1;
    $(tr).find('.tax').eq(index).focus();
}

function numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}