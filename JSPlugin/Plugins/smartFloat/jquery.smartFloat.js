; (function ($) {
    var defaults = {
        direction: "top"
    };

    $.fn.smartFloat = function (options) {
        options = $.extend(defaults, options || {});
        var position = function (element) {
            var top = element.offset().top; //当前元素对象element距离浏览器上边缘的距离 
            var pos = element.css("position"); //当前元素距离页面document顶部的距离           

            if (options.direction == "top") {
                $(window).on("scroll", function () { //侦听滚动时 
                    var scrolls = $(this).scrollTop();

                    if (scrolls > top) { //如果滚动到页面超出了当前元素element的相对页面顶部的高度 
                        if (window.XMLHttpRequest) { //如果不是ie6 
                            element.css({ //设置css 
                                position: "fixed", //固定定位,即不再跟随滚动 
                                top: 0 //距离页面顶部为0 
                            }).addClass("floatshadow"); //加上阴影样式.shadow 
                        } else { //如果是ie6 
                            element.css({
                                top: scrolls  //与页面顶部距离 
                            });
                        }
                    }
                    else {
                        element.css({ //如果当前元素element未滚动到浏览器上边缘，则使用默认样式 
                            position: pos,
                            top: top
                        }).removeClass("floatshadow");//移除阴影样式.shadow 
                    }
                });
            }
            else {
                element.css({
                    "position": "fixed",
                    "bottom": "0"
                });
                var windowHeight = $(window).height();

                $(window).on("scroll", function () {
                    var scrolls = $(this).scrollTop();

                    if (scrolls + windowHeight > top) {
                        element.css({
                            "position": pos
                        });
                    }
                    else {
                        element.css({
                            "position": "fixed",
                            "bottom": "0",
                        });
                    }
                })
            }
        };
        return $(this).each(function () {
            position($(this));
        });
    };
})($);