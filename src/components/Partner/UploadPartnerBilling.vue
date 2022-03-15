<template>
  <el-button
    style="margin-left:16px;"
    size="small"
    type="success"
    @click="handleUpload"
  >
    Сохранить
  </el-button>
</template>

<script>
export default {
  props: ["data", "period", "partner"],
  methods: {
    handleUpload() {
      this.data.forEach((element) => {
        fetch(
          "https://bitrix.d-platforms.ru/rest/54/x8k9x92hq18r7183/lists.element.add.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=49&ELEMENT_CODE=" +
          element.name +
          this.period +
          "&FIELDS[NAME]=" +
          element.name +
          "&FIELDS[PROPERTY_287]=" + //Partner
          this.partner +
          "&FIELDS[PROPERTY_288]=" + //CPU
          element.cpu +
          "&FIELDS[PROPERTY_289]=" + //RAM
          element.ram +
          "&FIELDS[PROPERTY_290]=" + //SSD
          element.ssd +
          "&FIELDS[PROPERTY_291]=" + //SAS
          element.sas +
          "&FIELDS[PROPERTY_292]=" + //SATA
          element.sata +
          "&FIELDS[PROPERTY_293]=" + //Period
            this.period
        )
          .then((response) => {
            return response.json();
          })
          .then((respdata) => {
            if (respdata.error) {
              console.log(respdata);
            } else {
              console.log("Удачная отправка отчёта");
            }
          });
      });
      this.$emit("dialogClose");
    },
  },
};
</script>
