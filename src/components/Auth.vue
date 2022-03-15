<template>
  <el-dialog
    v-model="visible"
    @close="dialogClose"
    title="Авторизация"
    width="20%"
    center
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="username@d-platforms.ru"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Cancel</el-button>
        <el-button type="primary" @click="handleLogin">Login</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { HmacSHA512, enc } from "crypto-js";

export default {
  props: ["dialogLoginVisible"],
  emits: ["dialogClose", "success", "failed"],
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!this.validUsername(value)) {
        callback(new Error("Используйте корпоративную почту для входа"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {},
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
      },
      passwordType: "password",
      visible: this.dialogLoginVisible,
    };
  },
  watch: {
    dialogLoginVisible() {
      this.visible = this.dialogLoginVisible;
    },
  },
  methods: {
    validUsername(str) {
      return str.indexOf("@d-platforms.ru") >= 0;
    },
    handleLogin() {
      let hash = HmacSHA512(this.loginForm.password, "Secret Passphrase");
      let userInfo = {
        email: this.loginForm.username,
        password: hash.toString(enc.Hex),
      };
      this.$store.dispatch("getCurrentUser", userInfo).then(() => {
        let user = this.$store.getters.currentUser;
        if (user.ID) {
          let avatarName = user.NAME[0] + user.LAST_NAME[0];
          this.$emit("success", avatarName);
        } else {
          this.$message({
            message: "Связка логин/пароль неверна.",
            type: "error",
          });
          this.loginForm = {};
        }
      });
    },
    dialogClose() {
      this.$emit("dialogClose");
    },
  },
};
</script>
