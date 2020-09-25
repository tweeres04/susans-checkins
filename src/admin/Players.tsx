import React, { useContext } from 'react';
import { Link } from '@reach/router';

import firebase from 'firebase/app';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

import {
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
} from '@material-ui/core';

import TeamContext from '../TeamContext';

import { Player } from './player';
import useImages from './useImages';

const LinkWithRef = React.forwardRef((props, ref) => (
	<Link ref={ref} {...props} />
));

export default function Players() {
	const team = useContext(TeamContext);
	const [players = [], playersLoading] = useCollectionDataOnce<Player>(
		firebase.firestore().collection(`teams/${team}/users`).orderBy('name'),
		{
			idField: 'uid',
		}
	);

	const images = useImages();

	const playersWithImage = players.map((p) => ({
		...p,
		imageUrl: images.find((i) => i.uid === p.uid)?.url,
	}));

	return playersLoading ? null : (
		<List>
			{playersWithImage.map(({ name, imageUrl, uid }) => (
				<ListItem
					component={LinkWithRef}
					to={`/admin/players/${uid}`}
					button
					key={uid}
				>
					<ListItemAvatar>
						<Avatar src={imageUrl} alt={name} />
					</ListItemAvatar>
					<ListItemText primary={name} />
				</ListItem>
			))}
		</List>
	);
}
