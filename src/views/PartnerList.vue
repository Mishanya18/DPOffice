<template>
  <el-table :data="gridDataPartner" @cell-click="linkToPage">
    <el-table-column prop="name" label="Имя" min-width="150"></el-table-column>
    <el-table-column
      prop="deal_num"
      label="Номер договора"
      min-width="150"
    ></el-table-column>
    <el-table-column
      prop="deal_date"
      label="Дата договора"
      min-width="150"
    ></el-table-column>
    <el-table-column
      prop="manager"
      label="Ответственный"
      min-width="150"
    ></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "partner-list",
  methods: {
    linkToPage(cell) {
      this.$router.push({ path: "partner/" + cell.name });
    },
  },
  computed: {
    gridDataPartner() {
      return this.$store.getters.postsGridData;
    },
  },
  async mounted() {
    if (Object.keys(this.$store.getters.usersData).length == 0) {
      await this.$store.dispatch("getUsersFromBitrix");
      await this.$store.dispatch("getPostavshicsFromBitrix");
    } else {
      this.$store.dispatch("getPostavshicsFromBitrix");
    }
  },
};
</script>
