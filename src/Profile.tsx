import React, { useState, useEffect, useCallback } from 'react';
import firebase from 'firebase/app';

import { debounce } from 'lodash';

import { TextField, Grid, Typography } from '@material-ui/core';

function usePlayerState() {
	const { uid } = firebase.auth().currentUser;
	const [playerState, setPlayerState] = useState({
		name: '',
		dob: '',
		notes: '',
		imageUrl: '',
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		firebase
			.firestore()
			.doc(`users/${uid}`)
			.get()
			.then((snapshot) => {
				setPlayerState((playerState) => ({
					...playerState,
					...snapshot.data(),
				}));
				setIsLoading(false);
			});
	}, [uid]);

	const syncPlayerStateToServer = useCallback(
		function syncPlayerStateToServer(playerState) {
			return firebase.firestore().doc(`users/${uid}`).update(playerState);
		},
		[uid]
	);

	const debouncedSyncPlayerStateToServer = useCallback(
		debounce(syncPlayerStateToServer, 1000),
		[]
	);

	function setProperty({
		property,
		value,
	}: {
		property: string;
		value: string;
	}) {
		setPlayerState((playerState) => {
			const newPlayerState = {
				...playerState,
				[property]: value,
			};
			debouncedSyncPlayerStateToServer.cancel();
			debouncedSyncPlayerStateToServer(newPlayerState);
			return newPlayerState;
		});
	}

	return { ...playerState, setProperty, isLoading };
}

export default function Profile() {
	const { name, dob, notes, setProperty, isLoading } = usePlayerState();

	return isLoading ? null : (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h3">Profile</Typography>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label="Name"
					variant="filled"
					value={name}
					onChange={(event) => {
						setProperty({ property: 'name', value: event.target.value });
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label="Birthdate"
					type="date"
					variant="filled"
					value={dob}
					onChange={(event) => {
						setProperty({ property: 'dob', value: event.target.value });
					}}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label="Notes"
					multiline
					variant="filled"
					value={notes}
					onChange={(event) => {
						setProperty({ property: 'notes', value: event.target.value });
					}}
				/>
			</Grid>
		</Grid>
	);
}
