(function () {
    'use strict';
    var defaults = {
        pageIndex: 0,
        maxButtonCount: 7,
        itemCount: 0,
        pageSize: 10
    };
    ko.components.register("ko-pager", {
        viewModel: function (params) {
            params = ko.utils.extend(defaults, params.options || {});

            var self = this;

            //生成ko形式的页码
            function createKoPage(index, curIndex, maxButtonCount, midPageIndex) {
                var koPage = {};
                koPage.index = index;
                koPage.select = function () {
                    self.pageIndex(koPage.index);
                }
                var isVisiblePage = getVisiblePage(index, curIndex, maxButtonCount, midPageIndex);
                koPage.isShowLink = (index != curIndex && isVisiblePage);
                koPage.isShowSpan = (index == curIndex && isVisiblePage);
                return koPage;
            }

            //==判断一个页码是否显示
            function getVisiblePage(index, curIndex, maxButtonCount, midPageIndex) {
                if (curIndex <= midPageIndex) {//如果选中页码小于中位的页码
                    return index < self.maxButtonCount();
                }
                if (self.maxPageIndex() - curIndex < midPageIndex) {//如果是最大页码减去选中页码的结果小于中位的页码
                    return index + self.maxButtonCount() > self.maxPageIndex();
                }
                return Math.abs(index - curIndex) <= midPageIndex;
            }

            //=====当前页码=====
            self.pageIndex = ko.observable(params.pageIndex);

            //=====最多的按钮数量======
            self.maxButtonCount = ko.observable(params.maxButtonCount);

            //=======总条数=========
            self.itemCount = ko.observable(params.itemCount);

            //=======每页显示的条数=========
            self.pageSize = ko.observable(params.pageSize);

            //====最大的页码索引====
            self.maxPageIndex = ko.computed(function () {
                return Math.ceil(self.itemCount() / self.pageSize()) - 1;
            });

            //=====页码列表=======
            self.pageList = ko.computed(function () {
                var pages = []
                var curIndex = self.pageIndex();
                var maxButtonCount = self.maxButtonCount();
                var midPageIndex = Math.ceil(maxButtonCount / 2);
                for (var i = 0; i <= self.maxPageIndex() ; i++) {
                    pages.push(createKoPage(i, curIndex, maxButtonCount, midPageIndex));
                }
                return pages;
            });

            //=====是否显示上一页或首页====
            self.prevOrFirstVisible = ko.computed(function () {
                return self.pageIndex() > 0;
            })

            //=====是否显示下一页或末页====
            self.nextOrLastVisible = ko.computed(function () {
                return self.pageIndex() < self.maxPageIndex();
            });

            //=======上一页处理事件=======
            self.prevHandler = function () {
                var pageIndex = self.pageIndex();
                pageIndex > 0 && self.pageIndex(pageIndex - 1);

            }

            //=======下一页处理时间=========
            self.nextHandler = function () {
                var pageIndex = self.pageIndex();
                pageIndex < self.maxPageIndex() && self.pageIndex(pageIndex + 1);
            }
        },
        template:
            '<div class="pager" data-bind="visible:maxPageIndex() > 0">\
                <a class="flip" href="javascript:;" data-bind="visible:prevOrFirstVisible,click:function(){pageIndex(0)}">首页</a>\
                <span class="flip noPage" data-bind="visible:!prevOrFirstVisible()">上一页</span>\
                <a class="flip" href="javascript:;" data-bind="visible:prevOrFirstVisible,click:prevHandler">上一页</a>\
                <!--ko foreach:pageList-->\
                <a href="javascript:;" data-bind="visible:isShowLink, text:index+1,click:select"></a>\
                <span class="curPage" data-bind="visible:isShowSpan,text:index+1"></span>\
                <!--/ko-->\
                <span class="flip noPage" data-bind="visible:!nextOrLastVisible()">下一页</span>\
                <a class="flip" href="javascript:;" data-bind="visible:nextOrLastVisible,click:nextHandler">下一页</a>\
                <a class="flip" href="javascript:;" data-bind="visible:nextOrLastVisible,click:function(){ pageIndex(maxPageIndex())}">末页</a>\
            </div>'
    });
})();
