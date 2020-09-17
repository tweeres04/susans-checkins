import { useState, useEffect, useRef } from 'react';
import firebase, { User } from 'firebase/app';

export default function usePlayerImage() {
	const { uid } = firebase.auth().currentUser as User;
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const objectUrl = useRef<string>();

	useEffect(() => {
		firebase
			.storage()
			.ref(`profile/${uid}`)
			.getDownloadURL()
			.then((url) => {
				setImageUrl(url);
			})
			.finally(() => {
				setIsLoading(false);
			});
	});

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
		imageUrl,
		setImage,
		isLoading,
	};
}
