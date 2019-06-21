/* eslint-disable */
<template>
  <div class="myBody" :style="mainHeight">
    <el-container>
      <el-main>
        <div class="mainContent">
          <div class="mainTop">
            <div v-if="carListLength != 0">
              <div class="car" v-for="(item,index) in carList" :key="index">
                <div class="carContent" :class="{carContentHover:!autoMode}">
                  <div
                    class="carName"
                    :class="{ carStyGreen: index < runStep, carStyYellowgreen: index == runStep,carStyYello: index > runStep}"
                  >{{item.name}} ({{index+1}})</div>
                  <div class="carDelect carHover" @click="onCarDelect(index)">
                    <i class="el-icon-remove"></i>
                  </div>
                  <div class="carAdd carHover" @click="onCarAdd(index)">
                    <i class="el-icon-circle-plus"></i>
                  </div>
                </div>
                <div class="carLine" v-show="!(index == carListLength - 1)">---></div>
              </div>
            </div>

            <div v-else>
              <div class="car">
                <div class="carContent" :class="{carContentHover:!autoMode}">
                  <div class="carName">无片区 (0)</div>
                  <div class="carAdd carHover" @click="onCarAdd(-1)">
                    <i class="el-icon-circle-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mainBottom">
            <div class="IrrManagement">
              <div class="sideTitle">灌溉制度</div>

              <div class="ferSelectItem">
                <div class="paramTitle">灌溉周期:</div>
                <el-input
                  v-model="IrrManagementParam.cycle"
                  placeholder="请输入内容"
                  class="paramInput"
                  :disabled="autoMode"
                ></el-input>
                <div class="unit">天</div>
              </div>

              <div class="ferSelectItem">
                <div class="paramTitle">时间段1:</div>
                <el-time-picker
                  :disabled="autoMode"
                  is-range
                  v-model="IrrManagementParam.time1"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                ></el-time-picker>
              </div>

              <div class="ferSelectItem">
                <div class="paramTitle">时间段2:</div>
                <el-time-picker
                  :disabled="autoMode"
                  is-range
                  v-model="IrrManagementParam.time2"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                ></el-time-picker>
              </div>

              <div class="sideConfirm">
                <el-button type="primary" round @click="onIrrConfirm" :disabled="autoMode">确认修改</el-button>
              </div>
            </div>
            <div class="control">
              <el-switch v-model="autoMode" active-text="默认参数" inactive-text="自定义参数"></el-switch>
              <el-button type="primary" @click="onConfirm()">{{runState?'停止运行':'确认运行'}}</el-button>
            </div>
          </div>
        </div>
      </el-main>
      <el-aside width="380px">
        <div class="side">
          <div class="sideMode">
            <div class="sideTitle">模式:</div>
            <el-radio-group v-model="ferModeRadio">
              <el-radio :label="0">无施肥</el-radio>
              <el-radio :label="1">肥料比</el-radio>
              <el-radio :label="2">施肥量</el-radio>
            </el-radio-group>
          </div>
          <div class="ferManagement">
            <div class="sideTitle">施肥制度</div>
            <div class="sideName">
              <div
                class="sideItem"
                v-for="(item,index) in ferRelayList"
                :key="index"
                @click="onSideItem(index)"
              >
                <div class="shuli">{{item.name}}</div>
                <div class="bottom" :class="{current: ferRelayCurrent == index}"></div>
              </div>
            </div>
            <div class="sideContenr">
              <div class="ferSelectItem">
                <div class="paramTitle">肥料类型:</div>
                <el-select
                  v-model="ferSelectParam.ferType"
                  placeholder="请选择"
                  class="paramInput"
                  :disabled="autoMode"
                >
                  <el-option
                    v-for="item in ferTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div class="unit"></div>
              </div>
              <div class="ferSelectItem">
                <div class="paramTitle">肥料配比:</div>
                <el-input
                  v-model="ferSelectParam.concentration"
                  placeholder="请输入内容"
                  class="paramInput"
                  :disabled="autoMode"
                ></el-input>
                <div class="unit"></div>
              </div>

              <div class="ferSelectItem">
                <div class="paramTitle">施肥时间:</div>
                <el-input
                  v-model="ferSelectParam.time"
                  placeholder="请输入内容"
                  class="paramInput"
                  :disabled="autoMode"
                ></el-input>
                <div class="unit">小时</div>
              </div>

              <div class="ferSelectItem">
                <div class="paramTitle">施肥周期:</div>
                <el-input
                  v-model="ferSelectParam.cycle"
                  placeholder="请输入内容"
                  class="paramInput"
                  :disabled="autoMode"
                ></el-input>
                <div class="unit">天</div>
              </div>

              <div class="ferSelectItem">
                <div class="paramTitle">&nbsp;施肥量&nbsp;&nbsp;:</div>
                <el-input
                  v-model="ferSelectParam.value"
                  placeholder="请输入内容"
                  class="paramInput"
                  :disabled="autoMode"
                ></el-input>
                <div class="unit"></div>
              </div>
            </div>
            <div class="sideConfirm">
              <el-button type="primary" round @click="onSideConfirm" :disabled="autoMode">确认修改</el-button>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
    <el-dialog title="选择片区" :visible.sync="dialogTableVisible" width="30%" center>
      <el-select v-model="dialogValue" placeholder="请选择要执行的片区">
        <el-option v-for="(item,index) in areaList" :key="index" :label="item.name" :value="index"></el-option>
      </el-select>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { xph } from "../xphDevice";

