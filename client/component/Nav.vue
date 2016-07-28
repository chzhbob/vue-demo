<template>
	<ul class="top-nav">
		<li class="nav-logo"></li>
		<li v-bind:class="{ 'active': isHome }" v-touch:tap="navTo('/home')" >我的</li>
		<li v-bind:class="{ 'active': isList }" v-touch:tap="navTo('/list')" >一些书</li>
	</ul>
</template>

<script>
import Vue from 'vue'

export default{
	methods: {
		navTo: function(url){
			this.$route.router.go(url);
			this.updateActive(url);
		},

		updateActive: function(url){
			this.isHome = this.isList = this.isSettings = false;

			if(url){
				var router = url;
			}else{
				var router = this.$route.path.toString();	
			}
			
			if(router.indexOf('/home') >= 0){
				this.isHome = true;
			}else if(router.indexOf('/list') >= 0){
				this.isList = true;
			}else if(router.indexOf('/settings') >= 0){
				this.isSettings = true;
			}
		}
	},

	created: function(){
		this.updateActive();
	},

	data: function(){
		return {
			isHome : false,
			isList : false,
			isSettings : false
		}
	}
	
}

</script>

<style type="text/css">
.top-nav{
	width: 100%;
	background: rgba(255, 255, 255, 0.9);
	position: fixed;
	left: 0px;
	top: 0px;
	border-bottom: 0.5px solid #ddd;
	border-top: 3px solid #ffce54;
}
.top-nav li{
	color: #666666;
	float: left;
	width: 50%;
	line-height: 44px;
	font-size: 14px;
	text-align: center;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
}
.top-nav li.active{
	color: #ffb600;
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