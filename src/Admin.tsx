import React from 'react';

import {
	List,
	ListItem,
	ListItemText,
	Avatar,
	ListItemAvatar,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import {
	eachDayOfInterval,
	isTuesday,
	isThursday,
	subMonths,
	set,
} from 'date-fns';
import random from 'random';
import * as faker from 'faker';

type Player = {
	name: string;
	dob: string;
	notes: string;
	imageUrl: string;
};

type YesOrNo = 'yes' | 'no';

type Checkin = Record<string, YesOrNo>;

type CheckinEntry = {
	checkin: Checkin;
	timestamp: Date;
	player: Player;
};

const positiveSymptomResult = random.bernoulli(0.01);
const playerSelector = random.uniformInt(0, 21);

function positiveSymptom(): YesOrNo {
	return positiveSymptomResult() ? 'yes' : 'no';
}

function generatePlayer(): Player {
	return {
		name: faker.name.findName(),
		dob: faker.date.past().toLocaleDateString(),
		imageUrl: faker.image.avatar(),
		notes: faker.lorem.paragraph(),
	};
}

function generatePlayers() {
	return Array.from({ length: 22 }).map(() => generatePlayer());
}

function generatePracticeDates() {
	const now = new Date();
	const practiceDates = eachDayOfInterval({
		start: subMonths(now, 3),
		end: now,
	})
		.filter((d) => isTuesday(d) || isThursday(d))
		.map((d) =>
			set(d, { hours: 20, minutes: 30, seconds: 0, milliseconds: 0 })
		);

	return practiceDates;
}

function generateTestData(): CheckinEntry[] {
	const testPlayers = generatePlayers();
	const testPracticeDates = generatePracticeDates();
	const data = testPracticeDates.flatMap((d) =>
		Array.from({ length: 20 }).map(() => ({
			checkin: {
				fever: positiveSymptom(),
				chills: positiveSymptom(),
				cough: positiveSymptom(),
				shortnessOfBreath: positiveSymptom(),
				soreThroat: positiveSymptom(),
				runnyNose: positiveSymptom(),
				lossOfSmellOrTaste: positiveSymptom(),
				headache: positiveSymptom(),
				fatigue: positiveSymptom(),
				diarrhea: positiveSymptom(),
				lossOfAppetite: positiveSymptom(),
				nauseaAndVomiting: positiveSymptom(),
				muscleAches: positiveSymptom(),
			},
			timestamp: d,
			player: testPlayers[playerSelector()],
		}))
	);

	return data;
}

const testData = generateTestData();

function hasSymptoms(checkin: Checkin) {
	return Object.keys(checkin).filter((k) => checkin[k] === 'yes');
}

const useStyles = makeStyles((theme) => ({
	symptomsPresent: {
		color: theme.palette.error.main,
	},
}));

export default function Admin() {
	const classes = useStyles();

	return (
		<List>
			{testData.map(({ player: { name, imageUrl }, checkin, timestamp }, i) => {
				const checkinSymptoms = hasSymptoms(checkin);
				const symptomsPresent = checkinSymptoms.length > 0;
				return (
					<ListItem alignItems="flex-start" key={`${name}${timestamp}${i}`}>
						<ListItemAvatar>
							<Avatar alt={name} src={imageUrl} />
						</ListItemAvatar>
						<ListItemText
							primary={name}
							secondary={
								<>
									<div>{timestamp.toLocaleString()}</div>
									<div>
										{symptomsPresent
											? `Symptoms: ${checkinSymptoms.join(', ')}`
											: 'No symptoms'}
									</div>
								</>
							}
							secondaryTypographyProps={{
								component: 'div',
								className: symptomsPresent
									? classes.symptomsPresent
									: undefined,
							}}
						/>
					</ListItem>
				);
			})}
		</List>
	);
}
