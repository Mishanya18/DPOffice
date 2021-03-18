<template>
  <el-menu class="menu">
    <el-image
      style="width: 125px; height: 38px"
      src="https://o2.d-platforms.ru/brand/logo.svg"
      class="brand"
    ></el-image>
    <el-menu-item index="1" @click="linkToClients">
      <i class="el-icon-user"></i>
      <span>Клиенты</span>
    </el-menu-item>
    <el-menu-item index="2" @click="linkToPosts">
      <i class="el-icon-partly-cloudy"></i>
      <span>Партнеры</span>
    </el-menu-item>
    <el-menu-item index="3" @click="linkToServices">
      <i class="el-icon-shopping-bag-2"></i>
      <span>Услуги</span>
    </el-menu-item>
    <el-menu-item index="4" @click="linkToReports">
      <i class="el-icon-data-line"></i>
      <span>Отчёт</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "nav-menu",
  data() {
    return {
      selected: {
        clients: true,
        partners: false,
        services: false,
        reports: false,
      },
    };
  },
  methods: {
    linkToClients() {
      this.$router.push({ path: "/clients" });
      this.selected.clients = true;
      this.selected.partners = false;
      this.selected.services = false;
      this.selected.reports = false;
    },
    linkToPosts() {
      this.$router.push({ path: "/posts" });
      this.selected.clients = false;
      this.selected.partners = true;
      this.selected.services = false;
      this.selected.reports = false;
    },
    linkToServices() {
      this.$router.push({ path: "/services" });
      this.selected.clients = false;
      this.selected.partners = false;
      this.selected.services = true;
      this.selected.reports = false;
    },
    linkToReports() {
      this.$router.push({ path: "/reports" });
      this.selected.clients = false;
      this.selected.partners = false;
      this.selected.services = false;
      this.selected.reports = true;
    },
  },
};
</script>

<style scoped>
.menu {
  width: 150px;
}
.brand {
  margin-top: 10px;
  margin-left: 10px;
}
</style>
