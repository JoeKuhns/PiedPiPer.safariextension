(function () {
    'use strict';
    
//     monitorEvents(window);

    var resources,
        currentResource,
        addPipButtons,
        findVideos,
        plexObserver,
        plexObserverTrigger,
        amazonObserver,
        amazonObserverTrigger,
        netflixObserver,
        netflixObserverTrigger,
        initPiPTool;
        
//         THIS IS THE SHOW HIDE FUNCTION FOR AMAZON


function shower() {
    document.getElementById('piper').style.visibility = "visible";
  }
  function hider() {
    document.getElementById('piper').style.visibility = "hidden";
  }
        
        

    /**
     * Add the PiP event and button to a given video
     * @param {Object} videoWrapper Video element to process
     */
    addPipButtons = function (videoWrapper) {
        var pipButton,
            pipImage,
            video,
            controlsWrapper;

        /** @type {Object} The video to be switched */
        setTimeout(function(){
	        
	        video = videoWrapper.querySelector(currentResource.videoSelector);
        
	        if (currentResource.name == 'amazon') {
	// 	        video = videoWrapper.querySelectorAll(currentResource.videoSelector);
	        } 
	        
	        console.log(video);
	
	        /** @type {Object} The PiP button */
	        pipButton = document.createElement(currentResource.elementType);
	        pipButton.classList = currentResource.buttonClassList;
	        pipButton.title = 'PiP Mode';
	
	        /** @type {Object} The icon shown in the PiP button */
            if (currentResource.name == 'youtube') { 
                // svg must be inserted inline, otherwise youtube css style properties won't be inherited
                pipButton.innerHTML = '<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-90"></use><path class="ytp-svg-fill" d="M31,21v7H19v-7H31z M9,11h18v8h2v-8c0-1.1-0.9-2-2-2H9c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h8v-2H9V11zM15,15.4l-3.6-3.5L10,13.3l3.7,3.7H11v2h4h2v-2v-4h-2V15.4z" id="ytp-svg-90"></path></svg>';
            } else {
                pipImage = document.createElement('img');
                pipImage.src = safari.extension.baseURI + 'images/' + currentResource.name + '-icon.svg';
                pipButton.appendChild(pipImage);                
            }
	        
	        pipButton.addEventListener('click', function (event) {
	            event.preventDefault();
	
	            /** Swap the PiP mode */
	            if ('inline' === video.webkitPresentationMode) {
	                video.webkitSetPresentationMode('picture-in-picture');
	            } else {
	                video.webkitSetPresentationMode('inline');
	            }
	        });
	
	        
	
		    controlsWrapper = videoWrapper.querySelector(currentResource.controlsWrapperClass);
	
	        if (currentResource.name == 'netflix' && document.body.querySelectorAll('.pip-button').length < 1) {
	// 	        document.body.appendChild(pipButton);
		        document.querySelector('.player-status').appendChild(pipButton);
	        } else if (controlsWrapper && 0 === controlsWrapper.querySelectorAll('.pip-button').length) {
                if (currentResource.name == 'youtube') {
                    // insert between airplay and fullscreen icon
                    controlsWrapper.insertBefore(pipButton, controlsWrapper.childNodes[controlsWrapper.childNodes.length-1]);
                } else {
                    controlsWrapper.appendChild(pipButton);
                }
	        } else if (currentResource.name == 'weather' && document.body.querySelectorAll('.pip-button').length < 1) {
	            document.querySelector('.akamai-controls .akamai-control-bar').appendChild(pipButton);
	   
	        } else if (currentResource.name == 'amazon' && document.body.querySelectorAll('.pip-button').length < 1) {
		        pipButton.id = 'piper';
	
		        document.body.appendChild(pipButton);
		        console.log('Its Amazon');
		        
		        document.body.addEventListener('mouseover',function() { shower() },true);
		        document.body.addEventListener('mouseout',function() { hider() },true);
	
	
	        }
        

	        
        }, 50)

        
    };

    /** Find the videos according to the current resource options */
    findVideos = function () {
        var videoWrappers,
            videoWrapperIterator;

        /** Fetch all the video elements */
        videoWrappers = document.querySelectorAll(currentResource.videoParentClass);
        
        console.log(videoWrappers);

        for (videoWrapperIterator = 0; videoWrapperIterator < videoWrappers.length; videoWrapperIterator++) {
            addPipButtons(videoWrappers[videoWrapperIterator]);
        }
    };
    
    

    /** The method used to listen and trigger the event of finding the videos */
    netflixObserver = function (mutations) {
        mutations.forEach(function (mutation) {
            var addedNodesIterator;

            for (addedNodesIterator = 0; addedNodesIterator < mutation.addedNodes.length; addedNodesIterator++) {
                if (mutation.addedNodes[addedNodesIterator].classList && mutation.addedNodes[addedNodesIterator].classList.contains(currentResource.customClasses.videoClassObserver)) {
                    findVideos();
                }
            }
        });
    };

    /** The trigger of the Plex Observer */
    netflixObserverTrigger = function () {
        var observer;

        /** @type {MutationObserver} Initialize an observer */
        observer = new MutationObserver(netflixObserver);

        /** Set the observer */
        observer.observe(document.querySelector(currentResource.customClasses.netflixContainer), {
			childList: true, 
		    subtree:true
        });
    };






    /** The method used to listen and trigger the event of finding the videos */
    amazonObserver = function (mutations) {
// 	    console.log(mutations);
        mutations.forEach(function (mutation) {
            var addedNodesIterator;

            for (addedNodesIterator = 0; addedNodesIterator < mutation.addedNodes.length; addedNodesIterator++) {
                if (mutation.addedNodes[addedNodesIterator].classList && mutation.addedNodes[addedNodesIterator].classList.contains(currentResource.customClasses.videoClassObserver)) {
                    findVideos();
                }
            }
        });
    };

    /** The trigger of the Plex Observer */
    amazonObserverTrigger = function () {

	        console.log('Its Amazon');
	        
// 	        addPipButtons(document.body);


        var observer;

        /** @type {MutationObserver} Initialize an observer */
        observer = new MutationObserver(amazonObserver);

        /** Set the observer */
        observer.observe(document.querySelector(currentResource.customClasses.amazonContainer), {
			childList: true, 
		    subtree:true
        });
    };








    /** The method used to listen and trigger the event of finding the videos */
    plexObserver = function (mutations) {
        mutations.forEach(function (mutation) {
            var addedNodesIterator;

            for (addedNodesIterator = 0; addedNodesIterator < mutation.addedNodes.length; addedNodesIterator++) {
                if (mutation.addedNodes[addedNodesIterator].classList && mutation.addedNodes[addedNodesIterator].classList.contains(currentResource.customClasses.videoClassObserver)) {
                    findVideos();
                }
            }
        });
    };

    /** The trigger of the Plex Observer */
    plexObserverTrigger = function () {
        var observer;

        /** @type {MutationObserver} Initialize an observer */
        observer = new MutationObserver(plexObserver);

        /** Set the observer */
        observer.observe(document.querySelector(currentResource.customClasses.plexContainer), {
            childList: true
        });
    };

    /** Method to trigger the PiP button display */
    initPiPTool = function () {
        /** @type {Array} An array with every platform and the custom options for them */
        resources = [
            {
                name: 'dailymotion',
                testPattern: /(dailymotion\.com|www\.dailymotion\.com)/,
                customLoadEvent: null,
                elementType: 'button',
                videoSelector: 'video#dmp_Video',
                buttonClassList: 'dmp_ControlBarButton pip-button',
                videoParentClass: '.dmp_Player',
                controlsWrapperClass: '.dmp_ControlBar',
                customClasses: null
            },
            {
                name: 'plex',
                testPattern: /(plex\.tv|www\.plex\.tv|app\.plex\.tv)/,
                customLoadEvent: {
                    name: 'DOMContentLoaded',
                    method: plexObserverTrigger,
                    loaded: false
                },
                elementType: 'button',
                videoSelector: 'video.html-video',
                buttonClassList: 'btn-link pip-button',
                videoParentClass: '.video-container',
                controlsWrapperClass: '.video-controls-overlay-bottom .video-controls-right',
                customClasses: {
                    plexContainer: '#plex',
                    videoClassObserver: 'video-player'
                }
            },
            {
                name: 'youtube',
                testPattern: /(youtube\.com|www\.youtube\.com|youtu\.be|www\.youtu\.be)/,
                customLoadEvent: {
                    name: 'spfdone',
                    method: findVideos,
                    loaded: false
                },
                elementType: 'button',
                videoSelector: 'video.html5-main-video',
                buttonClassList: 'ytp-button pip-button',
                videoParentClass: '.html5-video-player',
                controlsWrapperClass: '.ytp-right-controls',
                customClasses: null
            },
            {
                name: 'netflix',
                testPattern: /(netflix\.com|www\.netflix\.com)/,

                customLoadEvent: {
                    name: 'load',
                    method: netflixObserverTrigger,
                    loaded: false
                },

                elementType: 'span',
                videoSelector: 'video',
                buttonClassList: 'netflix-pip',
                videoParentClass: '.player-video-wrapper',
                customClasses: {
                    netflixContainer: '#appMountPoint',
                    videoClassObserver: 'player-menu'
                }
            },
            {
                name: 'weather',
                testPattern: /(weather\.com|www\.weather\.com|www\.imrworldwide\.com|imrworldwide\.com)/,
                customLoadEvent: {
                    name: 'initialized',
                    method: findVideos,
                    loaded: false
                },
                elementType: 'button',
                videoSelector: 'video.akamai-html5',
                buttonClassList: 'akamai-button pip-button akamaiJ',
                videoParentClass: '.akamai-video',
                controlsWrapperClass: '.akamai-controls',
                customClasses: null
            },
            {
                name: 'amazon',
                testPattern: /(amazon\.com|www\.amazon\.com)/,
                customLoadEvent: {
                    name: 'load',
                    method: amazonObserverTrigger,
                    loaded: false
                },
                elementType: 'button',
                videoSelector: 'video',
                buttonClassList: 'ytp-button pip-button amazon-pip',
                videoParentClass: '.rendererContainer',
                controlsWrapperClass: '.controlsOverlayTopRight',
                customClasses: {
                    amazonContainer: '#dv-player-content',
                    videoClassObserver: 'rendererContainer'
                }
            }
        ];
        

        /** @type {Object} An object keeping the current platform options */
        currentResource = null;

        resources.forEach(function (resource) {
            if (location.hostname.match(resource.name)) {
                currentResource = resource;

                /** Add the event for normal pages */
                window.addEventListener('load', findVideos, true);

                /** Try to see if we have any custom handlers for this page (for instance DailyMotion). Usually these are used with SPAs (single page applications) like YouTube or Plex */
                if (null !== currentResource.customLoadEvent && false === currentResource.customLoadEvent.loaded) {
                    window.addEventListener(currentResource.customLoadEvent.name, currentResource.customLoadEvent.method, true);

                    currentResource.customLoadEvent.loaded = true;
                }
            }
        });
    };

    initPiPTool();
}());


