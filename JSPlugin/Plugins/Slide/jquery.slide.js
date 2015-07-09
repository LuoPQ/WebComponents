; (function ($) {
    "use strict";

    var defaults = {
        "switchTime": 5000,
        "effect": "slide",//slide or fade
        "speed": 800,
        "perScrollCount": 1,
        "indexBoxSelector": ".indexBox",
        "btnLeftSelector": ".btnLeft",
        "btnRightSelector": ".btnRight",
        "indexClass": null
    }

    $.fn.slide = function (options) {
        options = $.extend(defaults, options || {});

        var TOP_ZINDEX = 5;
        var DEFAULT_ZINDEX = 0;

        var directions = {
            left: "left",
            right: "right"
        };

        var $slider = $(this);
        var $list = $slider.children();

        var width = $list.first().outerWidth(true);
        var height = $list.first().outerHeight(true);
        var currentIndex = 0;
        var minIndex = 0;
        var maxIndex = $list.length - 1;

        var timerObj = {
            timer: null,
            start: function () {
                timerObj.timer = setInterval(function () {
                    $(options.btnRightSelector).click();
                }, options.switchTime);
            },
            stop: function () {
                clearInterval(timerObj.timer);
            }
        };

        function start() {
            init();

            bindEvent();

            timerObj.start();
        }

        function init() {
            //如果一次性滚动多个，修改相关的的数据
            if (options.perScrollCount > 1) {
                for (var i = 0, length = $list.length; i < length; i = i + options.perScrollCount) {
                    $list.slice(i, i + options.perScrollCount).wrapAll("<div />");
                }
                $list = $slider.children();

                width = width * options.perScrollCount;
                maxIndex = $list.length - 1;
            }

            //在外层增加一个遮挡滚动列表的div
            $slider.wrap('<div style="overflow:hidden;position:relative;width:' + width + 'px;height:' + height + 'px" />');

            //设置图片绝对定位，使其重叠
            $list.css("position", "absolute");

            //设置图片列表为绝对定位，动画效果需要绝对定位
            $slider.css({
                "width": width * 2,
                "position": "absolute"
            });

            //初始化图片的样式
            $list.first().css({
                zIndex: TOP_ZINDEX
            });
            $list.eq(1).css({
                left: width
            });
            $list.last().css({
                left: -width
            })
        }

        function bindEvent() {
            $slider.hover(function () {
                timerObj.stop();
            }, function () {
                timerObj.start();
            });

            $(options.btnLeftSelector).on("click", function () {
                timerObj.stop();
                doRolling(directions.left);
            })

            $(options.btnRightSelector).on("click", function () {
                timerObj.stop();
                doRolling(directions.right);
            })

            $(options.indexBoxSelector).children()
                .hover(function () {
                    var index = $(this).index();
                    if (index != currentIndex) {
                        var left = index - currentIndex < 0 ? width : -width;

                        scrollAnim(left);

                        currentIndex = index;

                        setCurrentIndexClass();
                    }
                    timerObj.stop();
                }, function () {
                    timerObj.start();
                });
        }

        //进行滚动
        function doRolling(direction) {
            chageCurrentIndex(direction);
            setCurrentIndexClass();
            var left = direction == directions.left ? width : -width;

            scrollAnim(left);
            timerObj.start();
        }

        //改变当前滚动的索引
        function chageCurrentIndex(direction) {
            switch (direction) {
                case directions.left:
                    currentIndex = currentIndex == minIndex ? maxIndex : currentIndex - 1;
                    break;
                case directions.right:
                    currentIndex = currentIndex == maxIndex ? minIndex : currentIndex + 1;
                    break;
                default:
            }
        }

        //滚动的动画效果
        function scrollAnim(left) {
            $slider.stop(true, true).animate({ "left": left }, options.scrollSpeed, "linear", function () {
                $slider.css({ "left": "0px" });

                $list.css({
                    left: "0px",
                    zIndex: DEFAULT_ZINDEX
                })
                $list.eq(currentIndex).css({
                    zIndex: TOP_ZINDEX,
                });

                //设置前后索引的样式保证动画效果
                //设置当前索引的前一项的left
                $list.eq(currentIndex - 1 < minIndex ? maxIndex : currentIndex - 1).css({
                    left: -width
                });

                //设置当前索引的后一项的left
                $list.eq(currentIndex + 1 > maxIndex ? minIndex : currentIndex + 1).css({
                    left: width
                });
            });
        }

        //设置当前按钮按时
        function setCurrentIndexClass() {
            $(options.indexBoxSelector)
                .children().eq(currentIndex).addClass(options.indexClass)
                .siblings().removeClass(options.indexClass);
        }

        //if (options.effect == "slide") {
        start();
        //}

        return {
            start: function () {
                timerObj.start();
                return this;
            },
            stop: function () {
                timerObj.stop();
                return this;
            }
        }
    }
})($);