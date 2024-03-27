
//$.fn.cloneItem = function (obj, cls) {
//    var $tr = $(obj).closest('.' + cls);
//    var $clone = $tr.clone();
//    if ($clone.attr('id')) {
//        $clone.attr('id', $clone.attr('id').replace(/\d+$/, function () { return $('.' + cls).length + 1 }));
//    }
//    $clone.find('[id]').each(function () {
//        var newId = $(this).attr('id').replace(/\d+$/, function () { return $('.' + cls).length + 1 });
//        $(this).attr('id', newId);
//    });
//    $clone.find('[for]').each(function () {

//        var newId = $(this).attr('for').replace(/\d+$/, function () { return $('.' + cls).length + 1 });
//        $(this).attr('for', newId);
//    });


//    //$($clone).find(".unit").val(0);
//    $tr.after($clone);
//};

//$.fn.removeDom = function (obj, cls, callback = null) {
//    event.preventDefault();
//    if ($('.' + cls).length > 1) {
//        $(obj).closest("." + cls).remove();
//    }
    
//}
