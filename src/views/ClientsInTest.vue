<template>
  <el-container direction="vertical">
    <el-row>
      <el-col :span="23">
        <el-table
          :data="gridDataClient"
          style="width: 100%"
          ref="multipleTable"
          @row-click="linkToPage"
          @selection-change="handleSelectionChange"
          :row-style="rowStyle"
        >
          <el-table-column type="selection" width="45"> </el-table-column>
          <el-table-column prop="name" label="Имя" min-width="200">
          </el-table-column>
          <el-table-column prop="code" label="Code" min-width="150">
          </el-table-column>
          <el-table-column
            prop="creation_date"
            label="Дата добавления"
            min-width="125"
          >
          </el-table-column>
          <el-table-column prop="manager" label="Ответственный" min-width="200">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1" v-if="right">
        <el-dropdown trigger="click" style="margin-left: 1vh;">
          <span class="el-dropdown-link">
            <i class="el-icon-more icon"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-row class="p-0">
                <el-button
                  type="text"
                  class="link p-0"
                  @click="showAddClientDialog"
                >
                  <el-dropdown-item class="dropdown-item">
                    Добавить тест
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
                  @confirm="deleteClients"
                  placement="top"
                >
                  <template #reference>
                    <el-button type="text" class="link p-0 m-0">
                      <el-dropdown-item class="dropdown-item">
                        Удалить тест
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

    <client-in-test-add-edit
      v-if="showAddDialog"
      :dialogFormVisible="showAddDialog"
      :forma="form"
      @dialogClose="showAddDialog = false"
      @refreshList="refreshList()"
    />
  </el-container>
</template>

<script>
import ClientInTestAddEdit from "../components/ClientsInTest/ClientInTestAddEdit.vue";

export default {
  components: {
    ClientInTestAddEdit,
  },
  data() {
    return {
      formLabelWidth: "50%",
      clients: [],
      operation: "",
      form: {},
      multipleSelection: [],
      showDeleteButton: false,
      showAddDialog: false,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
    },
    showAddClientDialog() {
      this.showAddDialog = true;
      this.form.title = "Добавить тест";
      this.form.code = "";
      this.form.short_name = "";
      this.form.full_name = "";
      this.form.inn = 0;
      this.form.cont_deal = [];
      this.form.cont_tech = [];
      this.form.manager = "";
      this.form.isClientEdit = false;
    },
    deleteClients() {
      this.multipleSelection.forEach((element) => {
        this.$store
          .dispatch("getClientsServsFromBitrix", {
            client_code: element.code,
          })
          .then(() => {
            fetch(
              "https://bitrix.d-platforms.ru/rest/54/j2ddrqogky8h0nmn/lists.element.delete.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=38&ELEMENT_ID=" +
                element.id
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                if (data.error) {
                  this.$message.error("Не удалось удалить клиента из теста.");
                } else {
                  this.$message({
                    message: "Клиент успешно удален из теста.",
                    type: "success",
                  });
                  this.cleanServicesBeforeClientDelete();
                  this.$store.dispatch("getClientsFromBitrix");
                }
              });
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
    refreshList() {
      this.$store.dispatch("getClientsFromBitrix");
      this.showAddDialog = false;
    },
    linkToPage(cell) {
      this.$router.push({ path: "/clientsintest/" + cell.code });
    },
    rowStyle() {
      return { cursor: "pointer" };
    },
  },
  computed: {
    gridDataClient() {
      const clients = this.$store.getters.clientsData;
      const users = this.$store.getters.usersData;
      let gridClient = [];
      clients.forEach((element) => {
        if (element.IN_TEST == 1) {
          const clientFromResult = {
            id: element.ID,
            name: element.NAME,
            creation_date: element.CREATION_DATE,
            deal_num: element.DEAL_NUM,
            deal_date: element.DEAL_DATE,
            manager: users[element.MANAGER],
            code: element.CODE,
          };
          gridClient.push(clientFromResult);
        }
      });
      return gridClient;
    },
    right() {
      return this.$store.getters.isLogged;
    },
  },
  async mounted() {
    if (Object.keys(this.$store.getters.usersData).length == 0) {
      await this.$store.dispatch("getUsersFromBitrix");
    }
    if (this.$store.getters.dcsData.length == 0) {
      await this.$store.dispatch("getDCFromBitrix");
    }
    if (this.$store.getters.servicvesData.length == 0) {
      await this.$store.dispatch("getServicesFromBitrix");
    }
  },
};
</script>

<style scoped>
.link {
  font-size: 15px;
  color: #606266;
  width: 180px;
}
.mar-pad-element {
  margin: 0px;
  padding: 0px;
}
.icon {
  font-size: 28px;
}
.dropdown-item {
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  font-size: 15px;
}
</style>
