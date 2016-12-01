!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){!function(){function e(e){this.id=e,this.power=100,this.mediator=null,this.radius=10+40*e-12,this.deg=0,this.timer=null,this.state="stop"}function t(){this.id="kangheitan",this.mediator=null,this.cmds=[]}function r(e){function t(){var t=this,n=t.dataset.op,r=t.parentNode.index,o=new v(r,n);e.sendCommand(o)}var n=document.querySelector(".commander-panel ul").children,r=document.getElementsByTagName("button");r=Array.from(r),n=Array.from(n),n.forEach(function(e,t){e.index=t+1}),r.forEach(function(e,n){e.onclick=t})}n(1);var o=2,i=2,a=5,s=400,c=400,l=.3,u="#00AAFF",f="#00DF2D",d="#FC0000",p=19,h=23,m=8;e.prototype.dynamicManager=function(){var e=this,t=function(){e.timer=setInterval(function(){e.deg+=o,e.deg>=360&&(e.deg=0)},30)},n=function(){clearInterval(e.timer),y.log("Spaceship No."+e.id+" is stopped.")};return{fly:t,stop:n}},e.prototype.powerManager=function(){var e=this,t=function(){var t=setInterval(function(){return"stop"!==e.state?void clearInterval(t):e.power>=100?(clearInterval(t),void(e.power=100)):void(e.power+=i)},1e3);y.log("飞船 No."+e.id+"号正在充电.")},n=function(){var t=setInterval(function(){return"fly"!==e.state?void clearInterval(t):e.power<a?(clearInterval(t),y.log("飞船 No."+e.id+"号燃油即将耗尽."),e.power=0,void e.StateManager().setState("stop")):void(e.power-=a)},1e3);y.log("飞船 No."+e.id+"能量正在减少.")};return{charge:t,consume:n}},e.prototype.StateManager=function(){var e=this,t={fly:function(){e.dynamicManager().fly(),e.powerManager().consume()},stop:function(){e.dynamicManager().stop(),e.powerManager().charge()},destroy:function(){e.state="destroy",console.log(e),e.mediator.remove(e)}},n=function(n){e.state=n,t[n]&&t[n](),y.log("飞船 No."+e.id+" 状态为 "+n)};return{setState:n}},e.prototype.SingleManager=function(){var e=this,t=function(t){e.id===t.id&&e.StateManager().setState(t.command)};return{recieve:t}},t.prototype.sendCommand=function(e){this.mediator&&(this.cmds.push(e),this.mediator.send(e))};var g=function(){var n=null,r=[];return{send:function(e){var t=this;setTimeout(function(){if(e){var n=Math.random()<l;n?y.log("丢包!!","error"):"init"===e.command?t.create(e):(y.log("信号发射成功!"),r.forEach(function(t,n){t.SingleManager().recieve(e)}))}},1e3)},register:function(o){if(o instanceof t)n=o,o.mediator=this,console.log(o,o.mediator),y.log("指挥官注册成功："+o.id);else{if(!(o instanceof e))throw new Error("property error");r[o.id]=o,o.mediator=this}},create:function(t){if(r[t.id])return void y.log("飞船已存在："+obj.id);var n=new e(t.id);this.register(n),y.log("飞船注册成功："+n.id)},remove:function(t){t instanceof e?delete r[t.id]:y.show("飞船销毁失败")},getShips:function(){return r}}},v=function(e,t){this.id=e,this.command=t},y={ele:document.querySelector(".console-log"),log:function(e,t){var n=document.createElement("p");n.innerHTML=e,t&&(n.className=t),this.ele.appendChild(n)}},b=function(){function e(e){l=e}function t(e){e.save(),e.translate(s/2,c/2);for(var t=1;t<=4;t++)e.beginPath(),e.strokeStyle="#aaa",e.arc(0,0,10+40*t,0,2*Math.PI),e.closePath(),e.stroke();e.restore()}function n(e,t){e.save(),e.rotate(-t.deg*Math.PI/180),e.drawImage(o,t.radius,-h/2),t.power>=60?e.fillStyle=u:t.power<60&&t.power>=30?e.fillStyle=f:e.fillStyle=d,e.fillRect(t.radius,-h,p*t.power/100,m),e.restore()}function r(e){a.clearRect(0,0,s,c),a.save(),a.translate(s/2,c/2),e.forEach(function(e,t){n(a,e)}),a.restore()}var o=new Image;o.src="./dist/ship.png";var i=document.getElementById("canvas"),a=i.getContext("2d");i.width=s,i.height=c;var l=null,g=function(){requestAnimationFrame(g),r(l.getShips())};return function(){var e=document.getElementById("layer"),n=e.getContext("2d");e.width=s,e.height=c,n.clearRect(0,0,s,c),t(n)}(),{setMediator:e,animLoop:g}}();window.onload=function(){var e=new t,n=new g;n.register(e),r(e),b.setMediator(n),b.animLoop()}}()},function(e,t,n){var r=n(2);"string"==typeof r&&(r=[[e.id,r,""]]);n(4)(r,{});r.locals&&(e.exports=r.locals)},function(e,t,n){t=e.exports=n(3)(),t.push([e.id,"body{font-family:Microsoft YaHei}h5,h6,p{margin:5px 0}.wrapper{position:relative;margin-right:300px}.ship-canvas{position:relative;display:block;margin:0 auto;box-shadow:0 0 10px #aaa;z-index:100}.layer-canvas{position:absolute;top:0;bottom:0;left:50%;margin-left:-200px}.console-log{top:0;right:0;width:300px;overflow-y:auto}.commander-panel,.console-log{position:fixed;bottom:0;border:1px solid #aaa}.commander-panel{left:0;right:300px;height:200px}.commander-panel li{margin-top:15px}.commander-panel button{font-size:18px;margin-left:10px;border:none;box-shadow:0 0 5px #aaa;border-radius:3px;background:-webkit-radial-gradient(#fff,#aaa);background:radial-gradient(#fff,#aaa)}.error{color:red}",""])},function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<t.length;o++){var a=t[o];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},function(e,t,n){function r(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=p[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(l(r.parts[i],t))}else{for(var a=[],i=0;i<r.parts.length;i++)a.push(l(r.parts[i],t));p[r.id]={id:r.id,refs:1,parts:a}}}}function o(e){for(var t=[],n={},r=0;r<e.length;r++){var o=e[r],i=o[0],a=o[1],s=o[2],c=o[3],l={css:a,media:s,sourceMap:c};n[i]?n[i].parts.push(l):t.push(n[i]={id:i,parts:[l]})}return t}function i(e,t){var n=g(),r=b[b.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),b.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function a(e){e.parentNode.removeChild(e);var t=b.indexOf(e);t>=0&&b.splice(t,1)}function s(e){var t=document.createElement("style");return t.type="text/css",i(e,t),t}function c(e){var t=document.createElement("link");return t.rel="stylesheet",i(e,t),t}function l(e,t){var n,r,o;if(t.singleton){var i=y++;n=v||(v=s(t)),r=u.bind(null,n,i,!1),o=u.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(t),r=d.bind(null,n),o=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(t),r=f.bind(null,n),o=function(){a(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}function u(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=w(t,o);else{var i=document.createTextNode(o),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function f(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function d(e,t){var n=t.css,r=t.sourceMap;r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var o=new Blob([n],{type:"text/css"}),i=e.href;e.href=URL.createObjectURL(o),i&&URL.revokeObjectURL(i)}var p={},h=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},m=h(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),g=h(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,y=0,b=[];e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=m()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom");var n=o(e);return r(n,t),function(e){for(var i=[],a=0;a<n.length;a++){var s=n[a],c=p[s.id];c.refs--,i.push(c)}if(e){var l=o(e);r(l,t)}for(var a=0;a<i.length;a++){var c=i[a];if(0===c.refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete p[c.id]}}}};var w=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()}]);