<template>
	<section class="detail">
		<h1>文字详情</h1>
	</section>
	<app-footer></app-footer>
</template>

<script>

import footer from './Footer.vue';

export default{
	
	components: {
		'app-footer' : footer
	}
}

</script>

<style type="text/css">
	.detail{
		margin-top: 56px;
		text-align: center;
	}
</style>