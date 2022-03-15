<template>
  <el-table :data="data" height="84vh">
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
  data() {
    return {};
  },
  props: ["data"],
};
</script>

<style scoped></style>
