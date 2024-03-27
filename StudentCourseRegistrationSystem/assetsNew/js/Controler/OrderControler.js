


var OrderController = function () {
   

    hidebtn();
    convertnumbertocomma();
    status();
    
    function checkbox() {

        var servicecharge = $("#servicecharges").text();
        var tax = $("#TotalTax").text();
        console.log(servicecharge);
        console.log(tax);


    }

    $(document).on('click', '#checkbox-ServiceCharges', function (e) {

        var chk = $('#checkbox-ServiceCharges').is(':checked');

        
        if (chk == false) {
            $("#servicecharges").text("0.00");
            update_total();
        }
        if (chk == true) {
            update_total();
        }

    });
    $(document).on('click', '#checkbox-Tax', function (e) {

        var chk = $('#checkbox-Tax').is(':checked');

        if (chk == false) {
            $("#TotalTax").text("0.00");
            update_total();
        }
        if (chk == true) {
            update_total();
        }

    });
    
    function autoComplete(ProdList) {
        var data = ProdList;
       

        console.log(ProdList);

        
        $("#countries").kendoAutoComplete({
            dataSource: data,
            filter: "startswith",
            placeholder: "Select Product",

        });
    }
    function autoApend(item) {

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        //console.log(item);
       
        var name = $('#countries').val();
        
        console.log();

        if (!isNumeric(name))
        {
            var pro = item.filter(function (p) {
                return p.Name == name;
            })[0];
           

        }
        if (isNumeric(name)) {
            var pro = item.filter(function (p) {
                return p.Code == name;
            })[0];
            
            


        }

            console.log(pro);

            var orderItem = {
                Id: pro.Id,
                code: pro.Code,
                name: pro.Name,
                qty: 1,
                price: pro.Price,
                Unit: pro.MeasurementUnitName,
                DealItem: pro.DealItem

            };            
            
            console.log(orderItem);
        //apend(orderItem);
        addqty(orderItem);
        update_total();
        $('#countries').val("");
        $('#countries').focus()

        }
    function confirmation(ev) {
        ev.preventDefault();
        var urlToRedirect = ev.currentTarget.getAttribute('href'); //use currentTarget because the click may be on the nested i tag and not a tag causing the href to be empty
        //console.log(urlToRedirect); // verify if this is the right URL
        swal({
            title: "Are you sure?",
            //text: "Once deleted, you will not be able to recover this Order!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                // redirect with javascript here as per your logic after showing the alert using the urlToRedirect value
                if (willDelete) {
                    swal("Done! Your Order has been deleted!", {
                        icon: "success",
                    });
                    window.location.replace(urlToRedirect);

                }
                else {
                    swal("Your Order file is not Deleted!");
                }
            });
    }

   //toggle button 3 options
    $('#searchTypeToggle input').click(function (event) {
       
        $('#searchTypeToggle > div').css('transform', 'translateX(' + $(this).data('location') + ')');
            $(this).parent().siblings().removeClass('selected');
        $(this).parent().addClass('selected');
        status();
    });

   

    $(document).on('change', 'input.qty', function (e) {
        e.preventDefault();

        
        update_amounts();
        update_total();
        convertnumbertocomma();
                
           
    });

    $(document).on('ready', 'input.qty', function (e) {
        e.preventDefault();

        update_amounts();
        update_total();
        convertnumbertocomma();

    });

    $('#table_id_paginate').click(function () {
        

        status();


    })
    function convertnumbertocomma() {

        $("#body1 tr").each(function () {

            var rate = $(this).find(".rate").text();
            var amount = $(this).find(".samount").text().split(",").join("");


            $(this).find(".rate").text(numberWithCommas(rate));
            $(this).find(".samount").text(numberWithCommas(amount));

           
        });
        

    }
    function numberWithCommas(number) {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    function addqty(orderItem) {
        var arr = [];
       

        $("#body1 tr:last td").each(function () {

            arr.push($(this).text());
        });

        
       
        if (localStorage.getItem("productsInCart") === null) {
            var cartItems = {};
            var items = []
            cartItems.items = items;
            cartItems.items.push(arr);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            
           
        }
        else {
            var cartItems = JSON.parse(localStorage.getItem("productsInCart"));
            var items = cartItems.items;
                cartItems.items.push(arr);
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));

        }
       
        var pd = $.grep(items, function (v) {
            //console.log("id =" + v[0]);
            return v[0] == orderItem.Id;
        })[0];
        //console.log(pd);
        if (pd == undefined) {
            apend(orderItem)
        }
        if (pd != undefined) {

            if (Number(pd[0]) == orderItem.Id) {

                var val = $('#body1 tr :contains("' + orderItem.name + '")').closest("tr").index();
                //console.log(val);
                $('#body1  > tr:eq(' + val + ')').each(function () {
                    var q = Number($(this).find('.qty').val());
                    //swal("Item already exist!", {
                    //    buttons: {
                    //        cancel: "Cancel",
                    //        catch: {
                    //            text: "Increse Qty",
                    //            value: "catch",
                    //        },
                    //    },
                    //})
                    //    .then((value) => {
                    //        switch (value) {
                    //            case "catch":
                    //                {
                                        
                    //                }
                    //        }
                    //    });
                    $(this).find('.qty').val(q + 1);
                    //$(this).find('#update1').text("false");
                    update_amounts();
                    update_total();
                    swal( orderItem.name+ " " + "Qty Updated!!", "", "success");
                });

            }
            else {
                apend(orderItem);
            }
        }
    }
    function lasttableId(tablelist) {
        var tblName = $('#Rtable').val()

        var tbl = tablelist.filter(function (p) {
            return p.Name == tblName;
        })[0];
        if (tbl != null) {
            $('#tid2').text(tbl.Id);
        }

        var t = tablelist.filter(function (p) {
            return p.IsReserved == true;
        });

        //console.log(t);

        $.each(t, function (index, value) {
            //console.log(value.Name);
            $('#Rtable').val("");
            $('#Rtable').find('option:contains("' + value.Name + '")').hide();

            var tableval = $('#Rtable').val();

            

            if (tableval == "") {
                var lt = tablelist.filter(function (p) {
                    return p.Id == $('#tid2').text();
                })[0];
                if (lt != null) {
                    
                    $('#Rtable').find('option:contains("' + lt.Name + '")').show();
                    $('#Rtable').val(lt.Name);
                }

            }

        });


    }
    function table(tablelist) {
        var tblName = $('#Rtable').val()

        var tbl = tablelist.filter(function (p) {
            return p.Name == tblName;
        })[0];
        if (tbl != null) {

            $('#tableid').text(tbl.Id);
        }

        
    }
    function type(typelist) {
        var typeName = $('#type').val()

        var typ = typelist.filter(function (p) {
            return p.Name == typeName;
        })[0];
        if (typ != null) {

            $('#typeid').text(typ.Id);
        }


    }
    function Random_Number() {
        
        var on = $('#Code').val();

        //on = "000" + on;

        $('#Code').val(on);

        
    }
    function update_amounts() {
        var sum = 0.0;
        $('#body1  > tr').each(function () {
            var qty = $(this).find('.qty').val();
            var price = $(this).find('.rate').text().split(",").join("");
            var amount = (qty * price)
            sum += amount;
            //$(this).find('#update1').text(false);
            $(this).find('.samount').text('' + amount);
        });

    }
    function update_total(list) {

        var taxname = "";
        
        var sum = 0;
        var qtyt = 0;
        var taxid = 0;
        var taxp = 0;

        $('.samount').each(function () {
            var amt = $(this).text();
            amt = amt.split(",").join("");
            //console.log(amt);
            sum += Number(amt);
        });

        $('.qty').each(function () {
            qtyt += Number($(this).val());
        });

        var sc = 0;
        //var servicechargesval = $('.servicecharges-val').text();

        //sc = (sum * servicechargesval) / 100;
        
        if (list != null) {
            var txName = $('#TaxId').val()

            var tx = list.filter(function (p) {
                return p.Name == txName;
            })[0];


            //tax = (sum * tx.Texs) / 100;
            taxid = tx.Id;
            taxp = tx.Texs
            $('#taxp').text(taxp);
            $('#taxid').text(taxid);
        }
        //var P = Number($('#taxp').text());

        //tax = (sum * P ) / 100;
        //var gt = 0;
        //gt = sum + sc + tax;

        $('#subtotal').text(numberWithCommas(sum.toFixed(2)));
        $('.SubTotal').text(numberWithCommas(sum.toFixed(2)));

        var SCNull = $("#ModelSC").val();
        if (SCNull != "0.00") {
            
            $('#checkbox-ServiceCharges').prop('checked', true);
            $("#ModelSC").val("0.00");
           
            console.log($("#ModelSC").val());
            debugger;
        }
        
        var chkS = $('#checkbox-ServiceCharges').is(':checked');      
        if (chkS == false) {
            $("#servicecharges").text("0.00");
        }
        if (chkS == true) {
            
            var servicechargesval = $('.servicecharges-val').text();

            sc = (sum * servicechargesval) / 100;

            $('#servicecharges').text(numberWithCommas(sc.toFixed(2)));
            $('.ServiceCharges').text(numberWithCommas(sc.toFixed(2)));

        }
        var taxNull = $("#ModelTAX").val();
        
        if (taxNull != "0.00") {
            $("#ModelTAX").val("0.00");
            $('#checkbox-Tax').prop('checked', true);

        }

        var chkT = $('#checkbox-Tax').is(':checked');
        if (chkT == false) {
            $("#TotalTax").text("0.00");
            //$('.strickT').wrap("<strike>");
        }
        var tax = Number($('#tx').text());
        if (chkT == true) {
            var P = Number($('#taxp').text());
            tax = (sum * P) / 100;
            $('.tx').text(numberWithCommas(tax.toFixed(2)));

        }

        $('.taxN').text(txName);
        

        

        //tax = (sum * P) / 100;
        var gt = 0;
        gt = sum + sc + tax;

        $('#gtotal').text(numberWithCommas(gt.toFixed(2)));
        $('.GTotal').text(numberWithCommas(gt.toFixed(2)));
        $('#TotalBill').text(numberWithCommas(gt.toFixed(2)));
        $('#totalqty').text(qtyt);

        
        //$('#taxid').val(taxid);
       

    }

    function apend(orderItem) {
        $('#body1 tr :contains("Please Select Any Product")').closest("tr").remove();
        var prod = orderItem;

        detailsTableBody = $("#body1");
        if (prod.DealItem == null) {
            prod.DealItem = "";
        }

        var productItem = '<tr><td hidden><p class="Id">' + prod.Id + '</p><td ><p class="Pcode">' + prod.code + '</p></td><td><p class="pname">' + prod.name + prod.DealItem + '</p></th><td class="text-right unit">' + prod.Unit + '</td><td style="float:right; display: inline-block" class="text-right"><input class="form-control qty" type="number" style="width:50px; text-align: center " value="' + prod.qty + '" ></input></td><td class="text-right oldqty" hidden>0</td><td class="text-right update" hidden>false</td>' + '<td class="text-right rate">' + prod.price + '</td>' + '<td class="text-right samount font-weight-semibold">' + (parseFloat(prod.price) * parseInt(prod.qty)) + '</td><td class="text-right"><a data-itemId="0" href="#"  class="delete-row deleteItem"><i class="far fa-trash-alt"></i></a></td></tr>';

        detailsTableBody.append(productItem);

        convertnumbertocomma();
    }

    function saveOrder(data, st) {
        

        $('.enterkey').parsley().validate();
        //console.log($('.enterkey').parsley().isValid());

        var val = $("#body1 tr").html();
        //console.log("this is val" + val);
        var Item = '<tr><td><p style="color:red;" > Please Select Any Product</p></td><td hidden>1</td></tr>';

        if (val == undefined) {

            TableBody = $("#body1");
            TableBody.append(Item);   
        }

        if ($('.enterkey').parsley().isValid()) {

            var tr = $("#body1 tr:eq(0) td:eq(1)").text();
            //console.log("Table empty" + tr);

            if (tr != 1) {
                $.blockUI();
                return $.ajax({
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    type: 'POST',
                    url: "/Restaurant/SaveOrder",
                    data: data,
                    success: function (id) {
                        //console.log(id.data.id);
                        id = id.data.id ;
                        if (st == 1) {
                            swal("Done", "Order is Saved!!", "success");
                            
                            PrintOrder(id);
                        }
                        if (st == 2) {
                            swal("Done", "Order Completed!!", "success");
                            //var id = $('.Code').val();
                            Print(id);
                        }
                        window.location.replace("/Restaurant/OrderList");
                    },
                    error: null
                });
            }
        }
    }

    function hidebtn() {
        if ($('#Status').val() == 1) {
            $("#Status").val("Draft");
            //$("#CloseBtn").hide();

        }
        if ($('#Status').val() == 2) {
            $("#Status").val("Complete");
            $("#order").hide();
            $("#saveOrder").hide();
            $(".deleteItem").hide();
            $(".enterprod").hide();

            
            $("#saveOrderC").hide();
            $(".qty").attr('disabled', 'disabled');
            $("#Rtable").attr('disabled', 'disabled');
            $("#TaxId").attr('disabled', 'disabled');
            $("#DeadlineDate").attr('disabled', 'disabled');
            $("#CName").attr('disabled', 'disabled');
            $("#phone").attr('disabled', 'disabled');
            $("#Address").attr('disabled', 'disabled');
            $("#type").attr('disabled', 'disabled');
            
        }
        if ($('#Status').val() == "") {
            $("#saveOrderC").hide();
            //$("#CloseBtn").hide();
            $("#Status").val("Is Not Avalible");
            $(".ONumber").hide();
        }

    }

    function status() {

       

        var sts = $("#searchTypeToggle").find('.selected input').val();
        //console.log(sts);
       
            if (sts == "1") {

                $("#table_id_wrapper").fadeOut();
                $("#table_id2_wrapper").fadeOut();
                $("#table_id3_wrapper").fadeIn();

            }
            if (sts == "2") {

                $("#table_id_wrapper").fadeOut();
                $("#table_id2_wrapper").fadeIn();
                $("#table_id3_wrapper").fadeOut();

        }
        if (sts == "3") {

            $("#table_id_wrapper").fadeIn();
            $("#table_id2_wrapper").fadeOut();
            $("#table_id3_wrapper").fadeOut();

            
                    

               

            }
        
       

       

    }

    $(document).on('click', 'a.deleteItem', function (e) {
        e.preventDefault();
        if ($(this).attr('data-itemId') == "0") {
            $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
                $(this).hide();
                $(this).find(".qty").val(0);
                update_amounts();
                update_total();
            });
        }
    });

    $("#saveOrder, #saveOrderC, #saveorder2").click(function (e) {

       //console.log(e.target.classList[4]);

        e.preventDefault();

        

        if (e.target.classList.contains("saveOrder"))
        {
            var  st = 1;
        }
        if (e.target.classList.contains("saveorder2")) {
            //console.log(e.target.classList.contains("saveorder2"))
            var st = 1;
        }
        if (e.target.classList.contains("saveOrderC"))
        {
            var st = 2;

        }

        var orderItemArr = [];
        var orderArr = [];

        orderArr.length = 0;

        $.each($("#body1 tr"), function () {
            orderItemArr.push({
                Id: $(this).find('.Id').text(),
                ProductId: $(this).find('.Id').text(),
                Quantity: $(this).find('.qty').val(),
                Rate: $(this).find('.rate').text().split(",").join(""),
                Subtotal: $(this).find('.samount').text().split(",").join("")
                
            });
        });
        orderArr.push({


            OrderNo: $('.Code').val(),
            Id: $('#OId').val(),
            OrderDate: $('#DeadlineDate').val(),
            TotalQty: $('#totalqty').text(),
            CustomerName: $('#CName').val(),
            
            CustomerPhone: $('#phone').val(),
            CustomerAddress: $('#Address').val(),
            NetTotal: parseFloat($('#gtotal').text().split(",").join("")),
            Status: st,
            TaxId: $('#taxid').text(),
            TableId: $('#tableid').text(),
            OrderTypeId: $('#typeid').text(),
            TotalTax: $('#TotalTax').text().split(",").join(""),
            LastTableId: $('#tid2').text(),
            ServiceCharges: $('#servicecharges').text(),
            CustomerId: $('.Customer').val(),
            PaymentModeId: $('.PaymentMode').val(),
            OrderItems: orderItemArr
            
        });

        //console.log(orderArr[0]);

        var data = JSON.stringify({
           
            order: orderArr[0]
        });

        saveOrder(data,st);       
    });

    var AddToorder = function (product, proId, qty) {
        
            AddToLocalStorage(product, proId, qty);
    };

    function AddToLocalStorage(product, proId, qty) {


        var pro = product.filter(function (p) {
            return p.Id == proId;
        })[0];



        

        var orderItem = {
            Id: pro.Id,
            code: pro.Code,
            name: pro.Name,
            qty: qty,
            price: pro.Price,
            Unit: pro.MeasurementUnitName,
            DealItem: pro.DealItem

        };
        console.log(orderItem);
        addqty(orderItem);

        update_total();

    }

    var getProducts = function (id) {
        $.ajax({
            url: "/Product/GetProductByCategory/" + id,
            dataType: "html",
            success: function (result) {
                $('#productsCat').empty();
                $('#productsCat').append(result);
            }
        });

    };
    function Print(Id) {

        window.open("../../ReportsView/ReportViewer.aspx?Id=" + Id + "&ReportTag=" + "OrderInvoice");
    }
    Random_Number();


    function PrintOrder(Id) {

        window.open("../../ReportsView/ReportViewer.aspx?Id=" + Id + "&ReportTag=" + "OrderForKitchen");
    }
    return {
        AddToorder: AddToorder,
        getProducts: getProducts,
        update_total: update_total,
        table: table,
        type: type,
        lasttableId: lasttableId,
        numberWithCommas: numberWithCommas,
        confirmation: confirmation,
        autoComplete: autoComplete,
        autoApend: autoApend
    };


}();


