import LocaleSwitch from "./core/LocaleSwitch.vue"
import ThemeToggle from "./core/ThemeToggle.vue"

export default {
  install(app) {
    app.component("LocaleSwitch", LocaleSwitch)
    app.component("ThemeToggle", ThemeToggle)
  }
}