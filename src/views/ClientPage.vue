<template>
  <el-table
    :data="gridClientServicesData"
    @selection-change="handleSelectionChange"
    ref="multipleTable"
    @row-click="showEditDialogForm"
  >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column
      prop="name"
      label="Название"
      min-width="100"
    ></el-table-column>
    <el-table-column
      prop="startDateTime"
      label="Начало"
      min-width="100"
    ></el-table-column>
    <el-table-column
      prop="endDateTime"
      label="Окончание"
      min-width="100"
    ></el-table-column>
    <el-table-column
      prop="unit"
      label="Ед. изм."
      min-width="100"
    ></el-table-column>
    <el-table-column
      prop="amount"
      label="Количество"
      min-width="110"
    ></el-table-column>
    <el-table-column
      prop="sale"
      label="Дисконт"
      min-width="80"
    ></el-table-column>
    <el-table-column
      prop="post"
      label="Партнер"
      min-width="90"
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
  computed: {
    gridClientServicesData() {
      return this.$store.getters.clientServicesData(
        this.$route.params.clientCode
      );
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
    },
  },
  async created() {
    if (this.$store.getters.servicvesData.length == 0) {
      await this.$store.dispatch("getServicesFromBitrix");
    }
    if (this.$store.getters.dcsData.length == 0) {
      await this.$store.dispatch("getDCFromBitrix");
    }
    if (this.$store.getters.postsData.length == 0) {
      await this.$store.dispatch("getPostavshicsFromBitrix");
    }
    await this.$store.dispatch("getClientsServsFromBitrix", {
      client_code: this.$route.params.clientCode,
    });
    // this.getClientNameParams();
  },
};
</script>

<style scoped>
.text {
  overflow-wrap: normal;
  word-wrap: normal;
  word-break: normal;
  line-break: auto;
  hyphens: manual;
}
</style>
