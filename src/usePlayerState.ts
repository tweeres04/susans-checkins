import { useState, useEffect, useRef, useCallback } from 'react';
import firebase from 'firebase/app';

import { debounce } from 'lodash';

export default function usePlayerState() {
	const { uid } = firebase.auth().currentUser;
	const objectUrl = useRef<string>();
	const [playerState, setPlayerState] = useState({
		name: '',
		dob: '',
		notes: '',
	});
	const [{ isLoadingData, isLoadingImage }, setIsLoading] = useState({
		isLoadingData: true,
		isLoadingImage: true,
	});
	const [imageUrl, setImageUrl] = useState<string | null>(null);

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
				setIsLoading((isLoading) => ({
					...isLoading,
					isLoadingData: false,
				}));
			});

		firebase
			.storage()
			.ref(`profile/${uid}`)
			.getDownloadURL()
			.then((url) => {
				setImageUrl(url);
			})
			.finally(() => {
				setIsLoading((isLoading) => ({
					...isLoading,
					isLoadingImage: false,
				}));
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

	async function setImage(image: File) {
		const snapshot = await firebase.storage().ref(`/profile/${uid}`).put(image);
		console.log(snapshot);
		if (objectUrl.current) {
			URL.revokeObjectURL(objectUrl.current);
		}
		const newObjectUrl = window.URL.createObjectURL(image);
		setImageUrl(newObjectUrl);
		objectUrl.current = newObjectUrl;
	}

	return {
		playerState,
		setProperty,
		isLoadingData,
		isLoadingImage,
		imageUrl,
		setImage,
	};
}
