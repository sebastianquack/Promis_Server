import { Meteor } from 'meteor/meteor';
declare var process: any;
declare var S3: any;
import { GlobalSettings, RemoteVideos, PromisUsers } from '../lib/collections'
declare var HttpBasicAuth: any;

S3.config = {
    key: process.env.PROMIS_S3_KEY,
    secret: process.env.PROMIS_S3_SECRET,
    bucket: 'promis-dev'
};

var basicAuth = new HttpBasicAuth("promis", process.env.PROMIS_ADMIN_PASSWORD);
basicAuth.protect(['/admin']);


Meteor.startup(() => {
  // code to run on server at startup

  var globalSettings = GlobalSettings.findOne();
  console.log(globalSettings);
  if(!globalSettings) {
    GlobalSettings.insert({
		how_to_play_content: "<h1>What is PROMIS?</h1><p>Here's how it works.</p><h2>Sub header</h2><p>More info...</p>",
		about_content: "<p>PROMIS is a project by Nina Westerdahl and Sebastian Quack. Programming Support by Holger Heissmeyer. Realized for Nuuk Art Museum. Funded by Nanoq.</p>",
		make_promis_content: "<p>Click the button below to make a Promis or Branch.</p>"
    });
  }

});

Meteor.methods({
  "updateStaticContent"(content) {
    console.log("updating static content with" + JSON.stringify(content));
    let gs = GlobalSettings.findOne();
    gs.how_to_play_content = content.how_to_play_content;
    gs.about_content = content.about_content;
    gs.make_promis_content = content.make_promis_content;
    GlobalSettings.update({_id: gs._id}, gs);
  },
  "updateVideo"(video) {
    RemoteVideos.update({_id: video._id}, video);
  },
  "deleteVideo"(video) {
    RemoteVideos.collection.remove({_id: video._id});
  },
  "hideVideo"(video, hide) {
    video.hidden = hide;
    RemoteVideos.update({_id: video._id}, video);
  },
  "flagVideo"(video, flag) {
    video.flagged = flag;
    RemoteVideos.update({_id: video._id}, video);
  },
  "updateUser"(deviceUuid, obj) {
    let user:any = PromisUsers.findOne({deviceUuid: deviceUuid});
    if(!user) {
      PromisUsers.insert({
        deviceUuid: deviceUuid,
        username: obj.username,
        email: obj.email
      });
      return;
    } 
    user.username = obj.username;
    user.email = obj.email;
    PromisUsers.update({_id: user._id}, user)
  }
});

  



