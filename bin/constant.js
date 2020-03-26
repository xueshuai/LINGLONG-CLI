/*
 * @Descripttion: 
 * @version: 
 * @Author: Shuai XUE
 * @Date: 2020-03-25 09:26:31
 * @LastEditors: Shuai XUE
 * @LastEditTime: 2020-03-26 15:05:57
 */
const TYPE_ENUM = ['react-typescript', 'vue-m', 'vue-pc', 'vue-activity'];

const REACT_TEMPLATE = 'direct:http://git.jd.com/public-components/react-ts-basic.git';
const VUE_M_TEMPLATE = 'direct:http://git.jd.com/public-components/vue-cli3.x-plus.git';

const TEMPLATE_URL = {
  'react-typescript': REACT_TEMPLATE,
  'vue-m': VUE_M_TEMPLATE,
  'vue-pc': VUE_M_TEMPLATE + '#pc',
  'vue-activity': VUE_M_TEMPLATE + '#activity'
};

module.exports = {
  TYPE_ENUM,
  TEMPLATE_URL
}