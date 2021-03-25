<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="link in linksArray"
      :key="link.label"
      :to="link.to"
      class="label-style"
      >{{ link.label }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script>
const BREADCRUMB_NAMES = {
  clients: "Клиенты",
  posts: "Партнеры",
  services: "Услуги",
  reports: "Отчёты",
};

export default {
  name: "bread-crumb",
  computed: {
    linksArray() {
      let links = [];
      let routeArray = this.$route.path.split("/");
      if (routeArray[1]) {
        let link = {
          to: {
            name: routeArray[1],
          },
          label: BREADCRUMB_NAMES[routeArray[1]],
        };
        links.push(link);
      }
      if (routeArray[2]) {
        let link = {
          label: routeArray[2],
        };
        links.push(link);
      }
      return links;
    },
  },
};
</script>

<style scoped>
.label-style {
  font-size: 17px;
  color: #606266;
  line-height: 60px;
}
</style>