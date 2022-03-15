<template>
  <el-container direction="vertical">
    <el-row>
      <el-col :span="23">
        <el-descriptions border :column="2">
          <el-descriptions-item label="Краткое наименование">
            {{ clientParams.name }}
          </el-descriptions-item>
          <el-descriptions-item label="Code">
            {{ clientParams.code }}
          </el-descriptions-item>
          <el-descriptions-item label="Полное наименование">
            {{ clientParams.full_name }}
          </el-descriptions-item>
          <el-descriptions-item label="ИНН">
            {{ clientParams.inn }}
          </el-descriptions-item>
          <el-descriptions-item label="Номер договора">
            {{ clientParams.deal_num }}
          </el-descriptions-item>
          <el-descriptions-item label="Дата договора">
            {{ clientParams.deal_date }}
          </el-descriptions-item>
          <el-descriptions-item label="Предмет договора">
            {{ clientParams.deal_sub }}
          </el-descriptions-item>
          <el-descriptions-item label="Дополнительное соглашение к договору">
            {{ clientParams.deal_add }}
          </el-descriptions-item>
          <el-descriptions-item label="Контактное лицо по договору ">
            <p class="param" v-for="Cont in dealCont" :key="Cont">
              {{ Cont }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="Контактное лицо техподдержки">
            <p class="param" v-for="Cont in techCont" :key="Cont">
              {{ Cont }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="Ответственный менеджер">
            {{ clientParams.manager }}
          </el-descriptions-item>
          <el-descriptions-item label="Дата создания">
            {{ clientParams.creation_date }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="1" v-if="right">
        <el-dropdown
          trigger="click"
          :hide-on-click="false"
          style="margin-left: 1vh;"
        >
          <span class="el-dropdown-link">
            <i class="el-icon-more icon"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-row>
                <el-button
                  type="text"
                  class="link"
                  @click="showEditClientDialog"
                >
                  <el-dropdown-item class="dropdown-item">
                    Изменить клиента
                  </el-dropdown-item>
                </el-button>
              </el-row>
              <el-row class="mar-pad-element">
                <el-popconfirm
                  confirm-button-text="Да"
                  cancel-button-text="Нет"
                  icon="el-icon-info"
                  icon-color="red"
                  title="Вы уверены?"
                  @confirm="deleteClient"
                  placement="top"
                >
                  <template #reference>
                    <el-button type="text" class="link p-0">
                      <el-dropdown-item class="dropdown-item">
                        Удалить клиента
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
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      clientParams: {},
      techCont: [],
      dealCont: [],
    };
  },
  computed: {
    right() {
      return this.$store.getters.isLogged;
    },
  },
  methods: {
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
    getClientParams() {
      let client = this.$store.getters.clientPageData(
        this.$route.params.clientCode
      );
      let users = this.$store.getters.usersData;

      this.clientParams = {
        name: client.NAME,
        full_name: client.FULL_NAME ? client.FULL_NAME : "Не указано",
        inn: client.INN ? client.INN : "Не указано",
        deal_num: client.DEAL_NUM,
        deal_date: client.DEAL_DATE,
        deal_sub: client.DEAL_SUB ? client.DEAL_SUB : "Не указано",
        deal_add: client.DEAL_ADD ? client.DEAL_ADD : "Не указано",
        code: client.CODE,
        deal_cont: client.DEAL_CONT,
        tech_cont: client.TECH_CONT,
        manager: users[client.MANAGER],
        manager_id: client.MANAGER,
        creation_date: client.CREATION_DATE,
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
      form.code = this.clientParams.code;
      form.short_name = this.clientParams.name;
      form.full_name =
        this.clientParams.full_name == "Не указано"
          ? ""
          : this.clientParams.full_name;
      form.inn = this.clientParams.inn;
      form.deal_num = this.clientParams.deal_num;
      let dateArrDeal = this.clientParams.deal_date.split(".");
      form.deal_date = new Date(
        dateArrDeal[2],
        dateArrDeal[1] - 1,
        dateArrDeal[0]
      );
      form.deal_sub =
        this.clientParams.deal_sub == "Не указано"
          ? ""
          : this.clientParams.deal_sub;
      form.deal_add =
        this.clientParams.deal_add == "Не указано"
          ? ""
          : this.clientParams.deal_add;
      let options = [];
      if (this.dealCont[0] != "Не указано") {
        form.cont_deal = this.clientParams.deal_cont;
        for (let i = 0; i < this.dealCont.length; i++) {
          options.push({
            label: this.dealCont[i],
            value: this.clientParams.deal_cont[i],
          });
        }
      } else {
        form.cont_deal = [];
      }
      if (this.techCont[0] != "Не указано") {
        form.cont_tech = this.clientParams.tech_cont;
        for (let i = 0; i < this.techCont.length; i++) {
          let isExist = options.find(
            (element) => element.value === this.techCont[i]
          );
          if (!isExist) {
            options.push({
              label: this.techCont[i],
              value: this.clientParams.tech_cont[i],
            });
          }
        }
      } else {
        form.cont_tech = [];
      }

      form.options = options;
      form.manager = this.clientParams.manager_id;
      form.isClientEdit = true;
      this.$store.commit("nullClientAddForm");
      this.$store.commit("setClientAddForm", form);
      this.$store.commit("showAddClientDialog");
    },
    deleteClient() {
      this.$store
        .dispatch("getClientsServsFromBitrix", {
          client_code: this.$route.params.clientCode,
        })
        .then(() => {
          fetch(
            "https://bitrix.d-platforms.ru/rest/54/j2ddrqogky8h0nmn/lists.element.delete.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=38&ELEMENT_CODE=" +
              this.$route.params.clientCode
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.error) {
                this.$message.error("Не удалось удалить клиента.");
              } else {
                this.$router.push({ name: "clients" });
                this.$message({
                  message: "Клиент успешно удален.",
                  type: "success",
                });
                this.cleanServicesBeforeClientDelete();
                this.$store.dispatch("getClientsFromBitrix");
              }
            });
        });
    },
    cleanServicesBeforeClientDelete() {
      let services = this.$store.getters.clientServices;
      services.forEach((element) => {
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/j2ddrqogky8h0nmn/lists.element.delete.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=41&ELEMENT_ID=" +
            element.ID
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              console.log("Не удалось удалить услугу.");
              console.log(data.error);
            }
          });
      });
    },
  },
  created() {
    this.getClientParams();
  },
};
</script>

<style scoped>
.param {
  margin: 0px;
}
.icon {
  font-size: 28px;
}
.dropdown-item {
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  font-size: 15px;
}
.mar-pad-element {
  margin: 0px;
  padding: 0px;
}
.link {
  font-size: 15px;
  color: #606266;
  width: 180px;
  padding: 0px;
}
</style>
