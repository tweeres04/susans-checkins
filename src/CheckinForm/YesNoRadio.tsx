import React from 'react';

import {
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormHelperText,
} from '@material-ui/core';

import { UseFormMethods } from 'react-hook-form';

const isDev = process.env.NODE_ENV !== 'production';

type YesNoRadioProps = {
	label: string;
	name: string;
	error: string;
} & Pick<UseFormMethods, 'register'>;

export default function YesNoRadio({
	label,
	name,
	register,
	error,
}: YesNoRadioProps) {
	return (
		<FormControl component="fieldset" error={Boolean(error)}>
			<FormLabel component="span">{label}</FormLabel>
			<RadioGroup
				row
				aria-label={label}
				{...(isDev ? { defaultValue: 'no' } : {})}
			>
				<FormControlLabel
					control={
						<Radio
							name={name}
							value="yes"
							inputRef={register({ required: true })}
						/>
					}
					label="Yes"
				/>
				<FormControlLabel
					control={
						<Radio
							name={name}
							value="no"
							inputRef={register({ required: true })}
						/>
					}
					label="No"
				/>
				{error && <FormHelperText>This field is required</FormHelperText>}
			</RadioGroup>
		</FormControl>
	);
}
