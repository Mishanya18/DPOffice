<template>
  <el-container direction="vertical">
    <client-add-dialog />
    <multi-excel-export
      v-if="multiExportDialogVisible"
      :visible="multiExportDialogVisible"
      @dialogClose="multiExportDialogVisible = false"
      :clientCode="clientsForExport"
    />

    <el-row>
      <el-col :span="23">
        <el-table
          :data="gridDataClient"
          style="width: 100%"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @row-click="linkToPage"
          :row-style="rowStyle"
        >
          <el-table-column type="selection" width="45"> </el-table-column>
          <el-table-column prop="name" label="Имя" min-width="300">
          </el-table-column>
          <el-table-column prop="code" label="Code" min-width="150">
          </el-table-column>
          <el-table-column
            prop="deal_num"
            label="Номер договора"
            min-width="140"
          >
          </el-table-column>
          <el-table-column
            prop="deal_date"
            label="Дата договора"
            min-width="125"
          >
          </el-table-column>
          <el-table-column prop="manager" label="Ответственный" min-width="200">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">
        <el-dropdown
          trigger="click"
          :hide-on-click="false"
          style="margin-left: 1vh;"
          v-if="showExportButton || right"
        >
          <span class="el-dropdown-link">
            <i class="el-icon-more icon"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-row v-if="right" class="p-0">
                <el-button
                  type="text"
                  class="link p-0"
                  @click="showAddClientDialog"
                >
                  <el-dropdown-item class="dropdown-item">
                    Добавить клиента
                  </el-dropdown-item>
                </el-button>
              </el-row>
              <el-row class="p-0" v-if="showExportButton">
                <el-button
                  type="text"
                  class="link p-0"
                  @click="showMultiExportDialog"
                >
                  <el-dropdown-item class="dropdown-item">
                    Экспорт в Excel
                  </el-dropdown-item>
                </el-button>
              </el-row>
              <el-row class="mar-pad-element" v-if="showDeleteButton && right">
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
import ClientAddDialog from "../components/ClientAddDialog.vue";
import MultiExcelExport from "../components/Client/components/MultiExcelExport.vue";

export default {
  name: "client-list",
  components: {
    ClientAddDialog,
    MultiExcelExport,
  },
  data() {
    return {
      formLabelWidth: "50%",
      multipleSelection: [],
      showDeleteButton: false,
      showExportButton: false,
      visibleArray: {},
      multiExportDialogVisible: false,
      clientsForExport: [],
    };
  },
  methods: {
    linkToPage(cell) {
      this.$router.push({ path: "/clients/" + cell.code });
    },
    showAddClientDialog() {
      let form = {};
      form.title = "Добавить клиента";
      form.code = "";
      form.short_name = "";
      form.full_name = "";
      form.inn = 0;
      form.deal_num = "";
      form.deal_date = "";
      form.deal_sub = "";
      form.cont_deal = [];
      form.cont_tech = [];
      form.deal_add = "";
      form.manager = "";
      form.isClientEdit = false;
      this.$store.commit("nullClientAddForm");
      this.$store.commit("setClientAddForm", form);
      this.$store.commit("showAddClientDialog");
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
                  this.$message.error("Не удалось удалить клиента.");
                } else {
                  this.$message({
                    message: "Клиент успешно удален.",
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
        this.showExportButton = true;
      } else {
        this.showDeleteButton = false;
        this.showExportButton = false;
      }
    },
    rowStyle() {
      return { cursor: "pointer" };
    },
    showMultiExportDialog() {
      this.multipleSelection.forEach((element) => {
        this.clientsForExport.push(element.code);
      });
      this.multiExportDialogVisible = true;
    },
  },
  computed: {
    gridDataClient() {
      const clients = this.$store.getters.clientsData;
      const users = this.$store.getters.usersData;
      let gridClient = [];
      clients.forEach((element) => {
        if (element.IN_TEST == 2) {
          const clientFromResult = {
            id: element.ID,
            name: element.NAME,
            deal_num: element.DEAL_NUM,
            deal_date: element.DEAL_DATE,
            manager: users[element.MANAGER],
            code: element.CODE,
          };
          gridClient.push(clientFromResult);
          this.visibleArray[clientFromResult.id] = false;
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
    if (this.$store.getters.postsData.length == 0) {
      await this.$store.dispatch("getPostavshicsFromBitrix");
    }
    if (this.$store.getters.clientsData.length == 0) {
      await this.$store.dispatch("getClientsFromBitrix");
    }
    if (this.$store.getters.dcsData.length == 0) {
      await this.$store.dispatch("getDCFromBitrix");
    }
    if (this.$store.getters.servicvesData.length == 0) {
      await this.$store.dispatch("getServicesFromBitrix");
    }
    this.$store.commit("nullClientsServices");
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
tr {
  cursor: pointer !important;
  /* background-color: blue; */
}
</style>
