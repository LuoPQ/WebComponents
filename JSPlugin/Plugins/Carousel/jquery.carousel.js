; (function ($) {
    "use strict";

    var defaults = {
        "switchSpeed": 4000,
        "fadeSpeed": 800
    }

    $.fn.carousel = function (options) {
        options = $.extend(defaults, options || {});

        var timer = null;

        var $imgList = $(this);
        var $btnList = $(options.btnSelector);
        var length = $imgList.length;
        var index = 0;

        for (var i = 0; i < length; i++) {
            $imgList.eq(i).css({
                "zIndex": length - i,
                "position": "absolute"
            });

            $btnList.eq(i).css({
                "z-index": 999
            })
        }
        function startTimer() {
            timer = setTimeout(function () {
                $imgList.eq(index).fadeOut(options.fadeSpeed);
                if (index < length - 1) {
                    index++;
                }
                else {
                    index = 0;
                }
                $imgList.eq(index).fadeIn(options.fadeSpeed);
                $btnList.eq(index).addClass("select").siblings().removeClass("select");
                startTimer();
            }, options.switchSpeed)
        }

        function stopTimer(hoverIndex, hoverEle) {
            clearTimeout(timer);
            $imgList.eq(index).stop().fadeOut(options.fadeSpeed);
            index = hoverIndex;
            $imgList.eq(index).fadeIn(options.fadeSpeed);
            $(hoverEle).addClass("select").siblings().removeClass("select");
        }

        function bindEvent() {
            $imgList.each(function (i, ele) {
                $(ele).on({
                    "mouseover": function () {
                        clearTimeout(timer);
                    },
                    "mouseout": function () {
                        startTimer();
                    }
                })
            });

            $btnList.each(function (i, ele) {
                $(ele).on({
                    "mouseover": function () {
                        stopTimer(i, ele);
                    },
                    "mouseout": function () {
                        startTimer();
                    }
                })
            });
        }

        bindEvent();

        startTimer();
    };

})($);