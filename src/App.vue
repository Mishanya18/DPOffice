<template>
  <el-container style="height: 100vh;">
    <el-aside width="150px">
      <nav-menu />
    </el-aside>

    <el-container>
      <el-header>
        <bread-crumb />
      </el-header>

      <el-main style="padding: 10px; padding-top: 5px; ">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import BreadCrumb from "./components/BreadCrumb.vue";
import NavMenu from "./components/NavMenu.vue";

export default {
  name: "App",
  components: {
    BreadCrumb,
    NavMenu,
  },
};
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: IBM Plex Sans, ArialMT, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
