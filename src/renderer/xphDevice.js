import {
    sendFrameWithCrc
} from './communication';

import schedule from 'node-schedule';

class xphClass {
    port;
    sendBuf = [];
    // 轮灌区运行步骤
    carStep = 0;

    runDay = 1;
    runDayNum = 0;
    runState = '串口未初始化';
    runStep = 0;
    taskRunState = false;

    // 传感器数据
    sensorData = new Array(17);

    // 时间段定时器句柄
    taskHandle = '';
    jobOnHandle = [];
    jobOffHandle = [];
    ferTimeOutHandle = ['', '', '', '']; // 施肥浓度比句柄

    // 灌溉参数
    IrrManagementParam = {
        cycle: "31",
        time1: [new Date(), new Date()],
        time2: [new Date(), new Date()]
    };

    // 施肥参数
    ferModeRadio = 0;
    ferParam = [{
            name: "施肥阀1",
            jId: "0",
            param: {
                ferType: "氮肥",
                concentration: "1/30",
                time: "30",
                cycle: "2",
                value: "30"
            }
        },
        {
            name: "施肥阀2",
            jId: "1",
            param: {
                ferType: "氮肥",
                concentration: "1/30",
                time: "30",
                cycle: "2",
                value: "30"
            }
        },
        {
            name: "施肥阀3",
            jId: "2",
            param: {
                ferType: "氮肥",
                concentration: "1/30",
                time: "30",
                cycle: "2",
                value: "30"
            }
        },
        {
            name: "施肥阀4",
            jId: "3",
            param: {
                ferType: "氮肥",
                concentration: "1/30",
                time: "30",
                cycle: "2",
                value: "30"
            }
        }
    ];
    ferLiuliang = 0;

    // 灌溉片区参数
    carList = [{
        name: "盖伦"
    }, {
        name: "洛克萨斯"
    }];

    _emap = {};

    // 初始化
    init(port) {
        // 串口对象
        this.port = port;
        this.sendBuf = [];
        this.changeRunState('串口已初始化');
        // 开启一个定时任务
        clearInterval(this.taskHandle);
        this.taskHandle = setInterval(() => {
            if (this.runState == '串口未初始化') {
                return;
            }

            if (this.sendBuf.length == 0) { // 读取数据
                const send = Buffer.alloc(6);
                send[0] = 0x01;
                send[1] = 0x03;
                send[2] = 0x00;
                send[3] = 0x00;
                send[4] = 0;
                send[5] = 0;
                console.log(send);
                // sendFrameWithCrc(this.port, send, 0, send.length);
            } else { // 发送控制
                const data = this.sendBuf.shift();
                console.log(data);
                // sendFrameWithCrc(this.port, data, 0, data.length);
            }

        }, 5000)
    }


    reInit() {
        this.taskStop();
        clearInterval(this.taskHandle);
        this.changeRunState('串口未初始化');
    }

    // 添加订阅者
    on(eventName, f) {
        if (eventName == null || f == null) return -1;
        if (this._emap.hasOwnProperty(eventName) == false) {
            this._emap[eventName] = [];
        }
        this._emap[eventName].push(f);
        console.log(this._emap);
        return this._emap[eventName] - 1;
    }

    // 移除订阅者
    off(eventName, f) {
        if (eventName == null || f == null) return;

        for (let index = 0; index < this._emap[eventName].length; index++) {
            if (f == this._emap[eventName][index]) {
                console.log(f == this._emap[eventName][index]);
                this._emap[eventName].splice(index, 1);
            }
        }

        console.log(this._emap);
    }

    // 触发事件
    emit(eventName, arg) {
        const list = [];
        if (this._emap.hasOwnProperty(eventName) == false) {
            return;
        }
        // 深度复制
        for (const iterator of this._emap[eventName]) {
            list.push(iterator);
        }
        let len = list.length;
        if (list == undefined || list == null || len == 0) return;

        //反向遍历，防止在订阅者在回调中移除自身带来的下标错位
        for (var i = len - 1; i > -1; --i) {
            // console.log(list);
            // console.log(i);
            list[i](arg);
        }

    }

    changeRunState(state) {
        this.runState = state;
        this.emit("runState", state);
    }

