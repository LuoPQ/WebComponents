; (function ($) {
    "use strict";
    var defaults = {
        maxItemCount: 10,
        data: [],
        remoteDataUrl: null,
        onSelected: null,
    };
    function autoComplete(options) {

        var $ele = options.ele;

        var $list = null;

        var currentIndex = -1;

        //#region 内部方法

        //=====渲染列表容器=====
        function renderContainer() {
            $ele.after('<ul class="autocomplete-opt"></ul>');

            $list = $ele.siblings("ul:first");

            var offset = $ele.offset();

            $list.css({
                "width": $ele.innerWidth(),
                "top": offset.top + $ele.innerHeight(),
                "left": offset.left,
                "position": "absolute",
                "z-Index": "9999",
                "display": "none"
            });
        };

        //======绑定处理事件=======
        function bindEvent() {

            $ele.on({
                "click": function (event) {
                    var key = $ele.val();
                    key && filterData(key);
                    event.stopPropagation();
                },
                "keyup": function (event) {
                    var keyCode = event.keyCode || event.which;

                    switch (keyCode) {
                        case 38:
                        case 40:
                            return;
                        case 13:
                            var value = $list.children().eq(currentIndex).text();
                            selectHandler(value);
                            break;
                        default:
                            var key = $ele.val();
                            if (key) {
                                filterData(key);
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
                                setSelectClass(currentIndex);
                                break;
                            case 40:
                                currentIndex = currentIndex < $list.children().length - 1 ?
                                    currentIndex + 1 : 0;
                                setSelectClass(currentIndex);
                                break;
                            default:
                                break;
                        }
                    }, 30);

                }
            });

            $list.children().on("click", function () {
                var value = $(this).text();
                selectHandler(value);
            })

            $(document).on("click", function () {
                $list.hide();
            })
        }

        //=====过滤数据=========
        function filterData(key) {
            if (options.remoteDataUrl) {
                $.ajax({
                    url: options.remoteDataUrl,
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: key
                    }
                })
                .done(function (result) {
                    options.data = result;
                    renderList(key);
                });
            }
            else {
                renderList(key);
            }
        }

        //=====渲染列表数据======
        function renderList(key) {
            var html = [];
            var reg = new RegExp("(" + key + ")+", "i");
            var maxCount = options.maxItemCount < options.data.length
               ? options.maxItemCount : options.data.length;

            for (var i = 0; i < maxCount; i++) {
                if (reg.test(options.data[i])) {
                    html.push("<li>" + options.data[i] + "</li>");
                }
            }
            $list.html("").hide();
            if (html.length) {
                $list.append(html.join(""));
                $list.show();
            }
        }

        //====选择后处理事件======
        function selectHandler(value) {
            options.onSelected(value);
            $ele.val(value);
            $list.hide();
        }

        //====设置选中的样式====
        function setSelectClass(index) {
            $list.children().removeClass("select").eq(index).addClass("select");
        }

        //#endregion

        renderContainer();

        bindEvent();

    }

    autoComplete.prototype = {

        constructor: autoComplete,

        test: function () {
            console.log("test");
        }
    };

    $.fn.autoComplete = function (options) {
        options = $.extend(defaults, options || {});
        options.ele = $(this);
        //this.each(function () {
        //    return new autoComplete($(this));
        //});
        return new autoComplete(options);
    }
})(jQuery || $);