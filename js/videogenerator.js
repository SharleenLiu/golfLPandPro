/******************************************************************************
*******************************************************************************
**********************                                   **********************
**********************       VIDEO GENERATOR v1.0        **********************
**********************                                   **********************
*******************************************************************************
******************************************************************************/




//  GLOBAL VARS //
var projectName = "videogenerator";
var serverLocation = jQuery('#videoGeneratorScript').attr('src').split(projectName + '.')[0];
var $window = jQuery(window);
var $body = jQuery('body');
var videoOptions = []; // stores video options for each instance of generateVideo





/* (((((((((((((((((((( ------------------------- DOM READY ------------------------- )))))))))))))))))))) */
jQuery(function () {
	objPageManager.init(); // load necessary libraries automatically
});





/* !!!!!!!!!!!!!!!!!!!! ------------------------- GENERATE VIDEO (jquery extension) ------------------------- !!!!!!!!!!!!!!!!!!!! */
;(function ( jQuery, window, document, undefined ) {
    // Create the defaults once
    var pluginName = 'generateVideo',
        defaults = {
			// attributes
			id: 				"vid1",                     // unique ID for each video (gets set on all play, close, and container elements)
			type: 				"jwplayer",                 // type of player to use (only accepts youtube or JW) [acceptable value: jw, jwplayer, ytplayer, youtube, yt]
			filename: 			"videos/test.mp4",          // JW = path to video file, YT = youtube ID (ex: ryxC6UDtcbQ)
			visibleOnLoad: 		true,                       // show the video immediately on page load [true, false]															
			autostart: 			false,                      // plays video immediately on click of play button or page load [true, false]
			autopause:          false,                      // pause other videos in the page while one is playing (allow multiple vids to play at the same time)
			autoclose: 			false,                      // closes video immediately on video complete event [true, false]
			repeat: 			false,                      // loops or repeats video after video complete event [true, false]
			vidTarget: 			"",                         // target element to create video within (accepts classes, IDs, or standard elements [ex: ".someClass", "#someID", 'body']
			playTarget: 		"",                         // target element to create play button within (accepts classes, IDs, or standard elements [ex: ".someClass", "#someID", 'body']
			width: 				"100%",                     // width of the video in pixel or percentage value
			height:				"100%",                     // height of the video in pixel or percentage value
			aspectratio: 		"",                         // when 100% width is used for JW player this will automatically size the height with proper dimensions [16:9, 24:10 or 4:3]
			bgcolor: 			"#fff",                     // background color behind video player (accepts all hex values)
			poster: 			"",                         // poster image for video player (path to image)
			theme: 				"",                         // theme for video player (JW = path to skin, YT = light, dark)
			progresscolor: 		"red",                      // color of YT loading bar (red, white)
			mute: 				true,                       // allow sound or not [true, false]
			controls: 			true,                       // show video controls or not [true, false]
			closeButton: 	    true,                       // show custom close button [true, false]
			rel: 				true,                       // show related YT videos after current video has played
			stretching: 		"fill",                     // how the video reacts to resizing [none, exactfit, uniform, fill]
			modal: 				false,                      // display video in modal window [true, false] (uses block UI)
			modalOverlayBG: 	"#fff",                     // background color of overlay (any hex value)
			modalContentBG: 	"transparent",              // background color of content box within overlay (any hex value)																	
			modalWidth: 		"70%",                      // width of modal window (pixel or percentage value)
			modalHeight: 		"70%",                      // height of modal window (pixel or percentage value)
			modalOpacity: 		0.7,                        // opacity of overlay (0.0 - 1.0)
			tracking: 			true,                       // turns tracking on or off per video [true, false]
			trackProjectName: 	"videogenerator",           // gets displayed in tracking tags before end values (ex: videogenerator: vid1: play)
			showLogs: 			false,                      // show console.log messages [true, false]			
			
			// event callbacks
			onVideoReady: 		function(position, duration) 	{ objConsole.log('callback: video ready'); },            // callback when video is ready
			onVideoTime: 		function(position, duration) 	{ /*objConsole.log('callback: video on time');*/ },          // callback for while video is playing on time event
			onVideoPlay: 		function(position, duration) 	{ objConsole.log('callback: video play'); },             // callback for when video is played
			onVideoPause: 		function(position, duration) 	{ objConsole.log('callback: video pause'); },            // callback for when video is paused
			onVideoSeek: 		function(position, duration) 	{ objConsole.log('callback: video seek'); },             // callback for when video is seeked
			onVideoComplete: 	function(position, duration) 	{ objConsole.log('callback: video complete'); },         // callback for when video is complete
			onPlayButtonPress: 	function(element, vidID) 		{ objConsole.log('callback: play button press'); },      // callback for when play button is pressed
			onCloseButtonPress: function(element, vidID) 		{ objConsole.log('callback: close button press'); }      // callback for when close button is pressed
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // extend defaults so we dont alter the originals
        this.options = jQuery.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

	// initialization logic here
    Plugin.prototype.init = function () {
        // access to this.element and this.options
		this.options.vidTarget = this.element; // set vidTarget to element plugin is invoked on
		var currOptions = this.options;
		videoOptions.push(currOptions);
		var i = setInterval(timer, 100);
		function timer() {
			if (objPageManager.librariesExist == true) {
				clearInterval(i);
				objPlayerHandler.init(currOptions); // only init players if all libraries are loaded
				return;
			}
		}
    };

    // wrapper to prevent multiple instantiations
    jQuery.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!jQuery.data(this, 'plugin_' + pluginName)) {
                jQuery.data(this, 'plugin_' + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );





/* ******************** ------------------------- PLAYER HANDLER OBJECT ------------------------- ******************** */
var objPlayerHandler = {
	videoMarkup: "",
    tagFired: false,
    vidDuration: 0,
    vidCurrPosition: 0,
    q1: 0,
    q2: 0,
    q3: 0,
	ytPlayers: [],
    init: function (vid) {
        // set logger state
		if (vid.showLogs == true) { objConsole.showLogs = true; }
		
		// log video options
		objConsole.log('---------------------------- PLAYER INIT ----------------------------');
		objConsole.log(vid);
		
		// handle play buttons
		objPlayerHandler.createPlayButtonMarkup(vid);
		
		// handle visible on page load use case
        objPlayerHandler.handleVisibleOnLoad(vid);
		
		// handle play/close events
		objPlayerHandler.handleEvents(vid);

		return false;
	},
	handleVisibleOnLoad: function(vid) {
		// if video should be visible on page load
		if (vid.visibleOnLoad == true) {
			// create video player markup then init correct player on page load
			objPlayerHandler.createVideoMarkup(vid);
			objPlayerHandler.initPlayer(vid);
		}
	
		return false;
	},
	createPlayButtonMarkup: function(vid) {
		// create play button (if there's one specified)
		if ((vid.playTarget != null) || (vid.playTarget != "") || (vid.playTarget != "none")) {
			// but only if one does not already exist
			if (jQuery(vid.playTarget).find('#play-'+vid.id+'').length <= 0) {
				jQuery(vid.playTarget).append('<div class="playVideo play-'+vid.type+'" id="play-'+vid.id+'">play</div>');
			}
		}
		return false;
	},
	createVideoMarkup: function (vid) {
		// set percentage or pixel based measurement for added styling control
		var measurementBase;
		if ((vid.width.indexOf('%') >= 1) || (vid.width == "")) {
			measurementBase = "percentage"; 
		} else { 
			measurementBase = "pixels"; 
		}
		
		// store markup
		objPlayerHandler.videoMarkup = 
			'<div class="vidContainer vid-'+vid.type+' '+measurementBase+'" id="vidContainer-'+vid.id+'">'
				+ '<div class="videoLayer">'
					+ '<div class="videoControls">'
						+ '<div class="closeVideo close-'+vid.type+'" id="close-'+vid.id+'">X</div>'
					+ '</div>'
					+ '<div class="video">'
						+ '<div id="'+vid.id+'"></div>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		;
		
		// write markup to video target element or modal window
		if (vid.modal == true) {
			objModalWindow.openModal(vid, objPlayerHandler.videoMarkup);
		} else {
			jQuery(vid.vidTarget).append(objPlayerHandler.videoMarkup);
		}
		
		return false;
	},
	initPlayer: function(vid) {
		// jw player
		if ((vid.type.toLowerCase() == "jwplayer") || (vid.type.toLowerCase() == "jw")) { 
			objPlayerHandler.createJWPlayer(vid); 
		}
		
		// youtube player
		if ((vid.type.toLowerCase() == "ytplayer") || (vid.type.toLowerCase() == "youtube") || (vid.type.toLowerCase() == "yt")) {			
			objPlayerHandler.createYTPlayer(vid);
		}
		
		// show video layer after envoking player
		jQuery('#vidContainer-'+vid.id+'').addClass('showVideo');
		
		// handle custom controls class
		if (vid.closeButton == false) { 
			jQuery('#vidContainer-'+vid.id+'').addClass('hideCustomControls');
		}
		
		return false;	
	},
	createJWPlayer: function (vid) {
        // API: JW: http://support.jwplayer.com/customer/portal/articles/1413089-javascript-api-reference
		
		// tailor options to jw player
		if (vid.repeat == true) { vid.repeat = "always"; }
		
		// jw player setup
        var player = jwplayer(vid.id).setup({
			    playlist: [{
				    image: vid.poster,
				    sources: [
					    { file: vid.filename.replace(/\.[^/.]+$/, "") + ".flv" },
					    { file: vid.filename.replace(/\.[^/.]+$/, "") + ".mp4" },
					    { file: vid.filename.replace(/\.[^/.]+$/, "") + ".webm" }
				    ]
			    }],
				aspectratio: vid.aspectratio,
			    width: vid.width.replace('px',''),
			    height: vid.height.replace('px',''),
			    stretching: vid.stretching,
			    controls: vid.controls,
			    skin: vid.skin,
			    mute: vid.mute,
			    repeat: vid.repeat,
			    shuffle: 'false',
			    autostart: vid.autostart,
				analytics: { enabled:false}, // removes strange IE9 issue (SCRIPT438: Object doesn't support property or method 'setSampleFrequency' jwpsrv_frq.js, line 1 character 1)
				primary: "html5" // html5, flash
            }
        );
		
		// resize fix for jw player html5 video | (jwplayer resize bug) | jw sets a pixel value to the video element on resize dynamically which overrides initial percentage value
		$window.resize(function() {
			jQuery.each(jQuery('.jwplayer'), function() {
				var vidID = jQuery(this).attr('id');
				jQuery.each(videoOptions, function(index, video) {
					if (this.id == vidID) {
						jwplayer(this.id).resize(this.width, this.height);
					}
				});
			});
		});
		
        // jw player events
		player.onReady(function (event) {
            jQuery('#'+vid.id+', .jwmain, .jwvideo, video').css('background-color', vid.bgcolor); // change BG color of player (jw player doesn't have this as an option)
			jQuery('#vidContainer-'+vid.id+', #play-'+vid.id+'').removeClass('videoComplete').addClass('videoReady');
			vid.onVideoReady(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
			// autoplay for mobile devices
			if ((objPageManager.device != "desktop") && (vid.autostart == true)) { player.play(); }
		});
		player.onTime(function (event) {
			objPlayerHandler.vidDuration = Math.floor(player.getDuration());
			objPlayerHandler.vidCurrPosition = Math.floor(player.getPosition());
			objPlayerHandler.q1 = Math.floor(objPlayerHandler.vidDuration * .25);
			objPlayerHandler.q2 = Math.floor(objPlayerHandler.vidDuration * .50);
			objPlayerHandler.q3 = Math.floor(objPlayerHandler.vidDuration * .75);
					
			if ((objPlayerHandler.vidCurrPosition == objPlayerHandler.q1) && (objPlayerHandler.tagFired == false)) { objTracking.trackVideo(vid, "Video_Position_25%"); resetTag(); }
			if ((objPlayerHandler.vidCurrPosition == objPlayerHandler.q2) && (objPlayerHandler.tagFired == false)) { objTracking.trackVideo(vid, "Video_Position_50%"); resetTag(); }
			if ((objPlayerHandler.vidCurrPosition == objPlayerHandler.q3) && (objPlayerHandler.tagFired == false)) { objTracking.trackVideo(vid, "Video_Position_75%"); resetTag(); }
			
			vid.onVideoTime(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
		});
		player.onPlay(function (event) {
            jQuery('#vidContainer-'+vid.id+', #play-'+vid.id+'').removeClass('videoComplete videoReady videoPaused').addClass('videoPlaying');
			if (objPlayerHandler.tagFired == false) {
				objPlayerHandler.pauseOtherVideos(vid);
				vid.onVideoPlay(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
				objTracking.trackVideo(vid, "Video_Initiate");
				resetTag();
			} // prevents jwplayer bug of firing on play twice
		});
		player.onPause(function (event) {
            jQuery('#vidContainer-'+vid.id+', #play-'+vid.id+'').removeClass('videoPlaying').addClass('videoPaused');
			if (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q1) { objTracking.trackVideo(vid, "Video_Pause_25%"); }
			if ((objPlayerHandler.vidCurrPosition > objPlayerHandler.q1) && (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q2)) { objTracking.trackVideo(vid, "Video_Pause_50%"); }
			if ((objPlayerHandler.vidCurrPosition > objPlayerHandler.q2) && (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q3)) { objTracking.trackVideo(vid, "Video_Pause_75%"); }
			vid.onVideoPause(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
		});
		player.onSeek(function (event) {
			if (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q1) { objTracking.trackVideo(vid, "Video_Q1_jump"); }
			if ((objPlayerHandler.vidCurrPosition > objPlayerHandler.q1) && (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q2)) { objTracking.trackVideo(vid, "Video_Q2_jump"); }
			if ((objPlayerHandler.vidCurrPosition > objPlayerHandler.q2) && (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q3)) { objTracking.trackVideo(vid, "Video_Q3_jump"); }
			if (objPlayerHandler.vidCurrPosition > objPlayerHandler.q3) { objTracking.trackVideo(vid, "Video_Q4_jump"); }
			vid.onVideoSeek(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
		});
		player.onComplete(function (event) {
			jQuery('#vidContainer-'+vid.id+', #play-'+vid.id+'').removeClass('videoPlaying videoPaused').addClass('videoComplete');
			// close video on complete if conditions are met
			if ((vid.repeat == false) && (vid.autoclose == true)) {
				objPlayerHandler.closeVideo(vid.id);
			}
			objTracking.trackVideo(vid, "Video_Complete");
			vid.onVideoComplete(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
		});
		
		// reset tag function (necessary because JW player fires onTime event at different intervals and usually every few milliseconds causing multiple tags to fire per second)
		function resetTag() {
			objPlayerHandler.tagFired = true;
			setTimeout(function() { 
				objPlayerHandler.tagFired = false; 
			}, 1000);	
		}
		
		return false;
	},
	createYTPlayer: function(vid) {
        // API: https://developers.google.com/youtube/player_parameters
		
		// tailor options to yt player
        if (vid.autostart == true) { vid.autostart = 1; } else { vid.autostart = 0; }
		if (vid.repeat == true) { playlist = vid.filename; vid.repeat = 1; } else { playlist = ""; vid.repeat = 0; }
		if (vid.theme == "") { vid.theme = "dark"; }

        // local vars
		var videotime = 0;
		var timeupdater = null;
		
		// only call youtube API when it's ready
		var t = setInterval(ytimer, 100);
		function ytimer() {
			if ((YT.Player != null) && (YT.Player != undefined)) {
				clearInterval(t);
				ytAPIReady();
				return;
			}
		}

        // yt player
		function ytAPIReady() {
			player = new YT.Player(vid.id, {
				videoId: vid.filename,
				height: vid.height.replace('px',''),
				width: vid.width.replace('px',''),
				playerVars: {
					wmode: "transparent",
					modestbranding: 1,
					controls: vid.controls,
					autoplay: vid.autostart,
					autohide: 0,
					playsinline: 0, // for ios 1 = plays inline 0 = opens IOS video player
					playlist: playlist,
					hd: 1, // HD [1 sets HD by default, 0]
					fs: 1, // full screen button display [0,1]
					loop: vid.repeat,
					theme: vid.theme, // theme of player [dark, light]
					color: vid.progresscolor, // color of progress bar [red, white]
					rel: 1, // show related videos [0,1]
					enablejsapi: 1
				},
				events: {
					'onReady': function(event) {		
						objPlayerHandler.vidDuration = Math.ceil(event.target.getDuration());
						objConsole.log('YT on ready fired');
						jQuery('#vidContainer-'+vid.id+', #play-'+vid.id+'').removeClass('videoComplete').addClass('videoReady');
						vid.onVideoReady();
						
						// autoplay for mobile
						if ((objPageManager.device != "desktop") && (vid.autostart == 1)) { player.playVideo(); }
						
						// set interval to track onTime functionality since youtube API doesn't currently have it
						function updateTime(playerCurrTime) {
							var oldTime = videotime;
							if(player && player.getCurrentTime) {
								videotime = player.getCurrentTime();
							}
							if(videotime !== oldTime) {
								onProgress(vid, videotime);
							}
						}
						timeupdater = setInterval(updateTime, 1000);
					},
					'onStateChange': function(event) {
						objPlayerHandler.vidCurrPosition = Math.floor(event.target.getCurrentTime());
						objPlayerHandler.q1 = Math.floor(objPlayerHandler.vidDuration * .25);
						objPlayerHandler.q2 = Math.floor(objPlayerHandler.vidDuration * .50);
						objPlayerHandler.q3 = Math.floor(objPlayerHandler.vidDuration * .75);
						
						if (event.data === 1) {
							jQuery('#vidContainer-'+vid.id+', #play-'+vid.id+'').removeClass('videoComplete videoReady videoPaused').addClass('videoPlaying');
							objPlayerHandler.pauseOtherVideos(vid);
							objTracking.trackVideo(vid, "Video_Initiate");
							vid.onVideoPlay(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
						}
						if (event.data === 2) {
							jQuery('#vidContainer-'+vid.id+', #play-'+vid.id+'').removeClass('videoPlaying').addClass('videoPaused');
							if (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q1) { objTracking.trackVideo(vid, "Video_Pause_25%"); }
							if ((objPlayerHandler.vidCurrPosition > objPlayerHandler.q1) && (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q2)) { objTracking.trackVideo(vid, "Video_Pause_50%"); }
							if ((objPlayerHandler.vidCurrPosition > objPlayerHandler.q2) && (objPlayerHandler.vidCurrPosition <= objPlayerHandler.q3)) { objTracking.trackVideo(vid, "Video_Pause_75%"); }
							vid.onVideoPause(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
						}
						if (event.data === 0) {
							jQuery('#vidContainer-'+vid.id+', #play-'+vid.id+'').removeClass('videoPlaying videoPaused').addClass('videoComplete');
							// close video on complete if conditions are met
							if ((vid.repeat == false) && (vid.autoclose == true)) {
								objPlayerHandler.closeVideo(vid.id);
							}
							objTracking.trackVideo(vid, "Video_Complete");
							vid.onVideoComplete(objPlayerHandler.vidCurrPosition, objPlayerHandler.vidDuration);
						}
					}
				}
			});
			// add youtube player to players array (so we can modify events later on grrrrr youtube)
			objPlayerHandler.ytPlayers.push(player);
		}
		
		// executed from updateTime interval function (every second)
		function onProgress(vid, currentTime) {
			currentTime = Math.floor(currentTime);
			if (currentTime == objPlayerHandler.q1) { objTracking.trackVideo(vid, "Video_Position_25%"); }
			if (currentTime == objPlayerHandler.q2) { objTracking.trackVideo(vid, "Video_Position_50%"); }
			if (currentTime == objPlayerHandler.q3) { objTracking.trackVideo(vid, "Video_Position_75%"); }
			vid.onVideoTime(currentTime, objPlayerHandler.vidDuration);
		}
		
		return false;
	},
	handleEvents: function (vid) {	
		jQuery('#play-'+vid.id+'').bind('touchstart, click',function(e){
			e.preventDefault();		
			var vidID = jQuery(this).attr('id').split('-')[1];
			objPlayerHandler.playVideo(vidID);
			vid.onPlayButtonPress(jQuery(this), vidID);
		});
		jQuery('#close-'+vid.id+'').bind('touchstart, click',function(e){
			e.preventDefault();
            var vidID = jQuery(this).attr('id').split('-')[1];
			objPlayerHandler.closeVideo(vidID);
			vid.onCloseButtonPress(jQuery(this), vidID);
		});
		return false;
	},
	pauseOtherVideos: function(vid) {
		if (vid.autopause == true) {
			jQuery.each(jQuery('.vidContainer'), function() {
				var thisVidContainer = jQuery(this);
				var thisVidID = thisVidContainer.attr('id').split('-')[1];
				if (thisVidID != vid.id) {
					if (thisVidContainer.hasClass('vid-jwplayer')) {
						jwplayer(thisVidID).play(false); // used instead of pause because pause breaks occasionally grrrrrr
					} else {
						toggleYTState(thisVidID, 'pauseVideo');
					}
				}
			});
		}
		return false;
	},
	playVideo: function (vidID) {
		// if matching vid id already exists in the DOM just play it
		if (jQuery('#vidContainer-'+vidID+'').length >= 1) {
			if ((jQuery('#vidContainer-'+vidID+'').hasClass('videoPaused')) || (jQuery('#vidContainer-'+vidID+'').hasClass('videoReady'))) {
				if (jQuery('#vidContainer-'+vidID+'').hasClass('vid-jwplayer')) {
					jwplayer(vidID).play();
				} else {
					toggleYTState(vidID, 'playVideo');
				}
			}
			if (jQuery('#vidContainer-'+vidID+'').hasClass('videoPlaying')) {
				if (jQuery('#vidContainer-'+vidID+'').hasClass('vid-jwplayer')) {
					jwplayer(vidID).play(false); // used instead of pause because pause breaks occasionally grrrrrr
				} else {
					toggleYTState(vidID, 'pauseVideo');
				}
			}
		}
		// create the vid markup and player again
		else {		
			jQuery.each(videoOptions, function(index, video) {
				if (this.id == vidID) {
					objPlayerHandler.createVideoMarkup(this);
					objPlayerHandler.initPlayer(this);
					objPlayerHandler.handleEvents(this);
				}
			});
		}
		
		return false;
	},
	closeVideo: function (vidID) {
		if (jQuery('#vidContainer-'+vidID+'').hasClass('vid-jwplayer')) {
			jwplayer(vidID).stop();
			jwplayer(vidID).remove();
			jQuery('#vidContainer-'+vidID+'').html('').remove();
		} else {
			jQuery('#vidContainer-'+vidID+', #vidContainer-'+vidID+' iframe').html('').remove();
		}
		objModalWindow.closeModal();
		return false;
	}
};
// play/pause youtube video
function toggleYTState(vidID, state) {
	// loop through players stored in array
	jQuery.each(objPlayerHandler.ytPlayers, function(index, value) {
		var thisPlayerID = this.a.id;
		if (thisPlayerID == vidID) {
			if (state == "playVideo") {
				this.playVideo();	
			}
			if (state == "pauseVideo") {
				this.pauseVideo();
			}
		}
	});
}




/* ********************* ------------------------- MODAL WINDOW OBJECT ------------------------- ******************** */
var objModalWindow = {
    modalOpen: false,
	openModal: function (vid, videoMarkup) {
		$body.addClass('modalOpen');
		jQuery.blockUI({ 
			message: videoMarkup,
			css: {
				top: '0',
				right: '0',
				bottom: '0',
				left: '0',
				margin: 'auto',
				border: 'none',
				width: vid.modalWidth,
				height: vid.modalHeight,
				padding: 0,
				cursor: 'normal',
				backgroundColor: vid.modalContentBG
			},
			overlayCSS: { 
				backgroundColor: vid.modalOverlayBG, 
				opacity: vid.modalOpacity
			},
			onOverlayClick: function() {
				objPlayerHandler.closeVideo(vid.id);
				vid.onCloseButtonPress(jQuery(this), vid.id);
			}
		});
        objModalWindow.modalOpen = true;
		objModalWindow.handleOldIE();
		return false;
	},
	closeModal: function() {
		if (objModalWindow.modalOpen == true) {
            $body.removeClass('modalOpen');
		    jQuery.unblockUI();
            objModalWindow.modalOpen = false;
        }
		return false;
	},
	handleOldIE: function() {
		// necessary to center percentage based modal window in IE7
		if (jQuery.browser.version == '7.0') {
			jQuery('.blockMsg').centerHorizontally();
			jQuery(window).bind('resize', function () { 
				jQuery('.blockMsg').centerHorizontally();
			});
		}
        return false;
	}
};





/* ******************** ------------------------- FILE MANAGER OBJECT ------------------------- ******************** */
var objPageManager = {
    librariesExist: false,
	userAgent: window.navigator.userAgent,
    device: "",
	"file": [
		{
			"type": "css",
		    "name": "videogenerator",
            "src": serverLocation + 'videogenerator.css',
            "exists": false
        },
		{
            "type": "script",
		    "name": "jwplayer",
            "src": serverLocation + 'libs/jwplayer.js',
            "exists": false
        },
        {
            "type": "script",
		    "name": "youtube",
            "src": "https://www.youtube.com/player_api", //serverLocation + 'libs/youtube.playerapi.js',
            "exists": false
        },
        {
            "type": "script",
		    "name": "blockui",
            "src": serverLocation + 'libs/jquery.blockUI.js',
            "exists": false
        },
        {
            "type": "script",
		    "name": "omniture",
            "src": serverLocation + 'libs/omniture.js',
            "exists": false
        }
    ],
    init: function() {
		// append hidden field to store progress manager counter
        $body.append('<input id="hiddenFieldCounter" type="hidden" value="'+objProgressManager.progCounter+'" />');
        objProgressManager.hiddenFieldCounter = jQuery('#hiddenFieldCounter');
		
        // check for existing libraries then include appropriate files
        objPageManager.getCurrentDevice();
		objPageManager.checkExistingLibraries();
        objPageManager.includeNonExistentLibraries();

        return false;
    },
	getCurrentDevice: function () {
        if ((objPageManager.userAgent.match(/iPhone/i) || objPageManager.userAgent.match(/iPod/i) || objPageManager.userAgent.match(/BlackBerry/i)) || (screen.width < 400)) {
            objPageManager.device = "phone";
        } else if (objPageManager.userAgent.match(/iPad/i) || objPageManager.userAgent.match(/Mobile Safari/i)) {
            objPageManager.device = "tablet";
        } else {
            objPageManager.device = "desktop";
        }
        return false;
    },
    checkExistingLibraries: function() {	
		// array of script tags from the page we're loaded into
		var scriptTag = document.getElementsByTagName('script');
		var currSRC = "";		
		var thisFileType = "";
		var thisFileName = "";
		
		// loop through script tags and check to make sure library doesn't already exist on the page
		jQuery.each(scriptTag, function(i) {
			currSRC = scriptTag[i].src.toLowerCase();
            jQuery.each(objPageManager.file, function(index, file) {
                if (index != "undefined") {
					thisFileType = objPageManager.file[index].type;
					thisFileName = objPageManager.file[index].name;
					if (thisFileType == "script") {
						if (currSRC.indexOf(thisFileName) > 0) { objPageManager.file[index].exists = true; objConsole.log('' + thisFileName + ' library already exists'); } // set exists to true if library is already included in the page
					}
				}
            });
		});
		
		return false;
	},
    includeNonExistentLibraries: function() {
		// file length counter
		var numOfFilesToLoad = 0;

		// for each file in array
		jQuery.each(objPageManager.file, function() {
			// if omniture doesn't exist in the page add necessary icgMetricLoader var
			if (this.name == "omniture") {
				icgMetricLoader = { siteName: 'Video Generator', locale: 'en_US', channel: 'Marketing', googleOn: 'True', omnitureOn: 'True', omnitureAccount: 'gsicrlusstgi2', omnitureDomain: 'metrics.ralphlauren.com', googleAccount: 'UA-8100973-1' };	
			}
			// if file doesn't exist increase counter
			if (this.exists == false) {
				numOfFilesToLoad += 1;
			}
		});

        // use progress manager to only load the next file when the previous file is finished loading
        objProgressManager.checkProgressSynchronously(numOfFilesToLoad, inProgress, progressFinished);
        function inProgress(newVal) {
            // load each library (if it doesn't already exist) and update counters
			if (objPageManager.file[newVal].exists == false) {
				objPageManager.loadFile(objPageManager.file[newVal].type, objPageManager.file[newVal].src, function () {
					if (objPageManager.file[newVal].name == "jwplayer") { jwplayer.key="AQUs2whoj3v3iO/XU0zvCacFdYfvwLfefrwUCbBI0xY="; }
					objPageManager.file[newVal].exists = true;
					objConsole.log(objPageManager.file[newVal].name + ' ' + objPageManager.file[newVal].type + ' loaded');
					objProgressManager.updateCounters();
				});
			}
        }
        function progressFinished() {
            objConsole.log('PROGRESS FINISHED: all files loaded');
			objPageManager.librariesExist = true;
        }

        return false;
    },
    loadFile: function(type, url, callback) {
		// css
		if (type == "css") {
			nocache=false; // default don't refresh
			if (nocache) url += '?_ts=' + new Date().getTime();
			jQuery('<link>', {rel:'stylesheet', type:'text/css', 'href':url}).load(function(){
				if (typeof callback=='function') callback();
			}).appendTo($body);
		}
		// scripts
		if (type == "script") {
			var script = document.createElement("script")
			script.type = "text/javascript";
			if (script.readyState) { //IE
				script.onreadystatechange = function () {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else { //Others
				script.onload = function () {
					callback();
				};
			}
			script.src = url;
			document.getElementsByTagName('body')[0].appendChild(script);
		}
    }
};





/* ******************** ------------------------- PROGRESS MANAGER OBJECT ------------------------- ******************** */
var objProgressManager = {
	hiddenFieldCounter: "",
	progCounter: 0,
	checkProgressOfBool: function(valToCheck, endVal, doInProgress, doWhenProgressFinished) {
		objConsole.log('---------------------------- BOOL PROGRESS MANAGER ITERATION ----------------------------');
		boolInt = setInterval(boolChecker, 100);
		function boolChecker() {
			if (valToCheck != endVal) {
				objConsole.log('val to check: ' + valToCheck + ', endVal: ' + endVal);
				if (doInProgress) { doInProgress(); }
			} else {
				clearInterval(boolInt);
				objConsole.log('---------------------------- /BOOL PROGRESS MANAGER ITERATIONS ----------------------------');
				if (doWhenProgressFinished) { doWhenProgressFinished(); }
			}
		}
		return false;	
	},
	checkProgressAsynchronously: function(endVal, doInProgress, doWhenProgressFinished) {
		objConsole.log('---------------------------- ASYNC PROGRESS MANAGER ITERATION ----------------------------');
		asyncInt = setInterval(asyncChecker, 100);
		function asyncChecker() {
			if (objProgressManager.progCounter != endVal) {
				if (doInProgress) { doInProgress(); }
			} else {
				clearInterval(asyncInt);
				objProgressManager.progCounter = 0;
				objConsole.log('---------------------------- /ASYNC PROGRESS MANAGER ITERATIONS ----------------------------');
				if (doWhenProgressFinished) { doWhenProgressFinished(); }
			}
		}
		return false;	
	},
	checkProgressSynchronously: function(endVal, doInProgress, doWhenProgressFinished) {
		objConsole.log('---------------------------- PROGRESS MANAGER ITERATION ----------------------------');

		// do something on hidden field value change
		objProgressManager.hiddenFieldCounter.bind('change', function() {
			var newVal = jQuery(this).val();
			objConsole.log('CHANGE EVENT: hiddenField:' + newVal + ', progCounter: ' + objProgressManager.progCounter + ', end value: ' + endVal);
			// if were not at the end of the array
			if (newVal != endVal) {
				if (doInProgress) { doInProgress(newVal); }
			} else {
				objProgressManager.resetCounters();
				if (doWhenProgressFinished) { doWhenProgressFinished(); }
			}
		});

		// trigger initial change event to start the checking progress
		objProgressManager.hiddenFieldCounter.trigger('change');

		return false;
	},
	updateCounters: function() {
		objProgressManager.progCounter += 1;
		objConsole.log('updated counter: ' + objProgressManager.progCounter);
		objProgressManager.hiddenFieldCounter.val(objProgressManager.progCounter).change();
		return false;
	},
	resetCounters: function() {
		objProgressManager.progCounter = 0;
		objProgressManager.hiddenFieldCounter.val(objProgressManager.progCounter);
		objProgressManager.hiddenFieldCounter.unbind();
		objConsole.log('reset counter: ' + objProgressManager.progCounter);
		objConsole.log('---------------------------- /PROGRESS MANAGER ITERATIONS ----------------------------');
		return false;
	}
};





/* ******************** ------------------------- CONSOLE OBJECT ------------------------- ******************** */
var objConsole = {
	showLogs: false,
	log: function(message) {
		if (objConsole.showLogs == true) {
			try {
				console.log(message);				
			} catch (e) {

			}
		}
		return false;
	}
};





/* ********************* ------------------------- TRACKING OBJECT ------------------------- ******************** */
var objTracking = {
	trackVideo: function (vid, evar) {
		if (vid.tracking == true) {
			var evarValue = vid.trackProjectName + ': ' + vid.id + ': ' + evar;
			evarValue = evarValue.replace(/\s+/g, '');
			objConsole.log(evarValue);

			if ((s != null) && (s != undefined)) {
				if ((s.un == undefined) || (s.un == null)) { s.un = ''; }
				s.linkTrackVars = "eVar40";
				s.eVar40 = evarValue;
				s.tl(true, "o", "Video Tracking");
			}
		}
        return false;
	}
};





/* ++++++++++++++++++++ --------------- JS/JQUERY HELPER FUNCTIONS --------------- ++++++++++++++++++++ */
// center horizontally within element
jQuery.fn.extend({
    centerHorizontally: function () {
        return this.each(function () {
            $this = jQuery(this);
            //var top = ($(this).parent().height() - $(this).height()) / 2;
            var left = ($this.parent().width() - $this.outerWidth()) / 2;
            //$(this).css({ position: 'absolute', top: top + 'px' });
            $this.css({ position: 'fixed', left: left + 'px' });
        });
    }
});

// click anywhere to close
jQuery.fn.outside = function(ename, cb){
	return this.each(function(){
		var $this = jQuery(this),
		self = this;
		jQuery(document).bind(ename, function tempo(e){
			if(e.target !== self && !jQuery.contains(self, e.target)){
				cb.apply(self, [e]);
				if(!self.parentNode) jQuery(document.body).unbind(ename, tempo);
			}
		});
	});
};




