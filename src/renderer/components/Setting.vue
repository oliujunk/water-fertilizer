<<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="设备管理">
        <!-- <el-table
          :data="node"
          border
          height="580"
          size="mini"
        >
          <el-table-column label="编号" prop="id" width="50"></el-table-column>
          <el-table-column label="地址" prop="address" width="50"></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div>
                <el-button size="mini">编辑</el-button>
                <el-button size="mini" type="danger">删除</el-button>
              </div>
            </template>
          </el-table-column>
          <div slot="append" class="table-append">
            <el-input size="mini" style="width: 48px" v-model="addNode.id"></el-input>
            <el-input size="mini" style="width: 48px" v-model="addNode.address"></el-input>
            <el-input size="mini" style="width: 346px" v-model="addNode.type"></el-input>
            <el-input size="mini" style="width: 346px" v-model="addNode.name"></el-input>
            <el-button type="primary" size="mini" style="width: 80px; margin-left: 40px;">添加</el-button>
          </div>
        </el-table> -->
        <vxe-table
          ref="nodeTable"
          :data.sync="nodes"
          highlight-current-row
          highlight-hover-row
          size="small"
          border
          height="540"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
        >
          <vxe-table-column type="index" width="60" label="序号"></vxe-table-column>
          <vxe-table-column prop="address" label="地址" sortable :edit-render="{name: 'default'}">
            <template v-slot:edit="{ row }">
              <el-input-number v-model="row.address" :max="254" :min="1" size="mini"></el-input-number>
            </template>
          </vxe-table-column>
          <vxe-table-column prop="type" label="类型" :edit-render="{name: 'default'}">
            <template v-slot:edit="{ row }">
              <el-select v-model="row.type" size="mini">
                <el-option v-for="(item, index) in ['有线阀控器', '无线阀控器', '有线传感器', '无线传感器']" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </template>
          </vxe-table-column>
          <vxe-table-column prop="name" label="名称" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column label="操作">
            <template v-slot="{ row }">
              <template v-if="$refs.nodeTable.hasActiveRow(row)">
                <el-button size="mini" @click="handleNodeEditCancel(row)">取消</el-button>
                <el-button size="mini" type="primary" @click="handleNodeEditOk()">保存</el-button>
              </template>
              <template v-else>
                <el-button size="mini" @click="handleNodeEdit(row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleNodeDelete(row)">删除</el-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div style="float: right; margin-top: 10px; margin-right: 30px;">
          <el-button type="primary" size="mini" @click="handleNodeAdd">添加</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="灌区管理">
        <el-table
          :data="irrigatedArea"
          border
          height="580"
          size="mini"
        >
          <el-table-column label="编号" prop="id" width="100"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" @click.native.prevent="handleEditIrrigatedArea(scope.$index)">编辑</el-button>
                <el-button size="mini" type="danger">删除</el-button>
              </div>
            </template>
          </el-table-column>
          <div slot="append" class="table-append">
            <el-input size="mini" style="width: 100px" v-model="nodeAdd.id"></el-input>
            <el-input size="mini" style="width: 695px" v-model="nodeAdd.name"></el-input>
            <el-button type="primary" size="mini" style="width: 80px; margin-left: 40px;">添加</el-button>
          </div>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="灌溉制度">
        当前灌溉制度：<br>
        轮灌周期：{{irrigateProgram.period}}天，日工作时间：{{irrigateProgram.dailyWorkingHours}}小时，轮灌时间：{{irrigateProgram.rotationIrrigation}}小时
        <el-form ref="irrigateProgram" :model="irrigateProgram" label-width="100px">
          <el-form-item label="轮灌周期">
            <el-input v-model="irrigateProgram.period"></el-input>
          </el-form-item>
          <el-form-item label="日工作时间">
            <el-input v-model="irrigateProgram.dailyWorkingHours"></el-input>
          </el-form-item>
          <el-form-item label="轮灌时间">
            <el-input v-model="irrigateProgram.rotationIrrigation"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary">更改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="施肥制度">
        <el-form ref="fertilizeProgram" :model="fertilizeProgram" label-width="100px">
          <el-form-item label="施肥周期">
            <el-input v-model="fertilizeProgram.period"></el-input>
          </el-form-item>
          <el-form-item label="施肥时间">
            <el-input v-model="fertilizeProgram.rotationIrrigation"></el-input>
          </el-form-item>
          <el-form-item label="施肥通道">
            <el-select v-model="fertilizeProgram.channelNum">
              <el-option v-for="(item, index) in fertilizeProgram.channel" :key="index" :label="item.name" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="施肥量">
            <el-input v-model="fertilizeProgram.channel[fertilizeProgram.channelNum].fertilizingAmount"></el-input>
          </el-form-item>
          <el-form-item label="肥水比">
            <el-select v-model="fertilizeProgram.channel[fertilizeProgram.channelNum].proportion">
              <el-option v-for="(item, index) in ['1/2', '1/3', '1/5', '1/10']" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary">更改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="用户管理">
        <v-table
          :width="970"
          :height="535"
          :show-vertical-border="false"
          :columns="usersColumns"
          :table-data="users"
          row-hover-color="#eee"
          row-click-color="#edf7ff"
          @on-custom-comp="handleUserCustomComp"
        ></v-table>
        <div style="float: right; margin-top: 5px; margin-right: 70px;">
          <el-button type="primary" size="mini" @click="userAddDialog = true">添加</el-button>
        </div>
        <el-dialog
          :visible.sync="userEidtDialog"
          width="40%"
          title="修改密码"
        >
          <div>
            <el-input v-model="userEdit.password" placeholder="请输入新密码" show-password></el-input>
          </div>
          <div style="text-align: center; margin-top: 10px;">
            <el-button @click="userEidtDialog = false">取消</el-button>
            <el-button type="primary" @click="handleUserEditOk">确认</el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="userAddDialog"
          width="40%"
          title="添加用户"
        >
          <div>
            <el-input v-model="userAdd.username" placeholder="请输入用户名"></el-input>
          </div>
          <div style="margin-top: 20px;">
            <el-input v-model="userAdd.password" placeholder="请输入密码" show-password></el-input>
          </div>
          <div style="text-align: center; margin-top: 10px;">
            <el-button @click="userAddDialog = false">取消</el-button>
            <el-button type="primary" @click="handleUserAddOk">确认</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="系统设置">
        <el-row>
          <el-card class="communication-setting">
            <div slot="header">
              <span>串口设置</span>
            </div>
            <el-row>
              <el-col :span="24">
                <el-select v-model="portName" placeholder="串口号" size="small">
                  <el-option
                    v-for="item in portList"
                    :key="item.comName"
                    :value="item.comName"
                    :label="item.comName"
                  ></el-option>
                </el-select>
                <el-select v-model="baudRate" placeholder="波特率" size="small">
                  <el-option
                    v-for="item in [110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200]"
                    :key="item"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
                <el-select v-model="dataBits" placeholder="数据位" size="small">
                  <el-option
                    v-for="item in [8, 7, 6, 5]"
                    :key="item"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
                <el-select v-model="parity" placeholder="校验位" size="small">
                  <el-option
                    v-for="item in ['none', 'even', 'mark', 'odd', 'space']"
                    :key="item"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
                <el-select v-model="stopBits" placeholder="停止位" size="small">
                  <el-option
                    v-for="item in [1, 2]"
                    :key="item"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
                <el-button :type="portButtonType" size="small" @click="handlePortOpen" round>
                  {{portButtonText}}
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="communication-setting">
            <div slot="header">
              <span>网络设置</span>
            </div>
          </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import md5 from 'js-md5';
