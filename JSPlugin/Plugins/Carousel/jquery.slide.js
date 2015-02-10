; (function ($) {
    "use strict";

    var defaults = {
        "speed": 1000,
        "direction": "left",
        "type": "gallery",//carousel or gallery,
        "scrollCount": 1
    }

    $.fn.slide = function (options) {
        options = $.extend(defaults, options || {});

        var $container = $(this);
        var $slider = $container.find(".slider");
        var $sliderItems = $slider.children();


        var timer = null;//计时器
        var index = 0;//开始滚动的索引
        var count = 0;//一次完成滚动所需要的次数

        var containerLength = 0;
        var scrollLength = 0;

        $container.css({
            "overflow": "hidden",
            "position": "relative"
        });

        var sliderCss = {
            "position": "absolute"//保证Slide的position为absolute，必须脱离文档流才能滚动
        }
        switch (options.direction) {
            case "top":
            case "bottom":
                sliderCss = $.extend(sliderCss, { "height": "100%" });
                containerLength = $container.height();
                count = $sliderItems.length / options.scrollCount;

                //横向滚动的距离等于元素的宽度乘以滚动的元素个数
                scrollLength = $sliderItems.first().outerHeight(true) * options.scrollCount;


                //滑入停止动画，滑出开始动画.
                $container.hover(function () {
                    clearInterval(timer);
                }, function () {
                    timer = setInterval(function () {
                        showImg(index)
                        index++;
                        if (index >= count) {//最后一张图片之后，转到第一张
                            index = 0;
                        }
                    }, 3000);
                }).trigger("mouseleave");

                sliderCss = $.extend(sliderCss,
                    {
                        "top": -scrollLength * index + "px" //改变 marginTop 属性的值达到轮播的效果
                    });
                break;
            case "left":
            case "right":

                containerLength = $container.width();
                count = $sliderItems.length / options.scrollCount;

                //横向滚动的距离等于元素的宽度乘以滚动的元素个数
                scrollLength = $sliderItems.first().outerWidth(true) * options.scrollCount;

                //滑入停止动画，滑出开始动画.
                $container.hover(function () {
                    clearInterval(timer);
                }, function () {
                    timer = setInterval(function () {
                        showImg(index)
                        index++;
                        if (index >= count) {//最后一张图片之后，转到第一张
                            index = 0;
                        }
                    }, 3000);
                }).trigger("mouseleave");

                sliderCss = $.extend(sliderCss,
                    {
                        "width": $sliderItems.length * $sliderItems.first().outerWidth(true),
                        "left": -scrollLength * index + "px" //改变 marginTop 属性的值达到轮播的效果
                    });

                break;
            default:

        }
        $slider.css(sliderCss);

        //重启计时器
        function restartTimer(index) {
            clearInterval(timer);
            showImg(index);
            timer = setInterval(function () {
                showImg(index)
                index++;
                if (index > count) {       //最后一张图片之后，转到第一张
                    index = 0;
                }
            }, 3000);
        }

        function showImg(index) {
            //当滚动的距离与最大滚动距离之差小于容器的尺寸时
            //会出现空白区域，所以需要设置一个最大的滚动距离
            if (scrollLength * (count - index) < containerLength) {
                var maxScrollLength = containerLength - scrollLength * count;
            }
            var resultValue = maxScrollLength ? maxScrollLength : (-scrollLength * index) + "px";
            var animateCss = null;

            switch (options.direction) {
                case "top":
                case "bottom":
                    animateCss = {
                        "top": resultValue
                    }
                    break;
                case "left":
                case "right":
                    animateCss = {
                        "left": resultValue
                    }
                    break;
                default:

            }
            $(".slider").stop(true, false).animate(animateCss, 1000);
        }


        $(".slideLeft").on("click", function () {
            if (index > 0) {
                --index
            }
            else {
                index = count;
            }
            restartTimer(index);
        })

        $(".slideRight").on("click", function () {
            if (index < count) {
                ++index;
            }
            else {
                index = 0;
            }
            restartTimer(index);
        })
    };

})($);