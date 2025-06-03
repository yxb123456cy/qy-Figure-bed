const modules = import.meta.glob('./core/*.js', {
    eager: true,
})
  
export const registerPlugins = (app) => {
    Object.values(modules).forEach((module) => {
        app.use(module.default)
    })
}
