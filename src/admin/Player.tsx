import React from 'react';

import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	List,
	ListItem,
	ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as faker from 'faker';
import generatePlayer from './generatePlayer';
import generatePracticeDates from './generatePracticeDates';
import generateCheckinEntry from './generateCheckinEntry';
import hasSymptoms from './hasSymptoms';

const testDates = generatePracticeDates();
const testPlayer = generatePlayer();

const testCheckins = testDates.map((d) =>
	generateCheckinEntry({ player: testPlayer, timestamp: d })
);

const useStyles = makeStyles((theme) => ({
	playerImage: {
		height: '10rem',
	},
	symptomsPresent: {
		color: theme.palette.error.main,
	},
}));

type PlayerProps = {
	playerId: string;
};

export default function Player({ playerId }: PlayerProps) {
	const classes = useStyles();

	const { name, dob, notes } = testPlayer;

	return (
		<>
			<Card>
				<CardContent>
					<CardMedia
						image={faker.image.people()}
						className={classes.playerImage}
					/>
					<Typography variant="h3">{name}</Typography>
					<Typography variant="h6">{dob}</Typography>
					<Typography>{notes}</Typography>
				</CardContent>
			</Card>
			<List>
				{testCheckins.map(({ timestamp, checkin }) => {
					const checkinSymptoms = hasSymptoms(checkin);
					const symptomsPresent = checkinSymptoms.length > 0;
					return (
						<ListItem>
							<ListItemText
								primary={timestamp.toLocaleString()}
								secondary={
									<div>
										{symptomsPresent
											? `Symptoms: ${checkinSymptoms.join(', ')}`
											: 'No symptoms'}
									</div>
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
		</>
	);
}
