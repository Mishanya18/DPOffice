<template>
  <el-container direction="vertical">
    <service-add-dialog />
    <client-add-dialog @edited="refreshClientParams" />

    <el-tabs type="card">
      <el-tab-pane label="Информация о клиенте">
        <el-row>
          <el-col :span="24">
            <client-description :key="descriptionComponentKey" />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Online услуги">
        <el-row>
          <el-col :span="24">
            <client-service-table />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Offline слуги">
        <el-row>
          <el-col :span="24">
            <client-offline-service-table />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Потребление O2">
        <el-row>
          <el-col :span="24">
            <client-consumption />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Потребление у партнеров">
        <el-row>
          <el-col :span="24">
            <client-partners-consumption />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
import ServiceAddDialog from "../components/ServiceAddDialog.vue";
import ClientAddDialog from "../components/ClientAddDialog.vue";
import ClientDescription from "../components/ClientsInTest/ClientInTestDescription.vue";
import ClientServiceTable from "../components/ClientsInTest/ClientInTestServiceTable.vue";
import ClientOfflineServiceTable from "../components/ClientsInTest/ClientInTestOfflineServiceTable.vue";
import ClientConsumption from "../components/ClientsInTest/ClientInTestConsumption.vue";
import ClientPartnersConsumption from "../components/ClientsInTest/ClientInTestPartnersConsumption.vue";

export default {
  components: {
    ServiceAddDialog,
    ClientAddDialog,
    ClientDescription,
    ClientServiceTable,
    ClientOfflineServiceTable,
    ClientConsumption,
    ClientPartnersConsumption,
  },
  data() {
    return {
      editable: false,
      multipleSelection: [],
      showDeleteButton: false,
      descriptionComponentKey: 0,
    };
  },

  methods: {
    refreshClientParams() {
      this.descriptionComponentKey += 1;
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
}
.param {
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  font-size: 14px;
  color: #606266;
}
</style>
