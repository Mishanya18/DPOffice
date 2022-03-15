<template>
  <el-dialog title="Экспорт Excel" v-model="dialogFormVisible">
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
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Cancel</el-button>
        <el-button type="primary" @click="generateReport">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
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
  props: ["clientCode", "visible"],
  emits: ["dialogClose"],
  data() {
    return {
      clientsBillings: [],
      gridDataReportClient: [],
      clientsServices: [],
      periodStartDate: "",
      periodEndDate: "",
      month: "",
      hours: 0,
      summa: 0,
      dialogFormVisible: this.visible,
      disabledDate(time) {
        let date = new Date();
        let d = new Date(date.getFullYear(), date.getMonth(), 0);
        return time.getTime() > d;
      },
    };
  },
  methods: {
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    handleExcelExport() {
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "Начало по договору",
          "Начало периода",
          "Конец периода",
          "Клиент",
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
          "code",
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
          filename: formatDate(this.month, "mm.yyyy") + " " + "SummaryReport",
          autoWidth: false,
          bookType: "xlsx",
        });
      });
    },
    cookGridData(clientService, clientBilling, clientCode) {
      this.summa = 0;
      let servicesProcessed = 0;
      clientService.forEach((service) => {
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
          if (serviceEndDate < periodEndDate) {
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
            //Определение цены
            let price = partnerService.PRICE;
            //Вычисление цены с учётом дисконта
            let costAfterSale = price - (price / 100) * service.sale;
            //Вычисление количества потребленной услуги в отчетном периоде
            let amount;
            if (service.billing === "95") {
              amount = clientBilling[service.name.toLowerCase().split(" ")[0]];
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
              code: clientCode,
              service_short_name: partnerService.NAME,
              service_full_name: partnerService.FULL_NAME,
              service_cost: price,
              sale: service.sale + "%",
              cost_sale: Math.round(costAfterSale * 1000) / 1000,
              amount: Math.round(amount * 1000) / 1000,
              summa: summ,
            };
            this.gridDataReportClient.push(clientReport);
            if (servicesProcessed == clientService.length - 1) {
              this.gridDataReportClient.push(NaN);
            }
            servicesProcessed++;
          });
      });
    },
    getClientBilling(clientCode) {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=43&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_278]=" +
          formatDate(this.month, "mm.yyyy") +
          "&FILTER[NAME]=" +
          clientCode.toLowerCase()
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
    dialogClose() {
      this.$emit("dialogClose");
    },
    async fillClientsInfo(clients) {
      this.clientsBillings = [];
      this.clientsServices = [];
      for (const client of clients) {
        let clientBilling;
        let clientService;
        await this.$store.dispatch("getClientsServsFromBitrix", {
          client_code: client,
        });
        clientBilling = await this.getClientBilling(client);
        clientService = await this.$store.dispatch(
          "getReportPageService",
          client
        );
        this.clientsBillings.push(clientBilling);
        this.clientsServices.push(clientService);
      }
    },
    generateReport() {
      this.gridDataReportClient = [];
      let i = 0;
      this.clientCode.forEach((client) => {
        this.cookGridData(
          this.clientsServices[i],
          this.clientsBillings[i],
          client
        );
        i++;
      });
      this.handleExcelExport();
      this.$emit("dialogClose");
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
      this.fillClientsInfo(this.clientCode);
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
    this.fillClientsInfo(this.clientCode);
  },
};
</script>

<style scoped></style>
