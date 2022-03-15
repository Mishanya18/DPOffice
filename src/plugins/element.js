import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import ru from "element-plus/es/locale/lang/ru.js";

export default (app) => {
  app.use(ElementPlus, { locale: ru });
};
