<template>
  <div>
    <el-table
      :data="gridDataReportClients"
      style="width: 100%"
      @row-click="linkToPage"
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
function formatDate(date, format) {
  let month;
  let day;
  if (date.getDate() < 10) {
    day = "0" + date.getDate();
  } else {
    day = date.getDate();
  }
  if (date.getMonth() + 1 < 10) {
    month = "0" + (date.getMonth() + 1);
  } else {
    month = date.getMonth() + 1;
  }
  const map = {
    dd: day,
    mm: month,
    yyyy: date.getFullYear(),
  };

  return format.replace(/dd|mm|yyyy/gi, (matched) => map[matched]);
}

export default {
  data() {
    return {
      // periodStartDate: "",
      // periodEndDate: "",
      // month: "",
      // hours: 0,
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
      // console.log(cell);
      this.$router.push({ path: "/reports/" + cell.code });
    },
  },
  mounted() {
    let date = new Date();
    this.month = formatDate(
      new Date(date.getFullYear(), date.getMonth(), 0),
      "mm.yyyy"
    );
    this.periodStartDate = formatDate(
      new Date(date.getFullYear(), date.getMonth() - 1, 1),
      "dd.mm.yyyy"
    );
    this.periodEndDate = formatDate(
      new Date(date.getFullYear(), date.getMonth(), 0),
      "dd.mm.yyyy"
    );
    this.hours =
      new Date(date.getFullYear(), date.getMonth(), 0).getDate() * 24;
    this.$store.dispatch("getBillsSectionsFromBitrix");
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
