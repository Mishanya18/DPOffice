<template>
  <el-dialog
    :title="form.title"
    v-model="dialogFormVisible"
    @close="dialogClose"
    width="50%"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formSvc"
      size="mini"
      label-position="top"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="Выберите ЦОД" prop="DC">
            <div class="block">
              <el-cascader
                placeholder="Найти ЦОД"
                :options="optionsDC"
                :disabled="form.isEditDialog"
                v-model="form.DC"
                @change="getDataCenters"
                filterable
                style="width: 100%;"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="Выберите услугу" prop="service">
            <el-select
              v-model="form.service"
              :disabled="form.isEditDialog"
              @change="toggleAmountVisible"
              filterable
              placeholder="Услуги"
              style="width: 100%;"
            >
              <el-option
                v-for="item in form.optionsServices"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Время начала оказания услуги"
            prop="startDateTime"
          >
            <el-date-picker
              v-model="form.startDateTime"
              type="date"
              placeholder="Выберите дату"
              format="DD.MM.YYYY"
              style="width: 100%;"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Время конца оказания услуги">
            <el-date-picker
              v-model="form.endDateTime"
              type="date"
              placeholder="Выберите дату"
              format="DD.MM.YYYY"
              style="width: 100%;"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Дисконт">
            <el-input-number
              v-model="form.sale_num"
              controls-position="right"
              :min="0"
              :max="100"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
          <el-form-item v-if="amountVisible" label="Количество" prop="amount">
            <el-input-number
              v-model="form.amount"
              controls-position="right"
              :min="0"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="Содержаине услуги">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2 }"
              v-model="form.info"
              class="textarea"
              placeholder="Содержание услуги"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Отмена</el-button>
        <el-button
          v-if="!form.isEditDialog"
          type="primary"
          @click="commitFormAdd(false)"
          >Добавить</el-button
        >
        <el-button
          v-if="!form.isEditDialog"
          type="primary"
          @click="commitFormAdd(true)"
          >Добавить ещё</el-button
        >
        <el-button
          v-if="form.isEditDialog"
          type="success"
          @click="commitFormEdit"
          >Изменить</el-button
        >
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

