/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */
import registerGlobalComponents from '../../../src/js/app/components/ui/registerGlobalComponents';
import '../../../src/js/icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '../../../src/css/v2.scss'


export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  registerGlobalComponents(Vue)
  Vue.component('font-awesome-icon', FontAwesomeIcon);
}
