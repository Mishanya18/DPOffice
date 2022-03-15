<template>
  <el-row>
    <el-col :span="23">
      <el-descriptions border :column="2">
        <el-descriptions-item label="Краткое наименование">
          {{ partnerParams.name }}
        </el-descriptions-item>
        <el-descriptions-item label="Полное наименование">
          {{ partnerParams.full_name }}
        </el-descriptions-item>
        <el-descriptions-item label="ИНН">
          {{ partnerParams.inn }}
        </el-descriptions-item>
        <el-descriptions-item label="Номер договора">
          {{ partnerParams.deal_num }}
        </el-descriptions-item>
        <el-descriptions-item label="Дата договора">
          {{ partnerParams.deal_date }}
        </el-descriptions-item>
        <el-descriptions-item label="Предмет договора">
          {{ partnerParams.deal_sub }}
        </el-descriptions-item>
        <el-descriptions-item label="Контактное лицо по договору ">
          <p class="param" v-for="Cont in dealCont" :key="Cont">
            {{ Cont }}
          </p>
        </el-descriptions-item>
        <el-descriptions-item label="Контактное лицо техподдержки">
          <p class="param" v-for="Cont in techCont" :key="Cont">
            {{ Cont }}
          </p>
        </el-descriptions-item>
        <el-descriptions-item label="Ответственный менеджер">
          {{ partnerParams.manager }}
        </el-descriptions-item>
        <el-descriptions-item label="Дата создания">
          {{ partnerParams.creation_date }}
        </el-descriptions-item>
      </el-descriptions>
    </el-col>
    <!-- <el-col :span="1" v-if="right">
      <el-dropdown
        trigger="click"
        :hide-on-click="false"
        style="margin-left: 1vh;"
      >
        <span class="el-dropdown-link">
          <i class="el-icon-more icon"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-row>
              <el-button type="text" class="link" @click="showEditClientDialog">
                <el-dropdown-item class="dropdown-item">
                  Изменить клиента
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
                @confirm="deleteClient"
                placement="top"
              >
                <template #reference>
                  <el-button type="text" class="link p-0">
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
    </el-col> -->
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      partnerParams: {},
      techCont: [],
      dealCont: [],
    };
  },
  methods: {
    getContactById(partner, type) {
      partner.forEach((cont) => {
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/d3dkblc1w832p2fu/crm.contact.get.json?ID=" +
            cont
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            let last_name = "";
            let name = "";
            let second = "";
            if (data.result.LAST_NAME != "" && data.result.LAST_NAME != null) {
              last_name = data.result.LAST_NAME + " ";
            }
            if (data.result.NAME != "" && data.result.NAME != null) {
              name = data.result.NAME + " ";
            }
            if (
              data.result.SECOND_NAME != "" &&
              data.result.SECOND_NAME != null
            ) {
              second = data.result.SECOND_NAME;
            }
            let cont = last_name + name + second;
            if (type == "tech") this.techCont.push(cont);
            if (type == "deal") this.dealCont.push(cont);
          });
      });
    },
    getPartnerParams() {
      let partner = this.$store.getters.postPageData(
        this.$route.params.partnerName
      );
      let users = this.$store.getters.usersData;

      this.partnerParams = {
        name: partner.NAME,
        full_name: partner.FULL_NAME ? partner.FULL_NAME : "Не указано",
        inn: partner.INN ? partner.INN : "Не указано",
        deal_num: partner.DEAL_NUM,
        deal_date: partner.DEAL_DATE,
        deal_sub: partner.DEAL_SUB ? partner.DEAL_SUB : "Не указано",
        manager: users[partner.MANAGER],
        manager_id: partner.MANAGER,
        creation_date: partner.CREATION_DATE,
      };
      this.techCont = [];
      this.dealCont = [];
      partner.DEAL_CONT.length
        ? this.getContactById(partner.DEAL_CONT, "deal")
        : (this.dealCont = ["Не указано"]);
      partner.TECH_CONT.length
        ? this.getContactById(partner.TECH_CONT, "tech")
        : (this.techCont = ["Не указано"]);
    },
  },
  created() {
    this.getPartnerParams();
  },
};
</script>

<style scoped>
.param {
  margin: 0px;
}
</style>
