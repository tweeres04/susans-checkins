import { useState, useEffect, useCallback } from 'react';
import firebase, { User } from 'firebase/app';

import { debounce } from 'lodash';

export default function usePlayerState() {
	const { uid } = firebase.auth().currentUser as User;

	const [playerState, setPlayerState] = useState({
		name: '',
		dob: '',
		notes: '',
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
			})
			.finally(() => {
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
			debouncedSyncPlayerStateToServer(newPlayerState);
			return newPlayerState;
		});
	}

	return {
		playerState,
		setProperty,
		isLoading,
	};
}
