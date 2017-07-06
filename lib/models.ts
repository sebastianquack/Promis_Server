import { Geoposition } from 'ionic-native';

export interface LocalVideo {
	_id?: string;
	createdAt?: Date;
	lastModified?: Date;
	hidden?: boolean;

	title?:string;
	lowerCaseTitle?:string;
	
	thumbPath?: string;
	thumbPathRel?: string;

	videoUuid?: string;
	deviceUuid?: string;
 	system?: string;

	localOrigin?: boolean;
	originalPath?: string;
	originalPathRel?: string;
		
	size?: number;
	duration?: number;
	transcodeProgress?: number;
 	transcoded?: boolean;
 	transcodedPath?: string;
 	transcodedPathRel?: string;
 	transcodedFilename?: string;
 	
	uploadProgress?: number;
 	uploaded?: boolean;
 	remoteId?: string;

 	downloading?: boolean;
	downloadProgress?:number;
 	downloaded?: boolean;

	locationRestricted?: boolean;

	branch?: boolean;
 	branches?: [string];
 	start_geoposition?: Geoposition;
 	end_geoposition?: Geoposition;

 	deleted?: boolean;
}

export interface PTransfer {
	type?:string; // upload or download
	status?:string; // active, queued, done
	localVideoId?:string;
	remoteVideoId?:string;
	progress?:number;
	info?:string;
	createdAt?: Date;
}

export interface RemoteVideo {
	_id?: string;
	createdAt?: Date;
	lastModified?: Date;
	hidden?: boolean;
	flagged?: boolean;
		
	title?:string;
	duration?: number;

	url?: string;
	relativeUrl?: string;
 	filename?: string;	
 	type?: string;
 	size?: number;

 	thumbUrl?: string;
 	thumbFilename?: string;

	videoUuid?: string;
 	deviceUuid?: string;
 	system?: string;

 	restrictLocation?: boolean;

 	branch?: boolean;
 	branches?: [string];
 	start_geoposition?: Geoposition;
 	end_geoposition?: Geoposition; 	
}

export interface LocalSetting {
	_id?: string;
	name: string;
	email: string;
	offline: boolean;
	currentLat: number;
	currentLng: number;
	currentZoom: number;
	globalSettings?: GlobalSetting;
}

export interface GlobalSetting {
	_id?: string;
	how_to_play_content?: string;
	about_content?: string;
	make_promis_content?: string;
}

export interface PromisUser {
	_id?: string;
	username?: string;
	email?: string;
	deviceUuid?: string;
}