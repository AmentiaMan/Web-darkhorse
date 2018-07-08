/*
 *  问题： 单一属性，如果要做别的属性的动画，就要封装其他的函数
 * */
function animate_v1(element, target) {
    // 为了保证只有一个定时器，每次开启新的动画定时器之前，先把上一次动画的定时器清除
    clearInterval(element.timer);
    // 开启新的定时器，都保存到element.timer这个属性里面，方便下次动画获取用来停止上一次的动画
    element.timer = setInterval(function () {
        // 获取当前位置
        var current = element.offsetLeft;
        // 计算下一步该到哪里
        // 总是移动剩下距离的1/10
        var step = (target - current) / 10;
        // 判断方向取整
        step = current < target ? Math.ceil(step) : Math.floor(step);
        //            step = step >= 0 ? Math.ceil(step) : Math.floor(step);
        // 下一步要到达的位置
        current += step;
        // 设置回元素对象身上
        element.style.left = current + "px";
        // 判断条件停止动画
        if (current == target) {
            clearInterval(element.timer);
        }
    }, 20);
}


/*
 *  如果能做到，想修改什么属性都可以改，就很舒服
 *       发现：  属性也是可以改变的了
 *                       ↓
 *               把属性也变成参数
 *
 *
 *   升级思路：之前是写死的修改left属性，所以如果要修改别的属性，把要修改的属性也作为参数传递金函数与里面
 *
 *
 * */
function animate_v2(element, target, attr) {
    // 为了保证只有一个定时器，每次开启新的动画定时器之前，先把上一次动画的定时器清除
    clearInterval(element.timer);
    // 开启新的定时器，都保存到element.timer这个属性里面，方便下次动画获取用来停止上一次的动画
    element.timer = setInterval(function () {
        // 获取当前位置
        // 有一个方式可以获取任意样式的当前值：  getComputedStyle
        //            var current = element.offsetLeft;  // 这是获取当前位置
        //                              ↓
        var current = parseInt(window.getComputedStyle(element)[attr]);// 可以根据想要修改的属性动态获取该属性的当前值  - 记得转换为数字

        // 计算下一步该到哪里
        // 总是移动剩下距离的1/10
        var step = (target - current) / 10;
        // 判断方向取整
        step = current < target ? Math.ceil(step) : Math.floor(step);
        //            step = step >= 0 ? Math.ceil(step) : Math.floor(step);
        // 下一步要到达的位置
        current += step;
        // 设置回元素对象身上
        element.style[attr] = current + "px";
        // 判断条件停止动画
        if (current == target) {
            clearInterval(element.timer);
        }
    }, 20);

}

/*
 *  相比于上一个版本，可以可以同时修改多个属性
 *
 *   问题： 只要有一个属性到达了目标值，就停止了动画，导致其他的属性没有到达目标值就停下来了
 *
 *   升级思路：
 *      之前是把单个属性作为参数传递到函数内部，现在要同时修改多个属性
 *      之前的单个属性的修改过程放到循环里面
 *      每个属性都对应一个目标值 --》 以对象的形式传递要修改的属性和要达到的目标值
 *      遍历对象得到每个属性和每个属性对应的目标值，分别执行修改单个属性的逻辑
 *
 * */
function animate_v3(element, obj) {
    clearInterval(element.timer);
    // 以动画的形式，同时修改div的大小和位置
    element.timer = setInterval(function () {

        for (var attr in obj) {
            ///  ------------------  ↓↓↓↓ 这部分代码就是每次修改单个属性都要执行的代码 ↓↓↓↓↓
            var current = parseInt(window.getComputedStyle(element)[attr]);
            var target = obj[attr];// 获取每个属性对应的目标值
            // 计算出下一步是多少
            var step = (target - current) / 10;
            step = current < target ? Math.ceil(step) : Math.floor(step);
            current += step;
            // 设置回对象身上
            element.style[attr] = current + "px";

            if (current == target) {
                clearInterval(element.timer);
            }
            //--- ↑↑↑↑↑↑↑↑↑↑↑这部分代码就是每次修改单个属性都要执行的代码↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
        }

    }, 20);
}


