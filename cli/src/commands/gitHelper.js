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

  static newBranch(branchName) {
    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' })
    } catch (error) {
      handleError(error)
    }
  }

  static remoteBranchExists(remote, branchName) {
    try {
      const output = execSync(`git ls-remote --heads ${remote} ${branchName}`).toString()
      return output.trim() !== ''
    } catch (error) {
      return false
    }
  }

  static pushRemote(remote = 'origin') {
    try {
      const currentBranch = execSync('git branch --show-current').toString().trim()

        // 安全检查：禁止直接推送主分支
        if (['main', 'master', 'release'].includes(currentBranch)) {
            console.error('🚫 禁止直接推送主分支，请使用合并请求（MR）流程')
            process.exit(1)
        }

        // 安全检查：分支命名规范
        // const branchPattern = /^(feature|bugfix|hotfix)\/[a-z0-9-_]+/
        // if (!branchPattern.test(currentBranch)) {
        //     console.error('⚠️ 分支命名不规范，推荐格式：')
        //     console.error('  feature/新功能名称')
        //     console.error('  bugfix/问题描述')
        //     console.error('  hotfix/紧急修复描述')
        //     process.exit(1)
        // }
      
      // 检查远程分支是否存在
      if (this.remoteBranchExists(remote, currentBranch)) {
        console.log(`🔁 同步远程变更 ${remote}/${currentBranch}...`)
        try {
          // 使用 merge 方式拉取变更
          execSync(`git pull ${remote} ${currentBranch} --no-rebase`, { stdio: 'inherit' })
        } catch (pullError) {
          console.error('\n⚠️ 合并冲突检测！请按以下步骤操作：')
          console.error('1. 手动解决冲突文件（git status 查看冲突文件）')
          console.error('2. 添加解决后的文件: git add <file>')
          console.error('3. 完成合并提交: git commit -m "Merge conflict resolution"')
          console.error('4. 再次运行推送命令')
          handleError(pullError)
        }
      }

      console.log(`🚀 推送变更到 ${remote}/${currentBranch}...`)
      execSync(`git push ${remote} ${currentBranch}`, { stdio: 'inherit' })
      
      // 首次推送时设置上游分支
      if (!this.remoteBranchExists(remote, currentBranch)) {
        execSync(`git push -u ${remote} ${currentBranch}`, { stdio: 'inherit' })
      }
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

  program
    .command('new-branch <name>')
    .description('创建并切换到新分支')
    .action(GitHelper.newBranch)

  program  
    .command('push')
    .description('推送当前分支到远程仓库（自动拉取更新）')
    .option('-r, --remote <name>', '远程仓库名称', 'origin')
    .action((options) => {
      GitHelper.pushRemote(options.remote)
    })
}