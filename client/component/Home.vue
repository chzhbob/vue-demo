<template>
	<ul id="home">
		<li class="home-item" v-for="item in items" v-touch:tap="navTo('/detail/' + item.id + '/page/' + item.page)">
			<h1>{{ item.title }}</h1>
			<p>上次阅读第{{ item.page }}页 - 更新至第{{ item.chapter_length }}页</p>
		</li>
	</ul>
</template>

<script>

import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);
import config from '../config'

export default{
	data(){
		return {
			items: null
		}
	},

	methods: {
		navTo: function(url){
			this.$route.router.go(url);
		}
	},


	created: function(){
		this.$http.jsonp( config.host + 'api/home', {

		}).then(function(result){
			if(result.data && result.data.code == 0){
				console.log(result);
				this.items = result.data.data;
			}
		});
	}
}

</script>

<style type="text/css">
	#home{
		margin-top: 56px;
	}
	.home-item{
		overflow: hidden;
		padding: 8px;
		background: white;
		margin: 8px 0px;
		border-top: 0.5px solid #ddd;
		border-bottom: 0.5px solid #ddd;
	}
	.home-item:active{
		background: #F1F1F1;
    	box-shadow: inset 0px 1px 1px rgba(0,0,0,0.1);
	}
	.home-item:nth-child(odd) h1{
		font-size: 16px;
		line-height: 28px;
	}
	.home-item p{
		color: #ccc;
		font-size: 12px;
		line-height: 24px;
	}
</style>