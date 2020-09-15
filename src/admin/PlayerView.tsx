import React from 'react';
import firebase from 'firebase/app';

import {
	useDocumentDataOnce,
	useCollectionDataOnce,
} from 'react-firebase-hooks/firestore';
import { useDownloadURL } from 'react-firebase-hooks/storage';

import { Player } from './player';
import CheckinEntry from './CheckinEntry';

import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	List,
	ListItemIcon,
	ListItem,
	ListItemText,
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { makeStyles } from '@material-ui/core/styles';
import * as faker from 'faker';
import generatePlayer from './generatePlayer';
import generatePracticeDates from './generatePracticeDates';
import generateCheckinEntry from './generateCheckinEntry';
import hasSymptoms from './hasSymptoms';

const testDates = generatePracticeDates();
const testPlayer = generatePlayer();

const testCheckins = testDates.map((d) =>
	generateCheckinEntry({
		player: testPlayer,
		timestamp: d as firebase.firestore.Timestamp,
	})
);

const useStyles = makeStyles((theme) => ({
	playerImage: {
		height: '10rem',
	},
	symptomsPresent: {
		color: theme.palette.error.main,
	},
}));

type PlayerViewProps = {
	playerId: string;
};

export default function PlayerView({ playerId }: PlayerViewProps) {
	const classes = useStyles();

	const [
		{ name, dob, notes } = {},
		playerIsLoading,
		playerError,
	] = useDocumentDataOnce<Player>(
		firebase.firestore().doc(`users/${playerId}`)
	);

	const [
		checkins = [],
		checkinsIsLoading,
		checkinsError,
	] = useCollectionDataOnce<CheckinEntry>(
		firebase.firestore().collection(`users/${playerId}/checkins`),
		{ idField: 'uid' }
	);

	const [imageUrl] = useDownloadURL(
		firebase.storage().ref(`profile/${playerId}`)
	);

	const errors = [playerError, checkinsError].filter(Boolean) as Error[];

	return (
		<>
			{errors.map((e) => (
				<>
					<p>{e.message}</p>
					<p>{e.stack}</p>
				</>
			))}
			{playerIsLoading || (
				<Card>
					<CardContent>
						<CardMedia image={imageUrl} className={classes.playerImage} />
						<Typography variant="h3">{name}</Typography>
						<Typography variant="h6">{dob}</Typography>
						<Typography>{notes}</Typography>
					</CardContent>
				</Card>
			)}
			{checkinsIsLoading || (
				<List>
					{checkins.map(({ timestamp, checkin }) => {
						const checkinSymptoms = hasSymptoms(checkin);
						const symptomsPresent = checkinSymptoms.length > 0;
						const timestampDate = timestamp.toDate();
						return (
							<ListItem key={timestampDate}>
								<ListItemIcon>
									<AssignmentIcon />
								</ListItemIcon>
								<ListItemText
									primary={timestampDate.toLocaleString()}
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
			)}
		</>
	);
}
