import React from 'react';
import { Router } from '@reach/router';

import {
	CssBaseline,
	Container,
	AppBar,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CheckinForm from './CheckinForm/CheckinForm';

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
				<Router>
					<CheckinForm path="/" />
					<Success path="/success" />
					<Symptoms path="/symptoms" />
				</Router>
			</Container>
		</>
	);
}
