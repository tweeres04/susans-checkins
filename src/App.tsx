import React from 'react';
import { Router } from '@reach/router';

import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
	CssBaseline,
	Container,
	AppBar,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CheckinForm from './CheckinForm/CheckinForm';
import Signin from './Signin';

const useStyles = makeStyles((theme) => ({
	appBarSpacer: theme.mixins.toolbar,
}));

function Success() {
	return <p>Thanks for checking in!</p>;
}

function Symptoms() {
	return <p>Please stay home and get better.</p>;
}

export default function App() {
	const classes = useStyles();
	const [user, loading, error] = useAuthState(firebase.auth());

	return (
		<>
			<CssBaseline />
			<Container>
				<AppBar>
					<Toolbar>
						<Typography component="h1" variant="h6">
							Susans Checkins
						</Typography>
					</Toolbar>
				</AppBar>
				<div className={classes.appBarSpacer}></div>
				{!loading && !error ? (
					user ? (
						<Router>
							<CheckinForm path="/" />
							<Success path="/success" />
							<Symptoms path="/symptoms" />
						</Router>
					) : (
						<Signin />
					)
				) : null}
				{error && (
					<Typography>There was an error signing in. Try again.</Typography>
				)}
			</Container>
		</>
	);
}
