String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.format = function(){
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number){
		return typeof args[number] != 'undefined'
		?args[number]
		:match;
	})
}

function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) 
		return unescape(r[2]); 
	return null;
}