import { setTimeout } from 'timers';
const SerialPort = require('serialport');
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout');
const schedule = require('node-schedule');

export default {
  name: "Setting",

  data() {
    return {
      portList: [],
      portName: "",
      baudRate: 9600,
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      serialPort: null,
      schedules: {},
      portButtonText: '打开',
      portButtonType: 'danger',
      portButtonStatus: false,
      systemParameterDialog: false,
      nodeManageDialog: false,
      nodes: [
        {
          address: 1, type: '无线控制器', name: '节点1'
        },
      ],
      nodeAdd: {},
      irrigatedArea: [
        {
          id: 1, name: '灌区1'
        },
        {
          id: 2, name: '灌区2'
        },
        {
          id: 3, name: '灌区3'
        },
        {
          id: 4, name: '灌区4'
        },
        {
          id: 5, name: '灌区5'
        },
        {
          id: 6, name: '灌区6'
        },
      ],
      addIrrigatedArea: {},
      irrigateProgram: { period: 7, dailyWorkingHours: 8, rotationIrrigation: 1 },
      fertilizeProgram: {
        period: 7,
        rotationIrrigation: 1,
        channelNum: 0,
        channel: [
          { name: '氮肥', fertilizingAmount: 30, proportion: '1/3' },
          { name: '氨肥', fertilizingAmount: 40, proportion: '1/2' },
          { name: '钾肥', fertilizingAmount: 50, proportion: '1/5' },
          { name: '磷肥', fertilizingAmount: 60, proportion: '1/10' },
        ],
      },
      users: [],
      usersColumns: [
        {
          field: 'custome',
          title: '序号',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: (rowData, rowIndex) => rowIndex + 1
        },
        {
          field: 'username', title: '用户名', width: 100, titleAlign: 'center', columnAlign: 'center'
        },
        {
          field: 'createAt', title: '创建时间', width: 280, titleAlign: 'center', columnAlign: 'center'
        },
        {
          field: 'modifyAt', title: '修改时间', width: 280, titleAlign: 'center', columnAlign: 'center'
        },
        {
          field: 'custome-adv', title: '操作', width: 180, titleAlign: 'center', columnAlign: 'center', componentName: 'table-user-operation'
        },
      ],
      userEdit: {},
      userAdd: { username: '', password: '' },
      userEidtDialog: false,
      userAddDialog: false,
    };
  },

  methods: {
    handlePortOpen() {
      if (this.portButtonStatus) {
        this.serialPort.close((err) => {
          if (err) {
            this.$message.error(`关闭串口${this.serialPort.path}失败！`);
          } else {
            this.portButtonText = '打开';
            this.portButtonType = 'danger';
            this.portButtonStatus = false;
            this.serialPort = null;
            this.schedules.job1.cancel();
          }
        });
        this.serialPort = null;
      } else {
        const serialPort = new SerialPort(this.portName, {
          baudRate: this.baudRate,
          dataBits: this.dataBits,
          parity: this.parity,
          stopBits: this.stopBits,
          autoOpen: false,
        });
        serialPort.open((err) => {
          if (err) {
            this.$message.error(`打开串口${this.portName}失败！请检查该串口是否被占用。`);
          } else {
            const parser = serialPort.pipe(new InterByteTimeout({ interval: 50 }));
            parser.on('data', () => {});
            const job1 = schedule.scheduleJob('*/5 * * * * *', () => {
              console.log(new Date());
              const send = Buffer.alloc(6);
              send[0] = 0x01;
              send[1] = 0x03;
              send[2] = 0x00;
              send[3] = 0x00;
              send[4] = 0xF1;
              send[5] = 0xD8;
              serialPort.write(send);
              console.log(job1);
            });
            this.schedules = { ...this.schedules, job1 };
            this.portButtonText = '关闭';
            this.portButtonType = 'success';
            this.portButtonStatus = true;
            this.serialPort = serialPort;
          }
        });
      }
    },
    handleEditIrrigatedArea(index) {
      console.log(index);
    },
    handleNodeEdit(row) {
      this.$refs.nodeTable.setActiveRow(row);
    },
    handleNodeEditCancel(row) {
      this.$refs.nodeTable.revert(row);
      this.$refs.nodeTable.clearActived();
    },
    handleNodeEditOk() {
      this.$refs.nodeTable.clearActived();
      this.nodes.push(JSON.parse(JSON.stringify(this.$refs.nodeTable.getInsertRecords().pop()[0])));
      this.$db.node.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.node.insert(this.nodes);
      }, 1000);
    },
    handleNodeDelete(row) {
      this.$refs.nodeTable.remove(row);
      this.nodes = this.nodes.filter(
        (item) => this.$refs.nodeTable.getRemoveRecords()
          .every((node) => node.address !== item.address));
      this.$db.node.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.node.insert(this.nodes);
      }, 1000);
    },
    handleNodeAdd() {
      this.$refs.nodeTable.insertAt({}, -1);
    },
    handleUserCustomComp(params) {
      if (params.type === 'delete') {
        this.$delete(this.users, params.index);
        this.$db.user.remove({}, { multi: true });
        this.$db.user.insert(this.users);
      } else if (params.type === 'edit') {
        this.userEidtDialog = true;
        this.userEdit = this.users[params.index];
        this.userEdit.password = '';
        this.userEdit.index = params.index;
      }
    },
    handleUserEditOk() {
      this.userEidtDialog = false;
      this.userEdit.password = md5(this.userEdit.password);
      this.userEdit.modifyAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      this.users[this.userEdit.index] = JSON.parse(JSON.stringify(this.userEdit));
      this.$db.user.remove({}, { multi: true });
      this.$db.user.insert(this.users);
    },
    handleUserAddOk() {
      this.userAddDialog = false;
      if (this.userAdd.username === '' || this.userAdd.password === '') {
        this.$notify.error({
          title: '错误',
          message: '用户名或密码不能为空！',
        });
      } else {
        let usernameRepeated = false;
        for (let i = 0, len = this.users.length; i < len; i += 1) {
          if (this.userAdd.username === this.users[i].username) {
            usernameRepeated = true;
            break;
          }
        }
        if (usernameRepeated) {
          this.$notify.error({
            title: '错误',
            message: '用户名已存在！',
          });
        } else {
          this.userAdd.password = md5(this.userAdd.password);
          this.userAdd.createAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          this.userAdd.modifyAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          this.users.push(JSON.parse(JSON.stringify(this.userAdd)));
          this.$db.user.remove({}, { multi: true });
          this.$db.user.insert(this.users);
          this.userAdd.username = '';
          this.userAdd.password = '';
        }
      }
    },
  },

  mounted() {
    this.$db.settingPage.loadDatabase();
    this.$db.user.loadDatabase();
    this.$db.node.loadDatabase();
    SerialPort.list((err, ports) => {
      this.portList = [...ports];
      this.portName = ports[0].comName;
    });

    // this.$db.settingPage.findOne({}, (err, doc) => {
    //   this.portName = doc.portName;
    //   this.baudRate = doc.baudRate;
    //   this.dataBits = doc.dataBits;
    //   this.parity = doc.parity;
    //   this.stopBits = doc.stopBits;
    //   this.schedules = doc.schedules;
    // });
    this.$db.user.find({}, (err, docs) => {
      this.users = docs;
    });
    this.$db.node.find({}, (err, docs) => {
      this.nodes = docs;
    });
  },
  beforeDestroy() {
    this.$db.settingPage.remove({}, { multi: true });
    this.$db.settingPage.insert({
      portName: this.portName,
      baudRate: this.baudRate,
      dataBits: this.dataBits,
      parity: this.parity,
      stopBits: this.stopBits,
      schedules: this.schedules,
      dataTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    });
  },
};

Vue.component('table-user-operation', {
  template: `<span>
              <el-button size="mini" @click.stop.prevent="update(rowData,index)">编辑</el-button>&nbsp;
              <el-button size="mini" type="danger" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
            </span>`,
  props: {
    rowData: { type: Object },
    field: { type: String },
    index: { type: Number },
  },
  methods: {
    update() {
      const params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      const params = { type: 'delete', index: this.index };
      this.$emit('on-custom-comp', params);
    },
  },
});
Vue.component('table-node-operation', {
  template: `<span>
              <el-button size="mini" type="danger" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
            </span>`,
  props: {
    rowData: { type: Object },
    field: { type: String },
    index: { type: Number },
  },
  methods: {
    deleteRow() {
      const params = { type: 'delete', index: this.index };
      this.$emit('on-custom-comp', params);
    },
  },
});
</script>

<style lang="scss" scoped>
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

.system-manage {
  .table-append {
    display: flex;
  }
}
</style>
