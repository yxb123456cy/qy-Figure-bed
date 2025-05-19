import { execSync } from 'child_process'
import { program } from 'commander'

// 统一的错误处理函数
const handleError = (error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
}

// Git 操作帮助类
class GitHelper {
  static init() {
    try {
      execSync('git init', { stdio: 'inherit' })
      console.log('✅ Git repository initialized')
    } catch (error) {
      handleError(error)
    }
  }

  static commit(msg = 'Auto commit') {
    try {
      execSync('git add .', { stdio: 'inherit' })
      execSync(`git commit -m "${msg}"`, { stdio: 'inherit' })
    } catch (error) {
      handleError(error)
    }
  }

}

// 导出命令配置函数
export const gitHelperCommand = () => {
  program
    .command('git')
    .description('Git 操作助手')
    .command('init')
    .description('初始化 Git 仓库')
    .action(GitHelper.init)

  program
    .command('commit')
    .description('快速提交更改')
    .option('-m, --message <message>', '提交信息', 'Auto commit')
    .action((options) => {
      GitHelper.commit(options.message)
    })
}