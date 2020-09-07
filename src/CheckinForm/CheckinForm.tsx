import React from 'react';
import { navigate } from '@reach/router';

import firebase from 'firebase/app';

import { Typography, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Check as CheckIcon } from '@material-ui/icons';

import { useForm } from 'react-hook-form';

import YesNoRadio from './YesNoRadio';

const useStyles = makeStyles((theme) => ({
	list: { listStyle: 'none', paddingLeft: 0 },
	isSubmittingProgress: { marginLeft: theme.spacing(1) },
}));

async function onSubmit(checkin) {
	const { uid } = firebase.auth().currentUser;
	const checkinsRef = firebase.firestore().collection(`users/${uid}/checkins`);
	await checkinsRef.add({
		checkin,
		timestamp: firebase.firestore.FieldValue.serverTimestamp(),
	});
	const hasSymptoms = Object.values(checkin).some((value) => value === 'yes');
	if (hasSymptoms) {
		navigate('/symptoms');
	} else {
		return navigate('/success');
	}
}

export default function CheckinForm() {
	const classes = useStyles();

	const {
		register,
		handleSubmit,
		errors,
		formState: { isSubmitting },
	} = useForm();

	return (
		<>
			<Typography component="p" paragraph>
				Are you experiencing any of the following symptoms?
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ul className={classes.list}>
					<li>
						<YesNoRadio
							label="Fever"
							name="fever"
							register={register}
							error={errors.fever}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Chills"
							name="chills"
							register={register}
							error={errors.chills}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Cough or worsening of chronic cough"
							name="cough"
							register={register}
							error={errors.cough}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Shortness of breath"
							name="shortnessOfBreath"
							register={register}
							error={errors.shortnessOfBreath}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Sore throat"
							name="soreThroat"
							register={register}
							error={errors.soreThroat}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Runny nose"
							name="runnyNose"
							register={register}
							error={errors.runnyNose}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Loss of sense of smell or taste"
							name="lossOfSmellOrTaste"
							register={register}
							error={errors.lossOfSmellOrTaste}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Headache"
							name="headache"
							register={register}
							error={errors.headache}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Fatigue"
							name="fatigue"
							register={register}
							error={errors.fatigue}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Diarrhea"
							name="diarrhea"
							register={register}
							error={errors.diarrhea}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Loss of appetite"
							name="lossOfAppetite"
							register={register}
							error={errors.lossOfAppetite}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Nausea and vomiting"
							name="nauseaAndVomiting"
							register={register}
							error={errors.nauseaAndVomiting}
						/>
					</li>
					<li>
						<YesNoRadio
							label="Muscle aches"
							name="muscleAches"
							register={register}
							error={errors.muscleAches}
						/>
					</li>
				</ul>
				<Button
					type="submit"
					disabled={isSubmitting}
					variant="contained"
					color="primary"
					size="large"
					endIcon={
						isSubmitting ? (
							<CircularProgress
								size="1em"
								className={classes.isSubmittingProgress}
							/>
						) : (
							<CheckIcon />
						)
					}
				>
					Submit
				</Button>
			</form>
		</>
	);
}
