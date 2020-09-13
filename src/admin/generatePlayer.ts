import * as faker from 'faker';
import { Player } from './player';

export default function generatePlayer(): Player {
	return {
		name: faker.name.findName(undefined, undefined, 1),
		dob: faker.date.past(25).toLocaleDateString(),
		imageUrl: faker.image.avatar(),
		notes: faker.lorem.paragraph(),
	};
}
