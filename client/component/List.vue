<template>
	<ul id="home">
		<li class="home-item" v-for="item in items" v-touch:tap="navTo('/detail/' + item.id + '/page/1')">
			<h1>{{ item.title }}</h1>
			<p>更新至{{ item.chapter_length }}话 热度</p>
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

		this.$http.jsonp( config.host + 'api/list', {

		}).then(function(result){
			
			if(result.data && result.data.code == 0){
				this.items = result.data.data;
			}else{
				alert('未登录');
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

	.home-item h1{
		font-size: 16px;
		line-height: 28px;
	}
	.home-item p{
		color: #ccc;
		font-size: 12px;
		line-height: 24px;
	}
</style>