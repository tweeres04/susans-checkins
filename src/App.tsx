import React, { useState, Suspense } from 'react';
import { Router, Link } from '@reach/router';

import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
	CssBaseline,
	Container,
	AppBar,
	Toolbar,
	Typography,
	CircularProgress,
	IconButton,
	Drawer,
	List,
	ListSubheader,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';

import { makeStyles } from '@material-ui/core/styles';

const CheckinForm = React.lazy(() => import('./CheckinForm/CheckinForm'));
const Admin = React.lazy(() => import('./admin/Admin'));
const Signin = React.lazy(() => import('./Signin'));
const Player = React.lazy(() => import('./admin/PlayerView'));
const Profile = React.lazy(() => import('./Profile'));
const Players = React.lazy(() => import('./admin/Players'));

const useStyles = makeStyles((theme) => ({
	appBarSpacer: theme.mixins.toolbar,
	progress: {
		margin: 'auto',
		display: 'block',
		marginTop: theme.spacing(16),
	},
	drawerHeader: {
		padding: theme.spacing(2),
	},
	drawerList: {
		width: 200,
	},
}));

function Success() {
	return <p>Thanks for checking in!</p>;
}

function Symptoms() {
	return <p>Please stay home and get better.</p>;
}

const LinkWithRef = React.forwardRef((props, ref) => (
	<Link ref={ref} {...props} />
));

function useIsAdmin() {
	return true;
}

export default function App() {
	const classes = useStyles();
	const [user, loading, error] = useAuthState(firebase.auth());
	const [drawerOpen, setDrawerOpen] = useState(false);
	const isAdmin = useIsAdmin();

	return (
		<Suspense
			fallback={<CircularProgress classes={{ root: classes.progress }} />}
		>
			<CssBaseline />
			<Container>
				<AppBar>
					<Toolbar>
						<IconButton
							color="inherit"
							onClick={() => {
								setDrawerOpen(true);
							}}
							edge="start"
						>
							<MenuIcon />
						</IconButton>
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
							<Players path="/admin/players" />
							<Player path="/admin/players/:playerId" />
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
			<Drawer
				open={drawerOpen}
				onClose={() => {
					setDrawerOpen(false);
				}}
			>
				<Typography variant="h6" className={classes.drawerHeader}>
					Susans Checkins
				</Typography>
				<List
					className={classes.drawerList}
					onClick={() => {
						setDrawerOpen(false);
					}}
				>
					<ListItem component={LinkWithRef} to="/" button>
						<ListItemIcon>
							<AssignmentTurnedInIcon />
						</ListItemIcon>
						<ListItemText primary="Checkin" />
					</ListItem>
					<ListItem component={LinkWithRef} to="/profile" button>
						<ListItemIcon>
							<PersonIcon />
						</ListItemIcon>
						<ListItemText primary="Profile" />
					</ListItem>
					{isAdmin && (
						<>
							<ListSubheader>Admin</ListSubheader>
							<ListItem component={LinkWithRef} to="/admin" button>
								<ListItemIcon>
									<VerifiedUserIcon />
								</ListItemIcon>
								<ListItemText primary="Checkins" />
							</ListItem>
							<ListItem component={LinkWithRef} to="/admin/players" button>
								<ListItemIcon>
									<PeopleIcon />
								</ListItemIcon>
								<ListItemText primary="Players" />
							</ListItem>
						</>
					)}
				</List>
			</Drawer>
		</Suspense>
	);
}
