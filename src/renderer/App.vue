<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { xph } from "./xphDevice";

const { ipcRenderer } = require("electron");

export default {
  name: "water-fertilizer",
  mounted() {
    ipcRenderer.on("serialPort", (event, arg) => {
      console.log(2222);
      console.log(arg);
      xph.init(arg);
    });

    ipcRenderer.send("getSerialPort");
    ipcRenderer.on("getSerialPort", (event, arg) => {
      console.log(1111);
      console.log(arg);
      xph.init(arg);
    });
  },
  beforeDestroy() {}
};
</script>

<style>
</style>
