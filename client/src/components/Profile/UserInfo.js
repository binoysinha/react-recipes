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
			<div className="user-info">
				<p>
					Username:
					{username}
				</p>
				<p>
					Email:
					{email}
				</p>
				<p>
					Date of Joining:
					{doj}
				</p>
			</div>
			<ul>
				<h3>My's Favorites</h3>
				{!favorites.length ? <p>You don't have any favorite recipe.</p> : null}
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
