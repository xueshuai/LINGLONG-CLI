/*
 * @Descripttion: 
 * @version: 
 * @Author: Shuai XUE
 * @Date: 2020-03-20 18:00:43
 * @LastEditors: Shuai XUE
 * @LastEditTime: 2020-03-26 15:33:56
 */
const fs = require('fs-extra');
const chalk = require('chalk');
const { basename, join } = require('path');
const readline = require('readline');
const download = require('download-git-repo');
const ora = require('ora');
const vfs = require('vinyl-fs');
const map = require('map-stream');
const inquirer = require('inquirer');

const common = require('./common');
const { message, write } = common;

const constant = require('./constant')
const { TEMPLATE_URL, TYPE_ENUM } = constant

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

function createProject({ type, dest, isM }) {

  if (!TYPE_ENUM.includes(type)) {
    message.error(`Type must be [${TYPE_ENUM}]`)
    process.exit()
  }

  const spinner = ora('downloading template')

  spinner.start()
  if (fs.existsSync(tempTemplatePath)) fs.emptyDirSync(tempTemplatePath)

  download(TEMPLATE_URL[type], tempTemplatePath, { clone: true }, function (err) {
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
          .on('end', function () {
            const app = basename(dest);

            const configPath = `${dest}/package.json`;
            const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            configFile.name = app
            configFile.description = `${app}-project`;
            write(configPath, JSON.stringify(configFile, null, 2));

            if (type === 'react-typescript') {
              const evnLocalPath = `${dest}/.env.local`;
              let evnLocalFile = fs.readFileSync(evnLocalPath, 'utf-8');
              const regexName = /(REACT_APP_NAME=")[^"]*(")/
              const regexIsM = /(REACT_APP_ISM=)[^"]*(\s)/
              evnLocalFile = evnLocalFile.replace(regexName, function (arg0, arg1, arg2) {
                return arg1 + app + arg2
              })
              evnLocalFile = evnLocalFile.replace(regexIsM, function (arg0, arg1, arg2) {
                return arg1 + isM + arg2 + arg2
              })
              write(evnLocalPath, evnLocalFile);
            }

            if (type === 'vue-m' || type === 'vue-pc' || type === 'vue-activity') {
              const evnLocalPath = `${dest}/self.config.js`;
              let evnLocalFile = fs.readFileSync(evnLocalPath, 'utf-8');
              const regexName = /(name:\s')[^']*(')/
              const regexTitle = /(htmlTitle:\s')[^']*(')/
              evnLocalFile = evnLocalFile.replace(regexName, function (arg0, arg1, arg2) {
                return arg1 + app + arg2
              })
              evnLocalFile = evnLocalFile.replace(regexTitle, function (arg0, arg1, arg2) {
                return arg1 + app + arg2
              })
              write(evnLocalPath, evnLocalFile);
            }

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


function init({ type, app, isM }) {
  const dest = process.cwd();
  const appDir = join(dest, `./${app}`);
  if (fs.existsSync(appDir)) {
    inquirer.prompt([
      {
        name: 'q-clear',
        type: 'list',
        message: `${app} dir exist! Do you want clear this dir?`,
        choices: [
          'Yes',
          'No'
        ],
        default: 0
      }
    ])
      .then(answers => {
        if (answers['q-clear'] === 'Yes') {
          const spinner = ora(`remove ${app} dir`).start();
          fs
            .emptyDir(appDir)
            .then(() => {
              spinner.stop();
              createProject({ type, dest: appDir, isM });
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          process.exit();
        }
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
    // rl.question(
    //   chalk.blue(`${app} dir exist! Do you want clear this dir? (Y/N)`),
    //   str => {
    //     const answer = str && str.trim().toUpperCase();
    //     if (answer === 'Y') {
    //       const spinner = ora(`remove ${app} dir`).start();
    //       fs
    //         .emptyDir(appDir)
    //         .then(() => {
    //           spinner.stop();
    //           createProject({ type, dest: appDir, isM });
    //         })
    //         .catch(err => {
    //           console.error(err);
    //         });
    //     } else if (answer === 'N') {
    //       process.exit();
    //     }
    //   }
    // );
  } else {
    createProject({ type, dest: appDir, isM });
  }
}

module.exports = init;