//#region Date扩展

//添加指定单位的时间
Date.prototype.dateAdd = function (interval, number) {
    var d = new Date(this);
    var k = { 'y': 'FullYear', 'q': 'Month', 'm': 'Month', 'w': 'Date', 'd': 'Date', 'h': 'Hours', 'n': 'Minutes', 's': 'Seconds', 'ms': 'MilliSeconds' };
    var n = { 'q': 3, 'w': 7 };
    eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
    return d;
}

//计算当前日期与指定日期相差的天数
Date.prototype.dateDiff = function (otherDate) {
    return (this.getTime() - otherDate.getTime()) / 1000 / 60 / 60 / 24;
};
Date.prototype.format = function () {
    var month = this.getMonth() + 1;
    var date = this.getDate();
    month < 10 && (month = "0" + month);
    date < 10 && (date = "0" + date);

    return [this.getFullYear(), month, date].join("-");
};
Date.prototype.parse = function (s) {
    if ((s || '') == '')
        return null;

    if (typeof (s) == "object")
        return s;

    if (typeof (s) == 'string') {
        if (/\/Date\(.*\)\//gi.test(s)) {
            return eval(s.replace(/\/Date\((.*?)\)\//gi, "new Date($1)"));
        }
        else if (/(\d{8})/.test(s)) {
            return eval(s.replace(/(\d{4})(\d{2})(\d{2})/, "new Date($1,parseInt($2)-1,$3)"));
        }
        else if (/(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2})\:(\d{1,2})(?:\:(\d{1,2}))?/.test(s)) {
            return eval(s.replace(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2})\:(\d{1,2})(?:\:(\d{1,2}))?[\w\W]*/, "new Date($1,parseInt($2)-1,parseInt($3),parseInt($4),parseInt($5),parseInt($6)||0)"));
        }
        else if (/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.test(s)) {
            return eval(s.replace(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/, "new Date($1,parseInt($2)-1,$3)"));
        }
        try {
            return new Date(s);
        } catch (e) {
            return null;
        }
    }

    return null;
};

//#endregion

var arrayHelper = {
    each: function (arr, func) {
        if (Array.prototype.forEach) {
            arr.forEach(func(e, i));
        }
        else {
            for (var i = 0, length = arr.length; i < length; i++) {
                func(arr[i], i);
            }
        }
    }
};

