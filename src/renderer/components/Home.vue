<<template>
  <div class="home">
    <el-row :gutter="2">
      <el-col :span="16">
        <el-row class="pipeline-state">
          <el-card>
            <canvas id="tutorial" width="900" height="600"></canvas>
          </el-card>
        </el-row>
        <el-row class="element">
          <el-col :span="4">
            <el-card>
              <div v-for="item in element.slice(0, 3)">
                {{`${item.name}:`}}<br>{{`${accMul(item.data, item.prec)}${item.unit}`}}
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              <div v-for="item in element.slice(3, 5)">
                {{`${item.name}:`}}<br>{{`${accMul(item.data, item.prec)}${item.unit}`}}
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              肥料桶1 <br>
              <div v-for="item in element.slice(5, 8)">
                {{`${item.name}:`}}<br>{{`${accMul(item.data, item.prec)}${item.unit}`}}
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              肥料桶2 <br>
              <div v-for="item in element.slice(8, 11)">
                {{`${item.name}:`}}<br>{{`${accMul(item.data, item.prec)}${item.unit}`}}
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              肥料桶3 <br>
              <div v-for="item in element.slice(11, 14)">
                {{`${item.name}:`}}<br>{{`${accMul(item.data, item.prec)}${item.unit}`}}
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              肥料桶4 <br>
              <div v-for="item in element.slice(14, 17)">
                {{`${item.name}:`}}<br>{{`${accMul(item.data, item.prec)}${item.unit}`}}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row class="irrigated-area">
          <el-card>
            <div slot="header">
              <span>灌区状态</span>
            </div>
            <div>当前灌区：{{irrigatedArea[currentIrrigatedArea].name}}</div>
            <div v-for="(item, index) in irrigatedArea[currentIrrigatedArea].relay">
              {{item.name}}:
              <el-switch :key="index" v-model="item.state" disabled></el-switch>
            </div>
            <div v-for="item in irrigatedArea[currentIrrigatedArea].data">
              {{`${item.name}:`}}<br>{{`${accMul(item.data, item.prec)}${item.unit}`}}
            </div>
          </el-card>
        </el-row>
        <el-row class="alarm-information">
          <el-card>
            <div slot="header">
              <span>报警信息</span>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment';

const accMul = (arg1, arg2) => {
  let m = 0;
  if ((arg1 || arg1 === 0) && (arg2 || arg2 === 0)) {
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
      if (s1.split('.').length > 1) { m += s1.split('.')[1].length; }
    } catch (e) { console.log(e); }
    try {
      if (s2.split('.').length > 1) { m += s2.split('.')[1].length; }
    } catch (e) { console.log(e); }
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', '')))
      / (10 ** m)
    );
  }
  return null;
};

