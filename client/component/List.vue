<template>
	<ul id="list">
		<li class="item" v-for="item in items" v-touch:tap="navTo('/detail')">
			<section class="like">{{ item.like }}</section>
			<section class="avatar">
				<img v-bind:src=item.img />
			</section>
			<section class="text">
				<h2>{{ item.title }}</h2>
			</section>
		</li>
	</ul>
</template>

<script>

import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);

export default{
	data(){
		return {
			
		}
	},

	props: {
		items: Object
	},

	methods: {
		navTo: function(url){
			this.$route.router.go(url);
		}
	},


	created: function(){

		this.$http.jsonp('http://192.168.123.1:3000/api/list', {
			
		}).then(function(result){
			if(result.data && result.data.code == 0){
				this.items = result.data.data;
			}
		});
	}
}

</script>

<style type="text/css">
	#list{
		margin-top: 56px;
	}
	.item{
		overflow: hidden;
		padding: 8px;
		background: white;
		margin: 8px 0px;
		border-top: 0.5px solid #ddd;
		border-bottom: 0.5px solid #ddd;
	}
	.item .like{
		float: left;
		width: 50px;
		height: 50px;
		text-align: center;
		line-height: 50px;
		font-size: 14px;
		color: #00D0FF;

	}
	.item .avatar{
		float: left;
		width: 50px;
		height: 50px;
	}
	.item .text{
		margin-left: 108px;
		font-size: 14px;
		line-height: 50px;
	}
</style>