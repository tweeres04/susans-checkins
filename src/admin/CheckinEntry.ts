import Checkin from './Checkin';
import { Player } from './player';

type CheckinEntry = {
	checkin: Checkin;
	timestamp: Date;
	player: Player;
};

export default CheckinEntry;