export default {
  name: 'home',
  data() {
    return {
      accMul,
      element: [
        {
          index: 101, data: 32767, name: 'EC', unit: 'mS/cm', prec: 0.01,
        },
        {
          index: 102, data: 32767, name: 'PH', unit: '', prec: 0.01,
        },
        {
          index: 103, data: 32767, name: '压力', unit: 'kPa', prec: 0.1,
        },
        {
          index: 104, data: 32767, name: '实时流量', unit: 'm3/h', prec: 0.01,
        },
        {
          index: 104, data: 32767, name: '总累计流量', unit: 'm3', prec: 0.01,
        },
        {
          index: 104, data: 32767, name: '瞬时流量', unit: 'm3/h', prec: 0.01,
        },
        {
          index: 104, data: 32767, name: '累计流量', unit: 'm3', prec: 0.01,
        },
        {
          index: 105, data: 32767, name: '液位', unit: 'mm', prec: 0.1,
        },
        {
          index: 104, data: 32767, name: '瞬时流量', unit: 'm3/h', prec: 0.01,
        },
        {
          index: 104, data: 32767, name: '累计流量', unit: 'm3', prec: 0.01,
        },
        {
          index: 105, data: 32767, name: '液位', unit: 'mm', prec: 0.1,
        },
        {
          index: 104, data: 32767, name: '瞬时流量', unit: 'm3/h', prec: 0.01,
        },
        {
          index: 104, data: 32767, name: '累计流量', unit: 'm3', prec: 0.01,
        },
        {
          index: 105, data: 32767, name: '液位', unit: 'mm', prec: 0.1,
        },
        {
          index: 104, data: 32767, name: '瞬时流量', unit: 'm3/h', prec: 0.01,
        },
        {
          index: 104, data: 32767, name: '累计流量', unit: 'm3', prec: 0.01,
        },
        {
          index: 105, data: 32767, name: '液位', unit: 'mm', prec: 0.1,
        },
      ],
      relay: [
        {
          index: 1, name: '阀门1', state: true,
        },
        {
          index: 2, name: '阀门2', state: false,
        },
        {
          index: 3, name: '阀门3', state: false,
        },
        {
          index: 4, name: '阀门4', state: false,
        },
        {
          index: 5, name: '阀门5', state: false,
        },
        {
          index: 6, name: '阀门6', state: false,
        },
        {
          index: 7, name: '阀门7', state: false,
        },
        {
          index: 8, name: '阀门8', state: false,
        },
        {
          index: 9, name: '阀门9', state: false,
        },
        {
          index: 10, name: '阀门10', state: false,
        },
        {
          index: 11, name: '阀门11', state: false,
        },
        {
          index: 12, name: '阀门12', state: false,
        },
        {
          index: 13, name: '阀门13', state: false,
        },
        {
          index: 14, name: '阀门14', state: false,
        },
        {
          index: 15, name: '阀门15', state: false,
        },
        {
          index: 16, name: '阀门16', state: false,
        },
      ],
      irrigatedArea: [
        {
          name: '灌区1',
          data: [{
            index: 104, data: 32767, name: '实时流量', unit: 'm3/h', prec: 0.01,
          },
          {
            index: 104, data: 32767, name: '总累计流量', unit: 'm3', prec: 0.01,
          },
          ],
          relay: [
            {
              index: 1, name: '阀门1', state: true,
            },
            {
              index: 1, name: '阀门2', state: true,
            },
          ],
        },
      ],
      currentIrrigatedArea: 0,
    };
  },
  methods: {
    drawInit() {
      const canvas = document.getElementById('tutorial');
      if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#67C23A';
        ctx.fillRect(10, 10, 30, 90);
        const mainPipe = new Path2D();
        mainPipe.rect(40, 70, 560, 30);
        ctx.fillStyle = '#F56C6C';
        ctx.fill(mainPipe);
        const addWaterPipe = new Path2D();
        addWaterPipe.moveTo(10, 100);
        addWaterPipe.lineTo(10, 330);
        addWaterPipe.quadraticCurveTo(10, 400, 70, 400);
        addWaterPipe.lineTo(600, 400);
        addWaterPipe.lineTo(600, 370);
        addWaterPipe.lineTo(70, 370);
        addWaterPipe.quadraticCurveTo(40, 370, 40, 330);
        addWaterPipe.lineTo(40, 100);
        addWaterPipe.lineTo(10, 100);
        ctx.fillStyle = '#F56C6C';
        ctx.fill(addWaterPipe);
        this.drawRoundedRect(ctx, 100, 160, 80, 150, 10, 4.0);
        this.drawRoundedRect(ctx, 230, 160, 80, 150, 10, 4.0);
        this.drawRoundedRect(ctx, 360, 160, 80, 150, 10, 4.0);
        this.drawRoundedRect(ctx, 490, 160, 80, 150, 10, 4.0);

        this.drawVerticalPipe(ctx, 130, 100, 20, 60, 4.0);
        this.drawVerticalPipe(ctx, 260, 100, 20, 60, 4.0);
        this.drawVerticalPipe(ctx, 390, 100, 20, 60, 4.0);
        this.drawVerticalPipe(ctx, 520, 100, 20, 60, 4.0);

        this.drawVerticalPipe(ctx, 130, 310, 20, 60, 4.0);
        this.drawVerticalPipe(ctx, 260, 310, 20, 60, 4.0);
        this.drawVerticalPipe(ctx, 390, 310, 20, 60, 4.0);
        this.drawVerticalPipe(ctx, 520, 310, 20, 60, 4.0);

        this.drawValve(ctx, 115, 130);
        this.drawValve(ctx, 115, 340);
        this.drawValve(ctx, 245, 130);
        this.drawValve(ctx, 245, 340);
        this.drawValve(ctx, 375, 130);
        this.drawValve(ctx, 375, 340);
        this.drawValve(ctx, 505, 130);
        this.drawValve(ctx, 505, 340);

        this.drawWaterPump(ctx, 580, 55);

        this.drawStirrer(ctx, 140, 260);
        this.drawStirrer(ctx, 270, 260);
        this.drawStirrer(ctx, 400, 260);
        this.drawStirrer(ctx, 530, 260);
      }
    },
    // 绘制圆角矩形
    drawRoundedRect(ctx, x, y, width, height, radius, lineWidth) {
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x, y + height - radius);
      ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
      ctx.lineTo(x + width - radius, y + height);
      ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
      ctx.lineTo(x + width, y + radius);
      ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
      ctx.lineTo(x + radius, y);
      ctx.quadraticCurveTo(x, y, x, y + radius);
      ctx.stroke();
      ctx.lineWidth = 1.0;
    },
    // 绘制竖直管道
    drawVerticalPipe(ctx, x, y, width, height, lineWidth) {
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + height);
      ctx.moveTo(x + width, y);
      ctx.lineTo(x + width, y + height);
      ctx.stroke();
      ctx.lineWidth = 1.0;
    },
    // 绘制水泵
    drawWaterPump(ctx, x, y, open = false) {
      ctx.beginPath();
      ctx.scale(1, 0.5);
      ctx.arc(x, y * 2, 20, 0, 2 * Math.PI, false);
      ctx.scale(1, 2);
      ctx.stroke();
      if (open) ctx.fillStyle = '#67C23A';
      else ctx.fillStyle = '#F56C6C';
      ctx.fill();
      ctx.beginPath();
      ctx.lineWidth = 2.0;
      ctx.moveTo(x, y + 10);
      ctx.lineTo(x, y + 50);
      ctx.stroke();
    },
    // 绘制阀门
    drawValve(ctx, x, y, open = false) {
      ctx.beginPath();
      ctx.scale(0.5, 1);
      ctx.arc(x * 2, y, 15, 0, 2 * Math.PI, false);
      ctx.scale(2, 1);
      ctx.stroke();
      if (open) ctx.fillStyle = '#67C23A';
      else ctx.fillStyle = '#F56C6C';
      ctx.fill();
      ctx.beginPath();
      ctx.lineWidth = 2.0;
      ctx.moveTo(x + 7.5, y);
      ctx.lineTo(x + 40, y);
      ctx.stroke();
    },
    // 绘制搅拌器
    drawStirrer(ctx, x, y, open = false) {
      ctx.beginPath();
      ctx.lineWidth = 4.0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (open) ctx.strokeStyle = '#67C23A';
      else ctx.strokeStyle = '#F56C6C';
      ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x, y - 10);
      ctx.quadraticCurveTo(x + 10, y - 10, x + 10, y);
      ctx.moveTo(x, y + 5);
      ctx.lineTo(x, y + 10);
      ctx.quadraticCurveTo(x - 10, y + 10, x - 10, y);
      ctx.stroke();
      ctx.lineWidth = 1.0;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.strokeStyle = 'black';
    },

    drawWithState(mainPipeState, addWaterPipeState, valve, stirrer) {
      const canvas = document.getElementById('tutorial');
      if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const mainPipe = new Path2D();
        mainPipe.rect(40, 70, 560, 30);
        if (mainPipeState) ctx.fillStyle = '#67C23A';
        else ctx.fillStyle = '#F56C6C';
        ctx.fill(mainPipe);
        const addWaterPipe = new Path2D();
        addWaterPipe.moveTo(10, 100);
        addWaterPipe.lineTo(10, 330);
        addWaterPipe.quadraticCurveTo(10, 400, 70, 400);
        addWaterPipe.lineTo(600, 400);
        addWaterPipe.lineTo(600, 370);
        addWaterPipe.lineTo(70, 370);
        addWaterPipe.quadraticCurveTo(40, 370, 40, 330);
        addWaterPipe.lineTo(40, 100);
        addWaterPipe.lineTo(10, 100);
        if (addWaterPipeState) ctx.fillStyle = '#67C23A';
        else ctx.fillStyle = '#F56C6C';
        ctx.fill(addWaterPipe);

        this.drawValve(ctx, 115, 130, valve[0]);
        this.drawValve(ctx, 115, 340, valve[1]);
        this.drawValve(ctx, 245, 130, valve[2]);
        this.drawValve(ctx, 245, 340, valve[3]);
        this.drawValve(ctx, 375, 130, valve[4]);
        this.drawValve(ctx, 375, 340, valve[5]);
        this.drawValve(ctx, 505, 130, valve[6]);
        this.drawValve(ctx, 505, 340, valve[7]);

        this.drawWaterPump(ctx, 580, 55, valve[8]);

        this.drawStirrer(ctx, 140, 260, stirrer[0]);
        this.drawStirrer(ctx, 270, 260, stirrer[1]);
        this.drawStirrer(ctx, 400, 260, stirrer[2]);
        this.drawStirrer(ctx, 530, 260, stirrer[3]);
      }
    },
  },
  mounted() {
    this.$db.element.loadDatabase();
    this.$db.pageHome.loadDatabase();
    // this.$db.pageHome.findOne({}, (err, doc) => {
    //   this.element = doc.element;
    //   this.relay = doc.relay;
    // });
    this.$db.element.findOne({}).sort({ dataTime: -1 }).exec((err, docs) => {
      console.log(docs);
    });
    this.drawInit();
    const valve = [true, false, true, true, true, true, true, true, false];
    const stirrer = [true, true, false, true];
    this.drawWithState(true, false, valve, stirrer);
  },
  beforeDestroy() {
    this.$db.pageHome.remove({}, { multi: true });
    this.$db.pageHome.insert({
      element: this.element,
      relay: this.relay,
      dataTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    });
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 99.9%;
  .pipeline-state {
    height: 480px;
    .el-card {
      height: 480px;
    }
  }
  .element {
    height: 160px;
    font-size: 0.9em;
    .el-card {
      height: 160px;
    }
  }
  .irrigated-area {
    height: 380px;
    .el-card {
      height: 380px;
    }
    .el-pagination {
      margin-left: 0;
      padding-left: 0;
    }
  }
  .alarm-information {
    height: 260px;
    .el-card {
      height: 260px;
    }
  }
}
</style>
