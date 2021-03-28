<template>
  <el-table :data="gridDataService">
    <el-table-column prop="name" label="Название" min-width="150">
      <template #default="scope">
        <span class="text">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="full_name"
      label="Полное наименование"
      show-overflow-tooltip
      min-width="300"
    >
    </el-table-column>
    <el-table-column
      prop="unit"
      label="Ед. изм."
      min-width="100"
    ></el-table-column>
    <el-table-column
      prop="price"
      label="Цена"
      min-width="100"
    ></el-table-column>
    <el-table-column
      prop="data_center"
      label="ЦОД"
      min-width="70"
    ></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "service-list",
  computed: {
    gridDataService() {
      return this.$store.getters.serviceGridData;
    },
  },
  async mounted() {
    if (Object.keys(this.$store.getters.dcsData).length == 0) {
      await this.$store.dispatch("getDCFromBitrix");
      await this.$store.dispatch("getServicesFromBitrix");
    } else {
      this.$store.dispatch("getServicesFromBitrix");
    }
  },
};
</script>

<style scoped>
.text {
  overflow-wrap: normal;
  word-wrap: normal;
  word-break: normal !important;
  line-break: auto;
  hyphens: manual;
}
</style>