export default {
  props: ["forma", "visible"],
  emits: ["dialogClose", "refresh"],
  data() {
    return {
      formLabelWidth: "80%",
      editDialogVisible: false,
      dialogFormVisible: this.visible,
      form: this.forma,
      amountVisible: false,
      rules: {
        DC: [
          {
            required: true,
            message: "Выберите ЦОД партнера",
            trigger: "blur",
          },
        ],
        service: [
          {
            required: true,
            message: "Выберите услугу",
            trigger: "blur",
          },
        ],
        startDateTime: [
          {
            required: true,
            message: "Выберите дату начала предоставления услуги",
            trigger: "blur",
          },
        ],
        amount: [
          {
            required: true,
            message: "Введите количество предоставляемой услуги",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    optionsDC() {
      return this.$store.getters.clientAddServiceDCs;
    },
  },
  methods: {
    getDataCenters(val) {
      this.form.optionsServices = this.$store.getters.clientAddIndividService(
        val[1]
      );
    },
    dialogClose() {
      this.$emit("dialogClose");
    },
    showAddDialogForm(clientID) {
      let oneElseForm = {};
      oneElseForm.title = "Добавить услугу";
      oneElseForm.startDateTime = "";
      oneElseForm.endDateTime = "";
      oneElseForm.sale_num = 0;
      oneElseForm.service = "";
      oneElseForm.DC = [];
      oneElseForm.optionsServices = [];
      oneElseForm.isEditDialog = false;
      oneElseForm.amount = 0;
      oneElseForm.editDialogVisible = false;
      oneElseForm.clientID = clientID;
      this.form = oneElseForm;
    },
    commitFormAdd(more) {
      this.$refs["formSvc"].validate((valid) => {
        if (valid) {
          this.dialogClose();
          let startDate = formatDate(this.form.startDateTime, "dd.mm.yyyy");
          let endDate;
          if (this.form.endDateTime) {
            endDate = formatDate(this.form.endDateTime, "dd.mm.yyyy");
          } else {
            endDate = "";
          }

          fetch(
            "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.add.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=41&ELEMENT_CODE=" +
              this.form.service +
              this.form.clientID +
              "&FIELDS[NAME]=" +
              this.form.service +
              this.form.clientID +
              "&FIELDS[PROPERTY_234]=" +
              this.form.service +
              "&FIELDS[PROPERTY_235]=" +
              this.form.sale_num +
              "&FIELDS[PROPERTY_236]=" +
              this.form.clientID +
              "&FIELDS[PROPERTY_237]=" +
              this.form.amount +
              "&FIELDS[PROPERTY_238]=" +
              startDate +
              "&FIELDS[PROPERTY_239]=" +
              endDate +
              "&FIELDS[PROPERTY_307]=" +
              encodeURIComponent(this.form.info)
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.error) {
                if (data.error === "ERROR_ELEMENT_ALREADY_EXISTS") {
                  this.$message.error("Услуга уже добавлена.");
                } else {
                  console.log(data.error);
                }
              } else {
                this.$message({
                  message: "Услуга успешно добавлена.",
                  type: "success",
                });
              }
              if (more) {
                this.showAddDialogForm(this.form.clientID);
                this.$store.dispatch("getClientsServsFromBitrix", {
                  client_id: this.form.clientID,
                });
              } else {
                this.$store.dispatch("getClientsServsFromBitrix", {
                  client_id: this.form.clientID,
                });
              }
            });
        } else {
          console.log("Validation Failed");
          return false;
        }
      });
    },
    commitFormEdit() {
      this.$refs["formSvc"].validate((valid) => {
        if (valid) {
          this.dialogClose();
          let startDate = formatDate(this.form.startDateTime, "dd.mm.yyyy");
          let endDate;
          if (this.form.endDateTime) {
            endDate = formatDate(this.form.endDateTime, "dd.mm.yyyy");
          } else {
            endDate = "";
          }
          fetch(
            "https://bitrix.d-platforms.ru/rest/54/m6x71a0047f4ltg9/lists.element.update.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=41&ELEMENT_ID=" +
              this.form.serviceID +
              "&FIELDS[NAME]=" +
              this.form.service +
              this.form.clientID +
              "&FIELDS[PROPERTY_234]=" +
              this.form.service +
              "&FIELDS[PROPERTY_235]=" +
              this.form.sale_num +
              "&FIELDS[PROPERTY_236]=" +
              this.form.clientID +
              "&FIELDS[PROPERTY_237]=" +
              this.form.amount +
              "&FIELDS[PROPERTY_238]=" +
              startDate +
              "&FIELDS[PROPERTY_239]=" +
              endDate +
              "&FIELDS[PROPERTY_307]=" +
              encodeURIComponent(this.form.info)
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.error) {
                this.$message.error("Не удалось изменить услугу.");
              } else {
                this.$message({
                  message: "Услуга успешно изменена.",
                  type: "success",
                });
              }
              this.$store.dispatch("getClientsServsFromBitrix", {
                client_id: this.form.clientID,
              });
            });
        } else {
          return false;
        }
      });
    },
    toggleAmountVisible(val) {
      let service = this.$store.getters.serviceByID(val);
      if (service.BILLING === "95") {
        this.amountVisible = false;
      } else {
        this.amountVisible = true;
      }
    },
    setForm(formObj) {
      this.form = formObj;
    },
    setVisible(visible) {
      this.amountVisible = visible;
    },
  },
  async mounted() {
    if (this.$store.getters.postsData.length == 0) {
      await this.$store.dispatch("getPostavshicsFromBitrix");
    }
    if (this.$store.getters.dcsData.length == 0) {
      await this.$store.dispatch("getDCFromBitrix");
      await this.$store.dispatch("getServicesFromBitrix");
    }
  },
};
</script>
