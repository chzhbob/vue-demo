<template>
	<section class="chapter-nav">
		<a href="javascript:void(0);" v-touch:tap="naviChange('prev')">上一章</a>
		<select v-model="cid" v-on:change="pageChange()">
			<option v-for="n in total" v-bind:value="n+1">第{{ n+1 }}页</option>
		</select>
		<a href="javascript:void(0);" v-touch:tap="naviChange('next')">下一章</a>
	</section>
</template>

<script>
import Vue from 'vue'

export default{
	methods: {
		naviChange: function(action){
			this.$dispatch('navi-change', action)
		},

		pageChange: function(){
			this.$dispatch('navi-change', this.cid)
		}

	},

	props: {
		total: Number,
		cid: Number
	},

	created: function(){
		
	}

}

</script>

<style type="text/css">
.chapter-nav{
	width: 100%;
	background: rgba(255, 255, 255, 0.9);
	border-bottom: 0.5px solid #ddd;
	border-top: 0.5px solid #ddd;
	overflow: hidden;
}
.chapter-nav a{
	display: block;
	float: left;
	width: 30%;
	height: 48px;
	line-height: 48px;
	text-align: center;
	color: #ffb600;
	font-size: 16px;
}

.chapter-nav select{
	display: block;
	width: 40%;
	float: left;
	text-align: center;
	height: 48px;
	line-height: 48px;
	padding: 0 8px;
	background: none;
	border: none;
	border-left: 0.5px solid #ddd;
	border-right: 0.5px solid #ddd;
	text-align : center !important;
	color: #333;
	font-size: 16px;
	border-radius: 0px;
}
.chapter-nav select option{
	text-align: center;
}
</style>