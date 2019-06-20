import {
    sendFrameWithCrc
} from './communication'


class xphClass {
    port;
    sendBuf = [];
    // 轮灌区运行步骤
    carStep = 0;
    runDay = 1;
    runDayNum = 0;
    runState = '串口未初始化';

    // 时间段定时器句柄
    taskHandle = '';
    timeOutOnHandle = ['', ''];
    timeOutOffHandle = ['', ''];
    intervalOnHandle = ['', ''];
    intervalOffHandle = ['', ''];
    ferTimeOutHandle = ['', '', '', '']; // 施肥浓度比句柄

    // 灌溉参数
    IrrManagementParam = {
        cycle: "31",
        time1: [new Date(), new Date()],
        time2: [new Date(), new Date()]
    };

    // 施肥参数
    ferModeRadio = 0;
    ferParam = {
        ferType: "氮肥",
        concentration: "1/30",
        time: "30",
        cycle: "2",
        value: "30"
    };
    ferLiuliang = 0;

    // 灌溉片区参数
    carList = [{
        name: "盖伦"
    }, {
        name: "洛克萨斯"
    }];

    // 初始化
    init() {
        // 串口对象
        this.port = '1234';
        this.sendBuf = [];
        this.runState = '串口已初始化';
        // 开启一个定时任务
        clearInterval(this.taskHandle);
        this.taskHandle = setInterval(() => {
            if (this.runState = '串口未初始化') {
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
                // sendFrameWithCrc(this.port, data, 0, data.length);
            } else { // 发送控制
                const data = this.sendBuf.shift();
                console.log(data);
                // sendFrameWithCrc(this.port, data, 0, data.length);
            }

        }, 500)
    }


    reInit() {
        clearInterval(this.taskHandle);
        this.runState = '串口未初始化';
    }

    // 发送一帧数据
    sendFrame(data) {
        if (this.runState = '串口未初始化') {
            return;
        }

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
            const element = this.ferParam[index].concentration.split('/');

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
        let index = this.carStep < this.carList.length ? this.carStep : this.carStep - this.carList.length;
        // 开启阀门
        switch (this.carList[index].type) {
            case 0:
                relay(this.carList[index].addr, 1);
                break;
            case 1:
                wirelessRelay(this.carList[index].addr, 1);
                break;
            case 2:
                localRelay(this.carList[index].addr, 1);
                break;
            default:
                console.log('片区无类型');
                break
        }

        // 开启施肥
        switch (this.ferModeRadio) {
            case 1: // 肥料比
                this.ferRatio();
                for (let index = 0; index < this.ferTimeOutHandle.length; index++) {
                    clearTimeout(this.ferTimeOutHandle[index]);
                    this.ferTimeOutHandle[index] = setTimeout(() => {
                        this.localRelay(index, 0);
                    }, this.ferParam[index].time * 60 * 1000)
                }
                break;
            case 2: // 施肥量
                // this.ferLiuliang = xxx
                for (let index = 0; index < array.length; index++) {
                    this.localRelay(index, 1);
                }
                break;
            default:
                break;
        }
    }

    irrStopFun() {
        let index = this.carStep < this.carList.length ? this.carStep : this.carStep - this.carList.length;
        // 开启
        switch (this.carList[index].type) {
            case 0:
                relay(this.carList[index].addr, 0);
                break;
            case 1:
                wirelessRelay(this.carList[index].addr, 0);
                break;
            case 2:
                localRelay(this.carList[index].addr, 0);
                break;
            default:
                console.log('片区无类型');
                break
        }

        // 计算运行参数
        let nowDay = new Date().getDay();
        if (this.runDay != nowDay) {
            this.runDay = nowDay;
            this.runDayNum++;
        }
        this.carStep++;

        // 运行完毕
        if (this.carStep >= this.carList.length) {
            if (this.runDayNum >= this.IrrManagementParam.cycle) {
                this.taskStop();
            }
        }
    }

    // 每日执行定时器
    timeoutFunc(config) {
        // 1.清空上一次时间段运行
        clearTimeout(this.timeOutOnHandle[config.index]);
        clearTimeout(this.timeOutOffHandle[config.index]);
        clearInterval(this.intervalOnHandle[config.index]);
        clearInterval(this.intervalOffHandle[config.index]);

        // 2.计算出定时时间间隔
        let nowTime = new Date();
        nowTime = nowTime.getMonth() * 60 * 60 + nowTime.getMinutes() * 60 + nowTime.getSeconds();
        let timeOutSatrt = config.time[0].getMonth() * 60 * 60 + config.time[0].getMinutes() * 60 + config.time[0].getSeconds();
        let timeOutEnd = config.time[1].getMonth() * 60 * 60 + config.time[1].getMinutes() * 60 + config.time[1].getSeconds();

        console.log(nowTime);
        console.log(timeOutSatrt);
        console.log(timeOutEnd);

        if (timeOutSatrt >= nowTime) {
            timeOutSatrt = timeOutSatrt - nowTime;
            timeOutEnd = timeOutEnd - nowTime;
        } else {
            timeOutSatrt = 24 * 3600 + timeOutSatrt - nowTime;
            timeOutEnd = 24 * 3600 + timeOutEnd - nowTime;
        }

        console.log(timeOutSatrt);
        console.log(timeOutEnd);

        this.timeOutOnHandle[config.index] = setTimeout(() => {
            // 执行一次开启任务
            this.irrStartFun();
            // 开启后面每日执行
            this.intervalOnHandle[config.index] = setInterval(this.irrStartFun, 24 * 3600 * 1000);

        }, timeOutSatrt * 1000);
        this.timeOutOffHandle[config.index] = setTimeout(() => {
            // 执行一次关闭任务
            this.irrStopFun();
            this.intervalOffHandle[config.index] = setInterval(this.irrStopFun, 24 * 3600 * 1000);
        }, timeOutEnd * 1000);
    }

    // 开始运行主逻辑
    taskStart(runParam) {
        if (this.runState = '串口未初始化') {
            console.log('串口未初始化');
            return;
        }

        // 0.参数归一
        this.runDay = new Date().getDay() - 1;
        this.carStep = 0;
        this.runDayNum = 0;
        this.runState = '自动运行';

        // 1.解析出片区参数
        this.carList = runParam.carList;

        // 2.解析出施肥参数
        this.ferParam = runParam.ferSelectParam;
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
        this.runState = '串口已初始化';

        // 关闭所有定时器
        for (const item of this.timeOutOnHandle) {
            clearTimeout(item);
        }
        for (const item of this.intervalOnHandle) {
            clearInterval(item);
        }
        for (const item of this.timeOutOffHandle) {
            clearTimeout(item);
        }
        for (const item of this.intervalOffHandle) {
            clearInterval(item);
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