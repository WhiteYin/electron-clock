// 页面需要执行的js代码
const ipc = require('electron').ipcRenderer

let timer = null;
let countDownTimer = null;
let count = 0;
const FIVE_MINUTES = 5 * 60 * 1000;
const TWENTY_FIVE_MINUTES = 5 * FIVE_MINUTES;

const stopBtn = document.querySelector('#stop-btn');
const startBtn = document.querySelector('#start-btn');
const restBtn = document.querySelector('#rest-btn');
const minText = document.querySelector('#min-text');
const secText = document.querySelector('#sec-text');
const status = document.querySelector('#status');
// 给按钮绑定事件
stopBtn.onclick = stop;
startBtn.onclick = forceSet25Timer;
restBtn.onclick = forceSet5Timer;
set25Timer();
// 开启一个25分钟的定时器
function set25Timer() {
    // 页面开始计时
    writeCountDown(TWENTY_FIVE_MINUTES);
    status.textContent = '工作中';
    // 25分钟后设置5分钟定时器
    timer = setTimeout(function () {
        // 清除原有定时器
        clearTimeout(timer);
        // 通知
        ipc.send('open-rest-dialog');

    }, TWENTY_FIVE_MINUTES);
}
// 开启一个5分钟的定时器
function set5Timer() {
    // 页面开始计时
    writeCountDown(FIVE_MINUTES);
    status.textContent = '休息中';
    // 5分钟后设置25分钟定时器
    timer = setTimeout(function () {
        // 清除原有定时器
        clearTimeout(timer);
        // 通知
        ipc.send('open-work-dialog');
    }, FIVE_MINUTES);
}
// 强行置为休息定时器
function forceSet5Timer() {
    new Notification('开始休息');
    // 清除原有定时器
    clearTimeout(timer);
    // 开启5分钟休息定时器
    set5Timer();
}
// 强行置为工作定时器
function forceSet25Timer() {
    new Notification('开始工作');
    // 清除原有定时器
    clearTimeout(timer);
    // 开启25分钟工作定时器
    set25Timer();
}
// 停止
function stop() {
    new Notification('停止');
    // 清除原有定时器
    clearTimeout(timer);
    clearTimeout(countDownTimer);
}
// 页面中显示计时
function writeCountDown(totalTime) {
    count = 0;
    clearTimeout(countDownTimer);

    // 每秒倒计时
    countDownTimer = setTimeout(function countDown() {
        count++;
        // 分钟数
        let mins = parseInt(count / 60, 10);
        // 秒数
        let secs = count % 60;

        minText.textContent = mins;
        secText.textContent = secs;

        // 如果时间到了，则清除定时器
        // 把秒转为毫秒
        if (count * 1000 === totalTime) {
            clearTimeout(countDownTimer);
        }
        // 否则继续
        else {
            countDownTimer = setTimeout(countDown, 1000);
        }
    }, 1000);
}
// 当开始休息的通知框被点击后
ipc.on('rest-dialog-selection', function (event, index) {
    // 选择了‘是’
    if (index === 0) {
        // 开始休息计时
        set5Timer();
    }
});
// 当开始工作的通知框被点击后
ipc.on('work-dialog-selection', function (event, index) {
    // 选择了‘是’
    if (index === 0) {
        // 开始休息计时
        set25Timer();
    }
});