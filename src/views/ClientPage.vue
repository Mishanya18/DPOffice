<template>
  <el-container direction="vertical">
    <service-add-dialog />
    <client-add-dialog @edited="refreshClientParams" />

    <el-row type="flex" justify="space-between">
      <el-col :span="5" :offset="1">
        <span style="font-size: 20px;">Услуги</span>
      </el-col>
      <el-col :span="1">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-more icon"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-row>
                <el-button type="text" class="link" @click="showAddDialogForm">
                  <el-dropdown-item class="dropdown-item">
                    Добавить услугу
                  </el-dropdown-item>
                </el-button>
              </el-row>
              <el-row>
                <el-button
                  type="text"
                  class="link"
                  @click="showEditClientDialog"
                >
                  <el-dropdown-item divided class="dropdown-item">
                    Изменить клиента
                  </el-dropdown-item>
                </el-button>
              </el-row>
              <el-row class="mar-pad-element" v-if="showDeleteButton">
                <el-popconfirm
                  confirm-button-text="Да"
                  cancel-button-text="Нет"
                  icon="el-icon-info"
                  icon-color="red"
                  title="Вы уверены?"
                  @confirm="deleteSelectedRows"
                  placement="top"
                >
                  <template #reference>
                    <el-button type="text" class="link p-0">
                      <el-dropdown-item class="dropdown-item">
                        Удалить услуги
                      </el-dropdown-item>
                    </el-button>
                  </template>
                </el-popconfirm>
              </el-row>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="gridClientServicesData"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        @row-click="showEditDialogForm"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="Название" min-width="100">
          <template #default="scope">
            <span class="text">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="startDateTime"
          label="Начало"
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="endDateTime"
          label="Окончание"
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="unit"
          label="Ед. изм."
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="amount"
          label="Количество"
          min-width="110"
        ></el-table-column>
        <el-table-column
          prop="sale"
          label="Дисконт"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="post"
          label="Партнер"
          min-width="90"
        ></el-table-column>
        <el-table-column
          prop="data_center"
          label="ЦОД"
          min-width="70"
        ></el-table-column>
      </el-table>
    </el-row>
    <el-row style="padding-top: 20px;">
      <el-col :span="10" :offset="2">
        <p class="label">Краткое наименование</p>
        <p class="param">{{ clientNameParams.name }}</p>

        <p class="label">Code в o2.d-platforms.ru</p>
        <p class="param">{{ clientNameParams.code }}</p>

        <p class="label">Номер договора</p>
        <p class="param">{{ clientNameParams.deal_num }}</p>

        <p class="label">Дополнительное соглашение к договору</p>
        <p class="param">{{ clientNameParams.deal_add }}</p>

        <p class="label">Контактное лицо по договору</p>
        <p class="param" v-for="Cont in dealCont" :key="Cont">
          {{ Cont }}
        </p>

        <p class="label">Дата создания</p>
        <p class="param">{{ clientNameParams.creation_date }}</p>
      </el-col>
      <el-col :span="10" :offset="2">
        <p class="label">Полное наименование</p>
        <p class="param">{{ clientNameParams.full_name }}</p>

        <p class="label">ИНН</p>
        <p class="param">{{ clientNameParams.inn }}</p>

        <p class="label">Предмет договора</p>
        <p class="param">{{ clientNameParams.deal_sub }}</p>

        <p class="label">Дата договора</p>
        <p class="param">{{ clientNameParams.deal_date }}</p>

        <p class="label">Контактное лицо техподдержки</p>
        <p class="param" v-for="Cont in techCont" :key="Cont">
          {{ Cont }}
        </p>

        <p class="label">Ответственный менеджер</p>
        <p class="param">{{ clientNameParams.manager }}</p>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import ServiceAddDialog from "../components/ServiceAddDialog.vue";
import ClientAddDialog from "../components/ClientAddDialog.vue";

