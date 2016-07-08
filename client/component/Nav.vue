<template>

	<ul class="top-nav">
		<li class="nav-logo"></li>
		<li v-touch:tap="navTo('/list')" >实验室</li>
		<li v-touch:tap="navTo('/note')" >小笔记</li>
		<li v-touch:tap="navTo('/about')" >关于</li>
		
	</ul>
</template>

<script>
import Vue from 'vue'

export default{
	methods: {
		navTo: function(url){
			this.$route.router.go(url);
			// this.slideTo(url);
		},

		slideTo: function(url){
			switch(url){
				case '/list':
					this.slideTo(0);
					break;
				case '/note':
					this.slideTo(1);
					break;
				case '/about':
					this.slideTo(2);
					break;
				default:
					this.slideTo(0);
			}
		}
	},

	created: function(){
		// this.slideTo(this.$route.path);
	}
}

</script>

<style type="text/css">
.top-nav{
	width: 100%;
	background: white;
	position: fixed;
	left: 0px;
	top: 0px;
	border-bottom: 0.5px solid #ddd;
	border-top: 3px solid #ffce54;
}
.top-nav li{
	color: #666666;
	float: left;
	width: 33.33%;
	line-height: 44px;
	font-size: 14px;
	text-align: center;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
	background: #fff;
}

.top-nav .nav-logo{
	background: #ffce54;
	height: 44px;
	width: 0%;
	position: relative;
}
.top-nav .nav-logo:before{
	z-index: 1;
	position: absolute;
	top: 0px;
	right: 0px;
	content: '';
	width: 0px;
	height: 0px;
	border-right: 15px solid #fff;
	border-top: 44px solid transparent;
}
.top-nav .nav-me{
	background: #ffce54;
	width: 10%;
}
.top-nav .nav-logo img{
	height: 30px;
	display: block;
}
</style>