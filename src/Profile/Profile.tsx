import React, { useRef } from 'react';

import { TextField, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import usePlayerState from './usePlayerState';
import usePlayerImage from './usePlayerImage';

const useStyles = makeStyles((theme) => ({
	image: {
		width: '100%',
	},
	hidden: {
		display: 'none',
	},
}));

export default function Profile() {
	const classes = useStyles();
	const {
		playerState: { name, dob, notes },
		setProperty,
		isLoading: isLoadingData,
	} = usePlayerState();
	const { imageUrl, setImage, isLoading: isLoadingImage } = usePlayerImage();

	const fileInputRef = useRef<HTMLInputElement>(null);

	function startFileUpload() {
		fileInputRef.current!.click();
	}

	return isLoadingData ? null : (
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
			{isLoadingImage ||
				(imageUrl && (
					<Grid item xs={12}>
						<img
							src={imageUrl}
							onClick={startFileUpload}
							alt="Profile"
							className={classes.image}
						/>
					</Grid>
				))}
			<Grid item xs={12}>
				<input
					type="file"
					style={{ display: 'none' }}
					ref={fileInputRef}
					onChange={(e) => {
						const file = e.target.files![0];
						setImage(file);
					}}
				/>
				<Button onClick={startFileUpload} variant="contained">
					Upload profile image
				</Button>
			</Grid>
		</Grid>
	);
}
