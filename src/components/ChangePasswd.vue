<template>
  <el-dialog
    title="Смена пароля"
    v-model="visible"
    @close="dialogClose"
    width="20%"
  >
    <el-form :model="form" :rules="rules" ref="form" label-position="top">
      <el-row>
        <el-col>
          <el-form-item label="Новый пароль" prop="new_password">
            <el-input v-model="form.new_password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="Повторите новый пароль" prop="retype_password">
            <el-input v-model="form.retype_password" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button @click="dialogClose">Отмена</el-button> -->
        <el-button type="primary" @click="handleChangePasswd">
          Изменить пароль
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { HmacSHA512, enc } from "crypto-js";

export default {
  props: ["dialogVisible"],
  emits: ["dialogClose", "success", "failed"],
  data() {
    return {
      form: {},
      visible: false,
      rules: {
        new_password: [
          {
            required: true,
            message: "Введите новый пароль",
            trigger: "blur",
          },
        ],
        retype_password: [
          {
            required: true,
            message: "Повторите новый пароль",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    dialogVisible() {
      this.form = {};
      this.visible = this.dialogVisible;
    },
  },
  methods: {
    handleChangePasswd() {
      if (this.form.new_password != this.form.retype_password) {
        this.$message({
          message: "Введённые пароли не совпадают!",
          type: "error",
        });
      } else {
        let user = this.$store.getters.currentUser;
        let hash = HmacSHA512(
          this.form.new_password,
          "Secret Passphrase"
        ).toString(enc.Hex);
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.update.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=51&ELEMENT_ID=" +
          user.PASSWDCHA__ID +
          "&FIELDS[NAME]=" +
          user.PASSWDCHA_NAME +
          "&FIELDS[PROPERTY_310]=" + //пользователь
          user.ID +
          "&FIELDS[PROPERTY_311]=" + //права
          "103" +
          "&FIELDS[PROPERTY_312]=" + //пароль
          hash +
          "&FIELDS[PROPERTY_313]=" + //email
            user.EMAIL
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              console.log(data);
            } else {
              this.dialogClose();
            }
          });
      }
    },
    dialogClose() {
      this.$emit("dialogClose");
    },
  },
};
</script>
