<template>
  <el-row :gutter="12">
    <el-col :span="12">
      <el-card class="mar-element" shadow="always">
        <consumption-chart />
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="mar-element" shadow="always">
        <consumption-compare-table />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import ConsumptionChart from "./components/ConsumptionChart.vue";
import ConsumptionCompareTable from "./components/ConsumptionCompareTable.vue";

export default {
  components: {
    ConsumptionCompareTable,
    ConsumptionChart,
  },
};
</script>

<style scoped>
.mar-element {
  margin: 12px;
}
</style>
