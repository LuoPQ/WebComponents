var pageCount = 5;

function refreshFlip(flipType, newPageIndex) {
    var otherFlip = $this.siblings("." + flipType);
        pageIndex: 0,
    if (otherFlip.hasClass("noPage")) {
        var flipText = flipType == "prev" ? "上一� : "下一�;
        var $btnFlip = $("<a page='" + (newPageIndex - 1) + "' href='javascript:;' class='flip " + flipType + "'>" + flipText + "</a>");
        otherFlip.after($btnFlip).remove();
    }
    else {
        otherFlip.attr("page", newPageIndex - 1);
    }
    if (newPageIndex == 0) {
        var $newFlip = $("<span class='flip noPage prev'>上一�/span>");
        $this.after($newFlip).remove();
    }
    else {
        $this.attr("page", newPageIndex - 1);
    }
}
$(".pager").on("click", "a", function () {
    var $this = $(this);
    //替换原先选中的页码为未选中的页�
    var $oldCurPage = $this.siblings(".curPage");
    var oldPageIndex = parseInt($oldCurPage.text(), 10);
    var $btnPage = $("<a page='" + (oldPageIndex - 1) + "' href='javascript:;'>" + oldPageIndex + "</a>");
    //获取当前点击按钮指向的页�
    var newPageIndex = parseInt($this.attr("page"), 10);
    var $newCurPage = $("<span class='curPage'>" + (newPageIndex + 1) + "</span>");
    //要被替换的按钮，即被点击的页码或上一页下一页所指向的页码按�
    var toReplaceEle = $this.siblings("a[page=" + newPageIndex + "]:first");
    if ($this.hasClass("prev")) {//如果是上一页按�
        var otherFlip = $this.siblings(".next");
        if (otherFlip.hasClass("noPage")) {
            var $btnNext = $("<a page='" + (newPageIndex + 1) + "' href='javascript:;' class='flip next'>下一�/a>");
            otherFlip.after($btnNext).remove();
        }
        else {
            otherFlip.attr("page", newPageIndex + 1);
        }
        if (newPageIndex == 0) {
            var $newFlip = $("<span class='flip noPage prev'>上一�/span>");
            $this.after($newFlip).remove();
        }
        else {
            $this.attr("page", newPageIndex - 1);
        }
    }
    else if ($this.hasClass("next")) {//如果是下一�
        var prevFlip = $this.siblings(".prev");
        if (prevFlip.hasClass("noPage")) {
            var $btnPrev = $("<a page='" + (newPageIndex - 1) + "' href='javascript:;' class='flip prev'>上一�/a>");
            prevFlip.after($btnPrev).remove();
        }
        else {
            prevFlip.attr("page", newPageIndex - 1);
        }

        if (newPageIndex == pageCount - 1) {
            var $newFlip = $("<span class='flip noPage next'>下一�/span>");
            $this.after($newFlip).remove();
        }
        else {
            $this.attr("page", newPageIndex + 1);
        }
    }
    else {
        toReplaceEle = $this;
    }

    $oldCurPage.after($btnPage).remove();
    toReplaceEle.after($newCurPage).remove();
});