function DropDownList(ele, options) {
    this.ele = ele;
    this.options = options;
    this.init();
}

DropDownList.prototype = {
    constructor: DropDownList,

    getEle: function () {
        return this.ele;
    },
    getOptions: function () {
        return this.options;
    },

    setCurrent: function (current) {
        this.getOptions()["current"] = current;
    },

    getCurrent: function () {
        return this.getOptions()["current"];
    },

    setItemText: function (value) {
        this.getEle().find(".title div").text(value);
    },

    init: function () {
        var that = this;
        that.getOptions()["current"] = null;
        that.setItemText(that.getOptions()["currentText"]);

        var itemsEle = that.getEle().find(".content .items");
        that.getEle().find(".title div").on("click", function () {
            itemsEle.toggle();
        });
        that.getEle().find(".title span").on("click", function () {
            itemsEle.toggle();
        });
        $.each(this.getOptions()["items"], function (i, item) {
            item["id"] = (new Date().getTime()).toString();
            that.render(item);
        });
    },
    render: function (item) {
        var that = this;

        var itemEle = $("<div></div>").text(item["text"]).attr("id", item["id"]);

        if ("0" == item["disabled"]) {
            itemEle.on({
                "click": function () {
                    var onChange = that.getOptions()["change"];
                    that.getEle().find(".content .items").hide();
                    that.setItemText(item["text"]);
                    that.setCurrent(item);
                    onChange && onChange(item);
                },
                "mouseover": function () {
                    $(this).addClass("item-hover");
                },
                "mouseout": function () {
                    $(this).removeClass("item-hover");
                }
            })
        }
        else {
            itemEle.addClass("disabled")
            .on("click", function () {
                that.getEle().find(".content .items").hide();
                //that.setItemText(item["text"]);
            });
        }
        itemEle.appendTo(that.getEle().find(".content .items"));
    }

};