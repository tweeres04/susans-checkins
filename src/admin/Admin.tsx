import React from 'react';

import {
	List,
	ListItem,
	ListItemText,
	Avatar,
	ListItemAvatar,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import random from 'random';

import generatePlayer from './generatePlayer';
import generatePracticeDates from './generatePracticeDates';
import CheckinEntry from './CheckinEntry';
import hasSymptoms from './hasSymptoms';

import generateCheckinEntry from './generateCheckinEntry';

const playerSelector = random.uniformInt(0, 21);

function generatePlayers() {
	return Array.from({ length: 22 }).map(() => generatePlayer());
}

function generateTestData(): CheckinEntry[] {
	const testPlayers = generatePlayers();
	const testPracticeDates = generatePracticeDates();
	const data = testPracticeDates.flatMap((d) =>
		Array.from({ length: 20 }).map(() =>
			generateCheckinEntry({
				timestamp: d,
				player: testPlayers[playerSelector()],
			})
		)
	);

	return data;
}

const testData = generateTestData();

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
