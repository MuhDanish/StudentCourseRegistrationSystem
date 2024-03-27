(function ($) {
    //showSuccessToast = function (heading,msg) {
    //    'use strict';
    //    resetToastPosition();
    //    $.toast({
    //        heading: heading,
    //        text: msg,
    //        showHideTransition: 'slide',
    //        icon: 'success',
    //        loaderBg: '#4ac176',
    //        position: 'top-right'
    //    })
    //};
    showSuccessToast = function (heading,msg) {
        Swal.fire({
            type: 'success',
            title: heading,
            icon: 'success',
            text: msg
        });
    };
    showInfoToast = function (heading, msg) {
        'use strict';
        resetToastPosition();
        $.toast({
            heading: heading,
            text: msg,
            showHideTransition: 'slide',
            icon: 'info',
            loaderBg: '#46c35f',
            position: 'top-right'
        })
    };

    showWarningToast = function (heading, msg) {
        Swal.fire({
            type: 'warning',
            title: heading,
            text: msg
        });
    };

    showWarningProductNotFount = function (heading, msg) {
        Swal.fire({
            type: 'error',
            title: heading,
            text: msg,
        })
    };

    showDangerToast = function (heading, msg) {
        swal.fire({
            type: 'error',
            title: heading,
            text: msg
        });
    };
    showToastPosition = function (heading, msg,position) {
        'use strict';
        resetToastPosition();
        $.toast({
            heading: heading,
            text: msg,
            position: String(position),
            icon: 'info',
            stack: false,
            loaderBg: '#f96868'
        })
    }
    resetToastPosition = function () {
        $('.jq-toast-wrap').removeClass('bottom-left bottom-right top-left top-right mid-center'); // to remove previous position class
        $(".jq-toast-wrap").css({
            "top": "",
            "left": "",
            "bottom": "",
            "right": ""
        }); 
    }
})(jQuery);