import React from 'react';

import {
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormHelperText,
} from '@material-ui/core';

const isDev = process.env.NODE_ENV !== 'production';

export default function YesNoRadio({ label, name, register, error }) {
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
