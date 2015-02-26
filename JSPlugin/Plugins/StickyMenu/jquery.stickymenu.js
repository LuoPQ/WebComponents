; (function ($) {
    "use strict";

    var defaults = {
        "speed": 500,
        "isTopNav": true,
        "activeClass": "active"
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

        //菜单高度
        var menuHeight = $menu.height();

        //窗口高度
        var windowHeight = $(window).height();

        //存储目标区域的范围
        var sectionRange = [];

        //目标区域的hash值
        var hashes = [];

        //切换隐藏的区域
        var toggleHashes = [];

        function stickyMenu() {

            var scrollTop = $(window).scrollTop();

            if (scrollTop > offsetTop) {
                $menu.css({
                    "position": "fixed",
                    "top": 0,
                    "left": options.menuLeft ? options.menuLeft : "auto"
                });
                //$body.css('padding-top', menuHeight);
            }
            else {
                $menu.css({
                    "position": originPos,
                    "left": originLeft,
                    "top": originTop
                })
                //$body.css('padding-top', 0);

            }

            for (var i = 0; i < $links.length; i++) {
                if ((sectionRange[i].top > scrollTop + 1 && (scrollTop + windowHeight) > sectionRange[i].bottom) ||
                    (sectionRange[i].top < scrollTop + 1 && (scrollTop + windowHeight) < sectionRange[i].bottom)) {
                    $links.removeClass(options.activeClass);
                    $links.eq(i).addClass(options.activeClass);
                    break;
                }
            }

            //第一个链接
            if (scrollTop == 0) {
                $links.removeClass(options.activeClass);
                $links.first().addClass(options.activeClass);
            }

            //最后一个链接
            if (scrollTop >= $(document).height() - windowHeight) {
                $links.removeClass(options.activeClass);
                $links.last().addClass(options.activeClass);
            }
        }

        $links.each(function (i, ele) {

            if ($(this).attr("href").indexOf("#") < 0) {
                return;
            }
            var hash = $(this).attr("href").substr(1);
            hashes.push(hash);
            toggleHashes.push("toggle-" + hash);

            var $target = $("." + hash);
            var $ele = $(ele);

            var targetOffset = $target.offset();

            sectionRange.push({
                top: options.isTopNav ? targetOffset.top - menuHeight : targetOffset.top,
                bottom: targetOffset.top + $target.outerHeight()
            })

            $ele.on("click", function () {
                var $toggleTarget = $("." + toggleHashes[i]);
                if ($toggleTarget.isHidden()) {
                    $toggleTarget.slideDown();
                }
                $("html,body").stop().animate({
                    "scrollTop": sectionRange[i].top
                })
                return false;
            })

            //if ($(window).scrollTop() > 0) {
            //    stickyMenu(i, $ele);
            //}

            //$(window).on("scroll", function () {
            //    stickyMenu(i, $ele)
            //})
        });

        if ($(window).scrollTop() > 0) {
            stickyMenu();
        }

        $(window).on("scroll", function () {
            stickyMenu();
        })


        $(".toggle").on("click", function () {

            var toggleHash = "toggle-" + $(this).attr("toggletarget").substr(1);
            var $target = $("." + toggleHash);
            var index = toggleHashes.indexOf(toggleHash);

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