const fs = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')

const removeUselessDir = () => {
  const spinner = ora(`pkg for production...`);
  spinner.start();
  const uselessDir = [
    path.resolve(__dirname, `../dist/js/`),
  ];
  uselessDir.map(dir => {
    removeDir(dir);
  });
  spinner.stop();
  console.log(chalk.cyan(`pkg success!\n`));
}

const removeDir = (dir) => {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir) //如果文件夹是空的，就将自己删除掉
}

removeUselessDir();