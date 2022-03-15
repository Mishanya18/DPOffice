<template>
  <el-container direction="vertical">
    <el-row>
      <el-col :span="23">
        <el-table
          :data="gridClientServicesData"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          @row-dblclick="showEditDialogForm"
          :row-style="rowStyle"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="expand">
            <template #default="props">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2 }"
                :disabled="true"
                class="textarea"
                placeholder="Содержание услуги"
                v-model="props.row.info"
              >
              </el-input>
            </template>
          </el-table-column>
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
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      multipleSelection: [],
      showDeleteButton: false,
    };
  },
  computed: {
    gridClientServicesData() {
      let services = this.$store.getters.clientServicesData(
        this.$route.params.clientCode
      );
      let offlineServices = [];
      services.forEach((element) => {
        if (element.billing == 96) {
          offlineServices.push(element);
        }
      });
      return offlineServices;
    },
    right() {
      return this.$store.getters.isLogged;
    },
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
    showEditDialogForm(row) {
      if (this.right) {
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
        form.info = row.info;
        form.editDialogVisible = true;
        form.clientID = this.$store.getters.clientIDByCode(
          this.$route.params.clientCode
        );
        form.isEditDialog = true;
        this.$store.commit("nullClientServiceForm");
        this.$store.commit("setClientServiceForm", form);
        this.$store.commit("showAddClientServiceDialog");
      }
    },
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
    rowStyle() {
      return { cursor: "pointer" };
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
.textarea :last-child {
  background-color: #ffffff;
  color: #606266;
  cursor: text;
}
.text {
  overflow-wrap: normal;
  word-wrap: normal;
  word-break: normal !important;
  line-break: auto;
  hyphens: manual;
}
</style>
