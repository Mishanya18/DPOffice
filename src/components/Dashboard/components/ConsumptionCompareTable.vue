<template>
  <p class="title">Сравнение потребления</p>
  <el-date-picker
    v-model="month"
    type="month"
    format="MM.YYYY"
    :disabled-date="disabledDate"
    placeholder="Выберите месяц"
    @change="dateChange"
    size="small"
    style="width: 170px;"
  >
  </el-date-picker>
  <el-row>
    <el-col :span="24">
      <el-table :data="tableData">
        <el-table-column prop="service" label="Услуга" min-width="100">
        </el-table-column>
        <el-table-column prop="o2" label="O2" min-width="100">
        </el-table-column>
        <el-table-column prop="stack" label="Stack" min-width="100">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
function GetContent(obj) {
  for (var key in obj) {
    var value = obj[key];
  }
  return value;
}

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
      month: "",
      tableData: [],
      disabledDate(time) {
        let date = new Date();
        let d = new Date(date.getFullYear(), date.getMonth(), 0);
        return time.getTime() > d;
      },
    };
  },
  methods: {
    getO2Billing() {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=43&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_278]=" +
          formatDate(this.month, "mm.yyyy") +
          "&FILTER[NAME]=" +
          this.$route.params.clientCode.toLowerCase()
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.result.length != 0) {
            let clientBilling = {
              ID: data.result[0].ID,
              code: data.result[0].NAME,
              cpu:
                Math.round(GetContent(data.result[0].PROPERTY_229) * 1000) /
                1000,
              ram:
                Math.round(GetContent(data.result[0].PROPERTY_230) * 1000) /
                1000,
              sata:
                Math.round(GetContent(data.result[0].PROPERTY_231) * 1000) /
                1000,
              sas:
                Math.round(GetContent(data.result[0].PROPERTY_232) * 1000) /
                1000,
              ssd:
                Math.round(GetContent(data.result[0].PROPERTY_233) * 1000) /
                1000,
            };
            return clientBilling;
          } else {
            let clientBilling = {};
            return clientBilling;
          }
        });
    },
    getStackData() {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=49&IBLOCK_TYPE_ID=lists&FILTER[NAME]=" +
          this.$route.params.clientCode +
          "&FILTER[PROPERTY_293]=" +
          formatDate(this.month, "mm.yyyy")
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.result.length != 0) {
            let clientConsumpt = {
              ID: data.result[0].ID,
              code: data.result[0].NAME,
              partner: GetContent(data.result[0].PROPERTY_287),
              cpu: GetContent(data.result[0].PROPERTY_288),
              ram:
                Math.round(
                  (GetContent(data.result[0].PROPERTY_289) / 1024) * 1000
                ) / 1000,
              ssd:
                Math.round(
                  (GetContent(data.result[0].PROPERTY_290) / 1024) * 1000
                ) / 1000,
              sas:
                Math.round(
                  (GetContent(data.result[0].PROPERTY_291) / 1024) * 1000
                ) / 1000,
              sata:
                Math.round(
                  (GetContent(data.result[0].PROPERTY_292) / 1024) * 1000
                ) / 1000,
            };
            return clientConsumpt;
          } else {
            let clientConsumpt = {};
            return clientConsumpt;
          }
        });
    },
    cookingData(o2Billing, stackBilling) {
      this.tableData = [
        {
          service: "CPU",
          o2: o2Billing.cpu,
          stack: stackBilling.cpu,
        },
        {
          service: "RAM",
          o2: o2Billing.ram,
          stack: stackBilling.ram,
        },
        {
          service: "SSD",
          o2: o2Billing.ssd,
          stack: stackBilling.ssd,
        },
        {
          service: "SAS",
          o2: o2Billing.sas,
          stack: stackBilling.sas,
        },
        {
          service: "SATA",
          o2: o2Billing.sata,
          stack: stackBilling.sata,
        },
      ];
    },
    async dateChange() {
      this.cookingData(await this.getO2Billing(), await this.getStackData());
    },
  },
  async mounted() {
    let date = new Date();
    this.month = new Date(date.getFullYear(), date.getMonth(), 0);
    this.cookingData(await this.getO2Billing(), await this.getStackData());
  },
};
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 23px;
}
</style>
