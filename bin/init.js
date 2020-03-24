/*
 * @Descripttion: 
 * @version: 
 * @Author: Shuai XUE
 * @Date: 2020-03-20 18:00:43
 * @LastEditors: Shuai XUE
 * @LastEditTime: 2020-03-24 14:00:02
 */
const fs = require('fs-extra');
const chalk = require('chalk');
const {basename, join} = require('path');
const readline = require('readline');
const download = require('download-git-repo');
const ora = require('ora');
const vfs = require('vinyl-fs');
const map = require('map-stream');

const common = require('./common');
const {message, write} = common;

const template = 'direct:http://git.jd.com/public-components/react-ts-basic.git';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const tempTemplatePath = join(__dirname, '../temp_template');

// console.log(tempTemplatePath)

function copyLog(file, cb) {
  message.success(file.path);
  cb(null, file);
}

function initComplete(app) {
  message.success(`Success! Created ${app} project complete!`);
  message.light(`begin by typing:
    cd ${app}
    npm start
    
    `)
  process.exit();
}

function createProject(dest) {
  const spinner = ora('downloading template')
  spinner.start()
  if (fs.existsSync(tempTemplatePath)) fs.emptyDirSync(tempTemplatePath)
  download(template, tempTemplatePath, { clone: true }, function (err) {
    spinner.stop()
    if (err) {
      console.log(err)
      process.exit()
    }

    fs
    .ensureDir(dest)
    .then(() => {
      vfs
        .src(['**/*', '!node_modules/**/*'], {
          cwd: tempTemplatePath,
          cwdbase: true,
          dot: true,
        })
        .pipe(map(copyLog))
        .pipe(vfs.dest(dest))
        .on('end', function() {
          const app = basename(dest);
          // const configPath = `${dest}/config.json`;
          // const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          // configFile.dist = `../build/${app}`;
          // configFile.title = app;
          // configFile.description = `${app}-project`;
          // write(configPath, JSON.stringify(configFile, null, 2));
          message.info('run install packages');
          require('./install')({
            success: initComplete.bind(null, app),
            cwd: dest,
          });
        })
        .resume();
    })
    .catch(err => {
      console.log(err);
      process.exit();
    });
})
}

function init({app}) {
  const dest = process.cwd();
  const appDir = join(dest, `./${app}`);
  if (fs.existsSync(appDir)) {
    rl.question(
      chalk.blue(`${app} dir exist! Do you want clear this dir? (Y/N)`),
      str => {
        const answer = str && str.trim().toUpperCase();
        if (answer === 'Y') {
          const spinner = ora(`remove ${app} dir`).start();
          fs
            .emptyDir(appDir)
            .then(() => {
              spinner.stop();
              createProject(appDir);
            })
            .catch(err => {
              console.error(err);
            });
        } else if (answer === 'N') {
          process.exit();
        }
      }
    );
  } else {
    createProject(appDir);
  }
}

module.exports = init;