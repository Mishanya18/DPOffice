<template>
  <el-dialog
    :title="form.title"
    v-model="visible"
    @close="dialogClose"
    width="60%"
  >
    <el-form
      size="mini"
      :model="form"
      :rules="rules"
      ref="form"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="Краткое наименование"
            prop="short_name"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.short_name"></el-input>
          </el-form-item>
          <el-form-item
            label="Номер договора"
            prop="deal_num"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.deal_num"></el-input>
          </el-form-item>
          <el-form-item
            label="Дата договора"
            prop="deal_date"
            :label-width="formLabelWidth"
          >
            <el-date-picker
              v-model="form.deal_date"
              type="date"
              placeholder="Выберите дату"
              format="DD.MM.YYYY"
              style="width: 100%;"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="Контактное лицо по договору"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.cont_deal"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Введите фамилию"
              :remote-method="remoteMethod"
              :loading="loading"
              style="width: 100%;"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Ответственный менеджер"
            prop="manager"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.manager"
              filterable
              placeholder="Ответственный"
            >
              <el-option
                v-for="item in optionsUsers"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Полное наименование"
            prop="full_name"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.full_name"></el-input>
          </el-form-item>
          <el-form-item label="ИНН" :label-width="formLabelWidth">
            <el-input v-model="form.inn"></el-input>
          </el-form-item>
          <el-form-item label="Предмет договора" :label-width="formLabelWidth">
            <el-input v-model="form.deal_sub"></el-input>
          </el-form-item>
          <el-form-item
            label="Контактное лицо по техподдержке"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.cont_tech"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Введите фамилию"
              :remote-method="remoteMethod"
              :loading="loading"
              style="width: 100%;"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Отмена</el-button>
        <el-button
          v-if="!form.isPartnerEdit"
          type="primary"
          @click="commitFormAdd"
          >Добавить</el-button
        >
        <el-button v-else type="success" @click="commitFormEdit"
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
  props: ["forma", "dialogFormVisible"],
  emits: ["dialogClose", "refreshList", "refreshTest"],
  data() {
    return {
      formLabelWidth: "50%",
      visible: this.dialogFormVisible,
      loading: false,
      options: this.forma.options,
      rules: {
        short_name: [
          {
            required: true,
            message: "Введите краткое название партнера",
            trigger: "blur",
          },
        ],
        full_name: [
          {
            required: true,
            message: "Введите полное название партнера",
            trigger: "blur",
          },
        ],
        deal_num: [
          {
            required: true,
            message: "Введите номер договора",
            trigger: "blur",
          },
        ],
        manager: [
          {
            required: true,
            message: "Выберите ответственного менеджера",
            trigger: "change",
          },
        ],
      },
      form: this.forma,
    };
  },
  computed: {
    optionsUsers() {
      let users = this.$store.getters.activeUsersData;
      let options = [];
      for (let key in users) {
        let opt = {
          value: key,
          label: users[key],
        };
        options.push(opt);
      }
      return options;
    },
  },
  methods: {
    dialogClose() {
      this.$emit("dialogClose");
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/myhvybxm0ufykwi3/crm.contact.list.json?FILTER[%LAST_NAME]=" +
            query +
            "&SELECT[]=ID&SELECT[]=NAME&SELECT[]=LAST_NAME&SELECT[]=SECOND_NAME"
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.options = [];
            for (let i = 0; i < data.total; i++) {
              let last_name = "";
              let name = "";
              let second = "";
              if (
                data.result[i].LAST_NAME != "" &&
                data.result[i].LAST_NAME != null
              ) {
                last_name = data.result[i].LAST_NAME + " ";
              }
              if (data.result[i].NAME != "" && data.result[i].NAME != null) {
                name = data.result[i].NAME + " ";
              }
              if (
                data.result[i].SECOND_NAME != "" &&
                data.result[i].SECOND_NAME != null
              ) {
                second = data.result[i].SECOND_NAME;
              }
              let opt = {
                value: data.result[i].ID,
                label: last_name + name + second,
              };
              this.options.push(opt);
            }
            this.loading = false;
          });
      } else {
        this.options = [];
        this.loading = false;
      }
    },
    commitFormAdd() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let dealContacts = "";
          let techContacts = "";
          this.form.cont_deal.forEach((cont) => {
            dealContacts += "&FIELDS[PROPERTY_202][]=" + cont;
          });
          this.form.cont_tech.forEach((cont) => {
            techContacts += "&FIELDS[PROPERTY_203][]=" + cont;
          });
          fetch(
            "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.add.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=39&ELEMENT_CODE=" +
            this.form.short_name +
            "&FIELDS[NAME]=" +
            this.form.short_name +
            "&FIELDS[PROPERTY_195]=" + //полное имя
            this.form.full_name +
            "&FIELDS[PROPERTY_197]=" + //ИНН
            this.form.inn +
            "&FIELDS[PROPERTY_198]=" + //номер договора
            this.form.deal_num +
            "&FIELDS[PROPERTY_199]=" + //дата договора
            formatDate(this.form.deal_date, "dd.mm.yyyy") +
            dealContacts + //контакты по договору
            techContacts + //контакты по техподдержке
            "&FIELDS[PROPERTY_204]=" + //Ответственный менеджер
              this.form.manager
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.error) {
                console.log(data);
              } else {
                this.dialogClose();
                this.$emit("refreshList");
              }
            });
        } else {
          return false;
        }
      });
    },
    commitFormEdit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let dealContacts = "";
          let techContacts = "";
          this.form.cont_deal.forEach((cont) => {
            dealContacts += "&FIELDS[PROPERTY_192][]=" + cont;
          });
          this.form.cont_tech.forEach((cont) => {
            techContacts += "&FIELDS[PROPERTY_193][]=" + cont;
          });
          fetch(
            "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.update.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=38&ELEMENT_CODE=" +
            this.form.code +
            "&FIELDS[NAME]=" +
            this.form.short_name +
            "&FIELDS[PROPERTY_185]=" + //полное имя
            this.form.full_name +
            "&FIELDS[PROPERTY_187]=" + //ИНН
            this.form.inn +
            dealContacts + //контакты по договору
            techContacts + //контакты по техподдержке
            "&FIELDS[PROPERTY_205]=" + //Ответственный менеджер
            this.form.manager +
            "&FIELDS[PROPERTY_298]=" + //Code
            this.form.code +
            "&FIELDS[PROPERTY_308]=" + //Клиент в тесте
              "1"
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.error) {
                console.log(data.error);
              } else {
                this.$emit("refreshTest");
              }
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
