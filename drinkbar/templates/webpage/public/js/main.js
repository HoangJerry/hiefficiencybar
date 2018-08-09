$(document).ready(function () {
    $(".carousel").swipe({

        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {

            if (direction == 'left') $(this).carousel('next');
            if (direction == 'right') $(this).carousel('prev');

        },
        allowPageScroll: "vertical"

    });
    $("#myCarousel").carousel({ interval: 3000 });
    "use strict";
    $(".bar .bar_item .bar_main a").click(function () {
        let baritem = $(this).parents('.bar');
        if (baritem.hasClass('active')) {
            baritem.removeClass('col-md-9 col-lg-9 active').addClass('col-md-3 col-lg-3');
            $(".bar").removeClass('col-md-1 col-lg-1').addClass('col-md-3 col-lg-3');
            $(".bar_main").removeClass('col-md-4 col-lg-4');
            $(".bar_faster, .bar_ingredients,.bar_item_padding").css('display', 'none');
            $(".bar_item_title,.bar_item_content,.bar_item_button,.bar_item_hr").css('display', 'block');
            $(".bar_item").css('background', 'rgba(30, 40, 59, 0.6)');
            $(".bar_main a").removeClass('bar_item_icon_close').addClass('.bar_item_icon');
        } else {
            $(".bar").removeClass('col-md-3 col-lg-3').addClass('col-md-1 col-lg-1 disable');
            baritem.removeClass('col-md-1 col-lg-1 disable').addClass('col-md-9 col-lg-9 active');
            $(".bar_item_title,.bar_item_content,.bar_item_button,.bar_item_hr").css('display', 'block');
            $(".disable .bar_item_title, .disable .bar_item_content, .disable .bar_item_button, .disable .bar_item_hr,.bar_item_padding").css('display', 'none');
            $(".active .bar_main").addClass('col-md-4 col-lg-4');
            $(".active .bar_item>div").css('display', 'block');
            $(".disable .bar_item_padding").css('display', 'block');
            $(".bar_item").css('background', 'rgba(30, 40, 59, 0.6)');
            $(".active .bar_item").css('background', 'rgba(30, 40, 59, 0.83)');
            $(".active .bar_main a").removeClass('bar_item_icon').addClass("bar_item_icon_close");
            $(".disable .bar_main a").removeClass('bar_item_icon_close').addClass("bar_item_icon");
        }
    });

    $("#contact .modal-body_content form").submit(function () {
        $.ajax({
            type: "POST",
            url: '/api/contactus/',
            data: {
                name: $("#contact .modal-body_content form #Name").val(),
                email: $("#contact .modal-body_content form #email").val(),
                message: $("#contact .modal-body_content form #Message").val()
            },
            success: function (data) {
                $("#myModal .modal-content #information").append(data.detail);               
                $("#contact .modal-body_content form #Name").val('');
                $("#contact .modal-body_content form #email").val('');
                $("#contact .modal-body_content form #Message").val('');
            },
            error: function (data) {
                $("#myModal .modal-content #information-err").append(data.responseJSON.detail);
            } 
        });
            $("#myModal .modal-content #information").text('');
            $("#myModal .modal-content #information-err").text('');
    });
       

});
