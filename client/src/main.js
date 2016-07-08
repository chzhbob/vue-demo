import Vue from 'vue'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'

import Main from '../component/Main.vue'

import Detail from '../component/Detail.vue';
import List from '../component/List.vue';
import About from '../component/About.vue';

Vue.use(VueRouter);
Vue.use(VueTouch);

var Root = Vue.extend({})
var router = new VueRouter()

router.map({
	'/': {
		component: Main,
		subRoutes: {
			'/list': {
				component: List	
			},
			'/note': {
				component: function(resolve){
					require(['../component/Note.vue'], resolve)
				}
				
			},
			'/about': {
				component: About
			}
		}
	},

	'/detail': {
		component: Detail
	}
});

router.redirect({
	'/' : '/list'
});

router.mode = 'html5';
router.start(Root, '#app');
