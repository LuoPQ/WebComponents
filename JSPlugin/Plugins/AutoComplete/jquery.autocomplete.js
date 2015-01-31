;(function ($) {
    "use strict";
    var defaults = {
        maxItemCount: 10,
        data: [],
        selectHandler: function (item) {
            console.log(item);
        }
    };

    $.fn.autoComplete = function (options) {
        options = $.extend(defaults, options || {});

        this.each(function () {
            return new autoComplete($(this));
        });

        function autoComplete($ele) {

            var self = this;

            //======内部方法=======

            //=====渲染HTML=====
            function renderHtml() {
                $ele.after('<ul class="autocomplete-opt"></ul>');

                var $list = $ele.siblings("ul:first");

                var offset = $ele.offset();

                $list.css({
                    "width": $ele.innerWidth(),
                    "top": offset.top + $ele.innerHeight(),
                    "left": offset.left,
                    "position": "absolute",
                    "z-Index": "9999",
                    "display": "none"
                });

                var currentIndex = -1;

                $ele.on({
                    "click": function (event) {
                        event.stopPropagation();
                    },
                    "focus": function () {
                        var key = $ele.val();
                        filterData($list, key);
                    },
                    "keyup": function (event) {
                        var keyCode = event.keyCode || event.which;

                        switch (keyCode) {
                            case 38:
                            case 40:
                                return;
                            case 13:
                                var value = $list.children().eq(currentIndex).text();
                                options.selectHandler(value);
                                $ele.val(value);
                                $list.hide();
                                break;
                            default:
                                var key = $ele.val();
                                if (key) {
                                    filterData($list, key);
                                }
                                else {
                                    $list.hide();
                                    currentIndex = -1
                                }
                        }
                    },
                    "keypress": function (event) {
                        var keyCode = event.keyCode || event.which;

                        setTimeout(function () {
                            switch (keyCode) {
                                case 38:
                                    currentIndex = currentIndex > 0 ?
                                        currentIndex - 1 : $list.children().length - 1;
                                    setSelectClass($list, currentIndex);
                                    break;
                                case 40:
                                    currentIndex = currentIndex < $list.children().length - 1 ?
                                        currentIndex + 1 : 0;
                                    setSelectClass($list, currentIndex);
                                    break;
                                default:
                                    break;
                            }
                        }, 30);

                    }
                });

                $(document).on("click", function () {
                    $list.hide();
                })
            };

            //====设置选中的样式====
            function setSelectClass($list, index) {
                $list.children().removeClass("select").eq(index).addClass("select");
            }

            function filterData($list, key) {
                var reg = new RegExp("(" + key + ")+", "i");
                var html = [];
                for (var i = 0; i < options.data.length; i++) {
                    if (reg.test(options.data[i].Key)) {
                        html.push("<li>" + options.data[i].Name + "</li>");
                    }
                }
                if (html.length) {
                    $list.html("").append(html.join(""));
                    $list.show();
                    $list.children().on("click", function () {

                        var value = $(this).text();
                        options.selectHandler(value);
                        $ele.val(value);
                        $list.hide();
                    })
                }
                else {
                    $list.hide();
                    currentIndex = -1
                }
            }



            renderHtml();
        }

        autoComplete.prototype.test = function () {
            console.log("test");
        }

    }



})(jQuery || $);