let carBuf = [];
const runParam = {
  carList: {},
  ferParam: {},
  ferModeRadio: 0,
  IrrManagementParam: {}
};

export default {
  name: "autoControl",
  data() {
    return {
      mainHeight: { height: `${window.innerHeight - 80}px` },
      ferRelayList: [
        {
          name: "施肥阀1",
          jId: "0",
          param: {
            ferType: "氮肥",
            concentration: "1/30",
            time: "30",
            cycle: "2",
            value: "30"
          }
        },
        {
          name: "施肥阀2",
          jId: "1",
          param: {
            ferType: "氮肥",
            concentration: "1/30",
            time: "30",
            cycle: "2",
            value: "30"
          }
        },
        {
          name: "施肥阀3",
          jId: "2",
          param: {
            ferType: "氮肥",
            concentration: "1/30",
            time: "30",
            cycle: "2",
            value: "30"
          }
        },
        {
          name: "施肥阀4",
          jId: "3",
          param: {
            ferType: "氮肥",
            concentration: "1/30",
            time: "30",
            cycle: "2",
            value: "30"
          }
        }
      ],
      ferRelayCurrent: "0",
      ferSelectParam: {
        ferType: "氮肥",
        concentration: "1/30",
        time: "30",
        cycle: "2",
        value: "30"
      },
      ferTypeOptions: [
        {
          value: "选项1",
          label: "氮肥"
        },
        {
          value: "选项2",
          label: "钾肥"
        }
      ],
      IrrManagementParam: {
        cycle: "31",
        time1: [new Date(), new Date()],
        time2: [new Date(), new Date()]
      },
      autoMode: true,
      carList: [{ name: "盖伦" }, { name: "洛克萨斯" }],
      carListLength: 2,
      carCurrent: "",
      dialogTableVisible: false,
      dialogValue: "",
      areaList: [
        { name: "皇子", id: "0" },
        { name: "瞎子", id: "1" },
        { name: "蜘蛛", id: "2" }
      ],
      ferModeRadio: 0,
      runStep: 1,
      runState: false
    };
  },
  mounted() {
    // 得到当前运行状态
    this.runState = xph.runState == "自动运行";
    xph.on("runState", this.onRunstate);
    xph.on("runStep", this.onRunStep);
    xph.on("sensorData", this.onTest);
    // 正在运行
    if (this.runState == false) {
      this.ferModeRadio = xph.ferModeRadio;
      // 获取卡片数据;
      this.$db.area.loadDatabase();
      this.$db.area
        .find({})
        .sort({ id: 1 })
        .exec((err, docs) => {
          carBuf = docs;
          this.carList = carBuf;
          this.areaList = [];

          runParam.carList = JSON.parse(JSON.stringify(this.carList));
          this.carListLength = this.carList.length;
          // console.log(this.carList);
        });

      // 获取施肥数据和灌溉数据
      this.$db.config.loadDatabase();
      this.$db.config
        .find({})
        .sort({ id: 1 })
        .exec((err, docs) => {
          // console.log(docs[0].fertilizeProgram.channel);

          // 灌溉参数
          const IrrObj = docs[0].irrigateProgram;
          this.IrrManagementParam.time1 = IrrObj.dailyWorkingTime1;
          this.IrrManagementParam.time2 = IrrObj.dailyWorkingTime2;
          this.IrrManagementParam.cycle = IrrObj.period;

          runParam.IrrManagementParam = JSON.parse(
            JSON.stringify(this.IrrManagementParam)
          );
          // console.log(this.IrrManagementParam);

          // 施肥参数
          this.ferModeRadio =
            docs[0].fertilizeProgram.type == 0
              ? 0
              : docs[0].fertilizeProgram.type == 1
                ? 2
                : 1;
          const ferObj = docs[0].fertilizeProgram.channel;
          const ferlist = [];

          for (let index = 0; index < ferObj.length; index++) {
            const iterator = ferObj[index];
            const entry = {
              name: `施肥阀${index + 1}`,
              jId: index.toString(),
              param: {
                ferType: iterator.name,
                concentration: `1/${iterator.scale}`,
                time: iterator.rotationIrrigation,
                cycle: iterator.period,
                value: iterator.amount
              }
            };
            this.ferRelayList[index] = entry;
          }
          this.ferSelectParam = this.ferRelayList[0].param;
          // console.log(this.ferRelayList);
          runParam.ferModeRadio = this.ferModeRadio;
          runParam.ferParam = JSON.parse(JSON.stringify(this.ferRelayList));
        });
    } else {
      this.runStep = xph.runStep;
      this.carList = xph.carList;
      this.IrrManagementParam = xph.IrrManagementParam;
      this.ferRelayList = xph.ferParam;
      this.ferModeRadio = xph.ferModeRadio;
      this.ferSelectParam = this.ferRelayList[0].param;
    }

    this.carListLength = this.carList.length;
  },
  beforeDestroy() {
    xph.off("runState", this.onRunstate);
    xph.off("runStep", this.onRunStep);
    xph.off("sensorData", this.onTest);
  },
  methods: {
    onTest(data) {
      console.log(data);
    },
    onRunstate(state) {
      this.runState = xph.runState == "自动运行";
      // console.log(this.runState);
    },
    onRunStep(step) {
      this.runStep = step;
      console.log(`onRunStep${step}`);
    },
    onSideItem(index) {
      this.ferRelayCurrent = index;
      this.ferSelectParam = JSON.parse(
        JSON.stringify(this.ferRelayList[index].param)
      );
    },
    onSideConfirm() {
      const h = this.$createElement;
      if (this.ferSelectParam.concentration.indexOf("/") == -1) {
        this.$notify({
          title: "施肥参数修改失败！",
          message: h("i", { style: "color: teal" }, "肥料比没有检测到' / '")
        });
        return;
      }

      this.ferRelayList[this.ferRelayCurrent].param = this.ferSelectParam;
      runParam.ferParam = JSON.parse(JSON.stringify(this.ferRelayList));

      this.$notify({
        title: "施肥参数修改成功",
        message: h("i", { style: "color: teal" }, "施肥参数修改成功")
      });
    },
    onIrrConfirm() {
      runParam.IrrManagementParam = JSON.parse(
        JSON.stringify(this.IrrManagementParam)
      );
      const h = this.$createElement;
      this.$notify({
        title: "灌溉参数修改成功",
        message: h("i", { style: "color: teal" }, "灌溉参数修改成功")
      });
    },
    onCarAdd(index) {
      this.carCurrent = index;
      this.dialogTableVisible = true;
    },
    onCarDelect(index) {
      this.areaList.push(this.carList.splice(index, 1)[0]);
      runParam.carList = JSON.parse(JSON.stringify(this.carList));
      this.carListLength = this.carList.length;
    },
    onDialogConfirm() {
      if (this.dialogValue !== "") {
        this.carList.splice(
          this.carCurrent + 1,
          0,
          this.areaList.splice(this.dialogValue, 1)[0]
        );
        this.carListLength = this.carList.length;
        this.dialogValue = "";
        this.dialogTableVisible = false;
      }
    },
    onConfirm() {
      if (this.runState) {
        // 当前状态正在运行点击则是停止
        this.runState = !this.runState;
        xph.taskStop();
      } else {
        runParam.ferModeRadio = this.ferModeRadio;
        const flagMsg = xph.taskStart(runParam);
        if (flagMsg != undefined) {
          const h = this.$createElement;
          this.$notify({
            title: "运行错误",
            message: h("i", { style: "color: teal" }, flagMsg)
          });
        } else {
          this.runState = !this.runState;
          this.runStep = 0;
        }
      }
    }
  }
};
</script>

