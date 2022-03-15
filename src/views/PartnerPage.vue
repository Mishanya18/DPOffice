<template>
  <el-container direction="vertical">
    <el-tabs type="card">
      <el-tab-pane label="Информация о партнере">
        <el-row>
          <el-col :span="24">
            <partner-description />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Услуги">
        <el-row>
          <el-col :span="24">
            <partner-services />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Потребление">
        <el-row>
          <el-col :span="24">
            <partner-consumption />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
import PartnerDescription from "../components/Partner/PartnerDescription.vue";
import PartnerServices from "../components/Partner/PartnerServices.vue";
import PartnerConsumption from "../components/Partner/PartnerConsumption.vue";

export default {
  components: { PartnerDescription, PartnerServices, PartnerConsumption },
};
</script>
