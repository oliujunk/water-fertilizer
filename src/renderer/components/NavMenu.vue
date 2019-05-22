<template>
  <div class="navMenu">
    <el-menu
      :default-active="$route.path"
      mode="horizontal"
      background-color="#409EFF"
      active-text-color="#FFD04B"
      text-color="#FFF"
    >
      <el-menu-item index="/home" @click="$router.push('home')">
        <span slot="title"><i class="el-icon-s-home"></i>监测首页</span>
      </el-menu-item>
      <el-menu-item index="/autoControl" @click="$router.push('autoControl')">
        <span slot="title"><i class="el-icon-menu"></i>自动控制</span>
      </el-menu-item>
      <el-menu-item index="/setting" @click="$router.push('setting')">
        <span slot="title"><i class="el-icon-s-tools"></i>系统设置</span>
      </el-menu-item>
      <div class="logout">
        <el-dropdown>
          <el-button
            type="danger"
            plain
            round
            icon="el-icon-user-solid"
          >{{ user }}</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button
                type="text"
                @click="handleLogout"
              >登 出</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'navMenu',

  data() {
    return {
      user: sessionStorage.getItem('user'),
    };
  },

  methods: {
    handleLogout() {
      sessionStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.logout {
  line-height: 60px;
  float: right;
  padding-right: 30px;
}
</style>
