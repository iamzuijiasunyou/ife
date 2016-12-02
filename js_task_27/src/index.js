(function() {

    // require("./index.css");

    var SPACESHIP_SPEED = 3, //飞船速度
        CHARGE_RATE = 2, //充电速率
        COMSUME_RATE = 5, //耗电速率
        CANVAS_WIDTH = 400,
        CANVAS_HEIGHT = 400,
        SEND_TIME = 300, //命令传播时间
        LOST_MANIC = 0.1, //丢包率
        POWER_COLOR_HIGH = "#00AAFF", //高电量
        POWER_COLOR_MIDDLE = "#00DF2D", //中等电量
        POWER_COLOR_LOW = "#FC0000", //低电量
        SHIP_WIDTH = 19,
        SHIP_HEIGHT = 23,
        BATTRY_HEIGHT = 8, //电池高度
        FIRST_RADIUS = 50; //单位半径



    /**
     *飞船类
     *@param {speed} int 速度
     *@param {chRate} int 充电速率
     *@param {conRate} int 消耗速率
     */
    function Ship(id, speed, chRate, conRate) {
        this.id = id;
        this.power = 100;
        this.bus = null;
        this.radius = 10 + 40 * id; //飞船初始半径、和id有关
        this.deg = 0; //飞船初始角度
        this.speed = speed || SPACESHIP_SPEED;
        this.chRate = chRate || CHARGE_RATE;
        this.conRate = conRate || COMSUME_RATE;
        this.timer = null;
        this.state = "stop";
    }

    /**
     *动力系统
     *对象提供api:fly && stop
     */
    Ship.prototype.dynamicManager = function() {
        var self = this;

        var fly = function() {
            self.timer = setInterval(function() {
                self.deg += self.speed * FIRST_RADIUS / self.radius; //根据
                if (self.deg >= 360) self.deg = 0;

                // ConsoleUtil.log("Spaceship No." + self.id + " is flying.");
            }, 30);
        };

        var stop = function() {
            clearInterval(self.timer);

            ConsoleUtil.log("Spaceship No." + self.id + " is stopped.");
        };

        return {
            fly: fly,
            stop: stop
        };
    };

    /**
     *能源系统
     *对外提供api：charge 和 consume  
     */
    Ship.prototype.powerManager = function() {
        var self = this,

            //充电
            charge = function() {
                var chargeTimer = setInterval(function() {
                    if (self.state !== "stop") {
                        clearInterval(chargeTimer);
                        return;
                    } else if (self.power >= 100) {
                        clearInterval(chargeTimer);
                        self.power = 100;
                        return;
                    }
                    self.power += self.chRate;
                }, 1000);

                ConsoleUtil.log("飞船 No." + self.id + "号正在充电.");
            },
            /*耗电*/
            consume = function() {

                var consumeTimer = setInterval(function() {
                    if (self.state !== "fly") {
                        //不在飞行
                        clearInterval(consumeTimer);

                        return;

                    } else if (self.power < self.conRate) {
                        //能量耗尽
                        clearInterval(consumeTimer);

                        ConsoleUtil.log("飞船 No." + self.id + "号燃油即将耗尽.");

                        self.power = 0;

                        self.StateManager().setState("stop");

                        return;
                    }
                    self.power -= self.conRate;

                }, 1000);

                ConsoleUtil.log("飞船 No." + self.id + "能量正在减少.");
            };

        return {
            charge: charge,
            consume: consume
        };
    };

    /*状态管理*/
    Ship.prototype.StateManager = function() {
        var self = this,

            states = {
                "fly": function() {
                    self.dynamicManager().fly();
                    self.powerManager().consume();
                },
                "stop": function() {
                    self.dynamicManager().stop();
                    self.powerManager().charge();
                },
                "destroy": function() {
                    self.state = "destroy";
                    self.bus.remove(self);
                },
            },

            /*
             *设置飞船状态
             */
            setState = function(state) {
                self.state = state;
                states[state] && states[state](); //判断是否存在，再执行

                ConsoleUtil.log("飞船 No." + self.id + " 状态为 " + state);
            };

        return {
            setState: setState
        };
    };

    /**
     *飞船信号管理，负责接收和处理信号
     */
    Ship.prototype.SingleManager = function() {
        var self = this,

            recieve = function(cmd) {
                var cmdObj = Ship.Adapter(cmd);

                if (self.id === cmdObj.id) {
                    self.StateManager().setState(cmdObj.command);
                }
            },
            send  = function(){

            };

        return {
            recieve: recieve
        };
    };

    Ship.Adapter = function(cmd) {
        var
            id = parseInt(cmd.slice(1, 3)),
            comCode = cmd.slice(4),
            command;

        switch (comCode) {
            case '0001':
                command = 'fly';
                break;
            case '0010':
                command = 'stop';
                break;
            case '0100':
                command = 'destroy';
                break;
            default:
                throw new Error("错误的指令");
        }

        return { id: id, command: command };

    };
    /**
     *指挥官类
     */
    function Commander() {
        this.id = "kangheitan";
        this.bus = null;
        this.cmds = [];
    }
    /*发送命令，然后bus负责传播*/
    Commander.prototype.sendCommand = function(cmd) {
        if (!this.bus) return;

        if (cmd.command === 'init') {
            this.bus.create(cmd);
        } else {
            var comCode = Commander.Aadapter(cmd);

            this.cmds.push(comCode);

            this.bus.send(comCode);
        }
    };
    /*转换器*/
    Commander.Aadapter = function(cmd) {
        var id = ("i" + (cmd.id >= 10 ? cmd.id : "0" + cmd.id) + "d"),
            comCode;
        switch (cmd.command) {
            case 'fly':
                comCode = '0001';
                break;
            case 'stop':
                comCode = '0010';
                break;
            case 'destroy':
                comCode = '0100';
                break;
            default:
                comCode = cmd.command;
        }

        return id + comCode;
    };




    /**
     *传播介质类
     */
    var BUS = function() {
        var commander = null,
            ships = [];

        return {
            /*发送信号给飞船*/
            send: function(cmdObj) {
                var self = this;

                setTimeout(function() {

                    if (!cmdObj) return;

                    var lost = Math.random() < LOST_MANIC ? true : false;

                    //如果丢包
                    while (lost) {
                        //丢包
                        ConsoleUtil.log("丢包!!", "error");
                        lost = Math.random() < LOST_MANIC ? true : false;
                    }

                    ConsoleUtil.log("信号发射成功!");

                    ships.forEach(function(ele, index) {
                        ele.SingleManager().recieve(cmdObj);
                    });

                }, SEND_TIME);
            },
            /*注册指挥官或者飞船*/
            register: function(obj) {
                if (obj instanceof Commander) {

                    commander = obj;

                    obj.bus = this;


                    ConsoleUtil.log("指挥官注册成功：" + obj.id);
                } else if (obj instanceof Ship) {
                    ships[obj.id] = obj;

                    obj.bus = this;

                } else {
                    throw new Error("参数错误");
                }
            },

            /*新建飞船*/
            create: function(cmd) {
                if (ships[cmd.id]) {
                    ConsoleUtil.log("飞船已存在：" + cmd.id);
                    return;
                } else {
                    var dynamic = document.querySelector("input[name='dynamic']:checked"),
                        chRate = document.querySelector("input[name='power']:checked"),
                        speed, conRate;

                    if (dynamic) {
                        speed = dynamic.value.split(",")[0];
                        conRate = dynamic.value.split(",")[1];
                    }

                    if (chRate) chRate = chRate.value;
                    console.log(+speed, +chRate, +conRate);
                    var ship = new Ship(cmd.id, +speed, +chRate, +conRate);
                    this.register(ship);
                    ConsoleUtil.log("飞船注册成功：" + ship.id);
                }
            },
            /*移除飞船*/
            remove: function(ship) {
                if (ship instanceof Ship) {
                    delete ships[ship.id];
                } else {
                    ConsoleUtil.show("飞船销毁失败");
                }
            },
            /*返回飞船*/
            getShips: function() {
                return ships;
            }
        };
    };

    /**
     *命令类
     */
    var Command = function(id, command) {
        this.id = id;
        this.command = command;
    };

    /**
     *命令行工具类
     */
    var ConsoleUtil = {
        ele: document.querySelector(".console-log"),

        log: function(text, className) {
            var p = document.createElement("p");
            p.innerHTML = text;
            if (className) p.className = className;
            this.ele.appendChild(p);
        }
    };

    /**
     *动画工具类
     */
    var AnimateUtil = (function() {

        var shipImg = new Image();

        shipImg.src = "./dist/ship.png";

        var canvas = document.getElementById("canvas"), //canvas
            ctx = canvas.getContext("2d");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        var bus = null; //关联的bus

        function setBUS(_bus) {
            bus = _bus;
        }

        /*画背景*/
        function drawTrack(_ctx) {
            _ctx.save();
            _ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            //轨道
            for (var i = 1; i <= 4; i++) {
                _ctx.beginPath();
                _ctx.strokeStyle = "#aaa";
                _ctx.arc(0, 0, 10 + 40 * i, 0, 2 * Math.PI);
                _ctx.closePath();
                _ctx.stroke();
            }
            _ctx.restore();
        }

        /*画一个飞船*/
        function drawShip(ctx, ship) {

            ctx.save();
            //飞船
            ctx.rotate(-ship.deg * Math.PI / 180);

            ctx.drawImage(shipImg, ship.radius - SHIP_WIDTH / 2, -SHIP_HEIGHT / 2);

            ctx.font = "15px serif";
            ctx.fillText(ship.id+"号",ship.radius - 10,SHIP_HEIGHT + 2);
            ctx.fillText(ship.power + "%",ship.radius - 10, -BATTRY_HEIGHT - 17);
            //能量条
            if (ship.power >= 60) {
                ctx.fillStyle = POWER_COLOR_HIGH;
            } else if (ship.power < 60 && ship.power >= 30) {
                ctx.fillStyle = POWER_COLOR_MIDDLE;
            } else {
                ctx.fillStyle = POWER_COLOR_LOW;
            }


            ctx.fillRect(ship.radius - SHIP_WIDTH / 2, -SHIP_HEIGHT, SHIP_WIDTH * ship.power / 100, BATTRY_HEIGHT);

            ctx.restore();
        }

        /**
         *描绘所有飞船
         */
        function drawShips(ships) {

            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear canvas

            ctx.save();

            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

            ships.forEach(function(ele, index) {
                drawShip(ctx, ele);
            });

            ctx.restore();
        }

        //动画循环requestAnimationFrame
        var animLoop = function() {
            requestAnimationFrame(animLoop);
            drawShips(bus.getShips());
        };

        /*描绘背景*/
        (function() {
            var layer = document.getElementById("layer"),
                layerctx = layer.getContext("2d");


            layer.width = CANVAS_WIDTH;
            layer.height = CANVAS_HEIGHT;
            layerctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            drawTrack(layerctx);
        })();

        //对外api
        return {
            setBUS: setBUS,
            animLoop: animLoop
        };
    })();
    /**
     *事件处理程序
     */
    function eventHandle(commander) {
        var list = document.querySelector(".commander-panel ul").children,
            buttons = document.getElementsByTagName("button");

        buttons = Array.from(buttons);
        list = Array.from(list);

        list.forEach(function(ele, index) {
            ele.index = index + 1;
        });

        buttons.forEach(function(ele, index) {
            ele.onclick = handlebutton;
        });

        function handlebutton() {

            var self = this,
                op = self.dataset.op,
                id = self.parentNode.index,
                cmd = new Command(id, op);

            commander.sendCommand(cmd);
        }
    }
    /**
     *主线程
     */
    window.onload = function() {
        var commander = new Commander(),
            bus = new BUS();

        bus.register(commander);

        eventHandle(commander);

        AnimateUtil.setBUS(bus);
        AnimateUtil.animLoop();
    };



})();
