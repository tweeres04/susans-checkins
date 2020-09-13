import Checkin from './Checkin';

function hasSymptoms(checkin: Checkin) {
	return Object.keys(checkin).filter((k) => checkin[k] === 'yes');
}

export default hasSymptoms;
