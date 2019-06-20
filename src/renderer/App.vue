<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { xph } from "./xphDevice";

export default {
  name: "water-fertilizer",
  mounted() {
    xph.init();
    xph.print();
  },
  beforeDestroy() {}
};
</script>

<style>
</style>
