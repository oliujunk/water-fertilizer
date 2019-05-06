<template>
  <div class="navMenu">
    <el-menu :default-active="$route.path" mode="horizontal">
      <el-menu-item index="/home" @click="$router.push('home')">
        <span slot="title"><i class="el-icon-s-home"></i>监测首页</span>
      </el-menu-item>
      <el-menu-item index="/autoControl" @click="$router.push('autoControl')">
        <span slot="title"><i class="el-icon-menu"></i>自动控制</span>
      </el-menu-item>
      <el-menu-item index="/manualControl" @click="$router.push('manualControl')">
        <span slot="title"><i class="el-icon-s-operation"></i>手动控制</span>
      </el-menu-item>
      <el-menu-item index="/setting" @click="$router.push('setting')">
        <span slot="title"><i class="el-icon-s-tools"></i>系统设置</span>
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'navMenu',
};
</script>

<style>

</style>
