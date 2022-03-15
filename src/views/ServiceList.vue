<template>
  <el-container direction="vertical">
    <el-row type="flex">
      <el-col :span="23">
        <el-tabs type="card" @tab-click="handleClick">
          <el-tab-pane label="Price List 1">
            <el-row>
              <el-col :span="24">
                <service-table :data="gridDataService"></service-table>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Price List 2">
            <el-row>
              <el-col :span="24">
                <service-table :data="gridDataService"></service-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="1">
        <el-dropdown trigger="click">
          <span>
            <i class="el-icon-more icon"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-row>
                <el-button type="text" class="link">
                  <el-dropdown-item disabled class="dropdown-item">
                    Добавить услугу
                  </el-dropdown-item>
                </el-button>
              </el-row>
              <el-row>
                <el-button type="text" class="link">
                  <el-dropdown-item disabled class="dropdown-item">
                    Изменить услугу
                  </el-dropdown-item>
                </el-button>
              </el-row>
              <el-row>
                <el-button type="text" class="link">
                  <el-dropdown-item disabled class="dropdown-item">
                    Удалить услугу
                  </el-dropdown-item>
                </el-button>
              </el-row>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import ServiceTable from "../components/ServiceTable.vue";

export default {
  name: "service-list",
  components: {
    ServiceTable,
  },
  data() {
    return {
      tabLabel: 0,
    };
  },
  computed: {
    gridDataService() {
      if (this.tabLabel == 0) {
        return this.$store.getters.serviceGridData;
      } else {
        return this.$store.getters.serviceGridDataPL2;
      }
    },
  },
  methods: {
    handleClick(tab) {
      this.tabLabel = tab.index;
    },
  },
  async mounted() {
    if (Object.keys(this.$store.getters.dcsData).length == 0) {
      await this.$store.dispatch("getDCFromBitrix");
      await this.$store.dispatch("getServicesFromBitrix");
    } else {
      this.$store.dispatch("getServicesFromBitrix");
    }
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
.icon {
  font-size: 28px;
  margin: 10px;
}
.dropdown-item {
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  font-size: 15px;
}
.link {
  font-size: 15px;
  color: #606266;
  width: 180px;
  padding: 0px;
}
</style>
