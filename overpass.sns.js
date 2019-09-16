(function (e) {
	"object" != e.type(window.elandmall) && (window.elandmall = {});
	"object" != e.type(window.elandmall.sns) && (window.elandmall.sns = {});
	elandmall.sns = {
		sharePage: function (a) {
			var b = "",
				d = "",
				d = "undefined" != typeof a.type ? "event" == a.type || "shop" == a.type ? a.title : a.goods_nm : a.goods_nm;
			if ("FB" == a.sns) b = "https://wwww.facebook.com/sharer.php?u\x3d" + encodeURIComponent(a.url);
			else if ("KT" == a.sns) Kakao.Link.sendDefault({
				objectType: "feed",
				content: {
					title: d,
					imageUrl: a.img,
					link: {
						mobileWebUrl: a.url,
						webUrl: a.url
					}
				},
				buttons: [{
					title: "웹으로 보기",
					link: {
						mobileWebUrl: a.url,
						webUrl: a.url
					}
				}, {
					title: "앱으로 보기",
					link: {
						iosExecParams: a.url,
						androidExecParams: a.url
					}
				}]
			});
			else if ("KS" == a.sns) "undefined" != typeof a.mobile_yn && "Y" == a.mobile_yn ? Kakao.Story.open({
				url: a.url,
				text: d
			}) : Kakao.Story.share({
				url: a.url,
				text: d
			});
			else if ("NB" == a.sns) b = "http://blog.naver.com/openapi/share?serviceCode\x3dshare\x26url\x3d" + encodeURIComponent(a.url);
			else if ("LN" == a.sns) b = "http://line.me/R/msg/text/?" + encodeURIComponent(d + a.url);
			else if ("IG" == a.sns) b =
				"elandbridge://share/instagram?imgUrl\x3d" + a.img;
			else if ("UC" == a.sns) {
				if ("undefined" != typeof elandmall.global.app_cd && "" != elandmall.global.app_cd) {
					window.location.href = "elandbridge://urlCopy/?url\x3d" + a.url;
					alert("주소가 복사되었습니다.");
					return;
				}
				if ("undefined" != typeof a.mobile_yn && "Y" == a.mobile_yn) e("a.btn_close", "[id^\x3dsns_lyr]").click(), 0 < e("#bundle_detail").length ? elandmall.layer.createLayerForLayer({
					layer_id: "url_copy_lyr",
					class_name: "layer_con",
					close_btn_txt: "닫기",
					createContent: function (b) {
						var c = b.div_content;
						console.dir(c);
						c.append('\x3cdiv class\x3d"sns"\x3e\t\x3cdiv class\x3d"sns_ur"\x3e\t\t\x3cdiv class\x3d"info"\x3e아래의 url을 전체 선택하여 복사하세요.\x3c/div\x3e' + ('\t\t\x3cdiv class\x3d"urbox"\x3e\x3ctextarea id\x3d"url_copy_input" onfocus \x3d "this.select()"\x3e' + a.url + "\x3c/textarea\x3e\x3c/div\x3e") + "\t\x3c/div\x3e\x3c/div\x3e");
						c.attr("class", "pop_con");
						b.show();
					}
				}) : elandmall.layer.createLayer({
					layer_id: "url_copy_lyr",
					class_name: "layer_con",
					close_btn_txt: "닫기",
					createContent: function (b) {
						var c = b.div_content;
						console.dir(c);
						c.append('\x3cdiv class\x3d"sns"\x3e\t\x3cdiv class\x3d"sns_ur"\x3e\t\t\x3cdiv class\x3d"info"\x3e아래의 url을 전체 선택하여 복사하세요.\x3c/div\x3e' + ('\t\t\x3cdiv class\x3d"urbox"\x3e\x3ctextarea id\x3d"url_copy_input" onfocus \x3d "this.select()"\x3e' + a.url + "\x3c/textarea\x3e\x3c/div\x3e") + "\t\x3c/div\x3e\x3c/div\x3e");
						c.attr("class", "pop_con");
						b.show();
					}
				});
				else {
					window.clipboardData ? (window.clipboardData.setData("Text", a.url), alert("주소가 복사되었습니다.\n붙여 넣을 곳에 Ctrl + V하세요.")) : window.prompt("URL 복사 후 사용하세요.", a.url);
					return;
				}
			} else {
				alert("추후 지원 예정 SNS 입니다.");
				return;
			}
			"KT" != a.sns && "UC" != a.sns && "SM" != a.sns && "KS" != a.sns && ("undefined" != typeof elandmall.global.app_cd && "" != elandmall.global.app_cd && "IG" != a.sns && ("iOS" == elandmall.global.app_cd ? "LN" != a.sns && (b = "elandbridge://browser/?url\x3d" + b) : b = "elandbridge://browser/?url\x3d" + encodeURIComponent(b)), window.open(b, "_blank"));
		}
	};
})(jQuery);