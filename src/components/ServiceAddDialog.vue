<template>
  <el-dialog
    title="Добавить услугу"
    v-model="dialogFormVisible"
    @close="dialogClose"
    width="50%"
  >
    <el-form :model="form" :rules="rules" ref="formSvc" size="mini">
      <el-form-item
        label="Выберите ЦОД"
        prop="DC"
        :label-width="formLabelWidth"
      >
        <div class="block">
          <el-cascader
            placeholder="Найти ЦОД"
            :options="optionsDC"
            :disabled="form.isEditDialog"
            v-model="form.DC"
            @change="getDataCenters"
            filterable
          ></el-cascader>
        </div>
      </el-form-item>
      <el-form-item
        label="Выберите услугу"
        prop="service"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="form.service"
          :disabled="form.isEditDialog"
          @change="toggleAmountVisible"
          filterable
          placeholder="Услуги"
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
        :label-width="formLabelWidth"
      >
        <el-date-picker
          v-model="form.startDateTime"
          type="date"
          placeholder="Выберите дату"
          format="DD.MM.YYYY"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="Время конца оказания услуги"
        :label-width="formLabelWidth"
      >
        <el-date-picker
          v-model="form.endDateTime"
          type="date"
          placeholder="Выберите дату"
          format="DD.MM.YYYY"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Дисконт" :label-width="formLabelWidth">
        <el-input-number
          v-model="form.sale_num"
          controls-position="right"
          :min="0"
          :max="100"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        v-if="amountVisible"
        label="Количество"
        prop="amount"
        :label-width="formLabelWidth"
      >
        <el-input-number
          v-model="form.amount"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
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
export default {
  data() {
    return {
      formLabelWidth: "50%",
      editDialogVisible: false,
      form: {},
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
    dialogFormVisible() {
      let formObj = this.$store.getters.clientServiceForm;
      this.setForm(formObj);
      if (this.form.service) {
        this.toggleAmountVisible(this.form.service);
      } else {
        this.setVisible(false);
      }
      return this.$store.getters.dialogClientServiceAddVisible;
    },
    optionsDC() {
      return this.$store.getters.clientAddServiceDCs;
    },
  },
  methods: {
    getDataCenters(val) {
      this.form.optionsServices = this.$store.getters.clientAddServiceServices(
        val[1]
      );
    },
    dialogClose() {
      this.$store.commit("closeAddClientServiceDialog");
    },
    showAddDialogForm(clientID) {
      let form = {};
      form.startDateTime = "";
      form.endDateTime = "";
      form.sale_num = 0;
      form.service = "";
      form.DC = [];
      form.optionsServices = [];
      form.isEditDialog = false;
      form.amount = 0;
      form.editDialogVisible = false;
      form.clientID = clientID;
      this.$store.commit("nullClientServiceForm");
      this.$store.commit("setClientServiceForm", form);
      this.$store.commit("showAddClientServiceDialog");
    },
    commitFormAdd(more) {
      this.$refs["formSvc"].validate((valid) => {
        if (valid) {
          this.dialogClose();
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
              this.form.startDateTime +
              "&FIELDS[PROPERTY_239]=" +
              this.form.endDateTime
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.error) {
                if (data.error === "ERROR_ELEMENT_ALREADY_EXISTS") {
                  this.$message.error("Услуга уже добавлена.");
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
          return false;
        }
      });
    },
    commitFormEdit() {
      this.$refs["formSvc"].validate((valid) => {
        if (valid) {
          this.dialogClose();
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
              this.form.startDateTime +
              "&FIELDS[PROPERTY_239]=" +
              this.form.endDateTime
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
