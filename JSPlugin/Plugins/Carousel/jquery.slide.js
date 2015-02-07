; (function ($) {
    "use strict";

    var defaults = {
        "speed": 1000,
        "direction": "left",
        "type": "carousel",//carousel or gallery
    }

    $.fn.slide = function (options) {
        options = $.extend(defaults, options || {});

        var $container = $(this);
        var $slider = $container.find(".slider");

        $container.css({
            "overflow": "hidden",
            "position": "relative"
        });

        var sliderCss = {
            "position": "absolute"
        }
        switch (options.direction) {
            case "top":
            case "bottom":
                sliderCss = $.extend(sliderCss, { "height": "100%" });
                break;
            case "left":
            case "right":
                sliderCss = $.extend(sliderCss, { "width": "3000px" });
                break;
            default:

        }
        $slider.css(sliderCss);


    };

})($);