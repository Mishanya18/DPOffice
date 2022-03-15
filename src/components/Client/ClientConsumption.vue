<template>
  <el-container direction="vertical">
    <el-row type="flex" align="middle">
      <el-col :span="23">
        <el-date-picker
          v-model="month"
          type="month"
          format="MM.YYYY"
          :disabled-date="disabledDate"
          placeholder="Выберите месяц"
          size="small"
          @change="dateCalculate"
          style="width: 170px;"
        >
        </el-date-picker>
        <span class="label-style ms-3">Начало периода:</span>
        <span class="value-style">{{ periodStartDate }}</span>
        <span class="label-style ms-3">Конец периода:</span>
        <span class="value-style">{{ periodEndDate }}</span>
        <span class="label-style ms-3">Число часов в периоде:</span>
        <span class="value-style">{{ hours }}</span>
      </el-col>
      <el-col :span="1">
        <el-dropdown trigger="click">
          <span>
            <i class="el-icon-more icon"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-row>
                <el-button type="text" class="link" @click="handleExcelExport">
                  <el-dropdown-item class="dropdown-item">
                    Экспорт в Excel
                  </el-dropdown-item>
                </el-button>
              </el-row>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>

    <el-row>
      <el-table
        :data="gridDataReportClient"
        style="width: 100%"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column
          prop="start_date_deal"
          label="Начало по договору"
          min-width="170"
        >
        </el-table-column>
        <el-table-column
          prop="start_date_period"
          label="Начало периода"
          min-width="135"
        >
        </el-table-column>
        <el-table-column
          prop="end_date_period"
          label="Конец периода"
          min-width="125"
        >
        </el-table-column>
        <el-table-column
          prop="service_short_name"
          label="Услуга"
          min-width="100"
        >
          <template #default="scope">
            <span class="text">{{ scope.row.service_short_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="service_full_name"
          label="Название услуги"
          min-width="140"
        >
        </el-table-column>
        <el-table-column
          prop="service_cost"
          label="Цена за ед."
          min-width="100"
        >
        </el-table-column>
        <el-table-column prop="sale" label="Дисконт" min-width="80">
        </el-table-column>
        <el-table-column
          prop="cost_sale"
          label="Цена с дисконтом"
          min-width="145"
        >
        </el-table-column>
        <el-table-column prop="amount" label="Объем за период" min-width="145">
        </el-table-column>
        <el-table-column prop="summa" label="Стоимость" min-width="145">
          <template #default="scope">
            <span>{{ formatPrice(scope.row.summa.toString()) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-container>
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

function GetContent(obj) {
  for (var key in obj) {
    var value = obj[key];
  }
  return value;
}

export default {
  data() {
    return {
      clientBilling: {},
      periodStartDate: "",
      periodEndDate: "",
      month: "",
      hours: 0,
      clientCode: "",
      clientService: [],
      gridDataReportClient: [],
      summa: 0,
      disabledDate(time) {
        let date = new Date();
        let d = new Date(date.getFullYear(), date.getMonth(), 0);
        return time.getTime() > d;
      },
    };
  },
  methods: {
    getClientBilling() {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=43&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_278]=" +
          formatDate(this.month, "mm.yyyy") +
          "&FILTER[NAME]=" +
          this.clientCode.toLowerCase()
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.result.length != 0) {
            let clientBilling = {
              ID: data.result[0].ID,
              code: data.result[0].NAME,
              cpu: GetContent(data.result[0].PROPERTY_229),
              ram: GetContent(data.result[0].PROPERTY_230),
              sata: GetContent(data.result[0].PROPERTY_231),
              sas: GetContent(data.result[0].PROPERTY_232),
              ssd: GetContent(data.result[0].PROPERTY_233),
            };
            return clientBilling;
          } else {
            let clientBilling = {};
            return clientBilling;
          }
        });
    },
    dateCalculate() {
      let dateStr = formatDate(this.month, "mm.yyyy").split(".");
      let date = new Date(dateStr[1], dateStr[0] - 1);
      this.periodStartDate = formatDate(
        new Date(date.getFullYear(), date.getMonth(), 1),
        "dd.mm.yyyy"
      );
      this.periodEndDate = formatDate(
        new Date(date.getFullYear(), date.getMonth() + 1, 0),
        "dd.mm.yyyy"
      );
      this.hours =
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() * 24;
      this.getClientBilling().then((res) => {
        this.clientBilling = res;
        if (Object.keys(this.clientBilling).length != 0) {
          this.cookGridData();
        } else {
          this.gridDataReportClient = [];
        }
      });
    },
    cookGridData() {
      this.summa = 0;
      this.gridDataReportClient = [];
      this.clientService.forEach((service) => {
        //Вычисление даты начала пользования услугой в отчетном периоде
        let serviceStarts;
        let serviceEnds;
        let periodStartArr = this.periodStartDate.split(".");
        let serviceStartArr = service.startDateTime.split(" ")[0].split(".");
        let periodStartDate = new Date(
          periodStartArr[2],
          periodStartArr[1] - 1,
          periodStartArr[0]
        );
        let serviceStartDate = new Date(
          serviceStartArr[2],
          serviceStartArr[1] - 1,
          serviceStartArr[0]
        );
        let startDate;
        if (serviceStartDate < periodStartDate) {
          startDate = this.periodStartDate;
          serviceStarts = periodStartDate;
        } else {
          startDate = service.startDateTime;
          serviceStarts = serviceStartDate;
        }
        //Вычисление даты конца пользования услугой в отчетном периоде
        let endDate;
        if (service.endDateTime) {
          let periodEndArr = this.periodEndDate.split(".");
          let serviceEndArr = service.endDateTime.split(" ")[0].split(".");
          let periodEndDate = new Date(
            periodEndArr[2],
            periodEndArr[1] - 1,
            periodEndArr[0]
          );
          let serviceEndDate = new Date(
            serviceEndArr[2],
            serviceEndArr[1] - 1,
            serviceEndArr[0]
          );
          if (serviceEndDate > periodEndDate) {
            endDate = this.periodEndDate;
            serviceEnds = periodEndDate;
          } else {
            endDate = service.endDateTime;
            serviceEnds = serviceEndDate;
          }
        } else {
          endDate = this.periodEndDate;
          let periodEndArr = this.periodEndDate.split(".");
          let periodEndDatE = new Date(
            periodEndArr[2],
            periodEndArr[1] - 1,
            periodEndArr[0]
          );
          serviceEnds = periodEndDatE;
        }
        let partnerService;
        this.$store
          .dispatch("getReportPagePartnerService", service.service_id)
          .then((res) => {
            partnerService = res;
            let price = partnerService.PRICE;
            //Вычисление цены с учётом дисконта
            let costAfterSale = price - (price / 100) * service.sale;
            //Вычисление количества потребленной услуги в отчетном периоде
            let amount;
            if (service.billing === "95") {
              amount = this.clientBilling[
                service.name.toLowerCase().split(" ")[0]
              ];
            } else {
              amount = service.amount;
            }
            //Вычисление часов пользования услугой
            let reportingHours =
              (serviceEnds - serviceStarts) / 1000 / 60 / 60 + 24;
            //Вычисление множителя в зависимости биллинга услуги месяц/час
            let amount_multiplier;
            if (reportingHours <= 0) {
              amount_multiplier = 0;
            } else if (service.unit.split("/")[1] === "час") {
              amount_multiplier = reportingHours;
            } else {
              amount_multiplier = 1;
            }
            //Округление до 3-х знаков после запятой
            // costAfterSale = Math.round(costAfterSale * 1000) / 1000;
            // amount = Math.round(amount * 1000) / 1000;
            //Вычисление суммы, удерживаемое с клиента за пользование услугой в отчётном периоде
            let summ = costAfterSale * amount * amount_multiplier;
            this.summa += summ;
            // summ = summ.toFixed(2);
            summ = Math.round(summ * 100) / 100;
            //Создание строки таблицы для потребленной услуги
            const clientReport = {
              start_date_deal: service.startDateTime.split(" ")[0],
              start_date_period: startDate.split(" ")[0],
              end_date_period: endDate,
              service_short_name: partnerService.NAME,
              service_full_name: partnerService.FULL_NAME,
              service_cost: price,
              sale: service.sale + "%",
              cost_sale: Math.round(costAfterSale * 1000) / 1000,
              amount: Math.round(amount * 1000) / 1000,
              summa: summ,
            };
            this.gridDataReportClient.push(clientReport);
          });
      });
    },
    getSummaries(param) {
      const { columns } = param;
      const sum = [];
      sum[0] = "Сумма";
      sum[columns.length - 1] = this.formatPrice(this.summa.toFixed(2));
      return sum;
    },
    handleExcelExport() {
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "Начало по договору",
          "Начало периода",
          "Конец периода",
          "Услуга",
          "Название услуги",
          "Цена за ед.",
          "Дисконт",
          "Цена с дисконтом",
          "Объем за период",
          "Стоимость",
        ];
        const filterVal = [
          "start_date_deal",
          "start_date_period",
          "end_date_period",
          "service_short_name",
          "service_full_name",
          "service_cost",
          "sale",
          "cost_sale",
          "amount",
          "summa",
        ];
        const data = this.formatJson(filterVal, this.gridDataReportClient);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            this.clientCode +
            " " +
            formatDate(this.month, "mm.yyyy") +
            " " +
            "report",
          autoWidth: false,
          bookType: "xlsx",
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    formatPrice(price) {
      if (price > 999) {
        var priceArray = price.split("").reverse();
        var index = 3;
        while (priceArray.length > index + 3) {
          priceArray.splice(index + 3, 0, " ");
          index += 4;
        }
        return priceArray.reverse().join("") + " ₽";
      } else {
        return price + " ₽";
      }
    },
  },
  async mounted() {
    let date = new Date();
    this.month = new Date(date.getFullYear(), date.getMonth(), 0);
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

    this.clientCode = this.$route.params.clientCode;
    await this.$store.dispatch("getClientsServsFromBitrix", {
      client_code: this.clientCode,
    });
    this.clientBilling = await this.getClientBilling();
    this.clientService = await this.$store.dispatch(
      "getReportPageService",
      this.clientCode
    );
    if (Object.keys(this.clientBilling).length != 0) {
      this.cookGridData();
    }
  },
};
</script>

<style scoped>
.label-style {
  font-size: 15px;
  color: #606266;
  padding-right: 10px;
}
.value-style {
  font-size: 14px;
  color: #606266;
}
.text {
  overflow-wrap: normal;
  word-wrap: normal;
  word-break: normal !important;
  line-break: auto;
  hyphens: manual;
}
.icon {
  font-size: 28px;
}
.link {
  font-size: 15px;
  color: #606266;
  width: 180px;
  padding: 0px;
}
</style>
