var traverse = [], //存放遍历结果
    search = [], //存放搜索结果
    animation = false, //动画是否开始
    selectNode = null; //选中节点

/**
 *定义节点
 */
function Node(root) {
    this.data = root;
}

/*
 *遍历树,将数据返回到arr数组
 */
Node.prototype.traverse = function(order) {
    var arr = [];
    order.call(this, this.data, arr);
    return arr;
};

/*
 *前序遍历，返回数组
 */
Node.preOrder = function(curNode, arr) {
    arr.push(curNode);
    for (var i = 0; i < curNode.children.length; i++) {
        Node.preOrder(curNode.children[i], arr);
    }
};
/*
 *后续遍历，返回数组
 */
Node.postOrder = function(curNode, arr) {
    for (var i = 0; i < curNode.children.length; i++) {
        Node.postOrder(curNode.children[i], arr);
    }
    arr.push(curNode);
};

//新增节点
function addNode(parentNode, text,onclickFn) {
    if (text === "") {
        alert("新增节点文本不能为空");
        return;
    }
    var newNode = document.createElement("div");
    newNode.innerHTML = text;

    newNode.onclick = onclickFn||parentNode.onclick;

    parentNode.appendChild(newNode);
}

/*
 *遍历树动画开始
 */
function start(queryText, interval) {

    animation = true;
    clearStyle = false;

    var index = 0;

    var loop = setInterval(function() {
        //遍历完成
        if (index === traverse.length) {
            clearInterval(loop);
            traverse[traverse.length - 1].classList.remove("active");
            animation = false;
            return;
        }

        traverse[index].classList.add("active");

        if (index > 0) traverse[index - 1].classList.remove("active");

        if (traverse[index].firstChild.nodeValue.trim() === queryText) {
            traverse[index].classList.add("checked");
            search.push(traverse[index]);
        }
        index++;
    }, interval);

}
/*
 *重置样式
 */
function reset() {
    var allDiv = _root.getElementsByTagName("div");
    allDiv = Array.from(allDiv); //转换为数组

    //重置所有div的class
    allDiv.forEach(function(ele, index) {
        if (ele.className) ele.className = "";
    });

    traverse = [];
    search = [];
    selectNode = null;
}

//根据遍历顺序来搜索节点
function queryNode(target) {

    if (animation) {
        alert("正在搜索...");
        return;
    }

    if (queryText.value === "") {
        alert("搜索字不能为空");
        return;
    }

    reset();

    var order = target.dataset.order;
    traverse = rootNode.traverse(Node[order]);
    start(queryText.value, 500);
}

//处理按钮点击事件
function handleButton(event) {
    var target = event.target;
    var type = target.name;

    if (type === "deleteNode") {
        if (!selectNode) {
            alert("请选中节点");
            return;
        }
        selectNode.remove();
    } else if (type === "addNode") {
        if (!selectNode) {
            alert("请选中节点");
            return;
        }
        addNode(selectNode, newText.value.trim());
    } else {
        //遍历操作按钮
        queryNode(target);
    }
}

var _root = document.getElementById("root"),
    queryText = document.getElementById("queryText"),
    newText = document.getElementById("newText"),
    queryButton = document.getElementsByTagName("button"),
    
rootNode = new Node(_root);
queryButton = Array.from(queryButton);

//按钮点击事件
queryButton.forEach(function(ele, index) {
    if (ele.addEventListener) {
        ele.addEventListener("click", handleButton, false);
    } else {
        ele.attachEvent("onclick", handleButton.start);
    }
});

//绑定div的click事件
var divArr = Array.from(_root.parentNode.getElementsByTagName("div"));
divArr.forEach(function(ele, index) {
    ele.onclick = function(e) {

        if (traverse.length) reset();
        if (selectNode) selectNode.className = "";

        this.className = "select";
        e.stopPropagation();

        selectNode = this;
    };
});

