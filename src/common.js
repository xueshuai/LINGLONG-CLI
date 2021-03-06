/*
 * @Descripttion: 
 * @version: 
 * @Author: Shuai XUE
 * @Date: 2020-03-23 09:06:08
 * @LastEditors: Shuai XUE
 * @LastEditTime: 2020-03-26 14:51:04
 */
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

const sep = os.platform() === 'win32' ? '\\' : '/';

const message = {
  success(text) {
    console.log(chalk.green.bold(text));
  },
  error(text) {
    console.log(chalk.red.bold(text));
  },
  info(text) {
    console.log(chalk.blue.bold(text));
  },
  light(text) {
    console.log(chalk.yellow.bold(text));
  }
};

function copyTemplate(from, to, renderData) {
  from = path.join(__dirname, from);
  if (renderData) {
    const originTemplate = fs.readFileSync(from, 'utf-8')
    const distFile = originTemplate.split(/[/s/S]*?\<\%\s*(\w+)\s*\%\>[/s/S]*?/im)
      .map(key => {
        return renderData[key] || key
      })
      .join('')
    write(to, distFile);
  } else {
    write(to, fs.readFileSync(from, 'utf-8'));
  }
}
function write(path, str) {
  fs.writeFileSync(path, str);
}
function mkdir(path, fn) {
  fs.mkdir(path, function (err) {
    fn && fn();
  });
}

function exportCodeGenerator(type, options) {
  let code = '';
  if (type === 'component') {
    code = `export { default as ${options.uppercaseName} } from './${options.uppercaseName}';\r\n`;
  } else {
    code = `export { default as ${options.name} } from './routes/${options.uppercaseName}/model';\r\n`;
  }
  return code
}

function getInfo() {
  return inquirer.prompt([
    {
      name: 'pro-name',
      type: 'input',
      message: `Project Name?`
    },
    {
      name: 'pro-type',
      type: 'list',
      message: `Choose your web template?`,
      choices: [
        'react-typescript',
        'vue-m',
        'vue-pc',
        'vue-activity'
      ],
      default: 0
    }
  ])
    .then(answers => {
      if (answers["pro-type"] === 'react-typescript') {
        return inquirer.prompt({
          name: 'pro-isM',
          type: 'list',
          message: 'Is this a template for mobile?',
          choices: ['true', 'false']
        })
          .then(finalAnswers => {
            return {...answers, ...finalAnswers}
          })
      } else {
        return answers
      }
    })
    .catch(err => {
      console.log(chalk.red(err));
    })
}

module.exports = { getInfo, copyTemplate, write, mkdir, message, sep, exportCodeGenerator }