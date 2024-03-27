$(function () {
    $('.custom-date-time-picker').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        timePicker: true,
        minYear: 1901,
        locale: {
            format: 'MM/DD/YYYY hh:mm A'
        },
        maxYear: parseInt(moment().format('YYYY'), 10)
    });

    $('.custom-date-picker').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        //useCurrent: true,
        //autoUpdateInput: false,                
        minYear: 1901,
        locale: {
            format: 'MM/DD/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10)
    });
    $('.custom-date-picker').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('L'));
    });

    $('.custom-date-picker').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });


    $('.custom-time-picker').daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        //timePicker24Hour: true,
        timePickerIncrement: 1,
        //timePickerSeconds: true,
        locale: {
            format: 'hh:mm A'
        }
    }).on('show.daterangepicker', function (ev, picker) {
        picker.container.find(".calendar-table").hide();
    });
});