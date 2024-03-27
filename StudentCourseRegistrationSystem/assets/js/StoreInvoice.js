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
        $($clone).find(".quantity").val('1');
        $($clone).find(".code").val('');
        $($clone).find(".code").focus();
        $($clone).find(".stockInHandName").html('');
        $($clone).find(".stockInHand").html('');

        $($clone).find(".product").val('');
        SetSerialNumber();

    };

    $.fn.removeDom = function (obj, cls, callback = null) {
        event.preventDefault();
        if ($('.' + cls).length > 1) {
            $(obj).closest("." + cls).remove();
        }
        SetSerialNumber();
    }

    function ShowProductDetail(obj) {
        $.blockUI();
        let code = 0;
        let id = 0;
        if ($(obj).hasClass("code")) {
            code = $(obj).val();

        }
        else {

            id = Number($(obj).val());
        }
        let tr = $(obj).parents("tr");
        if (id == 0 && code.length < 5) {
            $.unblockUI();
            return false;
        }
        $.ajax({
            type: "GET",
            url: "/Purchase/GetProductDetail",
            dataType: "json",
            data: { id: id, code: code },
            success: function (detail) {
                if (detail.UnitName != null) {
                    $(tr).find(".units").text(detail.UnitName);
                    $(tr).find(".units").val(detail.MUnitId);
                    $(tr).find(".code").val(detail.Code);
                    $(tr).find(".stockInHand").text(detail.StockinHand);
                    $(tr).find(".stockInHandName").text(detail.StockinHandName);
                    $(tr).find(".product").val(detail.Id);
                    $(tr).find(".quantity").focus();


                    $.unblockUI();
                }
                else {
                    showWarningProductNotFount("Error !", "Product Not Found Against This Code!");

                }
                $.unblockUI();
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
        if (!$('#invoiceForm').parsley().validate()) {
            return false;
        }

        if ($("#invoiceForm").parsley().validate()) {
            var StoreInvoiceDetails = [];

            $('#invoice-items tbody tr').each(function () {
                let Code = $(this).find(".code").val(),
                    MUnitId = $(this).find(".units").val(),
                    ProductId = Number($(this).find(".product").val().replace('', '')),
                    Qty = $(this).find(".quantity").val(),
                    SlNo = $(this).find(".sr").text().replace('', '');


                StoreInvoiceDetails.push
                    ({
                        Code,
                        MUnitId,
                        ProductId,
                        Qty,
                        SlNo
                    });
            });
            let ab = 0;
            ab = $("#InvoicedSaved").val();

            let dc = 0;
            dc = $("#InvoicedDraft").val();
            var invoice =
                {

                    DepartmentId: $('#DepartmentId').val(),
                    InvoiceDate: $("#datePicker").val(),
                    Remarks: $("#remarks").val(),
                    Id: $("#InvoiceId").val(),
                    Status: status,
                    StoreInvoiceDetail: StoreInvoiceDetails
                };

            $(obj).prop("disabled", true);
            let a = 0;
            a = $("#Type").val();

            if (a == 3) {
                $.blockUI();
                $.ajax({
                    url: "/Store/SaveStoreIssue",
                    type: "POST",
                    dataType: "json",
                    data: { model: invoice },
                    success: function (data) {

                        $.unblockUI();
                        if (data.Success) {
                            showSuccessToast("Success !", "Issue Product save succefully");
                            location.href = "/Store/CreateUpdateStoreIssue?id=0";
                            
                            setTimeout(function () {
                                location.reload();
                                
                            }, 2000);

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
            else if (a == 4) {
                $.blockUI();
                $.ajax({
                    url: "/Store/SaveStoreIssueReturn",
                    type: "POST",
                    dataType: "json",
                    data: { model: invoice },
                    success: function (data) {

                        $.unblockUI();
                        if (data.Success) {
                            showSuccessToast("Success !", "Return Issue Product save succefully");
                            location.href = "/Store/CreateUpdateStoreIssueReturn?id=0";
                            setTimeout(function () {
                                location.reload();
                                
                            }, 2000);

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


        showProductDetail: ShowProductDetail,
        saveInvoice: SaveInvoice
    };
}();

//$('input').keydown(function (e) {

//    if (e.keyCode == 13) {
//        if ($(':input:eq(' + ($(':input').index(this) + 1) + ')').attr('type') == 'submit') {
//            return true;
//        }
//        $(':input:eq(' + ($(':input').index(this) + 1) + ')').focus();
//        return false;
//    }
//});

//function OnlyDigit(e) {
//    debugger;

//    //var keyCode = e.which ? e.which : e.keyCode

//    //if (!(keyCode >= 48 && keyCode <= 57)) {
//    //    $(".error").css("display", "inline");
//    //    return false;
//    //} else {
//    //    $(".error").css("display", "none");
//    //}
//    //if the letter is not digit then display error and don't type anything
//    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
//        //display error message
//        $("#errmsg").html("Digits Only").show().fadeOut("slow");
//        return false;
//    }
//}
$(".OnlyDigit").bind("keypress", function (e) {
    var keyCode = e.which ? e.which : e.keyCode

    if (!(keyCode >= 48 && keyCode <= 57)) {
        $(".error").css("display", "inline");
        return false;
    } else {
        $(".error").css("display", "none");
    }
});

//$('input').keydown(function (e) {

//    if (e.keyCode == 13) {
//        if ($(':input:eq(' + ($(':input').index(this) + 1) + ')').attr('type') == 'submit') {
//            return true;
//        }
//        $(':input:eq(' + ($(':input').index(this) + 1) + ')').focus();
//        return false;
//    }
//});
