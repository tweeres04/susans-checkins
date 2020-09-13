import Checkin from './Checkin';
import { Player } from './player';
import firebase from 'firebase/app';

type CheckinEntry = {
	checkin: Checkin;
	timestamp: firebase.firestore.Timestamp;
	player: Player | undefined;
	uid: string;
};

export default CheckinEntry;
