/**
 * Claude Code Post-Response Hook
 *
 * 在 AI 完成回答 (stop) 后自动执行以下功能：
 * 1. 播放完成音效
 * 2. 分析本次代码变更类型
 * 3. 智能推荐下一步操作
 * 4. 清理临时文件（如 Windows 下误创建的 nul 文件）
 *
 * 触发条件: stop (AI 完成回答时)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置选项
const config = {
  enableSound: true,
  soundFile: '',
  enableAnalysis: true,
  enableRecommendations: true,
  enableCleanup: true,
  cleanupPatterns: ['nul', '.DS_Store', 'Thumbs.db', 'tmpclaude-*-cwd'],
  cleanupIgnoreDirs: ['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', 'target', 'vendor'],
  cleanupMaxDepth: 5,
  verbose: true
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'reset') {
  if (config.verbose) {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
}

function printHeader(title) {
  console.log('');
  console.log(`${colors.cyan}${colors.bright}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}║${colors.reset}  ${colors.bright}${title}${colors.reset}                        ${colors.cyan}${colors.bright}║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}╚════════════════════════════════════════╝${colors.reset}`);
  console.log('');
}

// 1. 播放完成音效
function playCompletionSound() {
  if (!config.enableSound) return;
  try {
    const platform = process.platform;
    if (config.soundFile && fs.existsSync(config.soundFile)) {
      if (platform === 'win32') {
        execSync(`powershell -c "(New-Object Media.SoundPlayer '${config.soundFile}').PlaySync()"`, { stdio: 'ignore' });
      } else if (platform === 'darwin') {
        execSync(`afplay '${config.soundFile}'`, { stdio: 'ignore' });
      } else {
        execSync(`aplay '${config.soundFile}'`, { stdio: 'ignore' });
      }
    } else {
      if (platform === 'win32') {
        // 欢快的旋律: 叮-咚-叮-哒！
        execSync('powershell -c "[console]::beep(523, 150)"', { stdio: 'ignore' }); // C5
        execSync('powershell -c "Start-Sleep -Milliseconds 10"', { stdio: 'ignore' });
        execSync('powershell -c "[console]::beep(659, 150)"', { stdio: 'ignore' }); // E5
        execSync('powershell -c "Start-Sleep -Milliseconds 10"', { stdio: 'ignore' });
        execSync('powershell -c "[console]::beep(784, 200)"', { stdio: 'ignore' }); // G5
      } else if (platform === 'darwin') {
        execSync('afplay /System/Library/Sounds/Glass.aiff', { stdio: 'ignore' });
      } else {
        execSync('paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null || echo -e "\\a"', { stdio: 'ignore' });
      }
    }
    log('✓ 完成音效已播放', 'green');
  } catch (error) {
    log(`⚠ 播放音效失败: ${error.message}`, 'yellow');
  }
}

// 2. 分析本次代码变更类型
function analyzeChanges() {
  if (!config.enableAnalysis) return null;
  try {
    const contextData = process.env.CLAUDE_CONTEXT || '{}';
    const context = JSON.parse(contextData);

    const toolUsage = {};
    const fileChanges = { modified: [], created: [], read: [] };
    let totalOperations = 0;

    if (context.toolUses && Array.isArray(context.toolUses)) {
      context.toolUses.forEach(use => {
        const toolName = use.name || 'unknown';
        toolUsage[toolName] = (toolUsage[toolName] || 0) + 1;
        totalOperations++;

        if (use.input) {
          if (toolName === 'Edit' && use.input.file_path) {
            fileChanges.modified.push(use.input.file_path);
          } else if (toolName === 'Write' && use.input.file_path) {
            fileChanges.created.push(use.input.file_path);
          } else if (toolName === 'Read' && use.input.file_path) {
            fileChanges.read.push(use.input.file_path);
          }
        }
      });
    }

    const fileTypeStats = {};
    [...fileChanges.modified, ...fileChanges.created].forEach(file => {
      const ext = path.extname(file).toLowerCase() || 'no-extension';
      fileTypeStats[ext] = (fileTypeStats[ext] || 0) + 1;
    });

    const changeTypes = [];
    if (fileChanges.created.length > 0) changeTypes.push('新建文件');
    if (fileChanges.modified.length > 0) changeTypes.push('修改文件');
    if (toolUsage.Bash > 0) changeTypes.push('执行命令');
    if (toolUsage.WebSearch > 0 || toolUsage.WebFetch > 0) changeTypes.push('网络搜索');

    return {
      totalOperations,
      toolUsage,
      fileChanges,
      fileTypeStats,
      changeTypes,
      hasCodeChanges: fileChanges.modified.length > 0 || fileChanges.created.length > 0,
      hasNewFiles: fileChanges.created.length > 0,
      hasModifications: fileChanges.modified.length > 0
    };
  } catch (error) {
    log(`⚠ 分析变更失败: ${error.message}`, 'yellow');
    return null;
  }
}

function displayAnalysis(analysis) {
  if (!analysis) return;
  printHeader('变更分析');
  console.log(`${colors.bright}📊 操作总览${colors.reset}`);
  console.log(`   总操作数: ${analysis.totalOperations}`);
  if (Object.keys(analysis.toolUsage).length > 0) {
    console.log(`   工具使用:`);
    Object.entries(analysis.toolUsage).forEach(([tool, count]) => {
      console.log(`     • ${tool}: ${count} 次`);
    });
  }
  console.log('');

  if (analysis.hasCodeChanges) {
    console.log(`${colors.bright}📁 文件变更${colors.reset}`);
    if (analysis.fileChanges.created.length > 0) {
      console.log(`   新建 (${analysis.fileChanges.created.length}):`);
      analysis.fileChanges.created.slice(0, 5).forEach(file => {
        console.log(`     • ${colors.green}+${colors.reset} ${file}`);
      });
      if (analysis.fileChanges.created.length > 5) {
        console.log(`     ... 还有 ${analysis.fileChanges.created.length - 5} 个文件`);
      }
    }
    if (analysis.fileChanges.modified.length > 0) {
      console.log(`   修改 (${analysis.fileChanges.modified.length}):`);
      analysis.fileChanges.modified.slice(0, 5).forEach(file => {
        console.log(`     • ${colors.yellow}~${colors.reset} ${file}`);
      });
      if (analysis.fileChanges.modified.length > 5) {
        console.log(`     ... 还有 ${analysis.fileChanges.modified.length - 5} 个文件`);
      }
    }
    if (Object.keys(analysis.fileTypeStats).length > 0) {
      console.log(`   文件类型:`);
      Object.entries(analysis.fileTypeStats).forEach(([ext, count]) => {
        console.log(`     • ${ext || '无扩展名'}: ${count} 个`);
      });
    }
  }
  console.log('');
}

// 3. 智能推荐下一步操作
function generateRecommendations(analysis) {
  if (!config.enableRecommendations || !analysis) return [];
  const recommendations = [];

  if (analysis.hasModifications) {
    recommendations.push({
      icon: '🧪',
      title: '运行测试',
      command: 'npm test',
      reason: '检测到代码修改，建议运行测试确保功能正常'
    });
    recommendations.push({
      icon: '📝',
      title: '类型检查',
      command: 'npm run type-check',
      reason: '验证 TypeScript 类型正确性'
    });
  }

  if (analysis.hasNewFiles) {
    recommendations.push({
      icon: '📦',
      title: '添加到版本控制',
      command: 'git add .',
      reason: '检测到新文件，建议添加到 Git'
    });
  }

  if (analysis.fileTypeStats['.ts'] || analysis.fileTypeStats['.tsx']) {
    if (!recommendations.find(r => r.title === '类型检查')) {
      recommendations.push({
        icon: '🔍',
        title: '类型检查',
        command: 'tsc --noEmit',
        reason: 'TypeScript 项目建议进行类型检查'
      });
    }
  }

  if (analysis.fileTypeStats['.js'] || analysis.fileTypeStats['.jsx']) {
    recommendations.push({
      icon: '✨',
      title: '代码格式化',
      command: 'npm run format',
      reason: 'JavaScript 文件建议格式化以保持代码风格一致'
    });
  }

  if (analysis.fileTypeStats['.py']) {
    recommendations.push({
      icon: '🐍',
      title: 'Python 类型检查',
      command: 'mypy .',
      reason: 'Python 项目建议进行类型检查'
    });
  }

  if (analysis.toolUsage.Bash > 3) {
    recommendations.push({
      icon: '📋',
      title: '查看命令历史',
      command: 'history | tail -20',
      reason: '执行了多条命令，建议查看历史记录'
    });
  }

  if (analysis.changeTypes.includes('新建文件') || analysis.changeTypes.includes('修改文件')) {
    recommendations.push({
      icon: '💾',
      title: '提交更改',
      command: 'git commit -m "feat: update"',
      reason: '有代码变更，建议提交到版本控制'
    });
  }

  return recommendations;
}

function displayRecommendations(recommendations) {
  if (recommendations.length === 0) {
    log('暂无推荐操作', 'dim');
    return;
  }

  printHeader('智能推荐');
  recommendations.slice(0, 5).forEach((rec, index) => {
    console.log(`${colors.bright}${index + 1}. ${rec.icon} ${rec.title}${colors.reset}`);
    console.log(`   ${colors.dim}${rec.reason}${colors.reset}`);
    console.log(`   ${colors.cyan}$ ${rec.command}${colors.reset}`);
    console.log('');
  });
}

// 4. 清理临时文件
function cleanupTempFiles() {
  if (!config.enableCleanup) return;
  printHeader('清理临时文件');
  let cleanedCount = 0;

  try {
    // 检查文件名是否匹配任何清理模式
    const matchesPattern = (fileName) => {
      return config.cleanupPatterns.some(pattern => {
        // 精确匹配
        if (!pattern.includes('*') && !pattern.includes('?')) {
          return fileName === pattern;
        }
        // 简单的通配符匹配
        const regexPattern = pattern
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(fileName);
      });
    };

    // 检查目录是否应该被忽略
    const shouldIgnoreDir = (dirName) => {
      return config.cleanupIgnoreDirs.includes(dirName);
    };

    // 递归遍历目录
    const walk = (dir, depth = 0) => {
      // 深度限制
      if (depth > config.cleanupMaxDepth) {
        return;
      }

      try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            // 跳过忽略的目录
            if (!shouldIgnoreDir(file)) {
              walk(filePath, depth + 1);
            }
          } else if (stat.isFile()) {
            // 检查文件名是否匹配清理模式
            if (matchesPattern(file)) {
              try {
                fs.unlinkSync(filePath);
                log(`  ✓ 已删除: ${filePath}`, 'green');
                cleanedCount++;
              } catch (error) {
                log(`  ✗ 删除失败: ${filePath} - ${error.message}`, 'red');
              }
            }
          }
        });
      } catch (error) {
        // 忽略无法访问的目录
        log(`  ✗ 无法访问目录: ${dir}`, 'yellow');
      }
    };

    walk('.');
  } catch (error) {
    log(`  ✗ 清理失败: ${error.message}`, 'red');
  }

  if (cleanedCount === 0) {
    log('  没有发现需要清理的文件', 'dim');
  } else {
    log(`  共清理了 ${cleanedCount} 个文件`, 'green');
  }
  console.log('');
}

// 主函数
function main() {
  try {
    playCompletionSound();
    const analysis = analyzeChanges();
    if (analysis) {
      displayAnalysis(analysis);
    }
    const recommendations = generateRecommendations(analysis);
    displayRecommendations(recommendations);
    cleanupTempFiles();
  } catch (error) {
    log(`❌ Hook 执行出错: ${error.message}`, 'red');
    if (config.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, config };
