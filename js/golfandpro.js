/// <reference path="jquery-1.8.3.min.js" />

(function ($) {
    var $pro_golflp_53014_2 = $('#pro_golflp_53014_2'),
        $pro_golflp_53014_3 = $('#pro_golflp_53014_3'),
        $pro_golflp_53014_4 = $('#pro_golflp_53014_4'),
        $pro_golflp_53014_5 = $('#pro_golflp_53014_5'),
        $pro_golflp_53014_6_1 = $('#pro_golflp_53014_6_1'),
        $pro_golflp_53014_6_2 = $('#pro_golflp_53014_6_2'),
        $pro_golflp_53014_6_3 = $('#pro_golflp_53014_6_3'),
        $pro_golflp_53014_61 = $('#pro_golflp_53014_61'),
        $pro_golflp_53014_62 = $('#pro_golflp_53014_62'),
        $pro_golflp_53014_63 = $('#pro_golflp_53014_63'),
        $pro_golflp_53014_7 = $('#pro_golflp_53014_7'),
        $pro_golflp_53014_8 = $('#pro_golflp_53014_8'),
        $pro_golflp_53014_9 = $('#pro_golflp_53014_9'),
        $pro_golflp_53014_10 = $('#pro_golflp_53014_10'),
        $golflp_53014 = $('#golflp_53014'),
        $pro_golflp_53014 = $('#pro_golflp_53014'),       
        video1, video2, video3,

    init = function init() {
        
        $('img.golf_playeroffon').hover(function () {
            var idon = $(this).attr('id');
            $(this).attr('src', 'images/players/' + idon + '_on.png');
        }, function () {
            var idoff = $(this).attr('id');
            $(this).attr('src', 'images/players/' + idoff + '_off.png');
        });

        $('img.golf_playeroffon').click(function () {            
            var theid = $(this).attr('id');
            $golflp_53014.css('display', 'none');            
            $pro_golflp_53014.show();
            //clean_videos();
            golf_FinalProcess(theid);
            $(window).scrollTop(0);
        });

        $('.golf_videoswitch').click(function () {
            var videosw = $(this).attr('id').replace('pro_golflp_53014_6_', '');
            var video_div_id = '#pro_golflp_53014_6' + videosw;
            hide_videos();
            $(video_div_id).show();            
        });        

        // LP video
        $('body').generateVideo({
            id: "golf_lp_vd_53014",
            filename: "videos/AD19715_Su14_Polo_Golf_Banner_Ad_10s_640x480_V.04.mp4",
            visibleOnLoad: false,
            autostart: true,
            autopause: true,
            autoclose: true,
            playTarget: "#golflp_video",
            modal: true,
            modalWidth: "740",
            modalHeight: "740"
        });
    },

    create_video = function (vidID, whoplay, thevideo, poster) {
        console.log('-------------- create video ----------------');
        whoplay.generateVideo({
            id: vidID,
            type: "jwplayer",
            filename: thevideo,
            poster:poster,
            visibleOnLoad: true,
            autostart: false,
            autopause: true,
            autoclose: false,
            //playTarget: playtarget,
            closeButton: false,
            tracking: true,
            //trackProjectName: "YourProjectName",
            modal: false,
            showLogs: true,
            onVideoPause: function (position, duration) {
                //console.log('You paused me');
                //console.log('Video Position: ' + position + '');
                //console.log('Video Duration: ' + duration + '');
            }
        });
    },

    clean_videos = function () {        
        //$pro_golflp_53014_61.html("");
        //$pro_golflp_53014_62.html("");
        //$pro_golflp_53014_63.html("");
    },

    hide_videos = function () {
        $pro_golflp_53014_61.hide();
        $pro_golflp_53014_62.hide();
        $pro_golflp_53014_63.hide();        
    },

    slider = function (slides) {
        $('.royalSlider').royalSlider('destroy').empty().royalSlider({
            slides: slides,
            controlNavigation: 'bullets'
        });
    },
    
    golf_processData = function (gdata) {

        $pro_golflp_53014_2.css('background-image', 'url("' + gdata.player.image4 + '")');
        $pro_golflp_53014_3.html(gdata.player.description);
        $pro_golflp_53014_4.css('background-image', 'url("' + gdata.player.image5 + '")');
        $pro_golflp_53014_5.empty().css('background-image', 'url("' + gdata.player.image6 + '")');

        if (gdata.player.name == "Morgan") {                      
            $pro_golflp_53014_6_1.hide();
            $pro_golflp_53014_6_2.hide();
            $pro_golflp_53014_6_3.hide();
            $pro_golflp_53014_61.hide();
            $pro_golflp_53014_62.hide();
            $pro_golflp_53014_63.hide();

            $pro_golflp_53014_7.css('background-image', 'url("' + gdata.player.image15 + '")');
            $pro_golflp_53014_8.html(gdata.player.interview);
            $pro_golflp_53014_9.css('background-image', 'url("' + gdata.player.image16 + '")');
            $pro_golflp_53014_10.html(gdata.player.readfull);

            $pro_golflp_53014_7.css('top', '720px');
            $pro_golflp_53014_8.css('top', '835px');
            $pro_golflp_53014_9.css('top', '720px');
            $pro_golflp_53014_10.css('top', '1215px');           
        }
        else {
            
            pro_imgs = '<img class="rsImg" src="' + gdata.player.image6 + '" /><img class="rsImg" src="' + gdata.player.image7 + '" /><img class="rsImg" src="' + gdata.player.image8 + '" />'
            $pro_golflp_53014_5.empty().addClass("royalSlider rsDefault");
            slider(pro_imgs);

            $pro_golflp_53014_6_1.css('background-image', 'url("' + gdata.player.image12 + '")');
            $pro_golflp_53014_6_2.css('background-image', 'url("' + gdata.player.image13 + '")');
            $pro_golflp_53014_6_3.css('background-image', 'url("' + gdata.player.image14 + '")');                     

            clean_videos();

            create_video(gdata.player.name + "1", $pro_golflp_53014_61, gdata.player.video1, gdata.player.image9);
            create_video(gdata.player.name + "2", $pro_golflp_53014_62, gdata.player.video2, gdata.player.image10);
            create_video(gdata.player.name + "3", $pro_golflp_53014_63, gdata.player.video3, gdata.player.image11);

            $pro_golflp_53014_7.css('background-image', 'url("' + gdata.player.image15 + '")');
            $pro_golflp_53014_8.html(gdata.player.interview);
            $pro_golflp_53014_9.css('background-image', 'url("' + gdata.player.image16 + '")');
            $pro_golflp_53014_10.html(gdata.player.readfull);

            $pro_golflp_53014_7.css('top', '1048px');
            $pro_golflp_53014_8.css('top', '1163px');
            $pro_golflp_53014_9.css('top', '1048px');
            $pro_golflp_53014_10.css('top', '1543px');
        }        
    },

    golf_getData = function (options) {
        if (typeof options !== 'object') {
            options = {};
        }
        options.url = options.url || '';     
      
        return $.getJSON(options.url);
    },

    golf_FinalProcess = function (id) {
        $.when(
            golf_getData({ url: 'data/' + id + '.json' })
        )
        .done(function (gdata) {
            golf_processData(gdata);
        })
        .fail(function () {
            console.log('fail');
        });
    };

    $(document).ready(init);

})(jQuery);