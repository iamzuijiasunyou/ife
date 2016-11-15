/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData(city,value) {
	aqiData[city] = value;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var table = document.getElementById("aqi-table");
	var innerhtml = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	
	for(var city in aqiData){
		innerhtml +="<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button data-city='"+city+"'>删除</button></td></tr>";
	}

	table.innerHTML = innerhtml;
}
/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  //验证数据
  var aqi_city = document.getElementById("aqi-city-input").value.trim(),
  	  aqi_value = document.getElementById("aqi-value-input").value.trim();


  if (!/^[a-zA-Z\u4e00-\u9fa5 ]*$/.test(aqi_city)) {
  		alert("城市名只能是中英文");
  		return;
  }

  if (!/^[1-9][0-9]*$/.test(aqi_value)) {
  		alert("数值只能是整数");
  		return;
  }

  addAqiData(aqi_city,aqi_value);

  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
  delete aqiData[city];

  renderAqiList();
}


function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById("add-btn").onclick = addBtnHandle;

  //想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  //利用冒泡机制 给table注册事件来响应按钮点击
  document.getElementById("aqi-table").onclick = function (event) {
  		var ele = event.target;

  		if (ele.tagName.toLowerCase()==="button") {
  			delBtnHandle.call(null,ele.dataset.city);
  		}
  };
}

init();