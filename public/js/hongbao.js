$.ajaxSetup({
	contentType: "application/json; charset=utf-8",
	crossDomain: true
});
var apiHost = 'http://localhost:9000/'; //'http://123.57.254.32:9000/';//
var query = {
			  "device": {
			    "did": "09fc4c589a4e03779f1935518c3df2a7",
			    "dpid": "c7299603f205f356b66625fb62b3a995",
			    "ip": "202.165.28.29",
			    "make": "Apple",
			    "model": "Iphone 5s",
			    "os": "ios",
			    "osv": "ios 7.0.1"
			  },
			  "browser": {
			    
			  },
			  "imp": [
			    {
			      "h": 120,
			      "impid": "08604401000010009",
			      "pos": 1,
			      "w": 640
			    }
			  ],
			  "requestid": "b6b01bcb5c2d4421c58718a680466422",
			  "userid": "904436969",
			  "phonetype": "1"
			};

function getAd(callback){
    console.log(query);
    $.post(apiHost + "AdRequest",
    	JSON.stringify(query),  
        function(data){
        	console.log(data.adurl);
        	$('#ad_image').attr('src', data.adurl);
        	//callback(data, "OK");
    }).fail(function(xHr, status, message){
        console.log('error');
        //callback(message, "Fail");        
    });
}

var adurl = '';

function init() {
	//getAd(null);
	console.log(window.location.search);
	var ad = window.location.search.replace('?','');
	var cong_str = '恭喜拿到<span style="color:#FA8909">【{0}】</span>一起沃流量红包，可兑换为手机流量';
	if(ad == 'jumei'){
		$('#ad_image').attr('src', 'images/jumei.jpg');
		$('#cong').html(cong_str.format("聚美"));
		$('#slogan').html('免税店直接发货，上市公司的保证！');
		$('#brand').val("聚美");
		adurl="http://d.jumei.com?fr=liantongceshi";
	}else if(ad == 'tujia' || ad == ''){
		$('#ad_image').attr('src', 'images/tujia.jpg');
		$('#cong').html(cong_str.format("途家"));
		$('#slogan').html('世界那么大，带上心爱的她去看看。主题房，5折起！');
		$('#brand').val("途家");
		adurl="http://go.tujia.com/3122/?code=GDT";
	}else if(ad == 'zailushang'){
		$('#ad_image').attr('src', 'images/zailushang.jpg');
		$('#cong').html(cong_str.format("淘在路上"));
		$('#slogan').html('联通用户专享特价旅游，低到你不敢想！');
		$('#brand').val("淘在路上");
		adurl="http://tao.117go.com/downloads";
	}else{
		$('#ad_image').attr('src', 'images/tujia.jpg');
		$('#cong').html(cong_str.format("途家"));
		$('#slogan').html('世界那么大，带上心爱的她去看看。主题房，5折起！');
		$('#brand').val("途家");
		adurl="http://go.tujia.com/3122/?code=GDT";
	}
}

function toAdurl(){
	window.location.href=adurl;
}