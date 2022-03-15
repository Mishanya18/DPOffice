<template>
  <el-row>
    <el-col :span="23">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="link in linksArray"
          :key="link.label"
          :to="link.to"
          class="label-style"
          >{{ link.label }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-col>
    <el-col :span="1">
      <el-row justify="center" style="padding-top: 15px;">
        <el-dropdown @command="handleGuestCommand" v-if="!isLogedIn">
          <el-avatar :size="40" :src="circleUrl"></el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="Login">Login</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown @command="handleUserCommand" v-else>
          <el-avatar :size="40">{{ avatarName }}</el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="ChangePasswd">
                Change password
              </el-dropdown-item>
              <el-dropdown-item command="Logout" style="width: 100%">
                <el-row justify="center">
                  Logout
                </el-row>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-row>
    </el-col>
    <auth
      :dialogLoginVisible="loginVisible"
      @dialogClose="loginVisible = false"
      @success="handleSuccess"
    />

    <change-passwd
      :dialogVisible="changePasswdVisible"
      @dialogClose="changePasswdVisible = false"
    />
  </el-row>
</template>

<script>
const BREADCRUMB_NAMES = {
  clients: "Клиенты",
  partner: "Партнеры",
  service: "Услуги",
  reports: "Отчёты",
  clientsintest: "Клиенты в тесте",
};

import Auth from "./Auth.vue";
import ChangePasswd from "./ChangePasswd.vue";

export default {
  name: "bread-crumb",
  components: {
    Auth,
    ChangePasswd,
  },
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      loginVisible: false,
      changePasswdVisible: false,
      avatarName: "",
    };
  },
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
    isLogedIn() {
      return this.$store.getters.isLogged;
    },
  },
  methods: {
    handleGuestCommand(command) {
      if (command == "Login") {
        this.loginVisible = true;
      }
    },
    handleUserCommand(command) {
      if (command == "Logout") {
        this.isLogedIn = false;
        this.$store.commit("LogOff");
      }
      if (command == "ChangePasswd") {
        this.changePasswdVisible = true;
      }
    },
    handleSuccess(val) {
      this.avatarName = val;
      // this.isLogedIn = true;
      this.$store.commit("LogOn");
      this.loginVisible = false;
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
