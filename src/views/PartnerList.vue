<template>
  <partner-add-edit-dialog
    v-if="showDialog"
    :dialogFormVisible="showDialog"
    :forma="form"
    @dialogClose="showDialog = false"
    @refreshList="refreshList()"
  />

  <el-row>
    <el-col :span="23">
      <el-table
        :data="gridDataPartner"
        @row-click="linkToPage"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :row-style="rowStyle"
      >
        <el-table-column type="selection" width="45"> </el-table-column>
        <el-table-column
          prop="name"
          label="Имя"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="deal_num"
          label="Номер договора"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="deal_date"
          label="Дата договора"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="manager"
          label="Ответственный"
          min-width="150"
        ></el-table-column>
      </el-table>
    </el-col>
    <el-col :span="1" v-if="right">
      <el-dropdown
        trigger="click"
        style="margin-left: 1vh;"
        :hide-on-click="false"
      >
        <span class="el-dropdown-link">
          <i class="el-icon-more icon"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-row class="p-0">
              <el-button
                type="text"
                class="link p-0"
                @click="showAddPartnerDialog"
              >
                <el-dropdown-item class="dropdown-item">
                  Добавить партнера
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
                @confirm="deletePartner"
                placement="top"
              >
                <template #reference>
                  <el-button type="text" class="link p-0 m-0">
                    <el-dropdown-item class="dropdown-item">
                      Удалить партнера
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
</template>

<script>
import PartnerAddEditDialog from "../components/Partner/PartnerAddEditDialog.vue";

export default {
  name: "partner-list",
  components: {
    PartnerAddEditDialog,
  },
  data() {
    return {
      multipleSelection: [],
      showDeleteButton: false,
      showDialog: false,
      form: {},
    };
  },
  methods: {
    linkToPage(cell) {
      this.$router.push({ path: "/partner/" + cell.name });
    },
    showAddPartnerDialog() {
      this.showDialog = true;
      this.form.title = "Добавить партнера";
      this.form.short_name = "";
      this.form.full_name = "";
      this.form.inn = 0;
      this.form.deal_num = 0;
      let date = new Date();
      this.form.deal_date = date;
      this.form.cont_deal = [];
      this.form.cont_tech = [];
      this.form.manager = "";
      this.form.isPartnerEdit = false;
    },
    rowStyle() {
      return "cursor: pointer";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
    },
    deletePartner() {
      this.multipleSelection.forEach((element) => {
        let partnersDCs = this.$store.getters.dcsData.find(
          (dc) => dc.POST_NAME === element.id
        );
        if (!partnersDCs) {
          fetch(
            "https://bitrix.d-platforms.ru/rest/54/j2ddrqogky8h0nmn/lists.element.delete.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=39&ELEMENT_ID=" +
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
                this.$store.dispatch("getPostavshicsFromBitrix");
              }
            });
        } else {
          this.$messageBox({
            message: "Удалите все ЦОДы, входящие в состав Партнера!",
            type: "error",
          });
        }
      });
    },
    refreshList() {
      this.$store.dispatch("getPostavshicsFromBitrix");
      this.showDialog = false;
    },
  },
  computed: {
    gridDataPartner() {
      return this.$store.getters.postsGridData;
    },
    right() {
      return this.$store.getters.isLogged;
    },
  },
  async mounted() {
    if (Object.keys(this.$store.getters.usersData).length == 0) {
      await this.$store.dispatch("getUsersFromBitrix");
      await this.$store.dispatch("getPostavshicsFromBitrix");
    } else {
      this.$store.dispatch("getPostavshicsFromBitrix");
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
tr {
  cursor: pointer !important;
}
</style>
