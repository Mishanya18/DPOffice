<template>
  <div class="screen">
    <aside class="screen">
      <nav-menu />
    </aside>
    <main class="main">
      <nav class="navbar">
        <bread-crumb />
      </nav>
      <div class="content">
        content
        <!-- <router-view></router-view> -->
      </div>
    </main>
  </div>
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
.screen {
  min-height: 100vh;
  display: flex;
}
.main {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.navbar {
  padding: 15px;
}
.content {
  /* background-color: red; */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
