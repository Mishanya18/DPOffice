<template>
  <el-container direction="vertical">
    <el-row type="flex" justify="end">
      <el-col :span="21">
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
      </el-col>
      <el-col :span="3">
        <upload-excel-component
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          v-if="right"
        />
        <el-dialog
          title="Загружаемые данные"
          v-model="dialogVisible"
          width="70%"
        >
          <el-row>
            <el-col :span="8">
              <el-date-picker
                v-model="periodForUpload"
                type="month"
                format="MM.YYYY"
                placeholder="Выберите отчётный месяц"
                size="small"
                style="width: 250px;"
              >
              </el-date-picker>
            </el-col>
            <el-col :span="8">
              <el-button
                type="danger"
                size="small"
                v-if="showDeleteButton"
                @click="deleteRow()"
              >
                Удалить клиента
              </el-button>
            </el-col>
          </el-row>
          <el-row
            ><el-col
              ><el-table
                :data="tableData"
                border
                ref="multipleTable"
                style="width: 100%;margin-top:5px;"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column
                  v-for="item of tableHeader"
                  :key="item"
                  :prop="item.prop"
                  :label="item.label"
                /> </el-table></el-col
          ></el-row>
          <template #footer>
            <span class="dialog-footer">
              <el-button size="small" @click="dialogVisible = false"
                >Cancel</el-button
              >
              <upload-partner-billing
                :period="formatedPeriodForUpload"
                :data="tableData"
                :partner="partner"
                @dialog-close="dialogVisible = false"
              />
            </span>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <partner-consumption-table
          :key="consumptionTableKey"
          v-if="formatedMonth"
          :date="formatedMonth"
        />
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import UploadExcelComponent from "./UploadExcelComponent.vue";
import UploadPartnerBilling from "./UploadPartnerBilling.vue";
import PartnerConsumptionTable from "./PartnerConsumptionTable.vue";

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
  name: "UploadExcel",
  components: {
    UploadExcelComponent,
    UploadPartnerBilling,
    PartnerConsumptionTable,
  },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      resultInput: {},
      partner: this.$route.params.partnerName,
      dialogVisible: false,
      month: "",
      periodForUpload: "",
      formatedMonth: "",
      consumptionTableKey: 0,
      showDeleteButton: false,
      multipleSelection: [],
      disabledDate(time) {
        let date = new Date();
        let d = new Date(date.getFullYear(), date.getMonth(), 0);
        return time.getTime() > d;
      },
    };
  },
  computed: {
    formatedPeriodForUpload() {
      if (this.periodForUpload) {
        return formatDate(this.periodForUpload, "mm.yyyy");
      } else {
        return null;
      }
    },
    right() {
      return this.$store.getters.isLogged;
    },
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      this.cutNames();
      this.handleInput();
    },
    cutNames() {
      this.tableData.forEach((element) => {
        element.ResPool = element.ResPool.split("_")[0];
      });
    },
    handleInput() {
      this.resultInput = {};
      this.tableData.forEach((element) => {
        if (this.resultInput[element.ResPool]) {
          if (element.State) {
            this.resultInput[element.ResPool].cpu += element["CPU conf"];
            this.resultInput[element.ResPool].ram += element["RAM(MB) conf"];
            this.resultInput[element.ResPool].ssd += element["SSD(MB) conf"];
            this.resultInput[element.ResPool].sas += element["SAS(MB) conf"];
            this.resultInput[element.ResPool].sata += element["SATA(MB) conf"];
          } else {
            this.resultInput[element.ResPool].ssd += element["SSD(MB) conf"];
            this.resultInput[element.ResPool].sas += element["SAS(MB) conf"];
            this.resultInput[element.ResPool].sata += element["SATA(MB) conf"];
          }
        } else {
          this.resultInput[element.ResPool] = {
            name: element.ResPool,
            cpu: element["CPU conf"],
            ram: element["RAM(MB) conf"],
            ssd: element["SSD(MB) conf"],
            sas: element["SAS(MB) conf"],
            sata: element["SATA(MB) conf"],
          };
        }
      });
      this.tableHeader = [
        { prop: "name", label: "Клиент" },
        { prop: "cpu", label: "CPU" },
        { prop: "ram", label: "RAM" },
        { prop: "ssd", label: "SSD" },
        { prop: "sas", label: "SAS" },
        { prop: "sata", label: "SATA" },
      ];
      this.tableData = [];
      for (
        let index = 0;
        index < Object.keys(this.resultInput).length;
        index++
      ) {
        this.resultInput[Object.keys(this.resultInput)[index]].cpu =
          Math.round(
            this.resultInput[Object.keys(this.resultInput)[index]].cpu * 1000
          ) / 1000;
        this.resultInput[Object.keys(this.resultInput)[index]].ram =
          Math.round(
            this.resultInput[Object.keys(this.resultInput)[index]].ram * 1000
          ) / 1000;
        this.resultInput[Object.keys(this.resultInput)[index]].ssd =
          Math.round(
            this.resultInput[Object.keys(this.resultInput)[index]].ssd * 1000
          ) / 1000;
        this.resultInput[Object.keys(this.resultInput)[index]].sas =
          Math.round(
            this.resultInput[Object.keys(this.resultInput)[index]].sas * 1000
          ) / 1000;
        this.resultInput[Object.keys(this.resultInput)[index]].sata =
          Math.round(
            this.resultInput[Object.keys(this.resultInput)[index]].sata * 1000
          ) / 1000;
        this.tableData.push(
          this.resultInput[Object.keys(this.resultInput)[index]]
        );
      }
      this.dialogVisible = true;
    },
    dateChange() {
      this.formatedMonth = formatDate(this.month, "mm.yyyy");
      this.consumptionTableKey += 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
    },
    deleteRow() {
      this.multipleSelection.forEach((element) => {
        const index = this.tableData.indexOf(element);
        if (index > -1) {
          this.tableData.splice(index, 1);
        }
      });
    },
  },
  async mounted() {
    let date = new Date();
    this.month = new Date(date.getFullYear(), date.getMonth(), 0);
    this.periodForUpload = new Date(date.getFullYear(), date.getMonth(), 0);
    this.formatedMonth = formatDate(
      new Date(date.getFullYear(), date.getMonth(), 0),
      "mm.yyyy"
    );
  },
};
</script>
