<template>
  <el-dialog
    title="Добавить предоставляемую партнером услугу"
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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="Краткое название"
            prop="short_name"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.short_name"></el-input>
          </el-form-item>
          <el-form-item
            label="Единица измерения"
            prop="unit"
            :label-width="formLabelWidth"
          >
            <el-select v-model="form.unit" placeholder="" style="width: 100%;">
              <el-option
                v-for="item in optionsUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Способ биллинга"
            prop="billing_type"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.billing_type"
              placeholder=""
              style="width: 100%;"
            >
              <el-option
                v-for="item in optionsBilling"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Полное наименование"
            prop="full_name"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.full_name"></el-input>
          </el-form-item>
          <el-form-item label="Цена" prop="price" :label-width="formLabelWidth">
            <el-input-number
              v-model="form.price"
              :controls="false"
              :min="0"
              style="width: 100%;"
            ></el-input-number>
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
        short_name: [
          {
            required: true,
            message: "Введите краткое название услуги",
            trigger: "blur",
          },
        ],
        full_name: [
          {
            required: true,
            message: "Введите полное наименование услуги",
            trigger: "blur",
          },
        ],
        billing_type: [
          {
            required: true,
            message: "Выберите способ биллинга",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "Введите цену",
            trigger: "blur",
          },
        ],
        unit: [
          {
            required: true,
            message: "Выберите еденицу измерения",
            trigger: "blur",
          },
        ],
      },
      form: this.forma,
      optionsUnit: [
        {
          value: "91",
          label: "Ядро/час",
        },
        {
          value: "92",
          label: "Гбайт/час",
        },
        {
          value: "93",
          label: "шт./мес.",
        },
        {
          value: "94",
          label: "шт./час",
        },
      ],
      optionsBilling: [
        {
          value: "95",
          label: "Online",
        },
        {
          value: "96",
          label: "Offline",
        },
      ],
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
            "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.add.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=42&ELEMENT_CODE=" +
            this.form.short_name +
            this.form.price +
            "&FIELDS[NAME]=" +
            this.form.short_name +
            "&FIELDS[PROPERTY_225]=" + //Полное название
            this.form.full_name +
            "&FIELDS[PROPERTY_226]=" + //Единица измерения
            this.form.unit +
            "&FIELDS[PROPERTY_227]=" + //Цена
            this.form.price +
            "&FIELDS[PROPERTY_228]=" + //ЦОД
            this.form.dc +
            "&FIELDS[PROPERTY_242]=" + //Способ биллинга
              this.form.billing_type
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
