import common from './common'
import pro from './pro'
import ui from './ui'

export default {
  install(app) {
    [common, pro, ui].forEach(module => {
      app.use(module)
    })
  }
}