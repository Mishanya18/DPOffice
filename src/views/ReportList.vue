<template>
  <div>
    <el-table
      :data="gridDataReportClients"
      @row-click="linkToPage"
      :row-style="rowStyle"
    >
      <el-table-column prop="client_name" label="Клиент" min-width="350">
        <template #default="scope">
          <span class="text">{{ scope.row.client_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_date_deal"
        label="Дата начала по договору"
        label-class-name="text"
        min-width="200"
      >
      </el-table-column>
      <el-table-column prop="deal_num" label="Договор" min-width="120">
      </el-table-column>
      <el-table-column prop="client_manager" label="Менеджер" min-width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      billing: [],
    };
  },
  computed: {
    gridDataReportClients() {
      let gridData = [];
      let clients = this.$store.getters.clientsData;
      let users = this.$store.getters.usersData;

      clients.forEach((element) => {
        const clientReport = {
          start_date_deal: element.DEAL_DATE,
          deal_num: element.DEAL_NUM,
          client_name: element.NAME,
          client_manager: users[element.MANAGER],
          code: element.CODE,
        };
        gridData.push(clientReport);
      });
      return gridData;
    },
  },
  methods: {
    linkToPage(cell) {
      this.$router.push({ path: "/reports/" + cell.code });
    },
    rowStyle() {
      return "cursor: pointer";
    },
  },
  mounted() {
    if (this.$store.getters.servicvesData) {
      this.$store.dispatch("getDCFromBitrix");
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
