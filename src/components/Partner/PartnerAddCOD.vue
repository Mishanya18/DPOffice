<template>
  <el-dialog
    :title="form.title"
    v-model="visible"
    @close="dialogClose"
    width="60%"
    top="10vh"
  >
    <el-form
      size="mini"
      :model="form"
      :rules="rules"
      ref="form"
      label-position="top"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="Название"
            prop="name"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Отмена</el-button>
        <el-button type="primary" @click="commitFormAdd">Добавить</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: ["forma", "dialogFormVisible"],
  emits: ["dialogClose", "refreshList"],
  data() {
    return {
      formLabelWidth: "50%",
      visible: this.dialogFormVisible,
      rules: {
        name: [
          {
            required: true,
            message: "Введите название ЦОДа",
            trigger: "blur",
          },
        ],
      },
      form: this.forma,
    };
  },
  methods: {
    dialogClose() {
      this.$emit("dialogClose");
    },
    commitFormAdd() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          fetch(
            "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.add.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=40&ELEMENT_CODE=" +
            this.form.name +
            this.form.partner +
            "&FIELDS[NAME]=" +
            this.form.name +
            "&FIELDS[PROPERTY_222]=" + //партнер
              this.$store.getters.postIDByName(this.form.partner)
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.error) {
                console.log(data);
              } else {
                this.dialogClose();
                this.$emit("refreshList");
              }
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
