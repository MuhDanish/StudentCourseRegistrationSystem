
//$.each($(".body3"), function () {
//    var view = $(this).find(".View").val();
//    if (view == "ViewPage") {
//        $(this).find(".box").addClass("ViewPage");
//    }
//    else {
//        $(this).find(".box").addClass("Action");
//    }
//});

//$(".Action").change(function () {

//    $.each($(".box"), function () {

//        var vp = $(this).find(".Action").is(":checked");

//        $(".body2").find('.ViewPage').each(function () {
            
//            if (vp) {
//                $(this).prop("checked", true);
//                console.log("Hitt");

//            }

//        })
        
        

//    });

//});

function savePermissions(data) {
    $('#Role').parsley().validate();
    if ($('#Role').parsley().isValid()) {

        $.blockUI();
        return $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: "/User/SaveRolePermissions",
            data: data,
            error: function () {
                window.location.replace("/User/RolePermissions");
            },
        });
    }

}

$("#savebtn").click(function (e) {

    //console.log(e.target.classList[4]);

    e.preventDefault();

   
    var ActionArr = [];

    

    $.each($(".body3"), function () {

        

        var chk = $(this).find("#xnode-0-1-2").prop("checked");
        //console.log(chk);

        if (chk == true) {
            ActionArr.push({

                ActionId: $(this).find('.actionId').text(),
                PageId: $(this).find('.pageId').text(),
                ModuleId: $(this).find('.moduleId').text(),
                RoleId: $("#Role").val()

            });
        
        }
        

    });
    console.log(ActionArr);

    var data = JSON.stringify({

        model: ActionArr,
        Id: $("#Role").val()
    });

    savePermissions(data); 
});
$(".selectAllrole").click(function () {
    

    var chk = $(".selectAllrole").prop("checked");
    if (chk == true) {
        $('.box').prop('checked', true);
        $('.box1').prop('checked', true);
        $('.box2').prop('checked', true);
    }
    if (chk == false) {
        $('.box').prop('checked', false);
        $('.box1').prop('checked', false);
        $('.box2').prop('checked', false);
    }

});