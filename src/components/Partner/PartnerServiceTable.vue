<template>
  <el-table
    :data="data"
    height="84vh"
    ref="multipleTable"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="45"> </el-table-column>
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
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      multipleSelection: [],
      showDeleteButton: false,
    };
  },
  props: ["data"],
  emits: ["showDelete", "hideDelete"],
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
        this.$emit("showDelete", this.multipleSelection);
      } else {
        this.showDeleteButton = false;
        this.$emit("hideDelete");
      }
    },
  },
};
</script>

<style scoped></style>
