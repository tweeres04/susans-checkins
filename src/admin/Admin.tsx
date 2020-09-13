import React from 'react';

import { Link } from '@reach/router';

import firebase from 'firebase/app';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

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
import { Player } from './player';
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
				timestamp: d as firebase.firestore.Timestamp,
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

const LinkWithRef = React.forwardRef((props, ref) => (
	<Link ref={ref} {...props} />
));

export default function Admin() {
	const classes = useStyles();

	let [checkins = [], checkinsLoading, checkinsError] = useCollectionDataOnce<
		CheckinEntry
	>(
		firebase
			.firestore()
			.collectionGroup('checkins')
			.orderBy('timestamp', 'desc')
	);

	const [players = [], playersLoading, playersError] = useCollectionDataOnce<
		Player
	>(firebase.firestore().collection('users'), {
		idField: 'uid',
	});

	const error = checkinsError || playersError;
	const loading = playersLoading || checkinsLoading;

	checkins = checkins.map((c) => ({
		...c,
		player: players.find((p) => c.uid === p.uid),
	}));

	return (
		<>
			{error ? (
				<>
					<p>{error.message}</p>
					<p>{error.stack}</p>
				</>
			) : (
				loading || (
					<List>
						{checkins.map(
							({
								uid,
								player: { name = 'Unnamed player', imageUrl } = {},
								checkin,
								timestamp,
							}) => {
								const checkinSymptoms = hasSymptoms(checkin);
								const symptomsPresent = checkinSymptoms.length > 0;
								const timestampDate = timestamp.toDate();
								return (
									<ListItem
										component={LinkWithRef}
										alignItems="flex-start"
										key={`${uid}${timestampDate}`}
										to={`/admin/${uid}`}
										button
									>
										<ListItemAvatar>
											<Avatar alt={name} src={imageUrl} />
										</ListItemAvatar>
										<ListItemText
											primary={name}
											secondary={
												<>
													<div>{timestampDate.toLocaleString()}</div>
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
							}
						)}
					</List>
				)
			)}
		</>
	);
}
