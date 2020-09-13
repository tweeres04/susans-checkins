import {
	eachDayOfInterval,
	isTuesday,
	isThursday,
	subMonths,
	set,
} from 'date-fns';

export default function generatePracticeDates() {
	const now = new Date();
	const practiceDates = eachDayOfInterval({
		start: subMonths(now, 3),
		end: now,
	})
		.filter((d) => isTuesday(d) || isThursday(d))
		.map((d) => set(d, { hours: 20, minutes: 30, seconds: 0, milliseconds: 0 }))
		.map((d) => ({
			toDate: () => d,
		}));

	return practiceDates;
}
