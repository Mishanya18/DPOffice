<template>
  <el-container direction="vertical">
    <el-row>
      <el-col :span="23">
        <el-table
          :data="gridClientServicesData"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @row-click="showEditDialogForm"
          :row-style="rowStyle"
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
      </el-col>
      <el-col :span="1" v-if="right">
        <el-dropdown trigger="click" style="margin-left: 1vh;">
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
                        Удалить услугу
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

    <client-online-service-edit-dialog
      :key="editDialogKey"
      v-if="isFormEdit"
      :serviceProps="form"
    />
    <individ-service-add-dialog
      v-if="addIndividServiceVisible"
      :forma="form"
      :visible="addIndividServiceVisible"
      @dialogClose="addIndividServiceVisible = false"
      @refreshTest="refreshTest()"
    />
  </el-container>
</template>

<script>
import ClientOnlineServiceEditDialog from "./ClientOnlineServiceEditDialog.vue";
import IndividServiceAddDialog from "./components/IndividServiceAddDialog.vue";

export default {
  components: {
    ClientOnlineServiceEditDialog,
    IndividServiceAddDialog,
  },
  data() {
    return {
      form: {},
      isFormEdit: false,
      editDialogKey: 0,
      multipleSelection: [],
      showDeleteButton: false,
      addIndividServiceVisible: false,
    };
  },
  computed: {
    gridClientServicesData() {
      let services = this.$store.getters.clientServicesData(
        this.$route.params.clientCode
      );
      let onlineServices = [];
      services.forEach((element) => {
        if (element.billing == 95) {
          onlineServices.push(element);
        }
      });
      return onlineServices;
    },
    right() {
      return this.$store.getters.isLogged;
    },
  },
  methods: {
    showEditDialogForm(row) {
      if (this.right) {
        this.form.title = "Изменить услугу";
        this.form.serviceID = row.id;
        if (row.startDateTime) {
          let dateArrStart = row.startDateTime.split(".");
          this.form.startDateTime = new Date(
            dateArrStart[2],
            dateArrStart[1] - 1,
            dateArrStart[0]
          );
        }
        if (row.endDateTime) {
          let dateArrEnd = row.endDateTime.split(".");
          this.form.endDateTime = new Date(
            dateArrEnd[2],
            dateArrEnd[1] - 1,
            dateArrEnd[0]
          );
        }
        this.form.sale_num = parseInt(row.sale);
        this.form.service = this.$store.getters.serviceIDByName(row.name);
        this.form.DC = [];
        this.form.DC[0] = this.$store.getters.postIDByName(row.post);
        this.form.DC[1] = this.$store.getters.dcIDByName(row.data_center);
        this.form.optionsServices = this.$store.getters.clientAddServiceServices(
          this.form.DC[1]
        );
        this.form.amount = parseInt(row.amount);
        this.form.editDialogVisible = true;
        this.form.clientID = this.$store.getters.clientIDByCode(
          this.$route.params.clientCode
        );
        this.isFormEdit = true;
        this.editDialogKey += 1;
      }
    },
    showAddDialogForm() {
      this.form.title = "Добавить услугу";
      this.form.startDateTime = "";
      this.form.endDateTime = "";
      this.form.sale_num = 0;
      this.form.service = "";
      this.form.DC = [];
      this.form.optionsServices = [];
      this.form.isEditDialog = false;
      this.form.amount = 0;
      this.form.editDialogVisible = false;
      this.form.clientID = this.$store.getters.clientIDByCode(
        this.$route.params.clientCode
      );
      this.addIndividServiceVisible = true;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
    },
    rowStyle() {
      return { cursor: "pointer" };
    },
  },
  async mounted() {
    await this.$store.dispatch("getClientsServsFromBitrix", {
      client_code: this.$route.params.clientCode,
    });
  },
};
</script>

<style scoped>
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
