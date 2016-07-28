<template>
	<section class="app">
		<app-navi></app-navi>
		<router-view keep-alive></router-view>
		<app-footer></app-footer>
	</section>
</template>

<script>

import nav from './Nav.vue';
import footer from './Footer.vue';

export default{
	
	components: {
		'app-navi' : nav,
		'app-footer' : footer
	},

	methods: {
		
	},

	created(){

	}
}

</script>

<style type="text/css">
body{
	background: #f2f2f2;
}
.fade-transition {
  transition: opacity .1s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}
</style>