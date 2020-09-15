import { useState, useEffect } from 'react';
import firebase from 'firebase/app';

export default function useImages() {
	const [images, setImages] = useState<{ uid: string; url: string }[] | []>([]);

	useEffect(() => {
		async function getImages() {
			const res = await firebase.storage().ref('profile').listAll();
			const images = await Promise.all(
				res.items.map(async (ref) => ({
					uid: ref.name,
					url: await ref.getDownloadURL(),
				}))
			);
			setImages(images);
		}
		getImages();
	}, []);

	return images;
}
