<template>
  <div>
    <client-add-dialog />

    <el-row type="flex" justify="end">
      <el-col :span="1">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-more icon"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-row class="p-0">
                <el-button type="text" class="link p-0" @click="showAddDialog">
                  <el-dropdown-item class="dropdown-item">
                    Добавить клиента
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

    <el-row>
      <el-col :span="24">
        <el-table
          :data="gridDataClient"
          style="width: 100%"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @row-click="linkToPage"
          @cell-mouse-enter="showElseButtonInRow"
          @cell-mouse-leave="hideElseButtonInRow"
        >
          <el-table-column type="selection" width="45"> </el-table-column>
          <el-table-column prop="name" label="Имя" min-width="300">
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
    </el-row>
  </div>
</template>

<script>
import ClientAddDialog from "../components/ClientAddDialog.vue";

export default {
  name: "client-list",
  components: {
    ClientAddDialog,
  },
  data() {
    return {
      formLabelWidth: "50%",
      multipleSelection: [],
      showDeleteButton: false,
      visibleArray: {},
    };
  },
  methods: {
    linkToPage(cell) {
      this.$router.push({ path: "/clients/" + cell.code });
    },
    showAddDialog() {
      let form = {};
      form.code = "";
      form.short_name = "";
      form.full_name = "";
      form.inn = 0;
      form.deal_num = "";
      // let date = new Date();
      form.deal_date = "";
      form.deal_sub = "";
      form.cont_deal = [];
      form.cont_tech = [];
      form.sale = 0;
      form.manager = "";
      this.$store.commit("nullClientAddForm");
      this.$store.commit("setClientAddForm", form);
      this.$store.commit("showAddClientDialog");
    },
    deleteClients() {
      this.multipleSelection.forEach((element) => {
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
            }
            this.$store.dispatch("getClientsFromBitrix");
          });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
    },
    // toggleSelection(row) {
    //   if (row) {
    //     this.$refs.multipleTable.toggleRowSelection(row);
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
    showElseButtonInRow(row) {
      this.visibleArray[row.id] = true;
    },
    hideElseButtonInRow(row) {
      this.visibleArray[row.id] = false;
    },
  },
  computed: {
    gridDataClient() {
      const clients = this.$store.getters.clientsData;
      const users = this.$store.getters.usersData;
      let gridClient = [];
      clients.forEach((element) => {
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
      });
      return gridClient;
    },
  },
  async mounted() {
    if (Object.keys(this.$store.getters.usersData).length == 0) {
      await this.$store.dispatch("getUsersFromBitrix");
      await this.$store.dispatch("getClientsFromBitrix");
    } else {
      this.$store.dispatch("getClientsFromBitrix");
    }
    if (this.$store.getters.postsData.length == 0) {
      await this.$store.dispatch("getPostavshicsFromBitrix");
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
