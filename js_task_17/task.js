/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
    var time = pageState.nowGraTime,
        city = pageState.nowSelectCity,
        chart_wrap = document.getElementsByClassName("aqi-chart-wrap")[0];

    chart_wrap.style = "width:98%;height:600px;border:1px solid #aaa;border-radius:10px;position:relative;";

    //渲染的数据
    var sourcedata = chartData[time][city];
    //属性集合
    var data_keys = Object.keys(sourcedata);
    //值集合
    var data_values = data_keys.map(function(ele, index) {
        return sourcedata[ele];
    });

    //计算得到最大值 然后计算出单位高度和宽度
    var max = Math.max.apply(null, data_values) + 50,
        perWidth = chart_wrap.clientWidth / data_keys.length,
        perHeight = chart_wrap.offsetHeight / max,
        colorList = ["#e2cd47", "#388ac1", "#43b29d", "#cf4a36"];

    var innerhtml = "";

    data_keys.forEach(function(ele, index) {
        var color = colorList[Math.floor(sourcedata[ele] / (max - 49) * 4)]; //获取颜色

        innerhtml += '<div name="' + ele + '"style="position:absolute;bottom:0;left:' + perWidth * index + ';width:' + perWidth + 'px;height:0px;padding:0 ' + perWidth * 0.05 + 'px;box-sizing:border-box;background:' + color + ';background-clip:content-box;transition:1s ' + 0.05 * index + 's">' + '<div style="position:absolute;left:0;right:0;bottom:100%;text-align:center;font:bold 14px/20px Microsoft YaHei;z-index:100;display:none;">aqi:' + Math.floor(sourcedata[ele]) + '</div>' + '</div>';
    });

    chart_wrap.innerHTML = innerhtml;
    //重新设置height 触发transition效果
    var childs = chart_wrap.children;
    for (var i = 0; i < childs.length; i++) {
        (function(i) {
            setTimeout(function() {
                childs[i].style.height = sourcedata[childs[i].getAttribute("name")] * perHeight + "px";
            }, 0);
        })(i);
    }


    //利用冒泡对wrap进行hover监听事件
    chart_wrap.addEventListener("mouseover", function(event) {
        var target = event.target;
        if (target !== this) {
          target.children[0].style.display = "block" ;
        }
        
    }, false);

    chart_wrap.addEventListener("mouseout", function(event) {
        var target = event.target;
        if (target !== this) {
          target.children[0].style.display = "none";
        }
    }, false);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    var time_type = this.value;
    // 设置对应数据
    pageState.nowGraTime = time_type;
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var index = this.selectedIndex;
    var city = this.options[index].text;
    // 设置对应数据
    pageState.nowSelectCity = city;
    // 调用图表渲染函数

    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radio_list = Array.prototype.slice.call(document.getElementsByName("gra-time"));

    radio_list.forEach(function(ele) {
        ele.addEventListener("change", graTimeChange, false);
    });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var city_select = document.getElementById("city-select");
    var innerhtml = "";
    for (var city in aqiSourceData) {
        innerhtml += "<option>" + city + "</option>";
    }

    city_select.innerHTML = innerhtml;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    city_select.addEventListener("change", citySelectChange, false);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var time_type = ["day", "week", "month"];

    time_type.forEach(function(ele) {
        if (ele === "day") {
            chartData[ele] = Object.assign({}, aqiSourceData);
        } else if (ele === "week") {
            var aqiSourceData_week = {};
            for (var city in aqiSourceData) {
                var returnData = {},
                    currentData, currentArr, weekIndex, dayCount, aqiCount,
                    datetime, day;

                currentData = aqiSourceData[city];
                weekIndex = 0;
                dayCount = 0;
                aqiCount = 0;
                currentArr = Object.keys(currentData); //属性名数组

                currentArr.forEach(function(value, index) {

                    datetime = new Date(value);
                    day = (datetime.getDay() + 6) % 7; //化为星期一为开始

                    dayCount++;
                    aqiCount += currentData[value];

                    //如果是星期天或者最后一天 则把周数据进行统计保存。然后初始化变量进行下次计算
                    if (day === 6 || index === (currentArr.length - 1)) {
                        returnData["第" + (weekIndex + 1) + "周"] = aqiCount / dayCount;

                        dayCount = 0;
                        aqiCount = 0;
                        weekIndex++;
                    }
                });

                //把该城市对应数据添加到新对象中
                aqiSourceData_week[city] = returnData;
            }

            chartData[ele] = aqiSourceData_week;
        } else {
            var aqiSourceData_month = {};

            for (var city in aqiSourceData) {
                var returnData = {},
                    currentData, currentArr, monthIndex, dayCount, aqiCount,
                    datetime, date;

                currentData = aqiSourceData[city];
                monthIndex = 0;
                dayCount = 0;
                aqiCount = 0;
                currentArr = Object.keys(currentData); //属性名数组

                currentArr.forEach(function(value, index) {
                    datetime = new Date(value);
                    date = datetime.getDate();

                    //如果是1号或者最后一天 则把月数据进行统计保存。然后初始化变量进行下次计算
                    if ((date === 1 && index !== 0) || index === (currentArr.length - 1)) {
                        returnData["第" + (monthIndex + 1) + "月"] = aqiCount / (dayCount + 1);

                        dayCount = 0;
                        aqiCount = 0;
                        monthIndex++;

                        return;
                    }

                    dayCount++;
                    aqiCount += currentData[value];
                });
                //把该城市对应数据添加到新对象中
                aqiSourceData_month[city] = returnData;
            }
            chartData[ele] = aqiSourceData_month;
        }
    });
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
    console.log("aqiSourceData", aqiSourceData);
    console.log("chartData", chartData);
}

init();
renderChart();
