<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="设备管理">
        <vxe-table
          ref="nodeTable"
          :data.sync="nodes"
          highlight-current-row
          highlight-hover-row
          size="small"
          border
          height="540"
          auto-resize
          :edit-config="{ key: 'addr', trigger: 'manual', mode: 'row', autoClear: false }"
        >
          <vxe-table-column type="index" width="60" label="序号"></vxe-table-column>

          <vxe-table-column
            prop="addr"
            width="150"
            label="地址"
            sortable
            :edit-render="{name: 'default'}"
          >
            <template v-slot:edit="{ row }">
              <el-input-number v-model="row.addr" :max="254" :min="1" size="mini"></el-input-number>
            </template>
          </vxe-table-column>
          <vxe-table-column
            prop="type"
            width="200"
            label="类型"
            :formatter="formatNodeType"
            :edit-render="{name: 'default'}"
          >
            <template v-slot:edit="{ row }">
              <el-select v-model="row.type" size="mini">
                <el-option
                  v-for="(item, index) in nodeType"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
            </template>
          </vxe-table-column>
          <vxe-table-column prop="name" label="名称" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column label="操作" width="200">
            <template v-slot="{ row }">
              <template v-if="$refs.nodeTable.hasActiveRow(row)">
                <el-button size="mini" @click="handleNodeEditCancel(row)">取消</el-button>
                <el-button size="mini" type="primary" @click="handleNodeEditOk(row)">保存</el-button>
              </template>
              <template v-else>
                <el-button size="mini" @click="handleNodeEdit(row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleNodeDelete(row)">删除</el-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div style="float: right; margin-top: 10px; margin-right: 92px;">
          <el-button type="primary" size="mini" @click="handleNodeAdd">添加</el-button>
        </div>
        <el-dialog title="节点添加" :visible.sync="nodeAddDialogVisible" width="70%">
          <el-form :model="nodeAdd">
            <el-form-item label="节点地址" label-width="100px">
              <el-input-number v-model="nodeAdd.addr" :max="254" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="节点名称" label-width="100px">
              <el-input v-model="nodeAdd.name"></el-input>
            </el-form-item>
            <el-form-item label="节点类型" label-width="100px">
              <el-select v-model="nodeAdd.type">
                <el-option
                  v-for="(item, index) in nodeType"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="handleNodeAddCancel">取 消</el-button>
            <el-button type="primary" @click="handleNodeAddOk">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="灌区管理">
        <vxe-table
          ref="areaTable"
          :data.sync="areas"
          highlight-current-row
          highlight-hover-row
          size="small"
          border
          height="540"
          auto-resize
          :edit-config="{ key: 'id', trigger: 'manual', mode: 'row', autoClear: false }"
        >
          <vxe-table-column type="index" width="60" label="序号"></vxe-table-column>
          <vxe-table-column prop="id" label="编号" sortable></vxe-table-column>
          <vxe-table-column prop="name" label="名称"></vxe-table-column>
          <vxe-table-column label="包含节点" align="center">
            <template v-slot="{ row }">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  展开
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in row.node"
                    :key="item.addr"
                  >{{nodes.find((node) => node.addr === item.addr) ? nodes.find((node) => node.addr === item.addr).name : ''}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </vxe-table-column>
          <vxe-table-column label="操作">
            <template v-slot="{ row }">
              <template>
                <el-button size="mini" @click="handleAreaEdit(row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleAreaDelete(row)">删除</el-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div style="float: right; margin-top: 10px; margin-right: 92px;">
          <el-button type="primary" size="mini" @click="handleAreaAdd">添加</el-button>
        </div>
        <el-dialog title="灌区修改" :visible.sync="areaEditDialogVisible" width="70%">
          <el-form :model="areaEdit">
            <el-form-item label="灌区编号" label-width="100px">
              <el-input-number v-model="areaEdit.id" :max="128" :min="1" disabled></el-input-number>
            </el-form-item>
            <el-form-item label="灌区名称" label-width="100px">
              <el-input v-model="areaEdit.name"></el-input>
            </el-form-item>
            <el-form-item label="节点选择" label-width="100px">
              <el-transfer v-model="transferNodes" :data="nodes" :titles="['所有节点', '当前灌区节点']"></el-transfer>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="handleAreaEditCancel">取 消</el-button>
            <el-button type="primary" @click="handleAreaEditOk">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="灌区添加" :visible.sync="areaAddDialogVisible" width="70%">
          <el-form :model="areaAdd">
            <el-form-item label="灌区编号" label-width="100px">
              <el-input-number v-model="areaAdd.id" :max="128" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="灌区名称" label-width="100px">
              <el-input v-model="areaAdd.name"></el-input>
            </el-form-item>
            <el-form-item label="节点选择" label-width="100px">
              <el-transfer v-model="transferNodes" :data="nodes" :titles="['所有节点', '当前灌区节点']"></el-transfer>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="handleAreaAddCancel">取 消</el-button>
            <el-button type="primary" @click="handleAreaAddOk">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="灌溉制度">
        <el-form ref="irrigateProgram" :model="config.irrigateProgram" label-width="100px">
          <el-form-item label="轮灌周期">
            <el-input-number
              v-model="config.irrigateProgram.period"
              :precision="1"
              :step="0.5"
              :min="1"
              :max="14"
              label="轮灌周期"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="工作时段">
            <el-time-picker
              is-range
              v-model="config.irrigateProgram.dailyWorkingTime1"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
            <el-time-picker
              is-range
              arrow-control
              v-model="config.irrigateProgram.dailyWorkingTime2"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="handleIrrigateProgramChange">更改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="施肥制度">
        <el-form ref="fertilizeProgram" :model="config.fertilizeProgram" label-width="100px">
          <el-form-item label="施肥方式">
            <el-radio-group v-model="config.fertilizeProgram.type">
              <el-radio :label="0">仅灌溉</el-radio>
              <el-radio :label="1">定量施肥</el-radio>
              <el-radio :label="2">定比施肥</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="施肥通道">
            <el-select v-model="config.fertilizeProgram.channelNum">
              <el-option
                v-for="(item, index) in channel"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="施肥周期">
            <el-input-number
              v-model="config.fertilizeProgram.channel[config.fertilizeProgram.channelNum].period"
              :max="100"
              :min="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="施肥时间">
            <el-input-number
              v-model="config.fertilizeProgram.channel[config.fertilizeProgram.channelNum].rotationIrrigation"
              :max="100"
              :min="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="施肥类型">
            <el-select v-model="config.fertilizeProgram.channel[config.fertilizeProgram.channelNum].type">
              <el-option
                v-for="(item, index) in fertilizerType"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="施肥量">
            <el-input-number
              v-model="config.fertilizeProgram.channel[config.fertilizeProgram.channelNum].amount"
              :max="500"
              :min="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="肥水比">
            <el-input-number
              value="1"
              disabled
            ></el-input-number>
            :
            <el-input-number
              v-model="config.fertilizeProgram.channel[config.fertilizeProgram.channelNum].scale"
              :min="1"
              :max="500"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="handleFertilizeProgramChange">更改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="用户管理">
        <vxe-table
          ref="userTable"
          :data.sync="users"
          highlight-current-row
          highlight-hover-row
          size="small"
          border
          height="540"
          auto-resize
          :edit-config="{ key: 'username', trigger: 'manual', mode: 'row', autoClear: false }"
        >
          <vxe-table-column type="index" width="60" label="序号"></vxe-table-column>
          <vxe-table-column prop="username" width="200" label="用户名"></vxe-table-column>
          <vxe-table-column prop="createAt" label="创建时间"></vxe-table-column>
          <vxe-table-column prop="modifyAt" label="修改时间"></vxe-table-column>
          <vxe-table-column label="操作" width="200">
            <template v-slot="{ row }">
              <template>
                <el-button size="mini" @click="handleUserEdit(row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleUserDelete(row)">删除</el-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div style="float: right; margin-top: 5px; margin-right: 70px;">
          <el-button type="primary" size="mini" @click="userAddDialogVisible = true">添加</el-button>
        </div>
        <el-dialog title="密码修改" :visible.sync="userEditDialogVisible" width="50%">
          <el-form :model="userEdit">
            <el-form-item label="密码" label-width="60px">
              <el-input v-model="userEdit.password" show-password></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="userEditDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleUserEditOk">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="添加用户" :visible.sync="userAddDialogVisible" width="50%">
          <el-form :model="userAdd">
            <el-form-item label="用户名" label-width="60px">
              <el-input v-model="userAdd.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="60px">
              <el-input v-model="userAdd.password" show-password></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="userAddDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleUserAddOk">确 定</el-button>
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
                <el-select v-model="portProperty.name" placeholder="串口号" size="small">
                  <el-option
                    v-for="item in portList"
                    :key="item.comName"
                    :value="item.comName"
                    :label="item.comName"
                  ></el-option>
                </el-select>
                <el-select v-model="portProperty.baudRate" placeholder="波特率" size="small">
                  <el-option
                    v-for="item in [110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200]"
                    :key="item"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
                <el-select v-model="portProperty.dataBits" placeholder="数据位" size="small">
                  <el-option v-for="item in [8, 7, 6, 5]" :key="item" :value="item" :label="item"></el-option>
                </el-select>
                <el-select v-model="portProperty.parity" placeholder="校验位" size="small">
                  <el-option
                    v-for="item in ['none', 'even', 'mark', 'odd', 'space']"
                    :key="item"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
                <el-select v-model="portProperty.stopBits" placeholder="停止位" size="small">
                  <el-option v-for="item in [1, 2]" :key="item" :value="item" :label="item"></el-option>
                </el-select>
                <el-button
                  :type="portButtonType"
                  size="small"
                  @click="handlePortOpen"
                  round
                >{{portButtonText}}</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="communication-setting">
            <div slot="header">
              <span>灌溉系统参数</span>
            </div>
            <!-- <el-form :model="">
              <el-form-item label=""></el-form-item>
            </el-form>-->
            <!-- <el-input-number v-model="num" :precision="1" :step="0.1"></el-input-number> -->
          </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import moment from "moment";
import md5 from "js-md5";
import { setTimeout } from "timers";
import { receiveDataProcess, sendFrameWithCrc } from "../communication";
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const SerialPort = require("serialport");
const InterByteTimeout = require("@serialport/parser-inter-byte-timeout");
const schedule = require("node-schedule");
export default {
  name: "Setting",
  data() {
    return {
      nodeType: ["有线阀控器", "无线阀控器", "有线传感器", "无线传感器"],
      channel: ["通道1", "通道2", "通道3", "通道4"],
      fertilizerType: ["氮肥", "钾肥", "磷肥", "氨肥"],
      portList: [],
      portProperty: {
        name: "",
        baudRate: 9600,
        dataBits: 8,
        parity: "none",
        stopBits: 1
      },
      serialPort: null,
      schedules: {},
      portButtonText: "打开",
      portButtonType: "danger",
      portButtonStatus: false,
      systemParameterDialog: false,
      nodeManageDialog: false,
      nodes: [],
      transferNodes: [],
      nodeAddDialogVisible: false,
      nodeAdd: {},
      areas: [],
      areaEdit: {},
      areaAdd: {},
      areaEditDialogVisible: false,
      areaAddDialogVisible: false,
      config: {
        irrigateProgram: {
          period: 7,
          dailyWorkingTime1: null,
          dailyWorkingTime2: null,
        },
        fertilizeProgram: {
          type: 0,
          channelNum: 0,
          channel: [
            {
              period: 7, // 施肥周期
              rotationIrrigation: 1, // 施肥时间
              type: 0, // 施肥类型
              amount: 10, // 施肥量
              scale: 100 // 肥水比 分子默认为1
            },
            {
              period: 6, // 施肥周期
              rotationIrrigation: 2, // 施肥时间
              type: 1, // 施肥类型
              amount: 20, // 施肥量
              scale: 50 // 肥水比 分子默认为1
            },
            {
              period: 8, // 施肥周期
              rotationIrrigation: 1, // 施肥时间
              type: 3, // 施肥类型
              amount: 10, // 施肥量
              scale: 70 // 肥水比 分子默认为1
            },
            {
              period: 9, // 施肥周期
              rotationIrrigation: 4, // 施肥时间
              type: 3, // 施肥类型
              amount: 20, // 施肥量
              scale: 60 // 肥水比 分子默认为1
            }
          ]
        }
      },
      users: [],
      userEdit: {},
      userEditDialogVisible: false,
      userAdd: {},
      userAddDialogVisible: false
    };
  },
  methods: {
    formatNodeType({ cellValue }) {
      return this.nodeType[cellValue];
    },
    handlePortOpen() {
      if (this.portButtonStatus) {
        this.serialPort.close(err => {
          if (err) {
            this.$message.error(`关闭串口${this.serialPort.path}失败！`);
          } else {
            this.portButtonText = "打开";
            this.portButtonType = "danger";
            this.portButtonStatus = false;
            this.serialPort = null;
            this.schedules.job1.cancel();
          }
        });
        this.serialPort = null;
      } else {
        const serialPort = new SerialPort(this.portProperty.name, {
          baudRate: this.portProperty.baudRate,
          dataBits: this.portProperty.dataBits,
          parity: this.portProperty.parity,
          stopBits: this.portProperty.stopBits,
          autoOpen: false
        });
        ipcRenderer.send('serialPort', serialPort);
        serialPort.open(err => {
          if (err) {
            this.$message.error(
              `打开串口${this.portProperty.name}失败！请检查该串口是否被占用。`
            );
          } else {
            const parser = serialPort.pipe(
              new InterByteTimeout({ interval: 50 })
            );
            parser.on("data", receiveDataProcess);
            const job1 = schedule.scheduleJob("*/5 * * * * *", () => {
              console.log(new Date());
              const send = Buffer.alloc(6);
              send[0] = 0x01;
              send[1] = 0x03;
              send[2] = 0x00;
              send[3] = 0x00;
              send[4] = 0xf1;
              send[5] = 0xd8;
              console.log(job1);
              sendFrameWithCrc(serialPort, send, 0, 6);
            });
            this.schedules = { ...this.schedules, job1 };
            this.portButtonText = "关闭";
            this.portButtonType = "success";
            this.portButtonStatus = true;
            this.serialPort = serialPort;
          }
        });
      }
    },
    handleNodeEdit(row) {
      this.$refs.nodeTable.setActiveRow(row);
    },
    handleNodeEditCancel(row) {
      this.$refs.nodeTable.revert(row);
      this.$refs.nodeTable.clearActived();
    },
    handleNodeEditOk(row) {
      this.$refs.nodeTable.clearActived();
      if (this.$refs.nodeTable.hasRowChange(row)) {
        this.$refs.nodeTable.getUpdateRecords().forEach(item => {
          this.nodes.splice(
            this.nodes.findIndex(node => node._id === item._id),
            1,
            item
          );
        });
        this.$db.node.remove({}, { multi: true });
        setTimeout(() => {
          this.$db.node.insert(this.nodes);
        }, 500);
      } else {
        this.nodes.push(
          JSON.parse(
            JSON.stringify(this.$refs.nodeTable.getInsertRecords().pop()[0])
          )
        );
        this.$db.node.remove({}, { multi: true });
        setTimeout(() => {
          this.$db.node.insert(this.nodes);
        }, 500);
      }
    },
    handleNodeDelete(row) {
      this.$refs.nodeTable.remove(row);
      this.nodes = this.nodes.filter(item =>
        this.$refs.nodeTable
          .getRemoveRecords()
          .every(node => node.key !== item.key)
      );
      this.$db.node.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.node.insert(this.nodes);
      }, 1000);
    },
    handleNodeAdd() {
      this.nodeAddDialogVisible = true;
    },
    handleNodeAddCancel() {
      this.nodeAddDialogVisible = false;
    },
    handleNodeAddOk() {
      this.nodeAddDialogVisible = false;
      this.nodes.push(JSON.parse(JSON.stringify(this.nodeAdd)));
      this.$db.node.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.node.insert(this.nodes);
      }, 500);
    },
    handleAreaEdit(row) {
      this.areaEditDialogVisible = true;
      this.areaEdit = row;
      this.transferNodes = this.areaEdit.node.map(item => item.addr);
    },
    handleAreaEditCancel() {
      this.areaEditDialogVisible = false;
    },
    handleAreaEditOk() {
      this.areaEditDialogVisible = false;
      this.areaEdit.node = this.transferNodes.map((item) => this.nodes.find((node) => node.addr === item));
      this.areas.splice(

        this.areas.findIndex(area => area.id === this.areaEdit.id),
        1,
        JSON.parse(JSON.stringify(this.areaEdit))
      );
      this.$db.area.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.area.insert(this.areas);
      }, 500);
    },
    handleAreaDelete(row) {
      this.$refs.areaTable.remove(row);
      this.areas = this.areas.filter(item =>
        this.$refs.areaTable
          .getRemoveRecords()
          .every(area => area.id !== item.id)
      );
      this.$db.area.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.area.insert(this.areas);
      }, 1000);
    },
    handleAreaAdd() {
      this.areaAddDialogVisible = true;
      this.areaAdd = {};
      this.transferNodes = [];
    },
    handleAreaAddCancel() {
      this.areaAddDialogVisible = false;
      this.userAdd = {};
    },
    handleAreaAddOk() {
      this.areaAddDialogVisible = false;
      this.areaAdd.node = this.transferNodes.map((item) => this.nodes.find((node) => node.addr === item));
      this.areas.push(JSON.parse(JSON.stringify(this.areaAdd)));
      this.$db.area.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.area.insert(this.areas);
      }, 500);
    },
    handleUserEdit(row) {
      this.userEditDialogVisible = true;
      this.userEdit = row;
      this.userEdit.password = "";
    },
    handleUserDelete(row) {
      this.$refs.userTable.remove(row);
      this.users = this.users.filter(user =>
        this.$refs.userTable
          .getRemoveRecords()
          .every(item => item._id !== user._id)
      );
      this.$db.user.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.user.insert(this.users);
      }, 1000);
    },
    handleUserEditOk() {
      this.userEditDialogVisible = false;
      this.userEdit.password = md5(this.userEdit.password);
      this.userEdit.modifyAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      this.users.splice(
        this.users.findIndex(user => user.username === this.userEdit.username),
        1,
        JSON.parse(JSON.stringify(this.userEdit))
      );
      this.$db.user.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.user.insert(this.users);
      }, 500);
    },
    handleUserAddOk() {
      this.userAddDialogVisible = false;
      this.userAdd.password = md5(this.userAdd.password);
      this.userAdd.createAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      this.userAdd.modifyAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      this.users.push(JSON.parse(JSON.stringify(this.userAdd)));
      this.$db.user.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.user.insert(this.users);
      }, 500);
    },
    handleIrrigateProgramChange() {
      this.$db.config.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.config.insert(this.config);
      }, 500);
      this.$message({
        message: '修改成功',
        type: 'success'
      });
    },
    handleFertilizeProgramChange() {
      this.$db.config.remove({}, { multi: true });
      setTimeout(() => {
        this.$db.config.insert(this.config);
      }, 500);
      this.$message({
        message: '修改成功',
        type: 'success'
      });
    }
  },
  mounted() {
    this.$db.config.loadDatabase();
    this.$db.user.loadDatabase();
    this.$db.node.loadDatabase();
    this.$db.area.loadDatabase();
    SerialPort.list((err, ports) => {
      this.portList = [...ports];
      this.portProperty.name = ports[0].comName;
    });
    this.$db.user.find({}, (err, docs) => {
      this.users = docs;
    });
    this.$db.node
      .find({})
      .sort({ addr: 1 })
      .exec((err, docs) => {
        this.nodes = docs;
        this.nodes = this.nodes.map(item => {
          item.key = item.addr;
          item.label = item.name;
          return item;
        });
      });
    this.$db.area
      .find({})
      .sort({ id: 1 })
      .exec((err, docs) => {
        this.areas = docs;
      });
    this.$db.config.findOne({}, (err, doc) => {
      this.config = doc;
    });
  }
};
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