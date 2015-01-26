(function (ko) {
    "use strict";

    var defaults = {

    };

    function datePickerVM(params) {
        var self = this;

        //======辅助方法=======
        function dateDiff(date1, date2) {
            return Math.floor((date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);
        }


        function createKoDate(date, month) {
            var koDate = {};
            var currentMonth = date.getMonth();
            var minDate = self.minDate();

            koDate.year = date.getFullYear();
            koDate.month = currentMonth + 1;
            koDate.date = date.getDate();
            koDate.day = date.getDay() + 1;
            koDate.dateText = koDate.date;
            koDate.disabled = dateDiff(minDate, date) > 0;

            if (month == currentMonth) {
                var today = new Date();
                if (date.getDate() == today.getDate()
                    && date.getFullYear() == today.getFullYear()
                    && date.getMonth() == today.getMonth()) {
                    koDate.dateText = '<span>今天</span>';
                }
            }
            else {
                koDate.dateText = "";
            }

            koDate.select = function () {
                if (!koDate.disabled) {
                    self.selectedDay(koDate);
                    params.datePicked && params.datePicked(koDate);
                }
            }
            return koDate;
        }

        function getDateList(currentDate) {
            var currentYear = currentDate.getFullYear();
            var currentMonth = currentDate.getMonth();

            var firstDay = new Date(currentYear, currentMonth, 1);
            var lastDay = new Date(currentYear, currentMonth + 1, 0);

            var list = [];
            for (var i = 0; i < firstDay.getDay() ; i++) {
                list.push(createKoDate(new Date(currentYear, currentMonth - 1, i), currentMonth));
            }
            for (var i = 1; i <= lastDay.getDate() ; i++) {
                list.push(createKoDate(new Date(currentYear, currentMonth, i), currentMonth));
            }
            for (var i = 0; i < 6 - lastDay.getDay() ; i++) {
                list.push(createKoDate(new Date(currentYear, currentMonth + 1, i + 1), currentMonth));
            }

            return list;
        }

        var today = new Date();

        //最小天数
        self.minDate = ko.observable(params.minDate || new Date());

        //选择的天数
        self.selectedDay = ko.observable();
        self.selectedText = ko.computed(function () {
            var selectedDay = self.selectedDay();
            if (selectedDay) {
                self.datePickerVisible(false);
                return selectedDay.year + "-" + selectedDay.month + "-" + selectedDay.date;
            }
            return "";
        })

        //当前日期
        var minDate = self.minDate();
        self.currentDate = ko.observable(new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()));

        self.currentDateText = ko.computed(function () {
            var currentDate = self.currentDate();
            return currentDate.getFullYear() + "年" + (currentDate.getMonth() + 1) + "月";
        })

        //天数列表
        self.dayList = ko.computed(function () {
            return getDateList(self.currentDate());
        })

        //是否显示日期选择框
        self.datePickerVisible = ko.observable(true);

        //是否在选择
        self.showDatePicker = function () {
            self.datePickerVisible(true);
        }

        self.clickHandler = function () {

        }

        document.onclick = function () {
            setTimeout(function () {
                self.datePickerVisible(false);
            }, 150);
        }

        self.changeMonth = function (data, event) {

        }

        self.prevMonth = function (data, event) {
            var currentDate = self.currentDate();
            currentDate.setMonth(currentDate.getMonth() - 1);
            self.currentDate(currentDate);
        }

        self.nextMonth = function () {
            var currentDate = self.currentDate();
            currentDate.setMonth(currentDate.getMonth() + 1);
            self.currentDate(currentDate);
        }


    }

    ko.components.register("ko-datepicker", {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                params = ko.utils.extend(defaults, params.options || {});
                return new datePickerVM(params);
            }
        },
        template:
            //'<input type="text" data-bind="value:selectedText,event:{\'focus\':showDatePicker},click:clickHandler,clickBubble: false" />\
            '<input type="button" value="显示" data-bind="click:showDatePicker,clickBubble:false"/>\
            <div class="datepicker" data-bind="visible:datePickerVisible">\
                <dl>\
                    <dt class="month">\
                        <a class="month-prev" data-bind="click:prevMonth,clickBubble: false"></a>\
                        <span data-bind="text:currentDateText"></span>\
                        <a class="month-next" data-bind="click:nextMonth,clickBubble: false"></a>\
                    </dt>\
                    <dt class="week">日</dt>\
                    <dt class="week">一</dt>\
                    <dt class="week">二</dt>\
                    <dt class="week">三</dt>\
                    <dt class="week">四</dt>\
                    <dt class="week">五</dt>\
                    <dt class="week">六</dt>\
                    <dd data-bind="foreach:dayList">\
                        <a class="" data-bind="css:{\'disabled\':disabled},html:dateText,click:select"></a>\
                    </dd>\
                </dl>\
            </div>'
    })

})(ko);