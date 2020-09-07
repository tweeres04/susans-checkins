import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';

import 'firebaseui/dist/firebaseui.css';

export default function Signin() {
	useEffect(() => {
		const ui = new firebaseui.auth.AuthUI(firebase.auth());
		ui.start('#firebaseui', {
			signInOptions: [
				{
					provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
				},
			],
		});
	}, []);

	return <div id="firebaseui"></div>;
}
