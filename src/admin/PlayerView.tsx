import React, { useRef } from 'react';
import firebase from 'firebase/app';

import differenceInYears from 'date-fns/differenceInYears';

import {
	useDocumentDataOnce,
	useCollectionDataOnce,
} from 'react-firebase-hooks/firestore';

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
import usePlayerImage from '../usePlayerImage';
import useIsAdmin from '../useIsAdmin';

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
	const isAdmin = useIsAdmin();
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	const { imageUrl, setImage } = usePlayerImage(playerId);

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
						<input
							type="file"
							style={{ display: 'none' }}
							ref={fileInputRef}
							onChange={(e) => {
								const file = e.target.files![0];
								setImage(file);
							}}
						/>
						<CardMedia
							image={imageUrl}
							className={classes.playerImage}
							onClick={() => {
								if (isAdmin) {
									fileInputRef.current!.click();
								}
							}}
						/>
						<Typography variant="h3">{name}</Typography>
						<Typography variant="h6">Birthday: {dob}</Typography>
						<Typography>
							{differenceInYears(new Date(), new Date(dob))} years old
						</Typography>
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
							<ListItem key={timestampDate.toISOString()}>
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
