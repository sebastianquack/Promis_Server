import { RemoteVideos, GlobalSettings, PromisUsers } from "../../lib/collections";

Template.admin.helpers({
	remoteVideos() { return RemoteVideos.collection.find({}) },
	settings() { return GlobalSettings.collection.findOne(); },
	users() { return PromisUsers.find({})}
})

Template.admin.events({
	"submit #static-content"(event) {
		event.preventDefault();
		Meteor.call("updateStaticContent", {
			how_to_play_content: event.target.how_to_play_content.value,
			about_content: event.target.about_content.value,
			make_promis_content: event.target.make_promis_content.value
		});
	}
})

Template.videoItem.helpers({
	"flaggedClass"() {
		return this.flagged ? "flagged" : "";
	},
	"user"() {
		let user = PromisUsers.findOne({deviceUuid: this.deviceUuid});
		if(user) {
			return user.username;
		} else {
			return "not found";
		}
	}
})

Template.videoItem.events({
	"submit"(event) {
		event.preventDefault();
		this.start_geoposition.coords.latitude = event.target.lat.value;
		this.start_geoposition.coords.longitude = event.target.lon.value;
		this.end_geoposition.coords.latitude = event.target.lat.value;
        this.end_geoposition.coords.longitude = event.target.lon.value;
        console.log(this);
        Meteor.call("updateVideo", this);
    	
	},
	"click .hide"(event) {
		event.preventDefault();
		console.log(this);
		if(!this.hidden) {
			if(confirm("hide this video?")) {
				Meteor.call("hideVideo", this, true);
			}	
		} else {
			if(confirm("unhide this video?")) {
				Meteor.call("hideVideo", this, false);
			}	
		}
	},
	"click .flag"(event) {
		event.preventDefault();
		console.log(this);
		if(!this.flagged) {
			if(confirm("flag this video?")) {
				Meteor.call("flagVideo", this, true);
			}	
		} else {
			if(confirm("unflag this video?")) {
				Meteor.call("flagVideo", this, false);
			}	
		}
	},
	"click .delete"(event) {
		event.preventDefault();
		console.log(this);
		if(confirm("permanently delete this video?")) {
			Meteor.call("deleteVideo", this);
		}	
	},
	
	"click .show"(event) {
		event.preventDefault();
		console.log(this);
		if(this.url) {
			$("#player").attr("src", this.url);	
			$("#player")[0].load();
			setTimeout(()=>{
				$("#player")[0].play();
			}, 200);
		} else {
			$("#player").attr("src", "");	
			$("#player")[0].load();
		}		
	}
})