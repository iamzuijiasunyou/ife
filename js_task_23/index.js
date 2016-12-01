var _root = document.getElementById("root"),
    queryButton = document.getElementsByTagName("button"),
    queryText = document.getElementById("queryText"),
    arr = [],
    animation = false;

rootNode = new Node(_root);
queryButton = Array.prototype.slice.call(queryButton);


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
 *前序遍历二叉树 返回数组
 */
Node.preOrder = function(curNode, arr) {
    arr.push(curNode);
    for (var i = 0; i < curNode.children.length; i++) {
        Node.preOrder(curNode.children[i], arr);
    }
};
/*
 *后续遍历二叉树 返回数组
 */
Node.postOrder = function(curNode, arr) {
    for (var i = 0; i < curNode.children.length; i++) {
        Node.postOrder(curNode.children[i], arr);
    }
    arr.push(curNode);
};

/*
 *遍历树动画开始
 */
function start(arr, queryText) {

    animation = true;

    var index = 0;

    var loop = setInterval(function() {
        //遍历完成
        if (index === arr.length) {
            clearInterval(loop);
            arr[arr.length - 1].classList.remove("active");www.
            animation = false;
            return;
        }
        arr[index].classList.add("active");

        index > 0 ? arr[index - 1].classList.remove("active") : null;

        if (arr[index].firstChild.nodeValue.trim() === queryText) {
            arr[index].classList.add("checked");
        }
        index++;
    }, 1000);

}
/*
 *重置样式
 */
function reset(arr) {
    arr.forEach(function(ele) {
        ele.className = "";
    });
}

//根据遍历顺序来搜索节点
function queryNode(event) {
    var target = event.target;
    var order = target.dataset.order;

    if (animation) {
        alert("正在搜索...");
        return;
    }

    if (queryText.value === "") {
        alert("搜索字不能为空");
        return;
    }

    reset(arr);
    arr = rootNode.traverse(Node[order]);
    start(arr, queryText.value);
}

//点击事件
queryButton.forEach(function(ele, index) {
    if (ele.addEventListener) {
        ele.addEventListener("click", queryNode, false);
    } else {
        ele.attachEvent("onclick", queryNode.start);
    }
});
