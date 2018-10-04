import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';

const formatDate = date => {
	const newDate = new Date(date).toLocaleDateString('en-US');
	const newTime = new Date(date).toLocaleTimeString('en-US');

	return `${newDate} at ${newTime}`;
};
const UserInfo = ({ session }) => {
	let { username, email, joinDate, favorites } = session.getCurrentUser;
	const doj = formatDate(joinDate);
	return (
		<div>
			<h3>User Info</h3>
			<p>
				Username:
				{username}
			</p>
			<p>
				Email:
				{email}
			</p>
			<p>
				Join Date:
				{doj}
			</p>
			<ul>
				<h3>
					{username}
					's Favorites
				</h3>
				{favorites.map(recipe => (
					<li key={recipe._id}>
						<Link to={`/recipes/${recipe._id}`}>
							<p>{recipe.name}</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

UserInfo.propTypes = {
	session: PropTypes.object
};
export default UserInfo;