    changeRunStep(step) {
        this.runStep = step;
        this.emit("runStep", step);
    }

    // 发送一帧数据
    sendFrame(data) {
        if (this.runState == '串口未初始化') {
            return;
        }
        // this.sendBuf.push(data);
        console.log(data);
    }

    // 有线阀控器
    relay(num, state) {
        const send = Buffer.alloc(9);
        send[0] = 0x01;
        send[1] = 0x10;
        send[2] = 0x00;
        send[3] = 0x7b;
        send[4] = num;
        send[5] = 0x01;
        send[6] = state;
        send[7] = 0;
        send[8] = 0;
        this.sendFrame(send);
    }

    // 无线阀控器
    wirelessRelay(num, state) {
        const send = Buffer.alloc(9);
        send[0] = 0x01;
        send[1] = 0x10;
        send[2] = 0x00;
        send[3] = 0x7c;
        send[4] = num;
        send[5] = 0x01;
        send[6] = state;
        send[7] = 0;
        send[8] = 0;
        this.sendFrame(send);
    }

    // 本机控制
    localRelay(num, state) {
        const send = Buffer.alloc(9);
        send[0] = 0x01;
        send[1] = 0x10;
        send[2] = 0x00;
        send[3] = 0x7a;
        send[4] = num;
        send[5] = 0x01;
        send[6] = state;
        send[7] = 0;
        send[8] = 0;
        this.sendFrame(send);
    }

    // 发送肥料比
    ferRatio() {
        const send = Buffer.alloc(24);
        send[0] = 0x01;
        send[1] = 0x10;
        send[2] = 0x00;
        send[3] = 0xa0;
        send[4] = 0x00;
        send[5] = 0x10;
        for (let index = 0; index < this.ferParam.length; index++) {
            const element = this.ferParam[index].param.concentration.split('/');

            send[6 + index * 4] = ((element[0] >> 8) & 0x00ff);
            send[7 + index * 4] = ((element[0]) & 0x00ff);

            send[8 + index * 4] = ((element[1] >> 8) & 0x00ff);
            send[9 + index * 4] = ((element[1]) & 0x00ff);
        }
        this.sendFrame(send);
    }

    // 接受回调函数
    receiveHandle(data) {
        const recvLen = data.length;
        if (recvLen <= 1) return;
        switch (data[1]) {
            case 0x03:
                console.log(data.toString('hex').toUpperCase());
                break;
            case 0x10:
                break;
            default:
                break;
        }
    }

    // 灌溉执行程序
    irrStartFun() {
        this.taskRunState = true;

        let index = this.runStep;
        // 开启片区所有阀门
        // console.log(this.carList[index].node);
        for (const node of this.carList[index].node) {
            switch (node.type) {
                case 0:
                    this.relay(node.addr, 1);
                    break;
                case 1:
                    this.wirelessRelay(node.addr, 1);
                    break;
                case 2:
                    this.localRelay(node.addr, 1);
                    break;
                default:
                    console.log('片区无类型');
                    break
            }
        }


        // 开启施肥
        switch (this.ferModeRadio) {
            case 1: // 肥料比
                this.ferRatio();
                for (let index = 0; index < this.ferTimeOutHandle.length; index++) {
                    clearTimeout(this.ferTimeOutHandle[index]);
                    this.ferTimeOutHandle[index] = setTimeout(() => {
                        this.localRelay(index, 0);
                    }, this.ferParam[index].param.time * 1000) // * 60 
                }
                break;
            case 2: // 施肥量
                for (let index = 0; index < this.ferParam.length; index++) {
                    this.ferParam[index].param.concentration = '1/1';
                    this.localRelay(index, 1);
                }
                this.ferRatio();
                break;
            default:
                // console.log('不加肥料');
                break;
        }
    }