/*
 *  让所有的属性都能到达目标值、
 *
 *       多个属性都到达目标值才停下--- 反证法
 *
 *       升级思路：
 *          要多个条件(所有的属性都到达目标值)同时成立，直接使用反证法解决
 *          要点：  熟练使用反证法
 *
 * */
function animate_v4(element, obj) {
    // 保证定时器唯一，先把上一次的清除
    clearInterval(element.timer);
    // 重新开启定时器做动画
    element.timer = setInterval(function () {
        // 反证法：在循环外面假设所有的属性都已经到达了目标值
        var flag = true;
        for (var attr in obj) {
            ///  ------------------  ↓↓↓↓ 这部分代码就是每次修改单个属性都要执行的代码 ↓↓↓↓↓
            // 动画步骤：获取任意属性的当前值，记得转换为数字
            var current = parseInt(window.getComputedStyle(element)[attr]);
            var target = obj[attr];// 获取每个属性对应的目标值
            // 动画步骤：计算出下一步是多少
            var step = (target - current) / 10;
            step = current < target ? Math.ceil(step) : Math.floor(step);
            current += step;
            // 动画步骤：设置回对象身上
            element.style[attr] = current + "px";
            // 反证法：尝试推翻结论，找出任意一个没有到达目标值的属性
            if (current != target) {
                flag = false;
                // 反证法： 因为在循环里面，还有别的逻辑要继续执行，所以不要停止循环
            }
            //--- ↑↑↑↑↑↑↑↑↑↑↑这部分代码就是每次修改单个属性都要执行的代码↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
        }
        // 反证法：在循环结束之后，再次判断假设是否成立
        if (flag) {
            // 动画步骤：停止动画
            clearInterval(element.timer);
        }

    }, 20);
}

