/*
 * @Descripttion: 
 * @version: 
 * @Author: Shuai XUE
 * @Date: 2020-03-25 09:26:31
 * @LastEditors: Shuai XUE
 * @LastEditTime: 2020-03-26 08:48:38
 */
const TYPE_ENUM = ['react', 'vuem', 'vuepc', 'vueactivity'];

const REACT_TEMPLATE = 'direct:http://git.jd.com/public-components/react-ts-basic.git';
const VUE_M_TEMPLATE = 'direct:http://git.jd.com/public-components/vue-cli3.x-plus.git';

const TEMPLATE_URL = {
  react: REACT_TEMPLATE,
  vuem: VUE_M_TEMPLATE,
  vuepc: VUE_M_TEMPLATE + '#pc',
  vueactivity: VUE_M_TEMPLATE + '#activity'
};

module.exports = {
  TYPE_ENUM,
  TEMPLATE_URL
}