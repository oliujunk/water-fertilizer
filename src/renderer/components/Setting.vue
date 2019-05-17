<<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-card class="communication-setting">
          <div slot="header">
            <span>串口设置</span>
          </div>
          <el-col :span="8">
            <el-row type="flex" justify="start" align="middle">串口号</el-row>
            <el-row type="flex" justify="start" align="middle">波特率</el-row>
            <el-row type="flex" justify="start" align="middle">数据位</el-row>
            <el-row type="flex" justify="start" align="middle">校验位</el-row>
            <el-row type="flex" justify="start" align="middle">停止位</el-row>
          </el-col>
          <el-col :span="16">
            <el-row type="flex" justify="start" align="middle">
              <el-select v-model="portName" size="small">
                <el-option
                  v-for="item in portList"
                  :key="item.comName"
                  :value="item.comName"
                  :label="item.comName"
                ></el-option>
              </el-select>
            </el-row>
            <el-row type="flex" justify="start" align="middle">
              <el-select v-model="baudRate" size="small">
                <el-option
                  v-for="item in [110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200]"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-row>
            <el-row type="flex" justify="start" align="middle">
              <el-select v-model="dataBits" size="small">
                <el-option
                  v-for="item in [8, 7, 6, 5]"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-row>
            <el-row type="flex" justify="start" align="middle">
              <el-select v-model="parity" size="small">
                <el-option
                  v-for="item in ['none', 'even', 'mark', 'odd', 'space']"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-row>
            <el-row type="flex" justify="start" align="middle">
              <el-select v-model="stopBits" size="small">
                <el-option
                  v-for="item in [1, 2]"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-row>
            <el-row>
              <el-button :type="openButtonType" size="small" @click="handleOpenPort" round>
                {{openButtonText}}
              </el-button>
            </el-row>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const SerialPort = require("serialport");
const InterByteTimeout = require("@serialport/parser-inter-byte-timeout");

export default {
  name: "setting",

  data() {
    return {
      portList: [],
      portName: "",
      baudRate: 9600,
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      openButtonText: "打开串口",
      openButtonType: "danger",
      openButtonStatus: false,
      serialPort: null
    };
  },

  methods: {
    handleOpenPort() {
      if (!this.openButtonStatus) {
        const serialPort = new SerialPort(this.portName, {
          baudRate: this.baudRate,
          dataBits: this.dataBits,
          parity: this.parity,
          stopBits: this.stopBits,
          autoOpen: false
        });
        serialPort.open(err => {
          if (err) {
            this.$message.error(
              `打开串口${this.portName}失败！请检查该串口是否被占用。`
            );
          } else {
            this.openButtonText = "关闭串口";
            this.openButtonType = "success";
            this.openButtonStatus = true;
            this.serialPort = serialPort;
            const parser = serialPort.pipe(
              new InterByteTimeout({ interval: 50 })
            );
            parser.on("data", () => {});
            this.$store.commit("serialPort", { serialPort });
          }
        });
      } else {
        this.serialPort.close(err => {
          if (err) {
            this.$message.error(`关闭串口${this.portName}失败！`);
          } else {
            this.openButtonText = "打开串口";
            this.openButtonType = "danger";
            this.openButtonStatus = false;
            this.$store.commit("serialPort", { serialPort: null });
          }
        });
      }
    }
  },

  mounted() {
    SerialPort.list((err, ports) => {
      this.portList = [...ports];
      // this.portName = ports[0].comName;
    });
  }
};
</script>

<style lang="scss">
.el-row {
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
}

.communication-setting {
  .el-row {
    height: 40px;
  }
  .el-select {
    width: 100px;
  }
}
</style>