export default {
  components: {
    ServiceAddDialog,
    ClientAddDialog,
  },
  data() {
    return {
      editable: false,
      multipleSelection: [],
      showDeleteButton: false,
      clientNameParams: {},
      techCont: [],
      dealCont: [],
    };
  },
  computed: {
    gridClientServicesData() {
      return this.$store.getters.clientServicesData(
        this.$route.params.clientCode
      );
    },
  },
  methods: {
    showAddDialogForm() {
      let form = {};
      form.title = "Добавить услугу";
      form.startDateTime = "";
      form.endDateTime = "";
      form.sale_num = 0;
      form.service = "";
      form.DC = [];
      form.optionsServices = [];
      form.isEditDialog = false;
      form.amount = 0;
      form.editDialogVisible = false;
      form.clientID = this.$store.getters.clientIDByCode(
        this.$route.params.clientCode
      );
      this.$store.commit("nullClientServiceForm");
      this.$store.commit("setClientServiceForm", form);
      this.$store.commit("showAddClientServiceDialog");
    },
    showEditDialogForm(row) {
      let form = {};
      form.title = "Изменить услугу";
      form.serviceID = row.id;
      if (row.startDateTime) {
        let dateArrStart = row.startDateTime.split(".");
        form.startDateTime = new Date(
          dateArrStart[2],
          dateArrStart[1] - 1,
          dateArrStart[0]
        );
      }
      if (row.endDateTime) {
        let dateArrEnd = row.endDateTime.split(".");
        form.endDateTime = new Date(
          dateArrEnd[2],
          dateArrEnd[1] - 1,
          dateArrEnd[0]
        );
      }
      form.sale_num = parseInt(row.sale);
      form.service = this.$store.getters.serviceIDByName(row.name);
      form.DC = [];
      form.DC[0] = this.$store.getters.postIDByName(row.post);
      form.DC[1] = this.$store.getters.dcIDByName(row.data_center);
      form.optionsServices = this.$store.getters.clientAddServiceServices(
        form.DC[1]
      );
      form.amount = parseInt(row.amount);
      form.editDialogVisible = true;
      form.clientID = this.$store.getters.clientIDByCode(
        this.$route.params.clientCode
      );
      form.isEditDialog = true;
      this.$store.commit("nullClientServiceForm");
      this.$store.commit("setClientServiceForm", form);
      this.$store.commit("showAddClientServiceDialog");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
    },
    deleteSelectedRows() {
      this.multipleSelection.forEach((element) => {
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/j2ddrqogky8h0nmn/lists.element.delete.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=41&ELEMENT_ID=" +
            element.id
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              this.$message.error("Не удалось удалить услугу.");
            } else {
              this.$message({
                message: "Услуга успешно удалена.",
                type: "success",
              });
            }
            this.$store.dispatch("getClientsServsFromBitrix", {
              client_code: this.$route.params.clientCode,
            });
          });
      });
    },
    getContactById(client, type) {
      client.forEach((cont) => {
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/d3dkblc1w832p2fu/crm.contact.get.json?ID=" +
            cont
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            let last_name = "";
            let name = "";
            let second = "";
            if (data.result.LAST_NAME != "" && data.result.LAST_NAME != null) {
              last_name = data.result.LAST_NAME + " ";
            }
            if (data.result.NAME != "" && data.result.NAME != null) {
              name = data.result.NAME + " ";
            }
            if (
              data.result.SECOND_NAME != "" &&
              data.result.SECOND_NAME != null
            ) {
              second = data.result.SECOND_NAME;
            }
            let cont = last_name + name + second;
            if (type == "tech") this.techCont.push(cont);
            if (type == "deal") this.dealCont.push(cont);
          });
      });
    },
    getClientNameParams() {
      let client = this.$store.getters.clientPageData(
        this.$route.params.clientCode
      );
      let users = this.$store.getters.usersData;

      this.clientNameParams = {
        name: client.NAME,
        full_name: client.FULL_NAME ? client.FULL_NAME : "Не указано",
        inn: client.INN ? client.INN : "Не указано",
        deal_num: client.DEAL_NUM,
        deal_date: client.DEAL_DATE,
        deal_sub: client.DEAL_SUB ? client.DEAL_SUB : "Не указано",
        deal_add: client.DEAL_ADD ? client.DEAL_ADD : "Не указано",
        code: client.CODE,
        manager: users[client.MANAGER],
        manager_id: client.MANAGER,
        creation_date: client.CREATION_DATE,
        deal_cont: client.DEAL_CONT,
        tech_cont: client.TECH_CONT,
      };
      this.techCont = [];
      this.dealCont = [];
      client.DEAL_CONT.length
        ? this.getContactById(client.DEAL_CONT, "deal")
        : (this.dealCont = ["Не указано"]);
      client.TECH_CONT.length
        ? this.getContactById(client.TECH_CONT, "tech")
        : (this.techCont = ["Не указано"]);
    },
    showEditClientDialog() {
      let form = {};
      form.title = "Изменить клиента";
      form.code = this.clientNameParams.code;
      form.short_name = this.clientNameParams.name;
      form.full_name =
        this.clientNameParams.full_name == "Не указано"
          ? ""
          : this.clientNameParams.full_name;
      form.inn = this.clientNameParams.inn;
      form.deal_num = this.clientNameParams.deal_num;
      let dateArrDeal = this.clientNameParams.deal_date.split(".");
      form.deal_date = new Date(
        dateArrDeal[2],
        dateArrDeal[1] - 1,
        dateArrDeal[0]
      );
      form.deal_sub =
        this.clientNameParams.deal_sub == "Не указано"
          ? ""
          : this.clientNameParams.deal_sub;
      form.deal_add =
        this.clientNameParams.deal_add == "Не указано"
          ? ""
          : this.clientNameParams.deal_add;
      form.cont_deal = this.clientNameParams.deal_cont;
      form.cont_tech = this.clientNameParams.tech_cont;
      let options = [];
      for (let i = 0; i < this.clientNameParams.deal_cont.length; i++) {
        options.push({
          label: this.dealCont[i],
          value: this.clientNameParams.deal_cont[i],
        });
      }
      for (let i = 0; i < this.clientNameParams.tech_cont.length; i++) {
        let isExist = options.find(
          (element) => element.value === this.clientNameParams.tech_cont[i]
        );
        if (!isExist) {
          options.push({
            label: this.techCont[i],
            value: this.clientNameParams.tech_cont[i],
          });
        }
      }
      console.log(options);
      form.options = options;
      form.manager = this.clientNameParams.manager_id;
      form.isClientEdit = true;
      this.$store.commit("nullClientAddForm");
      this.$store.commit("setClientAddForm", form);
      this.$store.commit("showAddClientDialog");
    },
    refreshClientParams() {
      this.getClientNameParams();
    },
  },
  async created() {
    if (this.$store.getters.servicvesData.length == 0) {
      await this.$store.dispatch("getServicesFromBitrix");
    }
    if (this.$store.getters.dcsData.length == 0) {
      await this.$store.dispatch("getDCFromBitrix");
    }
    if (this.$store.getters.postsData.length == 0) {
      await this.$store.dispatch("getPostavshicsFromBitrix");
    }
    await this.$store.dispatch("getClientsServsFromBitrix", {
      client_code: this.$route.params.clientCode,
    });
    this.getClientNameParams();
  },
};
</script>

<style scoped>
.text {
  overflow-wrap: normal;
  word-wrap: normal;
  word-break: normal !important;
  line-break: auto;
  hyphens: manual;
}
.link {
  font-size: 15px;
  color: #606266;
  width: 180px;
  padding: 0px;
}
.icon {
  font-size: 28px;
}
.mar-pad-element {
  margin: 0px;
  padding: 0px;
}
.dropdown-item {
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  font-size: 15px;
}
.label {
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  font-size: 16px;
  margin-bottom: 5px;
  /* color: #606266; */
}
.param {
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  font-size: 14px;
  color: #606266;
}
</style>
