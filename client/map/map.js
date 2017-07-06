import { RemoteVideos } from "../../lib/collections";
import 'leaflet';
import 'leaflet.markercluster';

import '../../node_modules/leaflet/dist/leaflet.css';
import '../../node_modules/leaflet.markercluster/dist/MarkerCluster.css';
import '../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css';

var map;

var videosOnMap = [];
var videoIndex = 0;
var targetVideoUuid = null;

var playerOn = false;
var readyForNextMarker = true;

var waitAfterPlay = 6000;
var waitBeforePlay = 2000;
var maxPlayback = 8000;

const DEFAULT_ZOOM = 10;
const DEFAULT_LAT = 64.1842953;
const DEFAULT_LNG = -51.730436;

Template.map.onRendered(()=>{

	targetVideoUuid = FlowRouter.getParam("videoUuid");
	if(targetVideoUuid) {
		console.log("videoUuid: " + FlowRouter.getParam("videoUuid"));	
	} else {
		console.log("no videoUuid specified, going to panorama mode");
	}
	
	map = L.map('map', {zoomControl: false}).setView([DEFAULT_LAT, DEFAULT_LNG], DEFAULT_ZOOM);	 
	
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', { 
	  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
	  subdomains: ['a', 'b', 'c'],
	  minZoom: 14,
	  maxZoom: 18
	}).addTo(map);

	console.log("looking up videos");
	RemoteVideos.find().observeChanges({
   		added: function (id, video) {
       		console.log("added " + id);
       		addRemoteMarkerToMap(video);
   		},
   		changed: function (id, video) {
       		console.log("changed " + id);
   		},
   		removed: function (id) {
       		console.log("removed " + id);
  		}
	});

	if(!targetVideoUuid) {
		setInterval(()=> {
			if(!videosOnMap.length || !readyForNextMarker) {
				return;
			}
			readyForNextMarker = false;
			moveAndPlay(videosOnMap[videoIndex].videoUuid);	
			videoIndex = Math.floor(Math.random() * videosOnMap.length);
		}, 1000);	
	} else {
		setTimeout(()=> { // give remote videos time to load
			moveAndPlay(targetVideoUuid);	
		}, 1000);
	}
	
});

// verify existence of geo position
checkPosition = function(obj) {
    if(!obj) {
      return false;
    }
    if(typeof(obj.coords) == "undefined") {
      return false;
    }
    if(Object.keys(obj.coords).length === 0 && obj.coords.constructor === Object) {
      return false
    }
    return true;
}

moveAndPlayRandomVideo = function() {
	let randomVideo = RemoteVideos.aggregate({ $sample: { size: 1 } });
	moveAndPlay(randomVideo);
}

moveAndPlay = function(videoUuid) {

	let video = RemoteVideos.findOne({videoUuid: videoUuid});
	if(!video) {
		console.log("video not found, aborting");
		return;
	}

	let marker = addRemoteMarkerToMap(video);

	let pos = marker.getLatLng();
	console.log(pos);
	$(".lat").html("lat " + pos.lat.toFixed(5));
	$(".lng").html("long " + pos.lng.toFixed(5));

	//console.log(videosOnMap);
  	//markers.zoomToShowLayer(marker, ()=>{
  	//marker.__parent.spiderfy();
  	marker.addTo(map); // show marker
  	var latLngs = [ marker.getLatLng() ];
  	var markerBounds = L.latLngBounds(latLngs);
  	map.fitBounds(markerBounds);
  	setTimeout(()=>{
  		//$(".map-curtain").fadeTo(200, 0.5);
  		playVideo(video, marker);	
  	}, waitBeforePlay);
  //});
}

// add a remote marker to map
addRemoteMarkerToMap = function(video) {
    if(!this.checkPosition(video.start_geoposition)) {
    	console.log("no geoposition found, returning");
		return;
    }
    var videoStartLat = video.start_geoposition.coords.latitude;
    var videoStartLng = video.start_geoposition.coords.longitude;
    
    var thumb = video.thumbUrl;
    //thumb = "/dummy_thumb.jpg"; // for testing
    
	let marker = L.marker([videoStartLat, videoStartLng], {
		videoUuid: video.videoUuid,
		title: video.title,
		alt: video.title + "(not yet downloaded)",
		icon: new LocalIcon({ shadowUrl: thumb }),
	});
	
	//console.log("adding remote marker to map");
	//marker.addTo(map);
	/*.on('click', ()=>{
		console.log("click marker");
		playVideo(video.videoUuid);
	});*/
	//marker markersOnMap.push(marker);
	videosOnMap.push(video);

	return marker;
}

playVideo = function(video, marker) {
	console.log(video);
	if(!video) {
		readyForNextMarker = true;
		return;
	}
	//video.url = "http://s3.amazonaws.com/promis-dev/videos/65672ba3-33dd-42e7-8739-6e18296be474.mp4"; // for testing
	if(video.url) {
		$("#map-player").show();
		$("#map-player").attr("src", video.url);	
		$("#map-player")[0].load();
		console.log("loading...");

		$("#map-player").off().on("canplaythrough", ()=>{
			console.log("canplaythrough");
		
			$("#map-player")[0].play();
			playerOn = true;
			
			$("#map-player").off().on("ended", ()=>{
				if(playerOn) {
					console.log("ended");
					setCurtainWidth();
					$("#player-curtain").fadeIn(3000, ()=>{
						playbackStop(marker);
					});
				}
			});

			if(!targetVideoUuid) {
				setTimeout(()=>{
					if(playerOn) {
						playerOn = false;
						console.log("maxPlayback");
						setCurtainWidth();
						$("#player-curtain").fadeIn(3000, ()=>{
							$("#map-player")[0].pause();
							playbackStop(marker);
						});
					}
				}, maxPlayback);
			}

		});

	} else {
		$("#map-player").attr("src", "");	
		$("#map-player")[0].load();
		readyForNextMarker = true;
	}
}

setCurtainWidth = function() {
	console.log("width: " + $("#map-player").width());
	$("#player-curtain").width($("#map-player").width());
}

playbackStop = function(marker) {
	if(!targetVideoUuid) {
		playerOn = false;
		$(".curtain-info").show();
		marker.remove();
		setTimeout(()=>{
			$(".curtain-info").hide();
			$("#map-player").hide();
			$("#player-curtain").hide();
			$(".map-curtain").fadeOut();
			readyForNextMarker = true;
		}, waitAfterPlay);
	}
}

/***** icons *******/

var LocalIcon = L.Icon.extend({
  options: {
    //shadowUrl: video.thumbUrl, // set background picture here!
    iconUrl: '/markers_svg/PROMIS_marker_local.svg',
    iconSize:     [76, 88], // size of the icon
    shadowSize:   [72, 72], // size of the shadow
    iconAnchor:   [(76/2), 88], // point of the icon which will correspond to marker's location
    shadowAnchor: [(72/2), (88-1)],  // the same for the shadow
    //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    className: 'LocalIcon'
  }
});

var RemoteIcon = L.Icon.extend({
  options: {
    iconUrl: '/markers_svg/PROMIS_marker_remote.svg',
    iconSize:     [70, 70], // size of the icon
    shadowSize:   [69, 69],
    iconAnchor:   [(70/2), (70/2)], // point of the icon which will correspond to marker's location
    className: 'onlineIcon'
  }
});

