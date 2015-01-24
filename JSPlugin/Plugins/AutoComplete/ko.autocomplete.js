(function (ko) {
    "use strict";
    var defaults = {

    };

    ko.components.register("ko-auto-complete", {
        viewModel: function (params) {
            params = ko.utils.extend(defaults, params.options || {});

            var self = this;

            //=====设置当前选中项======
            function setSelectedItem() {
                var selected = self.validOptions()[self.curIndex()];
                selected && self.searchTerm(selected);
                self.selectedItem(selected);
            }

            //当前的焦点项索引
            self.curIndex = ko.observable(-1);

            //如果使用模板绑定，则需传入模板名称
            self.templateName = params.templName;

            //=====有效的选项=====
            self.validOptions = ko.observableArray();

            //====输入的搜索参数==========
            self.searchTerm = ko.observable();

            self.searchTerm.subscribe(function (newValue) {
                var key = newValue;
                if (key) {
                    if (params.remoteDataUrl && self.validOptions.indexOf(key) < 0) {
                        $.ajax({
                            url: params.remoteDataUrl,
                            type: "POST",
                            dataType: "json",
                            data: {
                                term: key
                            }
                        })
                        .done(function (result) {
                            self.validOptions(result);
                        });
                    }
                    else {
                        var result = [];
                        var reg = new RegExp(key + "+", "img");
                        for (var i = 0; i < params.allOptions.length; i++) {
                            var current = params.allOptions[i];
                            if (params.filter) {
                                params.filter(key, current) && result.push(current);
                            }
                            else {
                                reg.test(current) && result.push(current);
                            }
                        }
                        self.validOptions(result);
                    }
                }
                else {
                    self.validOptions([]);
                }
            });


            //===选中项====
            self.selectedItem = ko.observable();

            //=====是否显示列表======
            self.optionsVisible = ko.observable(false);
            //隐藏选项列表
            self.hideOptionList = function () {
                setTimeout(function () {
                    self.optionsVisible(false);
                }, 150);
            };

            //键盘按下后放开处理事件
            self.keyupHandler = function (event) {
                var keyCode = event.keyCode || event.which;
                var curIndex = self.curIndex();
                switch (keyCode) {
                    case 13:
                        setSelectedItem();
                        self.hideOptionList();
                        break;
                    case 38:
                        curIndex <= 0 ? self.curIndex(self.validOptions().length - 1) : self.curIndex(curIndex - 1);
                        break;
                    case 40:
                        curIndex == self.validOptions().length - 1 ? self.curIndex(0) : self.curIndex(curIndex + 1);
                        break;
                    default:
                        self.optionsVisible(true);
                }
            }

            //鼠标点击选择事件
            self.clickHandler = function (index) {
                self.curIndex(index);
                setSelectedItem();
            }

        },
        template:
            '<input class="autocomplete-txt" type="text" data-bind="value:searchTerm,valueUpdate:\'afterkeydown\',event:{\'keyup\':function(data,event){keyupHandler(event);},\'blur\':hideOptionList}" />\
            <ul class="autocomplete-opt" data-bind="visible:optionsVisible, foreach:validOptions">\
                <!--ko if:$parent.templateName-->\
                <li data-bind="template:{name:$parent.templateName,data:$data},css:{\'select\':$index() == $parent.curIndex() },click:function(){$parent.clickHandler($index());}"></li>\
                <!--/ko-->\
                <!--ko ifnot:$parent.templateName-->\
                <li data-bind="html:$data,css:{\'select\':$index() == $parent.curIndex() },click:function(){$parent.clickHandler($index());}"></li>\
                <!--/ko-->\
            </ul>'
    });
})(ko);