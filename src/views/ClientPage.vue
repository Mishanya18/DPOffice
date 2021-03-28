<template>
  <el-container direction="vertical">
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
                <el-button
                  type="text"
                  class="link p-0"
                  @click="showAddDialogForm"
                >
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
        <p class="param">Пример</p>

        <p class="label">Code в o2.d-platforms.ru</p>
        <p class="param">Пример</p>

        <p class="label">Номер договора</p>
        <p class="param">Пример</p>

        <p class="label">Дополнительное соглашение к договору</p>
        <p class="param">Пример</p>

        <p class="label">Контактное лицо по договору</p>
        <p class="param">Пример</p>

        <p class="label">Дата создания</p>
        <p class="param">Пример</p>
      </el-col>
      <el-col :span="10" :offset="2">
        <p class="label">Полное наименование</p>
        <p class="param">Пример</p>

        <p class="label">ИНН</p>
        <p class="param">Пример</p>

        <p class="label">Предмет договора</p>
        <p class="param">Пример</p>

        <p class="label">Дата договора</p>
        <p class="param">Пример</p>

        <p class="label">Контактное лицо техподдержки</p>
        <p class="param">Пример</p>

        <p class="label">Ответственный менеджер</p>
        <p class="param">Пример</p>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      editable: false,
      multipleSelection: [],
      showDeleteButton: false,
      clientNameParams: {},
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
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
    // this.getClientNameParams();
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
}
.param {
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  font-size: 14px;
}
</style>