<style scoped>
/* 整体布局 */
.myBody {
  display: flex;
  flex-flow: column nowrap;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
/* 主内容区 */
.mainContent {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  min-height: 100%;
  background-color: #b3c0d1;
}
.mainTop > div {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
}
/* 轮灌区 */
.car {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  height: 60px;
  padding: 10px 0;
}
.carContent {
  display: block;
  position: relative;
  padding: 0 28px;
  /* background-color: pink; */
  height: 40px;
  line-height: 40px;
}
.carName {
  padding: 0 5px;
  background-color: #409eff;
  color: #ffffff;
  border-radius: 5px;
}
.carDelect {
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 24px;
  color: #f56c6c;
}
.carAdd {
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 24px;
  color: #67c23a;
}
.carContentHover:hover .carHover {
  display: block;
  cursor: pointer;
}
.carLine {
  height: 40px;
  line-height: 40px;
  font-size: 24px;
}

.carStyYello {
  background-color: #ffc000;
}

.carStyGreen {
  background-color: green;
}

.carStyYellowgreen {
  background-color: yellowgreen;
}

.mainBottom {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
}
.control {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}
.control > .el-switch {
  margin-top: 20px;
  margin-bottom: 30px;
}

.control > .el-button {
  margin: auto 20px;
}

/* 右侧侧边栏布局 */
.side {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 100%;
  margin: auto 20px;
}
.sideMode {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 0 auto;
}
.sideMode .sideTitle {
  font-size: 16px;
  height: 24px;
  line-height: 16px;
  margin-right: 10px;
}
/* 灌溉管理 */
.IrrManagement {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 260px;
  width: 380px;
  background-color: #e9eef3;
  margin-bottom: 20px;
  padding: 0 10px;
}
/* 施肥管理 */
.ferManagement {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 520px;
  background-color: #e9eef3;
  padding: 0 10px;
}
.sideTitle {
  height: 36px;
  line-height: 36px;
  font-size: 28px;
  text-align: center;
  font-weight: 800;
  margin-bottom: 10px;
}
.sideName {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
}
.sideItem {
  background-color: #409eff;
  display: flex;
  flex-flow: column nowrap;
  cursor: pointer;
}
.shuli {
  width: 20px;
  margin: 0 auto;
  line-height: 24px;
  font-size: 20px;
  word-wrap: break-word; /*英文的时候需要加上这句，自动换行*/
  margin: 10px;
}
.sideItem .bottom {
  width: 40px;
  margin: 0 auto;
  height: 8px;
  background-color: #d3dce6;
}
.sideItem .current {
  background-color: #409eff;
}
.ferSelectItem {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background-color: #409eff;
  height: 50px;
}
.ferSelectItem .paramTitle {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  margin-right: 20px;
  width: 74px;
  text-align: center;
}
.ferSelectItem > .paramInput {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  width: 180px;
}
.ferSelectItem .unit {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  width: 50px;
}

.ferSelectItem .el-select {
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
}

.sideConfirm {
  display: block;
  height: 50px;
  line-height: 50px;
}
</style>