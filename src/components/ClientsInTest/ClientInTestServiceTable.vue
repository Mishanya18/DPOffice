<template>
  <el-container direction="vertical">
    <el-row>
      <el-col :span="24">
        <el-table
          :data="gridClientServicesData"
          ref="multipleTable"
          @row-click="showEditDialogForm"
          :row-style="rowStyle"
        >
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
    </el-row>

    <client-online-service-edit-dialog
      :key="editDialogKey"
      v-if="isFormEdit"
      :serviceProps="form"
    />
  </el-container>
</template>

<script>
import ClientOnlineServiceEditDialog from "./ClientInTestOnlineServiceEditDialog.vue";

export default {
  components: {
    ClientOnlineServiceEditDialog,
  },
  data() {
    return {
      form: {},
      isFormEdit: false,
      editDialogKey: 0,
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
    rowStyle() {
      return { cursor: "pointer" };
    },
  },
};
</script>

<style scoped>
.icon {
  font-size: 28px;
}
</style>
