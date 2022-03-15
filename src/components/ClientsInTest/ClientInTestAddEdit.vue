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
        <el-col :span="24">
          <el-form-item
            label="Краткое наименование"
            prop="short_name"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.short_name"></el-input>
          </el-form-item>
          <el-form-item
            label="Полное наименование"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.full_name"></el-input>
          </el-form-item>
          <el-form-item
            label="Code из o2.d-platforms.ru"
            prop="code"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.code"
              :disabled="form.isClientEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="ИНН" :label-width="formLabelWidth">
            <el-input v-model="form.inn"></el-input>
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
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Отмена</el-button>
        <el-button
          v-if="!form.isClientEdit"
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
            message: "Введите название клиента",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "Введите code из o2.d-platforms.ru",
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
            dealContacts += "&FIELDS[PROPERTY_192][]=" + cont;
          });
          this.form.cont_tech.forEach((cont) => {
            techContacts += "&FIELDS[PROPERTY_193][]=" + cont;
          });
          fetch(
            "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.add.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=38&ELEMENT_CODE=" +
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
                console.log(data);
              } else {
                this.addOnlineServices(data.result);
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
    addOnlineServices(clientID) {
      let services = this.$store.getters.servicvesData;
      services.forEach((element) => {
        if (element.BILLING == 95) {
          this.addServiceToBitrix(clientID, element.ID);
        }
      });
    },
    addServiceToBitrix(clientID, serviceID) {
      let startDate = formatDate(new Date(), "dd.mm.yyyy");
      fetch(
        "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.add.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=41&ELEMENT_CODE=" +
          serviceID +
          clientID +
          "&FIELDS[NAME]=" +
          serviceID +
          clientID +
          "&FIELDS[PROPERTY_234]=" +
          serviceID +
          "&FIELDS[PROPERTY_235]=" +
          "0" +
          "&FIELDS[PROPERTY_236]=" +
          clientID +
          "&FIELDS[PROPERTY_238]=" +
          startDate
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            // console.log("Услуга успешно добавлена!");
          }
        });
    },
  },
};
</script>
