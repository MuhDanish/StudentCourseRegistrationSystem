var Invoice = function () {
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
        $($clone).find(".location").val('');
        $($clone).find(".rank").val('');
        SetSerialNumber();

    };

    $.fn.removeDom = function (obj, cls, callback = null) {
        event.preventDefault();
        if ($('.' + cls).length > 1) {
            $(obj).closest("." + cls).remove();
        }
        SetSerialNumber();
    }


 

    //function ShowProductDetail(obj) {
    //    //$.blockUI();
    //    let code = 0;
    //    let id = 0;
    //    if ($(obj).hasClass("code")) {
    //        code = $(obj).val();

    //    }
    //    else {

    //        id = Number($(obj).val());
    //    }
    //    let tr = $(obj).parents("tr");
    //    if (id == 0 && code.length < 5) {
    //        $.unblockUI();
    //        return false;
    //    }
    //    $.ajax({
    //        type: "GET",
    //        url: "/Purchase/GetProductDetail",
    //        dataType: "json",
    //        data: { id: id, code: code },
    //        success: function (detail) {
    //            if (detail.UnitName != null) {
    //                $(tr).find(".units").text(detail.UnitName);
    //                $(tr).find(".units").val(detail.MUnitId);
    //                $(tr).find(".code").val(detail.Code);
    //                $(tr).find(".price").val(detail.LastPrice);
    //                $(tr).find(".stockInHand").text(numberWithCommas(detail.StockinHand));
    //                $(tr).find(".stockInHandName").text(detail.StockinHandName);
    //                $(tr).find(".product").val(detail.Id);
    //                $(tr).find(".price").focus();

    //                $.unblockUI();
    //            }
    //            //else {
    //            //    showWarningProductNotFount("Error !", "Product Not Found Against This Code!");

    //            //}
    //            $.unblockUI();
    //        },
    //        error: function (err) {
    //            console.log(err);
    //            $.unblockUI();
    //        }
    //    });
    //}


    function SetSerialNumber() {
        $('.invoice-items > tbody  > tr').each(function (index) {
            $(this).children("td:first").find(".sr").text(index + 1);
        });
    }

    function SaveInvoice() {
        debugger;
        if (!$('#invoiceForm').parsley().validate()) {
            return false;
        }
        if ($("#invoiceForm").parsley().validate()) {
            var invoiceDetail = [];
            $('#invoice-items tbody tr').each(function () {
                    SrNo = $(".sr").text(),
                    Rank = $('.rank').val(),
                    Locations = $('.location').val(),
                    invoiceDetail.push
                        ({
                       
                            SrNo,
                            Rank,
                            Locations,
                        });
            });
          
            var invoice =
            {
            
                Remarks: $("#remarks").val(),
                References: $("#refNo").val,
                SchoolName: $("#school").val,
/*                Id: $("#InvoiceId").val(),*/
                PurchaseInvoiceDetail: invoiceDetail
            };

            $.ajax({
                url: "/School/SaveSchool",
                type: "POST",
                data: { invoice: invoice },
                success: function (data) {

                    $.unblockUI();
                    if (data.Success) {
                        location.href = "/School/ManageSchool";
                        setTimeout(function () {
                            showSuccessToast("Success !", "Invoice save succefully");
                            location.reload();

                        }, 1000);

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

    return {
        saveInvoice: SaveInvoice
    };
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

$(".OnlyDigit").bind("keypress", function (e) {
    var keyCode = e.which ? e.which : e.keyCode

    if (!(keyCode >= 48 && keyCode <= 57)) {
        $(".error").css("display", "inline");
        return false;
    } else {
        $(".error").css("display", "none");
    }
});


