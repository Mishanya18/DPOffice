<template>
  <el-container direction="vertical">
    <el-tabs tab-position="left" v-if="DCs.length">
      <el-tab-pane v-for="dc in DCs" :key="dc.key" :label="dc.name">
        <el-row>
          <el-col :span="23">
            <partner-service-table
              :key="serviceTableKey"
              style="width: 100%"
              :data="gridDataService(dc.id)"
              @showDelete="handleSelectChange"
              @hideDelete="showDeleteButton = false"
            ></partner-service-table>
          </el-col>
          <el-col :span="1">
            <el-dropdown
              trigger="click"
              style="margin-left: 1vh;"
              :hide-on-click="false"
              v-if="right"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-more icon"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-row class="p-0">
                    <el-button type="text" class="link p-0" @click="showDialog">
                      <el-dropdown-item class="dropdown-item">
                        Добавить ЦОД
                      </el-dropdown-item>
                    </el-button>
                  </el-row>
                  <el-row class="p-0">
                    <el-button
                      type="text"
                      class="link p-0"
                      @click="showServiceDialog(dc.id)"
                    >
                      <el-dropdown-item class="dropdown-item">
                        Добавить услугу
                      </el-dropdown-item>
                    </el-button>
                  </el-row>
                  <el-row class="mar-pad-element">
                    <el-popconfirm
                      confirm-button-text="Да"
                      cancel-button-text="Нет"
                      icon="el-icon-info"
                      icon-color="red"
                      title="Вы уверены?"
                      @confirm="deleteCod(dc.id)"
                      placement="top"
                    >
                      <template #reference>
                        <el-button type="text" class="link p-0 m-0">
                          <el-dropdown-item divided class="dropdown-item">
                            Удалить ЦОД
                          </el-dropdown-item>
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </el-row>
                  <el-row class="mar-pad-element" v-if="showDeleteButton">
                    <el-popconfirm
                      confirm-button-text="Да"
                      cancel-button-text="Нет"
                      icon="el-icon-info"
                      icon-color="red"
                      title="Вы уверены?"
                      @confirm="deleteService"
                      placement="top"
                    >
                      <template #reference>
                        <el-button type="text" class="link p-0 m-0">
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
      </el-tab-pane>
    </el-tabs>

    <el-row v-else>
      <el-col :span="23">
        <el-row justify="center">
          ЦОДы ещё не добавлены
        </el-row>
      </el-col>
      <el-col :span="1">
        <el-dropdown
          trigger="click"
          style="margin-left: 1vh;"
          :hide-on-click="false"
          v-if="right"
        >
          <span class="el-dropdown-link">
            <i class="el-icon-more icon"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-row class="p-0">
                <el-button type="text" class="link p-0" @click="showDialog">
                  <el-dropdown-item class="dropdown-item">
                    Добавить ЦОД
                  </el-dropdown-item>
                </el-button>
              </el-row>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>

    <partner-add-cod
      v-if="showAddCODDialog"
      :dialogFormVisible="showAddCODDialog"
      :forma="form"
      @dialogClose="showAddCODDialog = false"
      @refreshList="refreshTest()"
    />
    <partner-add-service
      v-if="showAddServiceDialog"
      :dialogFormVisible="showAddServiceDialog"
      :forma="serviceForm"
      @dialogClose="showAddServiceDialog = false"
      @refreshList="refreshServices()"
    />
  </el-container>
</template>

<script>
import PartnerServiceTable from "./PartnerServiceTable.vue";
import PartnerAddCod from "./PartnerAddCOD.vue";
import PartnerAddService from "./PartnerAddService.vue";

export default {
  components: {
    PartnerServiceTable,
    PartnerAddCod,
    PartnerAddService,
  },
  data() {
    return {
      DCs: [],
      form: {},
      serviceForm: {},
      showAddCODDialog: false,
      showAddServiceDialog: false,
      serviceTableKey: 0,
      showDeleteButton: false,
      multipleSelection: [],
    };
  },
  computed: {
    right() {
      return this.$store.getters.isLogged;
    },
  },
  methods: {
    gridDataService(dcID) {
      return this.$store.getters.partnerServices(dcID);
    },
    getDCList() {
      this.DCs = [];
      this.$store.getters.dcsData.forEach((element) => {
        if (
          element.POST_NAME ===
          this.$store.getters.postIDByName(this.$route.params.partnerName)
        ) {
          var dc = new Object();

          dc.id = parseInt(element.ID);
          dc.key = parseInt(element.ID);
          dc.name = element.NAME;
          this.DCs.push(dc);
        }
      });
    },
    showDialog() {
      this.form.name = "";
      this.form.partner = this.$route.params.partnerName;
      this.showAddCODDialog = true;
    },
    refreshTest() {
      this.$store.dispatch("getDCFromBitrix").then(() => {
        this.getDCList();
      });
      this.showAddCODDialog = false;
    },
    refreshServices() {
      this.$store.dispatch("getServicesFromBitrix");
      this.serviceTableKey++;
    },
    deleteCod(dcid) {
      let servicesOfDC = this.$store.getters.partnerServices(dcid);
      if (!servicesOfDC.length) {
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/j2ddrqogky8h0nmn/lists.element.delete.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=40&ELEMENT_ID=" +
            dcid
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              this.$message.error("Не удалось удалить ЦОД.");
            } else {
              this.$message({
                message: "ЦОД успешно удален.",
                type: "success",
              });
              this.$store.dispatch("getDCFromBitrix").then(() => {
                this.getDCList();
              });
            }
          });
      } else {
        this.$messageBox({
          message: "Удалите все услуги, входящие в состав ЦОДа!",
          type: "error",
        });
      }
    },
    showServiceDialog(dcid) {
      this.serviceForm.dc = dcid;
      this.showAddServiceDialog = true;
    },
    deleteService() {
      this.multipleSelection.forEach((element) => {
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=41&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_234]=" +
            element.id
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            for (let i = 0; i < data.result.length; i++) {
              fetch(
                "https://bitrix.d-platforms.ru/rest/54/j2ddrqogky8h0nmn/lists.element.delete.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=41&ELEMENT_ID=" +
                  data.result[i].ID
              )
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  if (data.error) {
                    console.log("Не удалось удалить услугу.");
                  } else {
                    console.log("Услуга успешно удалена.");
                  }
                });
            }
          });

        fetch(
          "https://bitrix.d-platforms.ru/rest/54/j2ddrqogky8h0nmn/lists.element.delete.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=42&ELEMENT_ID=" +
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
              this.refreshServices();
              this.showDeleteButton = false;
            }
          });
      });
    },
    handleSelectChange(val) {
      this.showDeleteButton = true;
      this.multipleSelection = val;
    },
  },
  async mounted() {
    await this.$store.dispatch("getDCFromBitrix");
    await this.$store.dispatch("getServicesFromBitrix");
    this.getDCList();
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
