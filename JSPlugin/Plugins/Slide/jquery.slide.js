; (function ($) {
    "use strict";

    var defaults = {
        "speed": 1000,
        "timespan": 3000,
        "direction": "left",
        //"type": "gallery",//carousel or gallery,
        "scrollCount": 1,
        "leftSelector": ".slideLeft",
        "rightSelector": ".slideRight",
        "indexSelector": ".num",
        "indexClass": "on"
    }

    $.fn.slide = function (options) {
        options = $.extend(defaults, options || {});

        //#region 声明相关变量
        var $container = $(this);
        var $slider = $container.find(".slider");
        var $sliderItems = $slider.children();
        var $indexBtns = $(options.indexSelector).children();

        var timer = null;//计时器
        var index = 0;//开始滚动的索引
        var count = $sliderItems.length / options.scrollCount;//一次完成滚动所需要的次数
        var containerLength = 0;//元素容器的大小，上下方向则为高度，左右方向则为宽度
        var scrollLength = 0;//滚动的长度

        //#endregion

        //#region 计时器对象
        var timeObj = {
            timer: null,
            init: function () {
                startSlide();
                timeObj.timer = setInterval(function () {
                    startSlide()
                    index++;
                    if (index >= count) {//最后一张图片之后，转到第一张
                        index = 0;
                    }
                }, options.timespan);
            },
            stop: function () {
                $slider.stop(true, true);
                clearInterval(timeObj.timer);
            },
            restart: function () {
                clearInterval(timeObj.timer);
                timeObj.init();
            }
        };
        //#endregion

        ///初始化滑动
        function initSlide() {

            initData();

            bindEvent();
        }

        //初始化相关数据
        function initData() {
            $container.css({
                "overflow": "hidden",
                "position": "relative",
                "height": $slider.height() || $sliderItems.first().height()
            });

            var sliderCss = {
                "position": "absolute"//保证Slide的position为absolute，必须脱离文档流才能滚动
            }

            switch (options.direction) {
                case "top":
                case "bottom":
                    containerLength = $container.height();
                    //横向滚动的距离等于元素的宽度乘以滚动的元素个数
                    scrollLength = $sliderItems.first().outerHeight(true) * options.scrollCount;
                    sliderCss = $.extend(sliderCss,
                        {
                            "height": "100%",
                            "top": -scrollLength * index + "px" //改变 marginTop 属性的值达到轮播的效果
                        });
                    break;
                case "left":
                case "right":
                    containerLength = $container.width();
                    //横向滚动的距离等于元素的宽度乘以滚动的元素个数
                    scrollLength = $sliderItems.first().outerWidth(true) * options.scrollCount;
                    sliderCss = $.extend(sliderCss,
                       {
                           "width": $sliderItems.length * $sliderItems.first().outerWidth(true),
                           "left": -scrollLength * index + "px" //改变 marginTop 属性的值达到轮播的效果
                       });
                    break;
                default:
            }

            $slider.css(sliderCss);
        }

        ///绑定事件
        function bindEvent() {

            //滑入停止动画，滑出开始动画.
            $container.hover(function () {
                timeObj.stop();
            }, function () {
                timeObj.init();
            }).trigger("mouseleave");

            $(options.leftSelector).on("click", function () {
                if (index > 0) {
                    --index
                }
                else {
                    index = count;
                }
                setCurrentBtnClass($indexBtns.eq(index));
                timeObj.restart();
            })

            $(options.rightSelector).on("click", function () {
                if (index < count) {
                    ++index;
                }
                else {
                    index = 0;
                }
                setCurrentBtnClass($indexBtns.eq(index));
                timeObj.restart();
            })

            $indexBtns.hover(function () {
                var $this = $(this);
                index = $this.index();
                timeObj.stop();
                startSlide();
                setCurrentBtnClass($this);
            }, function () {
                timeObj.restart();
            })
        }

        //设置当前按钮按时
        function setCurrentBtnClass($indexBtn) {
            $indexBtn.addClass(options.indexClass).siblings().removeClass(options.indexClass);
        }

        //开始移动
        function startSlide() {
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
            $slider.stop(true, true).animate(animateCss, options.speed);

            setCurrentBtnClass($indexBtns.eq(index));
        }



        initSlide();

        return {
            start: function () {
                timeObj.restart();
                return this;
            },
            stop: function () {
                timeObj.stop();
                return this;
            }
        }
    };

})($);