function DatePicker(ele, options) {
    if (this == window) {
        return new DatePicker();
    }
    else {
        this.ele = ele;
        this.options = options;
        this.container = null;
        this.currentYear = null;
        this.currentMonth = null;
        this.currentDate = options.currentDate || new Date();
        this.pickerType = pickerTypes.day;

        this.init();
    }
}
DatePicker.prototype = {
    constructor: DatePicker,
    init: function () {
        this.ele.value = this.options.initDate;
        this.options.minDate = new Date().parse(this.options.minDate);
        this.options.maxDate = new Date().parse(this.options.maxDate);

        this.renderHtml();
    },
    renderHtml: function () {

        var container = document.createElement("dl");
        container.className = "datepicker";
        container.style.display = "none";
        document.body.appendChild(container);
        this.container = container;

        this.refresh();
    },
    refresh: function () {
        this.ele.setAttribute("readonly", "readonly");

        this.currentYear = this.currentYear || this.currentDate.getFullYear();
        this.currentMonth = this.currentMonth || this.currentDate.getMonth();
        var currentDate = new Date(this.currentYear, this.currentMonth, 1);

        switch (this.pickerType) {
            case pickerTypes.year:
                var yearTitleHtml = this.createTitleHtml(this.currentYear, this.currentMonth, pickerTypes.year);
                var yearListHtml = this.createYearListHtml(this.currentYear);
                this.container.innerHTML = (yearTitleHtml + yearListHtml);
                break;
            case pickerTypes.month:
                var monthTitleHtml = this.createTitleHtml(this.currentYear, this.currentMonth, pickerTypes.month);
                var monthListHtml = this.createMonthListHtml(this.currentYear);
                this.container.innerHTML = (monthTitleHtml + monthListHtml);
                break;
            case pickerTypes.day:
            default:
                var dayTitleHtml = this.createTitleHtml(this.currentYear, this.currentMonth, pickerTypes.day);
                var dayListHtml = this.createDateListHtml(this.currentYear, this.currentMonth);
                this.container.innerHTML = (dayTitleHtml + dayListHtml);
                break;
        }

        if (this.ele.value) {



            var selectedEles = document.querySelectorAll("#" + this.ele.id + " dd .select");
            for (var i = 0, length = selectedEles.length; i < length; i++) {
                selectedEles[i].className = selectedEles[i].className.replace("select", "");
            }

            var selectedDate = new Date().parse(this.ele.value);

            var dateBtn = document.querySelectorAll("#" + this.ele.id + " dd a");
            var year = selectedDate.getFullYear();
            var month = selectedDate.getMonth();

            for (var i = 0, length = dateBtn.length; i < length; i++) {
                if (dateBtn[i].getAttribute("year") === year) {
                    dateBtn[i].className += " select";
                    continue;
                }
                if (dateBtn[i].getAttribute("month") === month) {
                    dateBtn[i].className += " select";
                    continue;
                }
                if (dateBtn[i].getAttribute("date") === this.ele.value) {
                    dateBtn[i].className += " select";
                    continue;
                }
            }
        }
        //this.$container.find(".date-unit").hide().fadeIn();
        this.bindEvent();
    },
    createTitleHtml: function (currentYear, currentMonth, pickerType) {
        var title = "";
        switch (pickerType) {
            case pickerTypes.year:
                var yearRange = this.getYearRange(currentYear);
                title = yearRange.minYear + "-" + yearRange.maxYear;
                break;
            case pickerTypes.month:
                title = currentYear + '年';
                break;
            case pickerTypes.day:
            default:
                title = currentYear + '年' + (currentMonth + 1) + '月';
                break;
        }

        var titleHtml =
            '<dt class="date-action">\
                <a href="javascript:;" class="prev"></a>\
                    <span>' + title + '</span>\
                <a href="javascript:;" class="next"></a>\
            </dt>';


        if (pickerType == pickerTypes.day) {
            arrayHelper.each(weekdayNames, function (value) {
                titleHtml += '<dt class="week">' + value + '</dt>';
            })
        }

        return titleHtml;
    },
    createYearListHtml: function (currentYear) {
        var yearHtml = '<dd class="clearfix date-unit year">';

        var yearList = this.getYearList(currentYear);
        for (var i = 0; i < yearList.length; i++) {
            var year = yearList[i];

            var className = "";
            year.disabled && (className += " disabled");
            yearHtml += ('<a year="' + year.year + '" href="javascript:;" class="' + className + '">' + year.year + '</a>');
        }

        yearHtml += '</dd>';

        return yearHtml;
    },
    createMonthListHtml: function (currentYear) {
        var monthHtml = '<dd class="clearfix date-unit month">';

        var monthList = this.getMonthList();
        for (var i = 0; i < monthList.length; i++) {
            var month = monthList[i];
            var className = "";
            monthHtml += ('<a month="' + month.month + '" href="javascript:;" class="' + className + '">' + month.monthText + '</a>');
        }

        monthHtml += '</dd>';

        return monthHtml;
    },
    createDateListHtml: function (currentYear, currentMonth) {
        var dateHtml = '<dd class="clearfix date-unit day">';

        var dateList = this.getDateList(currentYear, currentMonth);
        for (var i = 0; i < dateList.length; i++) {
            var date = dateList[i];

            var className = "";
            date.disabled && (className += " disabled");
            date.isHoliday && (className += " holiday");
            dateHtml += ('<a date="' + date.format() + '" href="javascript:;" class="' + className + '">' + date.dateText + '</a>');
        }

        dateHtml += ('</dd>');

        return dateHtml;
    },
    getYearList: function (currentYear) {
        var yearRange = this.getYearRange(currentYear);

        var list = [];
        for (var startYear = yearRange.minYear - 1, endYear = yearRange.maxYear + 1; startYear <= endYear; startYear++) {
            list.push(this.createYear(startYear, startYear < yearRange.minYear || startYear > yearRange.maxYear));
        }

        return list;
    },
    getMonthList: function () {
        var list = [];
        for (var i = 0; i < 12; i++) {
            list.push(this.createMonth(i));
        }
        return list;
    },
    getDateList: function (currentYear, currentMonth) {

        var firstDay = new Date(currentYear, currentMonth, 1);
        var lastDay = new Date(currentYear, currentMonth + 1, 0);
        var list = [];

        for (var i = 0, length = firstDay.getDay() ; i < length ; i++) {
            list.push(this.createDate(firstDay.dateAdd("d", i - length), currentMonth));
        }
        for (var i = 1; i <= lastDay.getDate() ; i++) {
            list.push(this.createDate(new Date(currentYear, currentMonth, i), currentMonth));
        }
        for (var i = 0; i < 6 - lastDay.getDay() ; i++) {
            list.push(this.createDate(new Date(currentYear, currentMonth + 1, i + 1), currentMonth));
        }

        return list;
    },
    getYearRange: function (currentYear) {
        var minYear = parseInt(currentYear / 10) * 10;
        var maxYear = minYear + 9;
        return {
            minYear: minYear,
            maxYear: maxYear
        };
    },
    createYear: function (year, disabled) {
        return {
            year: year,
            disabled: disabled
        }
    },
    createMonth: function (month) {
        return {
            month: month,
            monthText: (month + 1) + "月"
        }
    },
    createDate: function (date, month) {

        date.disabled = (Math.ceil(date.dateDiff(this.options.minDate)) < 0 || month != date.getMonth());

        if (this.options.maxDate && !date.disabled) {
            date.disabled = (Math.ceil(date.dateDiff(this.options.maxDate)) > 0)
        }

        var dateInfo = this.getDayInfo(date);

        date.isHoliday = dateInfo.isHoliday;
        date.dateText = dateInfo.dateText;

        return date;
    },
    bindEvent: function () {
        var that = this;

        //document.querySelector("#" + that.ele.id+"")

        that.$container.find(".date-action").on("click", function () {
            switch (that.pickerType) {
                case pickerTypes.year:
                    break;
                case pickerTypes.month:
                    that.pickerType = pickerTypes.year;
                    that.refresh();
                    break;
                case pickerTypes.day:
                default:
                    that.pickerType = pickerTypes.month;
                    that.refresh();
                    break;
            }
        });

        that.$container.find("dd>a").on("click", function () {
            var $this = $(this);
            if (!$this.hasClass("disabled")) {
                switch (that.pickerType) {
                    case pickerTypes.year:
                        that.currentYear = parseInt($this.attr("year"));
                        that.pickerType = pickerTypes.month;
                        that.refresh();
                        break;
                    case pickerTypes.month:
                        that.currentMonth = parseInt($this.attr("month"));
                        that.pickerType = pickerTypes.day;
                        that.refresh();
                        break;
                    case pickerTypes.day:
                    default:
                        var date = $this.attr("date");
                        that.selectDate(date);
                        that.$container.find("dd .select").removeClass("select");
                        that.$container.find("dd>[date=" + date + "]").addClass("select");
                        break;
                }
            }

        });
        that.$container.find("dt .prev").on("click", function (event) {
            that.prev();
            that.stopBubble(event);
        });
        that.$container.find("dt .next").on("click", function (event) {
            that.next();
            that.stopBubble(event);
        });
        that.$ele.on({
            "click": function (event) {
            },
            "focus": function () {
                that.show();
                if (that.pickerType != pickerTypes.day) {
                    that.pickerType = pickerTypes.day;
                    that.refresh();
                }
            }
        });

        $(document).on("mousedown", function (event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (that.$ele[0] != target && that.$ele[0] != target.parentNode) {
                that.hide();
            }
        });
        that.$container.on({
            "click": function (event) {
                that.stopBubble(event);
            },
            "mousedown": function (event) {
                that.stopBubble(event);
            }
        });
    },
};