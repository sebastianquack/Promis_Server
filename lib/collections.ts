import { MongoObservable } from 'meteor-rxjs';
import { RemoteVideo, GlobalSetting, PromisUser } from './models';
import { Mongo } from 'meteor/mongo';

export const RemoteVideos = new MongoObservable.Collection<RemoteVideo>('remote-videos');
export const GlobalSettings = new MongoObservable.Collection<GlobalSetting>('global-settings');
export const PromisUsers = new Mongo.Collection('promis-users');
