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

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

export default {
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "vintage",
  },
  data() {
    return {
      date: new Date(),
      monthsArray: [],
      data: {
        cpu: [],
        ram: [],
        ssd: [],
        sas: [],
        sata: [],
      },
      option: {},
    };
  },
  async mounted() {
    for (let index = 0; index < 6; index++) {
      this.monthsArray.unshift(
        formatDate(
          new Date(this.date.getFullYear(), this.date.getMonth() - index, 0),
          "mm.yyyy"
        )
      );
    }
    this.Loading = true;
    let count = 0;
    let data = {
      cpu: [],
      ram: [],
      ssd: [],
      sas: [],
      sata: [],
    };
    for await (const month of this.monthsArray) {
      await fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=43&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_278]=" +
          month +
          "&FILTER[NAME]=" +
          this.$route.params.clientCode.toLowerCase()
      )
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          if (res.result.length != 0) {
            data.cpu.push(
              Math.round(GetContent(res.result[0].PROPERTY_229) * 1000) / 1000
            );
            data.ram.push(
              Math.round(GetContent(res.result[0].PROPERTY_230) * 1000) / 1000
            );
            data.ssd.push(
              Math.round(GetContent(res.result[0].PROPERTY_233) * 1000) / 1000
            );
            data.sas.push(
              Math.round(GetContent(res.result[0].PROPERTY_232) * 1000) / 1000
            );
            data.sata.push(
              Math.round(GetContent(res.result[0].PROPERTY_231) * 1000) / 1000
            );
          } else {
            data.cpu.push(0);
            data.ram.push(0);
            data.ssd.push(0);
            data.sas.push(0);
            data.sata.push(0);
          }
          count++;
          if (count == this.monthsArray.length) {
            this.option = {
              tooltip: {},
              legend: {
                data: ["CPU", "RAM", "SSD", "SAS", "SATA"],
              },
              xAxis: {
                type: "category",
                data: this.monthsArray,
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  name: "CPU",
                  data: data.cpu,
                  type: "bar",
                },
                {
                  name: "RAM",
                  data: data.ram,
                  type: "bar",
                },
                {
                  name: "SSD",
                  data: data.ssd,
                  type: "bar",
                },
                {
                  name: "SAS",
                  data: data.sas,
                  type: "bar",
                },
                {
                  name: "SATA",
                  data: data.sata,
                  type: "bar",
                },
              ],
            };
          }
          return res;
        });
    }
  },
};
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
