<template>
  <div class="app-container">
    <el-upload style="height: 5%;width: 100%"
        ref="upload"
        action="#"
        :auto-upload="false"
       :limit="1"
       :on-exceed="handleExceed"
        :before-upload="handleBeforeUpload"
        :on-change="handleChange">
      <el-button size="small" type="primary" style="margin:10px 0 0 10px">选择文件</el-button>
<!--      <el-button size="small" type="success" @click="submitUpload">上传</el-button>-->
    </el-upload>
    <div ref="chart" style="width: 100%;height: 95%"></div>
  </div>
</template>

<script>
import 'element-plus/dist/index.css';
import {ElUpload, ElButton, ElTable, ElTableColumn, genFileId} from 'element-plus';
import {useRouter} from "vue-router";
import * as echarts from "echarts";
import 'echarts-gl';
import {ref} from "vue";

export default {
  name:'Upload',
  components: {
    ElUpload,
    ElButton,
    ElTable,
    ElTableColumn
  },
  data() {
    return {
      echartOptions:{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis3D: {
          type: 'time',
          name: '运行时间'
        },
        yAxis3D: {
          type: 'category',
          name: '传感器',
          data: [],
          axisLabel:{
            interval:0
          }
        },
        zAxis3D: {
          type: 'value',
          name: 'Value'
        },
        grid3D: {
          boxDepth:300,
          viewControl: {
            projection:'orthographic',
            autoRotate:false,
            autoRotateSpeed:10
          }
        },
        series: []
      }
    }

  },
  setup() {
    const router = useRouter();
    const handleBeforeUpload = (file) => {
      console.log('File to upload:', file.name);
      return true;
    };
    const upload = ref(null)

    const handleExceed = (files) => {
      upload.value.clearFiles()
      const file = files[0]
      file.uid = Date.now().toString() // 简化了 genFileId 的替代
      upload.value.handleStart(file)
    }
    return {upload,handleBeforeUpload,handleExceed};
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    // this.chart.setOption(this.echartOptions);
  },
  methods: {
    updateMychart(category,series){
      this.echartOptions.yAxis3D.data = category
      this.echartOptions.series = series.map((item, index)=>{
        return {
          type: 'line3D',
          data: item,
          lineStyle: {
            width: 4
          },
          large: true,
          largeThreshold: 2000
        }
      })
      console.log('开始绘图')
      this.chart.setOption(this.echartOptions);
    },
    handleChange:function(file, fileList){
      const reader = new FileReader();
      reader.onload = (e) =>{
        const data = e.target.result;
        const lines = data.split('\n').map(line => line.split(','));
        const result = [];
        const tmpCategoryData = [];
        const tmpSeriesData = [];
        console.log(lines[0])
        const headers = lines[0].slice(0,lines[0].length-1)
        headers.forEach((item) => {
          tmpCategoryData.push(item)
          tmpSeriesData.push([])
        })
        const dataLines = lines.slice(1,lines.length-1)
        dataLines.forEach((cols, lineIndex) => {
          const timestamp = cols.pop(); // 获取最后一个元素作为时间戳
          cols.forEach((col, colIndex) => {
            tmpSeriesData[colIndex].push([timestamp,tmpCategoryData[colIndex],col.trim()])
          });

        });
        this.updateMychart(tmpCategoryData,tmpSeriesData)
      };
      reader.readAsText(file.raw);
    }
  }
}
</script>

<style scoped>
.app-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f0f0f0;
}
</style>
