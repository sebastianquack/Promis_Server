import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import './main.html';

FlowRouter.route('/admin', {
  name: 'Admin.show',
  action() {
    console.log("rendering admin");
    BlazeLayout.render('App_body', {main: 'admin'});
  }
});

FlowRouter.route('/:videoUuid?', {
  name: 'Map.show',
  action(params) {
    console.log("rendering map");
    BlazeLayout.render('App_body', {main: 'map'});
  }
});

