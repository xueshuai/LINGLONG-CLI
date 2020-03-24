#!/usr/bin/env node
/*
 * @Descripttion: 
 * @version: 
 * @Author: Shuai XUE
 * @Date: 2020-03-20 17:07:25
 * @LastEditors: Shuai XUE
 * @LastEditTime: 2020-03-24 14:56:26
 */
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const common = require('./common');
const init = require('./init');

const { message } = common;

function paramsToObj (paramsArr) {
  const params = {};
  paramsArr.forEach(item => {
      const kv = item.split('=')
      const key = kv[0]
      const value = kv[1] || kv[0]
      params[key] = value
    })
  return params;
}
if (process.argv.slice(2).join('') === '-v') {
  const pkg = require('../package');
  message.info('llr-cli version ' + pkg.version);
  process.exit()
}

program
  .command('new [name]')
  .alias('n')
  .description('Creates a new project')
  .action(function (name) {
    const projectName = name || 'llr-react';
    init({ app: projectName })
  });

program.parse(process.argv);

const cmd = process.argv[2];
if (!['c', 'create', 'new', 'n'].includes(cmd)) {
  program.help();
}