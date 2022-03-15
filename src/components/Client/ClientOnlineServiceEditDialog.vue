<template>
  <el-dialog
    :title="form.title"
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
            :disabled="true"
            :options="optionsDC"
            v-model="form.DC"
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
          :disabled="true"
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Отмена</el-button>
        <el-button type="success" @click="commitFormEdit">Изменить</el-button>
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
  props: ["serviceProps"],
  data() {
    return {
      formLabelWidth: "35%",
      dialogFormVisible: true,
      rules: {
        startDateTime: [
          {
            required: true,
            message: "Выберите дату начала предоставления услуги",
            trigger: "blur",
          },
        ],
      },
      form: this.serviceProps,
    };
  },
  computed: {
    optionsDC() {
      return this.$store.getters.clientAddServiceDCs;
    },
  },
  methods: {
    dialogClose() {
      this.dialogFormVisible = false;
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
              "&FIELDS[PROPERTY_238]=" +
              startDate +
              "&FIELDS[PROPERTY_239]=" +
              endDate
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
  },
};
</script>
