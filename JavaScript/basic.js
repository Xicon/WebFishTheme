/**
 * Created by star-x on 2017/7/31.
 */
var basic = {
	// 滚动聊天页面
	scrollPage:function(){
		if(navigator.userAgent.indexOf('Safari')>=0){
			document.querySelector(".sevice").scrollTop = document.querySelector('.pc_talk_content').offsetHeight;
		}else{
			var elems = document.querySelector('.pc_talk_content').children;
			elems[elems.length-1].scrollIntoView();
		}
	},
	// 中间弹出提醒文字
	toastOut:function(txt){
		$(".content-left .toasts").find(".toastsText").text(txt).end().show();
		setTimeout(function() {
			$(".content-left .toasts").hide();
		}, 1500);
	},
	// 关闭窗口
	close_window:function(){
		window.opener=null;
		window.open('','_self');
		window.close();
	},
	beforeRender:function(str){
		if(str.length>16){
			str = str.substr(0,10)+'...'+str.substr(-6);
		};
		return str;
	}
};