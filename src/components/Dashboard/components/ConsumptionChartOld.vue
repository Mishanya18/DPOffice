<template>
  <p class="title">Потребление Online услуг</p>
  <v-chart class="chart" autoresize :option="option" />
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

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

function getO2Billing(month, clientCode) {
  return fetch(
    "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=43&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_278]=" +
      month +
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
          cpu:
            Math.round(GetContent(data.result[0].PROPERTY_229) * 1000) / 1000,
          ram:
            Math.round(GetContent(data.result[0].PROPERTY_230) * 1000) / 1000,
          sata:
            Math.round(GetContent(data.result[0].PROPERTY_231) * 1000) / 1000,
          sas:
            Math.round(GetContent(data.result[0].PROPERTY_232) * 1000) / 1000,
          ssd:
            Math.round(GetContent(data.result[0].PROPERTY_233) * 1000) / 1000,
        };
        return clientBilling;
      } else {
        let clientBilling = {};
        return clientBilling;
      }
    });
}

export default defineComponent({
  name: "Consumption Chart",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "vintage",
  },
  setup() {
    let date = new Date();
    let monthsArray = [];
    const data = ref({
      cpu: [],
      ram: [],
      ssd: [],
      sas: [],
      sata: [],
    });
    for (let index = 0; index < 6; index++) {
      monthsArray.unshift(
        formatDate(
          new Date(date.getFullYear(), date.getMonth() - index, 0),
          "mm.yyyy"
        )
      );
    }

    const route = useRoute();

    async function bils() {
      monthsArray.forEach(async (month) => {
        await getO2Billing(month, route.params.clientCode).then((res) => {
          data.value.cpu.push(res.cpu);
          data.value.ram.push(res.ram);
          data.value.ssd.push(res.ssd);
          data.value.sas.push(res.sas);
          data.value.sata.push(res.sata);
        });
      });
    }

    onMounted(bils);

    const option = ref({
      tooltip: {},
      legend: {
        data: ["CPU", "RAM", "SSD", "SAS", "SATA"],
      },
      xAxis: {
        type: "category",
        data: monthsArray,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "CPU",
          data: data.value.cpu,
          type: "bar",
        },
        {
          name: "RAM",
          data: data.value.ram,
          type: "bar",
        },
        {
          name: "SSD",
          data: data.value.ssd,
          type: "bar",
        },
        {
          name: "SAS",
          data: data.value.sas,
          type: "bar",
        },
        {
          name: "SATA",
          data: data.value.sata,
          type: "bar",
        },
      ],
    });

    return { option };
  },
  data() {
    return {
      monthsArray: [],
    };
  },
  methods: {
    monthCalc() {
      let date = new Date();
      for (let index = 0; index < 6; index++) {
        this.monthsArray.push(
          formatDate(
            new Date(date.getFullYear(), date.getMonth() - index, 0),
            "mm.yyyy"
          )
        );
      }
    },
  },
});
</script>

<style scoped>
.chart {
  min-height: 450px;
  min-width: 450px;
}
.title {
  text-align: center;
  font-size: 23px;
}
</style>
