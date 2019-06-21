<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { xph } from "./xphDevice";
import { receiveDataProcess, sendFrameWithCrc } from "./communication";

const schedule = require("node-schedule");
const SerialPort = require("serialport");
const InterByteTimeout = require("@serialport/parser-inter-byte-timeout");

// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require("electron");

export default {
  name: "water-fertilizer",
  data() {
    return {
      portProperty: null,
      serialPort: null,
      schedule: {}
    };
  },
  mounted() {
    // 接收打开串口的消息
    ipcRenderer.on("pushSerialPort", (event, arg) => {
      this.portProperty = arg;
    });
    // 接收关闭串口的消息
    ipcRenderer.on("popSerialPort", (event, arg) => {
      this.portProperty = null;
    });
  },
  watch: {
    portProperty() {
      if (this.portProperty) {
        const serialPort = new SerialPort(this.portProperty.name, {
          baudRate: this.portProperty.baudRate,
          dataBits: this.portProperty.dataBits,
          parity: this.portProperty.parity,
          stopBits: this.portProperty.stopBits,
          autoOpen: this.portProperty.autoOpen
        });
        serialPort.open(err => {
          if (err) {
            this.$message.error(
              `打开串口${this.portProperty.name}失败！请检查该串口是否被占用。`
            );
          } else {
            const parser = serialPort.pipe(
              new InterByteTimeout({ interval: 50 })
            );
            parser.on("data", xph.receiveHandle);
            // parser.on("data", receiveDataProcess);
            // const job1 = schedule.scheduleJob("*/5 * * * * *", () => {
            //   console.log(new Date());
            //   const send = Buffer.alloc(6);
            //   send[0] = 0x01;
            //   send[1] = 0x03;
            //   send[2] = 0x00;
            //   send[3] = 0x00;
            //   send[4] = 0xf1;
            //   send[5] = 0xd8;
            //   console.log(job1);
            //   sendFrameWithCrc(serialPort, send, 0, 6);
            // });
            // this.schedule = { ...this.schedule, job1 };
            // this.schedules = { ...this.schedules, job1 };
            this.portButtonText = "关闭";
            this.portButtonType = "success";
            this.portButtonStatus = true;
            this.serialPort = serialPort;
            xph.init(this.serialPort);
          }
        });
      } else {
        this.serialPort.close();
        xph.reInit();
        // this.schedule.job1.cancel();
      }
    }
  },
  beforeDestroy() {}
};
</script>

<style>
</style>
