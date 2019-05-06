<<template>
  <div>
    <el-select
      v-model="currentPort"
      size="small"
    >
      <el-option
        v-for="item in portList"
        :key="item.comName"
        :value="item.comName"
        :label="item.comName"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
const serialport = require('serialport');

export default {
  name: 'setting',

  data() {
    return {
      portList: [],
      currentPort: '',
    };
  },

  mounted() {
    serialport.list((err, ports) => {
      this.portList = [...ports];
      this.currentPort = ports[0].comName;
    });
  },
};
</script>

<style>
</style>
