(function($) {
	var defaults = {
		className: "rater",
		maxCount: 5,
		$element: null,
		canReselect: true,
		textList: ["1分", "2分", "3分", "4分", "5分", "6分"],
		selectedCallBack: null
	};

	$.fn.rater = function(options) {
		options = $.extend(defaults, options);
		
		return this.each(function() {
			options.$element = $(this);
			new rater(options);
		})

	}


	//#region define rater class

	function rater(options) {
		var self = this;

		self.config = options;

		self.star = 0;

		//initialize
		self.init();
	}

	rater.prototype = {

		//overwrite the prototype so that the constructor pointers to Object,
		//so overwrite constructor, set it to rater
		constructor: rater,

		init: function() {
			var self = this;

			self.renderHtml();

			self.bindEvent();

		},

		renderHtml: function() {
			var config = this.config;
			var $element = config.$element;
			$element.addClass(config.className);

			var htmlArray = [];
			htmlArray.push("<ul>");
			for (var i = 0; i < config.maxCount; i++) {
				htmlArray.push('<li><a href="javascript:;"></a></li>');
			}
			htmlArray.push("</ul><span class='hidden'></span>");

			$element.html(htmlArray.join(" "));
		},

		bindEvent: function() {
			var self = this;
			var config = this.config;
			var $element = config.$element;

			var $liArray = $element.find('li');

			$liArray.on({
				"mouseover": function() {
					self.setItemStatus($liArray, $(this).index() + 1);
				},
				"mouseout": function() {
					self.setItemStatus($liArray);
				},
				"click": function() {
					var $this = $(this);

					//when trigger click event ,it will trigger mouseover event,
					//because mouse must move to the element, so don't need to call setItemStatus method
					if (config.canReselect || self.star == 0) {
						self.star = $this.index() + 1;
						config.selectedCallBack && config.selectedCallBack(self.star);
					}
				}
			});
		},

		setItemStatus: function($itemList, selectedIndex) {
			var self = this;

			//assign the star to a temp variable for setting selected style
			//for mouseover event,tempIndex is the index of selected item,
			//for mouseout event,tempIndex is the default value,
			var tempIndex = selectedIndex || self.star;

			$itemList.each(function(index) {
				//set the selected style if currentIndex is less than selectedIndex					
				var currentItem = $itemList.eq(index);
				index < tempIndex ? currentItem.addClass('select') : currentItem.removeClass('select');
			})

			var $textEle = $itemList.parent().next();
			self.setItemText($textEle, tempIndex);
		},

		setItemText: function($textEle, currentIndex) {
			currentIndex > 0 ? $textEle.html(this.config.textList[currentIndex - 1]).removeClass('hidden') : $textEle.addClass('hidden');
		}
	}

	//#endregion

})(jQuery)