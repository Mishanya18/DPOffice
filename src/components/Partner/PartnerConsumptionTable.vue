<template>
  <el-row>
    <el-table :data="reportData" style="width: 100%">
      <el-table-column prop="code" label="Клиент" min-width="150" />
      <el-table-column prop="cpu" label="CPU" min-width="80" />
      <el-table-column prop="ram" label="RAM" min-width="80" />
      <el-table-column prop="ssd" label="SSD" min-width="80" />
      <el-table-column prop="sas" label="SAS" min-width="80" />
      <el-table-column prop="sata" label="SATA" min-width="80" />
    </el-table>
  </el-row>
</template>

<script>
function GetContent(obj) {
  for (var key in obj) {
    var value = obj[key];
  }
  return value;
}

export default {
  props: ["date"],
  data() {
    return {
      reportData: [],
    };
  },
  computed: {
    month() {
      this.getTableData();
      return this.date;
    },
  },
  methods: {
    getTableData() {
      this.reportData = [];
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=49&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_287]=" +
          this.$route.params.partnerName +
          "&FILTER[PROPERTY_293]=" +
          this.date
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          for (let i = 0; i < data.total; i++) {
            let clientConsumpt = {
              ID: data.result[i].ID,
              code: data.result[i].NAME,
              cpu: GetContent(data.result[i].PROPERTY_288),
              ram: GetContent(data.result[i].PROPERTY_289),
              ssd: GetContent(data.result[i].PROPERTY_290),
              sas: GetContent(data.result[i].PROPERTY_291),
              sata: GetContent(data.result[i].PROPERTY_292),
            };
            this.reportData.push(clientConsumpt);
          }
        });
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>
