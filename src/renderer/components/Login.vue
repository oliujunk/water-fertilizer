<template>
  <el-container style="height: 100%;" direction="vertical">
    <el-header>
      <div>
        <h1>水肥控制系统</h1>
        <el-button
          type="primary"
          icon="el-icon-user-solid"
          @click="loginFormVisible = true"
        >登录</el-button>
      </div>
    </el-header>
    <el-main :style="mainHeight">
      <!-- <el-carousel height="600px" :interval="5000">
        <el-carousel-item v-for="index in 1" :key="index">
          <img :src="require(`D:/js/water-fertilizer/static/${index}.jpg`)">
        </el-carousel-item>
      </el-carousel> -->
      <div>
        <img :src="require('../../../static/1.jpg')">
      </div>
    </el-main>
    <el-dialog
      title="系统登录"
      :visible.sync="loginFormVisible"
      center
      style="margin-top: 100px;"
      width="400px"
    >
      <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-key"
            v-model="loginForm.password"
            placeholder="密码" type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleLogin" :loading="isLogining">登 录</el-button>
      </span>
    </el-dialog>
    <el-footer>Copyright© 2019 大禹节水集团股份有限公司</el-footer>
  </el-container>
</template>

<script>
import md5 from 'js-md5';
import Cookies from 'js-cookie';

export default {
  name: 'login',

  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      }
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      callback();
    };

    return {
      mainHeight: { height: `${window.innerHeight - 136}px` },
      isLogining: false,
      loginFormVisible: false,
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
      },
    };
  },

  methods: {
    handleCancel() {
      this.isLogining = false;
      this.loginFormVisible = false;
    },
    handleLogin() {
      this.isLogining = true;
      this.$db.user.findOne({ username: this.loginForm.username }, (err, docs) => {
        if (err) {
          console.log(err);
        } else if (docs) {
          const md5Password = md5(this.loginForm.password);
          if (md5Password === docs.password) {
            Cookies.set('token', '12345678');
            sessionStorage.setItem('user', this.loginForm.username);
            this.$store.commit('username', { username: this.loginForm.username });
            this.$router.push('/');
          } else {
            this.isLogining = false;
            this.$message.error('用户名或密码错误！');
          }
        }
      });
    },
  },

  mounted() {
    this.$db.user.loadDatabase();
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  color: #333;
  text-align: left;
  line-height: 60px;
  div h1 {
    color: rgb(0, 76, 138);
    display: inline-block;
    vertical-align: middle;
    font-size: 2em;
    font-weight: bold;
    margin: 0 0 0 12px;
    font-family: 'Myriad Pro', 'Helvetica', Arial, Helvetica, sans-serif;
  }
  .el-button {
    float: right;
    margin: 10px 50px;
  }
}

.el-footer {
  line-height: 60px;
  font-size: 1em;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  padding: 0;
  div {
    width: 100%;
    height: 100%;
    img {
      width: 995px;
      height: 595px;
      max-width: 100%;
      max-height: 99%;
    }
  }
}
</style>
