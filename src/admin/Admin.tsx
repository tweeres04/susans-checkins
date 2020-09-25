import React, { useState, useContext } from 'react';

import { Link } from '@reach/router';

import { startOfDay, endOfDay, formatISO, parseISO } from 'date-fns';

import firebase from 'firebase/app';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

import {
	List,
	ListItem,
	ListItemText,
	Avatar,
	ListItemAvatar,
	TextField,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import random from 'random';

import TeamContext from '../TeamContext';

import generatePlayer from './generatePlayer';
import generatePracticeDates from './generatePracticeDates';
import CheckinEntry from './CheckinEntry';
import { Player } from './player';
import hasSymptoms from './hasSymptoms';
import useImages from './useImages';

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
	datepicker: {
		padding: theme.spacing(2, 0),
	},
}));

const LinkWithRef = React.forwardRef((props, ref) => (
	<Link ref={ref} {...props} />
));

export default function Admin() {
	const classes = useStyles();
	const team = useContext(TeamContext);
	const [queryDate, setQueryDate] = useState(
		formatISO(new Date(), { representation: 'date' })
	);

	const queryDateDate = parseISO(queryDate);

	let [checkins = [], checkinsLoading, checkinsError] = useCollectionDataOnce<
		CheckinEntry
	>(
		firebase
			.firestore()
			.collectionGroup('checkins')
			.where('timestamp', '>=', startOfDay(queryDateDate))
			.where('timestamp', '<=', endOfDay(queryDateDate))
			.orderBy('timestamp', 'desc')
	);

	const [players = [], playersLoading, playersError] = useCollectionDataOnce<
		Player
	>(firebase.firestore().collection(`teams/${team}/users`), {
		idField: 'uid',
	});

	const images = useImages();

	const error = checkinsError || playersError;
	const loading = playersLoading || checkinsLoading;

	checkins = checkins.map((c) => ({
		...c,
		player: {
			...(players.find((p) => c.uid === p.uid) as Player),
			imageUrl: images.find((i) => i.uid === c.uid)?.url,
		},
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
					<>
						<TextField
							className={classes.datepicker}
							fullWidth
							value={queryDate}
							onChange={(e) => {
								setQueryDate(e.target.value);
							}}
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
						/>

						{checkins.length < 1 && <p>No checkins. Try another date.</p>}
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
											to={`/admin/players/${uid}`}
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
					</>
				)
			)}
		</>
	);
}
