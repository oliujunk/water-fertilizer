<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "water-fertilizer",
  mounted() {
    console.log("111");
  },
  beforeDestroy() {
    console.log("222");
  }
};
</script>

<style>
</style>