/*
*  相比上个版本 ：  可以修改透明度
*
*       升级思路：
*           修改透明度和其他属性不一样，所以单独处理
*           透明度是浮点数
*           透明度没有单位
*           透明度无法使用等号判断，所以处理浮点数比较的方式是放大取整再比较
* */
function animate_v5(element, obj) {
    clearInterval(element.timer);
    element.timer = setInterval(function () {
        var flag = true;
        for (var attr in obj) {
            var target = obj[attr];
            // 希望在这里面也可以对透明度进行修改，但是发现系统透明度的逻辑，和其他的相差比较大
            // 所以如果要修改透明度，特殊情况，特殊处理、
            // 判断如果是修改透明度
            if (attr == "opacity") {
                // 获取当前透明度
                var current = parseFloat(window.getComputedStyle(element)[attr]);
                // 计算出下一步到哪里
                var step = (target - current) / 10;
                current += step;
                // 设置会元素身上
                element.style[attr] = current;
                // 放大取整
                current *= 100;
                target *= 100;
                current = Math.floor(current);
                target = Math.floor(target);
                // 停下
                if (current == target) {
                    //clearInterval(element.timer); 因为停止动画是应该所有的属性都到达目标值后天下的，所有停止定时器的动作交给反证法解决
                    element.style[attr] = target / 100;
                }
            } else {
                // 这里是处理以px为单位的动画的逻辑
                var current = parseInt(window.getComputedStyle(element)[attr]);
                var step = (target - current) / 10;
                step = current < target ? Math.ceil(step) : Math.floor(step);
                current += step;
                element.style[attr] = current + "px";
            }
            if (current != target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(element.timer);
        }

    }, 20);
}

/*
* 还可以修改层级
*
*   升级思路：
*       特殊处理修改层级的逻辑
* */
function animate_v6(element, obj) {
    clearInterval(element.timer);
    element.timer = setInterval(function () {
        var flag = true;
        for (var attr in obj) {
            var target = obj[attr];
            // 希望在这里面也可以对透明度进行修改，但是发现系统透明度的逻辑，和其他的相差比较大
            // 所以如果要修改透明度，特殊情况，特殊处理、
            // 判断如果是修改透明度
            if (attr == "opacity") {
                // 获取当前透明度
                var current = parseFloat(window.getComputedStyle(element)[attr]);
                // 计算出下一步到哪里
                var step = (target - current) / 10;
                current += step;
                // 设置会元素身上
                element.style[attr] = current;
                // 放大取整
                current *= 100;
                target *= 100;
                current = Math.floor(current);
                target = Math.floor(target);
                // 停下
                if (current == target) {
                    //clearInterval(element.timer); 因为停止动画是应该所有的属性都到达目标值后天下的，所有停止定时器的动作交给反证法解决
                    element.style[attr] = target / 100;
                }
            } else if (attr == "zIndex") {// 特殊处理层级，因为层级的动画用户看不见，没有必要做
                // 我们要做的事情就是把层级直接从当前值，变成目标值即可
                var current = target;// 声明current变量的意义在于，可以是判断外面的 停下的条件可以进行判断
                element.style.zIndex = target;
            } else {
                // 这里是处理以px为单位的动画的逻辑
                var current = parseInt(window.getComputedStyle(element)[attr]);
                var step = (target - current) / 10;
                step = current < target ? Math.ceil(step) : Math.floor(step);
                current += step;
                element.style[attr] = current + "px";
            }
            if (current != target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(element.timer);
        }

    }, 20);
}

/*
*  为动画函数添加回调函数，回调函数在该动画执行完毕之后执行
* */
function animate_v7(element, obj, callback) {
    clearInterval(element.timer);
    element.timer = setInterval(function () {
        var flag = true;
        for (var attr in obj) {
            var target = obj[attr];
            // 希望在这里面也可以对透明度进行修改，但是发现系统透明度的逻辑，和其他的相差比较大
            // 所以如果要修改透明度，特殊情况，特殊处理、
            // 判断如果是修改透明度
            if (attr == "opacity") {
                // 获取当前透明度
                var current = parseFloat(window.getComputedStyle(element)[attr]);
                // 计算出下一步到哪里
                var step = (target - current) / 10;
                current += step;
                // 设置会元素身上
                element.style[attr] = current;
                // 放大取整
                current *= 100;
                target *= 100;
                current = Math.floor(current);
                target = Math.floor(target);
                // 停下
                if (current == target) {
                    //clearInterval(element.timer); 因为停止动画是应该所有的属性都到达目标值后天下的，所有停止定时器的动作交给反证法解决
                    element.style[attr] = target / 100;
                }
            } else if (attr == "zIndex") {// 特殊处理层级，因为层级的动画用户看不见，没有必要做
                // 我们要做的事情就是把层级直接从当前值，变成目标值即可
                var current = target;// 声明current变量的意义在于，可以是判断外面的 停下的条件可以进行判断
                element.style.zIndex = target;
            } else {
                // 这里是处理以px为单位的动画的逻辑
                var current = parseInt(window.getComputedStyle(element)[attr]);
                var step = (target - current) / 10;
                step = current < target ? Math.ceil(step) : Math.floor(step);
                current += step;
                element.style[attr] = current + "px";
            }
            if (current != target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(element.timer);
            /*
            *  这里就是动画执行完毕的地方
            *       如果希望动画执行完毕之后，还要做某些事情，就在这里做
            *
            *           将未知的操作，以函数的形式把代码包裹进来，调用函数即可
            *
            *           在特定时机执行的函数  ：  回调函数
            * */

            // 注意判断一下，该回调函数，有可能有，也可能没有，所以调用前先判断
            //typeof callback == "function" ? callback() : "";

            callback && callback();
        }

    }, 20);
}