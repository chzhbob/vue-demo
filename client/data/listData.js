import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);

export default listData;

listData.getItem = function(){
	Vue.http.jsonp('http://192.168.123.1:3000/api/list', {
		uu : '96d557097027b462c03c9a384a0ae580',
		uc : '4f54f93bb1c1efae94d39728d8b0cae9',
		guid : '0beb69f54a154b52b37caeea949d8d21',
		page : 1,
		pageSize : 10,
		jsonp : 'GrouphomeRecommendListCallback',
		callback : 'GrouphomeRecommendListCallback'
	}).then(function(result){
		if(result.data && result.data.code == 0){
			return result.data.data;
		}
	}, function(response){
		console.log(2)
	});
}

