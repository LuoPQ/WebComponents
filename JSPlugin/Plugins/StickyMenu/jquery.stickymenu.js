; (function ($) {
    "use strict";

    var defaults = {
        "speed": 500,
        "isTopNav": true
    }

    if (typeof Array.prototype.indexOf != "function") {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var index = -1;
            fromIndex = fromIndex * 1 || 0;

            for (var k = 0, length = this.length; k < length; k++) {
                if (k >= fromIndex && this[k] === searchElement) {
                    index = k;
                    break;
                }
            }
            return index;
        };
    }

    $.fn.isHidden = function () {
        return $(this).is(":hidden");
    }

    $.fn.stickymenu = function (options) {
        options = $.extend(defaults, options || {});

        var $menu = $(this);
        var $body = $('body');
        var $links = $menu.find("a:not(.exceptLink)");

        var offsetTop = $menu.offset().top;

        //菜单的原始的postion，left，top属性
        var originPos = $menu.css("position");
        var originLeft = $menu.css("left");
        var originTop = $menu.css("top");

        var menuHeight = $menu.height();

        //存储目标区域的范围
        var sectionRange = [];

        //目标区域的hash值
        var hashes = [];

        function stickyMenu(i, $ele) {
            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();

            if (scrollTop > offsetTop) {
                $menu.css({
                    "position": "fixed",
                    "top": 0
                });
                $body.css('padding-top', menuHeight);
            }
            else {
                $menu.css({
                    "position": originPos,
                    "left": originLeft,
                    "top": originTop
                })
                $body.css('padding-top', 0);

            }

            if ((sectionRange[i].top > scrollTop + 1 && (scrollTop + windowHeight) > sectionRange[i].bottom) ||
                (sectionRange[i].top < scrollTop + 1 && (scrollTop + windowHeight) < sectionRange[i].bottom)) {
                $links.removeClass("active");
                $ele.addClass("active");
            }


            //第一个链接
            if (scrollTop == 0) {
                $links.removeClass("active");
                $links.first().addClass("active");
            }

            //最后一个链接
            if (scrollTop >= $(document).height() - windowHeight) {
                $links.removeClass("active");
                $links.last().addClass("active");
            }
        }

        $links.each(function (i, ele) {

            if ($(this).attr("href").indexOf("#") < 0) {
                return;
            }
            var hash = $(this).attr("href").substr(1);
            hashes.push(hash);

            var $target = $("." + hash);
            var $ele = $(ele);

            var targetOffset = $target.offset();

            sectionRange.push({
                top: options.isTopNav ? targetOffset.top - menuHeight : targetOffset.top,
                bottom: targetOffset.top + $target.outerHeight()
            })

            $ele.on("click", function () {
                if ($target.isHidden()) {
                    $target.slideDown();
                }
                $("html,body").stop().animate({
                    "scrollTop": sectionRange[i].top
                })
                return false;
            })

            if ($(window).scrollTop() > 0) {
                stickyMenu(i, $ele);
            }

            $(window).on("scroll", function () {
                stickyMenu(i, $ele);
            })
        });


        $(".toggle").on("click", function () {

            var targetHash = $(this).attr("hideTarget").substr(1);
            var $target = $("." + targetHash);
            var index = hashes.indexOf(targetHash);

            if (index >= 0) {
                var height = $target.height();

                if ($target.isHidden()) {
                    for (var i = index + 1; i < sectionRange.length; i++) {
                        sectionRange[i].top += height;
                        sectionRange[i].bottom += height;
                    }
                }
                else {
                    for (var i = index + 1; i < sectionRange.length; i++) {
                        sectionRange[i].top -= height;
                        sectionRange[i].bottom -= height;
                    }
                }
                $target.slideToggle();
            }

            return false;
        });

    }

})($);