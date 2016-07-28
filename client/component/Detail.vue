<template>
	<section class="detail-title">
		<a class="back" href="javascript:void(0);" v-touch:tap="naviBack()">回去</a>
		<h2>&nbsp;{{ article }}&nbsp;</h2>
		<a v-if="isFollow" class="follow followed" href="javascript:void(0);" >已入</a>
		<a v-else class="follow" href="javascript:void(0);" v-touch:tap="follow()">入坑</a>
	</section>
	<chapter-navi v-on:navi-change="naviChange" v-bind:total="total" v-bind:cid="cid"></chapter-navi>
	<section class="detail">
		<h1>{{ title }}</h1>
		<pre>{{{ content }}}</pre>
	</section>
	<chapter-navi v-on:navi-change="naviChange" v-bind:total="total" v-bind:cid="cid"></chapter-navi>
	<app-footer></app-footer>
</template>

<script>


import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);
import footer from './Footer.vue'
import config from '../config'
import chapterNav from './ChapterNav.vue';

export default{
	data(){
		return {
			title : '',
			content : '',
			article : '',
			total : 0,
			aid : 0,
			cid : 0,
			isFollow : false
		}
	},

	props: {
		items: Object,
	},

	methods: {
		loadData: function(){
			this.$http.jsonp( config.host + 'api/detail?aid=' + parseInt(this.aid, 10) + '&cid=' + parseInt(this.cid, 10), {
			}).then(function(result){
				if(result.data && result.data.code == 0){
					this.$route.router.replace('/detail/' + this.aid + '/page/' + this.cid);
					this.title = result.data.data.title;
					this.content = result.data.data.content;
					this.total = parseInt(result.data.total, 10);
					this.isFollow = result.data.followed;
					this.article = result.data.article;
					
					window.scrollTo(0, 48);
				}
			});
		},

		naviChange: function(data){
			if(data == 'prev'){
				this.cid -= 1;
				if(this.cid < 1){
					this.cid = 1;
				}
			}else if(data == 'next'){
				this.cid += 1;
				if(this.cid > this.total){
					this.cid = this.total;
				}
			}else{
				this.cid = data;
			}
			this.loadData();
		},

		follow: function(){
			this.$http.jsonp( config.host + 'api/follow?aid=' + parseInt(this.aid, 10) + '&cid=' + parseInt(this.cid, 10), {
			}).then(function(result){
				if(result.data && result.data.code == 0){
					this.isFollow = true;
				}
			});
		},

		naviBack: function(){
			history.back();
		}
	},

	created: function(){
		this.aid = parseInt(this.$route.params.aid, 10);
		this.cid = parseInt(this.$route.params.cid, 10);
		this.loadData(this.$route.params.aid, this.$route.params.cid);
	},

	components: {
		'app-footer' : footer,
		'chapter-navi' : chapterNav
	}
}

</script>

<style type="text/css">
	.detail-title{
		background: white;
		font-size: 16px;
		height: 48px;
		text-align: center;
		line-height: 48px;
		color: #ffb600;
	}
	.detail-title h2{
		float: left;
		width: 40%;
		border-right: 0.5px solid #ddd;
		border-left: 0.5px solid #ddd;
		line-height: 48px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.detail-title a{
		display: block;
		width: 30%;
		float: left;
		color: #ffb600;
	}

	.detail{
		padding: 0 8px 8px;
		background: white;
		position: relative;
	}
	.detail h1{
		padding-top: 8px;
		font-size: 20px;
		line-height: 32px;
		padding-bottom: 24px;
		padding-right: 32px;
	}
	.detail pre{
		font-size: 16px;
		line-height: 24px;

	}
	.detail-title .followed{
		color: #ddd;
	}
</style>