    irrStopFun() {
        if (this.taskRunState == false) {
            return;
        }
        this.taskRunState = false;

        let index = this.runStep;
        // 关闭片区所有阀门
        // console.log(this.carList[index].node);
        for (const node of this.carList[index].node) {
            switch (node.type) {
                case 0:
                    this.relay(node.addr, 0);
                    break;
                case 1:
                    this.wirelessRelay(node.addr, 0);
                    break;
                case 2:
                    this.localRelay(node.addr, 0);
                    break;
                default:
                    console.log('片区无类型');
                    break
            }
        }

        // 计算运行参数
        // let nowDay = new Date().getDay();
        // if (this.runDay != nowDay) {
        //     this.runDay = nowDay;
        //     // 运行天数加1
        //     this.runDayNum++;
        // }
        this.runDayNum++;

        // 运行下一个片区
        this.carStep++;
        this.runStep = this.carStep;
        while (this.runStep >= this.carList.length) {
            this.runStep = this.runStep - this.carList.length;
        }
        this.changeRunStep(this.runStep);


        console.log('运行次数：' + this.carStep);
        console.log('xxx运行天数:' + this.runDayNum);
        // 运行完毕
        if (this.carStep >= this.carList.length) {
            if (this.runDayNum >= this.IrrManagementParam.cycle) {
                this.taskStop();
            }
        }
    }

    // 每日执行定时器
    timeoutFunc(config) {

        // 1.去掉错误时间段
        if (config.time == null) {
            console.log('job-时间为空');
            return;
        }

        if (config.time[0] == config.time[1]) {
            console.log('job-时间相同');
            return;
        }

        let time1 = new Date(config.time[0]);
        let time2 = new Date(config.time[1]);
        console.log(`${time1.getSeconds()} ${time1.getMinutes()} ${time1.getHours()} * * *`);
        console.log(`${time2.getSeconds()} ${time2.getMinutes()} ${time2.getHours()} * * *`);

        const j1 = schedule.scheduleJob(`${time1.getSeconds()} * * * * *`, () => {
            // console.log('定时器触发次数开 ' + new Date());
            // 执行一次开启任务
            this.irrStartFun();
        });

        this.jobOnHandle.push(j1);
        console.log(this.jobOnHandle);

        const j2 = schedule.scheduleJob(`${time2.getSeconds()} * * * * *`, () => {
            // console.log('定时器触发次数关 ' + new Date());
            this.irrStopFun();
        });
        this.jobOffHandle.push(j2);
        console.log(this.jobOffHandle);

    }

    // 开始运行主逻辑
    taskStart(runParam) {

        console.log(runParam);

        if (this.runState == '串口未初始化') {
            console.log('串口未初始化');
            return '串口未初始化';
        }

        // 0.参数归一
        this.runDay = new Date().getDay() - 1;
        this.carStep = 0;
        this.runStep = 0;
        this.runDayNum = 0;
        this.taskRunState = false;
        this.runState = "自动运行";


        // 1.解析出片区参数
        this.carList = runParam.carList;

        // 2.解析出施肥参数
        this.ferParam = runParam.ferParam;
        this.ferModeRadio = runParam.ferModeRadio;

        // 3. 解析出灌溉参数
        this.IrrManagementParam = runParam.IrrManagementParam;

        // 3.1将第一个时间段添加到任务当中
        const timeConfig = {
            index: 0,
            time: this.IrrManagementParam.time1
        };
        this.timeoutFunc(timeConfig);

        // 3.2将第二个时间段添加到任务当中
        timeConfig.index = 1;
        timeConfig.time = this.IrrManagementParam.time2;
        this.timeoutFunc(timeConfig);
    }

    // 停止运行逻辑运行
    taskStop() {

        while (1) {
            if (this.jobOnHandle.length == 0) {
                break;
            }
            this.jobOnHandle.splice(0, 1)[0].cancel();
        }
        console.log(this.jobOnHandle);
        while (1) {
            if (this.jobOffHandle.length == 0) {
                break;
            }
            this.jobOffHandle.splice(0, 1)[0].cancel();
        }
        console.log(this.jobOffHandle);

        for (let index = 0; index < this.ferTimeOutHandle.length; index++) {
            clearTimeout(this.ferTimeOutHandle[index]);
        }


        this.changeRunStep(0);

        if (this.runState == '自动运行') {
            this.changeRunState('串口已初始化');
        }
        console.log('runStop');
    }

    print() {
        console.log(this.port);
    }
}

const xph = new xphClass();

export {
    xph
};