import React, { Suspense } from 'react';
import { Router } from '@reach/router';

import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
	CssBaseline,
	Container,
	AppBar,
	Toolbar,
	Typography,
	CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const CheckinForm = React.lazy(() => import('./CheckinForm/CheckinForm'));
const Admin = React.lazy(() => import('./admin/Admin'));
const Signin = React.lazy(() => import('./Signin'));
const Player = React.lazy(() => import('./admin/PlayerView'));
const Profile = React.lazy(() => import('./Profile'));

const useStyles = makeStyles((theme) => ({
	appBarSpacer: theme.mixins.toolbar,
	progress: {
		margin: 'auto',
		display: 'block',
		marginTop: '10rem',
	},
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
		<Suspense
			fallback={<CircularProgress classes={{ root: classes.progress }} />}
		>
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
							<Player path="/admin/:playerId" />
							<Admin path="/admin" />
							<Profile path="/profile" />
						</Router>
					) : (
						<Signin />
					)
				) : null}
				{error && (
					<Typography>There was an error signing in. Try again.</Typography>
				)}
			</Container>
		</Suspense>
	);
}
