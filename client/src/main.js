import Vue from 'vue'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'

import Main from '../component/Main.vue'
import Detail from '../component/Detail.vue';
import Home from '../component/Home.vue';
import List from '../component/List.vue';
import Settings from '../component/Settings.vue';
import Cookies from 'cookies-js'
Cookies.set('openid', '1');

Vue.use(VueRouter);
Vue.use(VueTouch);

var Root = Vue.extend({})
var router = new VueRouter()

router.map({
	'/': {
		component: Main,
		subRoutes: {
			'/home': {
				component: Home	
			},
			'/list': {
				component: List
				// component: function(resolve){
				// 	require(['../component/Note.vue'], resolve)
				// }
				
			},
			'/settings': {
				component: Settings
			}
		}
	},

	'/detail/:aid/page/:cid': {
		component : Detail,
	}
	
});

router.redirect({
	'/' : '/home'
});



router.mode = 'html5';
router.start(Root, '#app');
