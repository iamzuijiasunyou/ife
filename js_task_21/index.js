    var $ = function(id) {
        return document.getElementById(id);
    };

    /**
     *创建一个可复用的Tag类
     *Tag(inputId, outputId, regexp [,buttonId])
     *@param {String} - inputId 输入框id
     *@param {String} - outputId 输出块id
     *@param {RegExp} - regexp 正则表达式
     *@param {String} - buttonId 可选,默认是键盘输入事件
     */
    function Tag(inputId, outputId, regexp, buttonId) {
        this.input = $(inputId);
        this.output = $(outputId);
        this.regexp = regexp;
        this.button = $(buttonId);
        this.tagArr = [];

        this.addEvent();
    }
    var tag = Tag.prototype;
    /*
     *更新tagArr的数据
     */
    tag.updateTagData = function(ele) {
        if (!this._existData(ele)) {
            if (this.tagArr.length < 10) {
                this.tagArr.push(ele);
            } else {
                this.tagArr.shift();
                this.tagArr.push(ele);
            }
        }
    };
    tag._existData = function(inputEle) {
        return this.tagArr.some(function(ele) {
            return inputEle === ele;
        });
    };
    /*
     *删除tagArr的元素
     */
    tag.deleteTagData = function(index) {
        this.tagArr.splice(index, 1);
    };
    /*
     *绘制元素
     */
    tag.render = function() {
        var tagArr = this.tagArr,
            innerhtml = "";

        tagArr.forEach(function(ele, index) {
            innerhtml += "<span data-index='" + index + "'>" + ele + "</span>";
        }, "");

        this.output.innerHTML = innerhtml;
        this.input.value = "";
    };

    /*
     *绑定事件（input或者click事件）
     */
    tag.addEvent = function() {
        //如果没有button，则是input事件
        var self = this;

        if (!self.button) {
            self.input.addEventListener("input", function() {
                var length = this.value.length;
                var lastChar = this.value[length - 1];

                if (self.regexp.test(lastChar)) {
                    var tag = this.value.slice(0, -1).trim();

                    self.updateTagData(tag);

                    self.render();
                }
            }, false);
        } else {
            self.button.addEventListener("click", function() {
                var tagList = self.input.value.split(self.regexp);

                tagList.forEach(function(ele, index) {
                    self.updateTagData(ele);
                });

                self.render();
            }, false);
        }

        //绑定span mouseover mouserout click事件事件
        self.output.addEventListener("mouseover", function(event) {
            var target = event.target;
            if (target.nodeName === "SPAN") {
                target.innerHTML = "点击删除" + target.innerHTML;
            }
        }, false);

        self.output.addEventListener("mouseout", function(event) {
            var target = event.target;
            if (target.nodeName === "SPAN") {
                target.innerHTML = target.innerHTML.replace("点击删除", "");
            }
        }, false);

        self.output.addEventListener("click", function(event) {
            var target = event.target;
            if (target.nodeName === "SPAN") {
                self.deleteTagData(target.dataset.index);
                target.remove();
            }
        }, false);
    };


    window.onload = function(argument) {
        var tag1 = new Tag("tag_1", "tag1", new RegExp("[\\s,\\r\\n]"));
        var tag2 = new Tag("tag_2", "tag2", new RegExp(/[\s,\r\n]/));

        var tag3 = new Tag("tag_3", "tag3", new RegExp(/[\s,、\r\n]/), "submit");

    };
