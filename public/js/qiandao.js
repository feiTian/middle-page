$.ajaxSetup({
    contentType: "application/json; charset=utf-8",
    crossDomain: true
});
var apiHost = 'http://123.57.254.32:9000/';//'http://localhost:9000/'; //
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
              "phonenumber": "",
              "userid": "904436969",
              "phonetype": "1"
            };
var done = 0;
function getAd(img_index, callback){
    $.post(apiHost + "AdRequest",
        JSON.stringify(query),  
        function(data){
            console.log(data.adurl);
            $(img_index).attr('src', data.adurl);	                    
    }).fail(function(xHr, status, message){
        console.log('error');
        //callback(message, "Fail");        
    });
}
//getAd('#ad_img_1', null);
//getAd('#ad_img_2', null);
//getAd('#ad_img_3', null);

function getHongbao(ad){
	console.log('get hongbao');
    $.post(apiHost + "getHongbao",
		JSON.stringify({phonenumber: query.phonenumber, ad_id:ad}),
		function(data){
            console.log(data);
    }).fail(function(xHr, status, message){
        console.log('error');
        //callback(message, "Fail");        
    });            	
}

function popup(ad){
	query.phonenumber = getUrlParam('phonenumber');
	console.log(query);
	getHongbao(ad);
	window.location.href='./hongbao.html?'+ad;
	//$("#dialog").dialog();
}
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) 
		return unescape(r[2]); 
	return null;
}
function init() {
	
}
