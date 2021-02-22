import Vue from 'vue';
/*

*  自定义指令 - 输入框限制 只能输入数字（可限制最大、最小、小数点后保留的位数）

*  使用方法

*  将以下代码复制到一个js文件中，然后在入口文件main.js中import引入即可；

*  给el-input加上v-onlynumber即可。

*  指令参数 max 限制最大输入（可选）  min  限制最小输入（可选）  precision  保留小数点位数（可选，默认为0位）

*  例：

*  无参数 <el-input v-onlynumber>

*  有参数 <el-input v-onlynumber="{max: 100, min: 0, precision: 2}">

*  Author：Wang Qiang

*/


const onlynumber = Vue.directive('onlynumber', {

  inserted(el, vDir, vNode) {
    // vDir.value 有指令的参数
    let content;
    //按键按下=>只允许输入 数字/小数点
    el.addEventListener("input", event => {
      let e = event || window.event;
      // let inputKey = String.fromCharCode(typeof e.charCode === 'number' ? e.charCode : e.keyCode);
      let re = /[^\d{1,}\.\d{1,}|\d{1,}]/g;
      content = e.target.value;
      e.target.value = e.target.value.replace(re, "")
    });
    //按键弹起=>并限制最大最小
    el.addEventListener("keyup",event => {
      let e = event || window.event;
      if (e.target.value) {
        content = parseFloat(e.target.value);
        if (!content) {
          content = 0.00;
        }
        let arg_max = "";
        let arg_min = "";
        if (vDir.value) {
          arg_max = parseFloat(vDir.value.max);
          arg_min = parseFloat(vDir.value.min);
        }
        if(arg_max && content > arg_max){
          e.target.value = arg_max;
          content = arg_max;
        }
        if(arg_min && content < arg_min){
          e.target.value = arg_min;
          content = arg_min;
        }
      }
    });
    //失去焦点=>保留指定位小数
    el.addEventListener("focusout", event=>{ // 此处会在 el-input 的 @change 后执行
      let e = event || window.event;
      if (e.target.value) {
        content = parseFloat(e.target.value);
        if (!content) {
          content = 0.00;
        }
        let arg_precision = 0; //默认保留至整数
        if (vDir.value.precision) {
          arg_precision = parseFloat(vDir.value.precision);
        }
        e.target.value = content.toFixed(arg_precision);
      }
      // -- callback写法1
      // vNode.data.model.callback = ()=>{
      //     e.target.value = content.toFixed(arg_precision)
      // }
      // vNode.data.model.callback();
      // -- callback 写法2
      // vNode.data.model.callback(
      //     e.target.value = content.toFixed(arg_precision)
      // )
    })
  }
})
export default onlynumber;
