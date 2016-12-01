/*
 *@param {object} obj 自定义初始化树数据
 *@param {domElement} docNode tree展示区域 
 *
 */
var init = function(obj, docNode) {
    for (var i = 0; i < obj.length; i++) {
        _append(obj[i], docNode);
    }

    //递归对象 添加dom元素
    function _append(ele, node) {
        var newNode = document.createElement("li"),
            pNode = document.createElement("p"),
            ulNode;

        pNode.innerHTML = "<span class='nodeText'>" + ele.data + "</span>" +
            "<span class='add-delete'>" +
            "<button>添加</button><button>删除</button>" +
            "</span>";
        newNode.appendChild(pNode);


        //如果有子节点，递归添加
        if (ele.child.length) {
            ulNode = document.createElement("ul");
            newNode.appendChild(ulNode);

            for (var i = 0, len = ele.child.length; i < len; i++) {
                _append(ele.child[i], ulNode);
            }
        }
        node.appendChild(newNode);
    }
};

//初始化数据
var testData = [{
    data: "计算机数目",
    child: [{
        data: "办公类",
        child: [{
            data: "Windows应用",
            child: []
        }, {
            data: "Office快速入门",
            child: []
        }]
    }, {
        data: "编程类",
        child: []
    }, {
        data: "网络类",
        child: []
    }, {
        data: "动画类",
        child: []
    }]
}, {
    data: "数学科目",
    child: [{
        data: "高数",
        child: [{
            data: "高数1",
            child: []
        }, {
            data: "高数2",
            child: []
        }]
    }]
}];

//新增节点
function addNode(parentNode, newNode) {
    var childUl = parentNode.getElementsByTagName("ul"),
        newli = document.createElement("li");

    newli.innerHTML = "<p><span class='nodeText'>" + newNode +
        "</span><span class='add-delete'>" +
        "<button>添加</button><button>删除</button>" +
        "</span></p>";

    newli.onclick = handleClick;

    if (childUl.length) {
        childUl[0].appendChild(newli);
    } else {
        childUl = document.createElement("ul");
        childUl.appendChild(newli);
        parentNode.appendChild(childUl);
    }
    console.log(newli);
    openNode(newli);
}

//移除节点
function removeNode(node) {
    node.remove();
}

//遍历节点
function traverse(rootNode, queryText) {
    if (queryText === "") {
        alert("搜索文本不能为空");
        return;
    }

    var child = Array.from(rootNode.getElementsByTagName("p"));

    traverseArr = child.filter(function(ele) {
        return ele.innerHTML.indexOf(queryText) >= 0;
    });
    if (!traverseArr.length) {
        alert("无搜索结果");
        return;
    }
    traverseArr.forEach(function(ele) {
        openNode(ele);
        ele.children[0].classList.add("selected");
    });
}

//打开节点
function openNode(curNode) {

    if (curNode === document.body) return;

    if (curNode.tagName === "LI") {
        curNode.classList.add("active");
    }
    openNode(curNode.parentNode);

}

//按钮点击事件函数
function handleClick(e) {
    //处理按钮点击事件
    if (e.target.nodeName === "BUTTON") {
        switch (e.target.innerHTML) {

            case "添加":
                var newNode = prompt("请输入新节点内容");
                if (newNode) {
                    addNode(this, newNode);
                }
                e.stopPropagation();
                return;

            case "删除":
                removeNode(this);
                break;
            default:
                alert("按钮指令出错");
        }
    }

    //处理li点击事件
    this.classList.toggle("active");
    e.stopPropagation();
}

//重置树样式
function reset(rootNode) {
    var activeList = rootNode.getElementsByClassName("active");
    Array.from(activeList).forEach(function(ele) {
        ele.classList.remove("active");
    });

    traverseArr.forEach(function(ele) {
        ele.children[0].classList.remove("selected");
    });

    traverseArr = [];
}

var tree = init(testData, document.getElementById("treeWrap"));

var treeWrap = document.getElementsByClassName("tree")[0],
    queryText = document.getElementById("queryText"),
    traverseArr = []; //搜索节点

var liList = Array.from(treeWrap.getElementsByTagName("li"));

//绑定点击事件
liList.forEach(function(ele) {
    ele.onclick = handleClick;
});

document.getElementById("queryButton").onclick = function(argument) {
    reset(treeWrap);
    traverse(treeWrap, queryText.value.trim());
};
