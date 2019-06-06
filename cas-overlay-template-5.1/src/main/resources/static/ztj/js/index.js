/**
 * Created by Administrator on 2019/1/4.
 */
function Index() {
    this.domObjs = {};
}

Index.prototype = {
    init: function() {
        this.selectDoms();
        this.bindListener();
        this.startCarouselAnimation();
    },

    //本地化dom对象
    selectDoms: function() {
        this.domObjs = {
            //轮播图下的dom
            mainDom: $('#main'),
            banner: $('#banner'),
            carouselImgs: $('#banner img'),
            carouselUl: $('#banner ul'),
            carouselLi: $('#banner li'),
            spans: $('#footer span'),
            index: 0,

            //表单切换dom
            $forms: $('#forms'),
            $loginTypeLiDoms: $('#loginTypeUl li'),

            //登录失败确定按钮
            $btnOk: $('#btnOk'),
            $shadow: $('#shadow')

        };
    },

    //绑定监听事件
    bindListener: function() {
        var self = this;

        //轮播图大小自适应
        $(window).on('resize', function() {
            var windowWidth = $(this).width();
            var windowHeight = $(this).height();
            self.domObjs.carouselUl.width(windowWidth * 5);
            self.domObjs.carouselLi.width(windowWidth);
            self.domObjs.banner.height(windowHeight - 70);
            if(windowWidth <= 1190) {
                self.domObjs.carouselImgs.width(1190);
            } else {
                self.domObjs.carouselImgs.width(windowWidth);
                self.domObjs.carouselImgs.height(windowHeight - 70);
            }

        });
        $(window).trigger('resize');

        //轮播图小按钮点击切换轮播图
        var $spans = this.domObjs.spans;
        $spans.on('click', function(e) {
            self.domObjs.spans.each(function(i) {
                if(this === e.target) {
                    self.domObjs.index = i;
                    var liWidth = self.domObjs.carouselLi.width();
                    self.carouselAnimate(self.domObjs.carouselUl, -i * liWidth, i);
                    $spans.removeClass('active');
                    $spans.get(i).className = 'active';

                    self.startCarouselAnimation();
                }
            });
        });

        //钉钉扫码和表单登录切换
        self.domObjs.$loginTypeLiDoms.on('click', function(e) {
            self.domObjs.$loginTypeLiDoms.removeClass('current');
            $(e.target).addClass('current');
            if($(e.target).text() == '扫码登录') {
                self.carouselAnimate(self.domObjs.$forms, 0);
            } else {
                self.carouselAnimate(self.domObjs.$forms, -300);
            }
        });


        //登录失败按钮
        self.domObjs.$btnOk.on('mousedown', function() {
           $(this).css('line-height', '33px');
        });
        

        function getQueryString(name) {
             var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
             var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
             if(r!=null)
            	 return  unescape(r[2]); 
             return null;
        }

        self.domObjs.$btnOk.on('mouseup', function() {
            var url = window.location.href;
            var index = url.indexOf('?');
            if(index == -1) {
                $(location).attr('href', '/cas/login');
            } else {
            	var serviceVal = getQueryString('service');

                if(serviceVal == null) {
                    $(location).attr('href', '/cas/login?count=1');
                } else {
                    $(location).attr('href', '/cas/login?count=1&service=' + serviceVal);
                }
            }
        });
    },

    //轮播动画
    carouselAnimate: function(element, target, index) {
        element.animate({
            left: target,
        }, 200, 'swing', function () {
            if(index == 4) {
                element.css('left', 0);
            }
        });
    },
    startCarouselAnimation: function() {
        clearInterval(this.timer);
        var self = this;
        var $spans = this.domObjs.spans;
        self.timer = setInterval(function() {
            self.domObjs.index = (self.domObjs.index+1) % 5;
            var liWidth = self.domObjs.carouselLi.width();
            self.carouselAnimate(self.domObjs.carouselUl, -self.domObjs.index * liWidth, self.domObjs.index);
            if(self.domObjs.index == 4) {
                self.domObjs.index = 0;
            }
            $spans.removeClass('active');
            $spans.get(self.domObjs.index).className = 'active';
        }, 6000);
    }
}

new Index().init();

