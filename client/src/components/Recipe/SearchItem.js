import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SearchItem = ({ _id, name, category, likes }) => (
	<li>
		<Link to={`/recipes/${_id}`}>
			<h4>{name}</h4>
		</Link>
		<p>
			<strong>{category}</strong>
		</p>
		<p>Likes: {likes}</p>
	</li>
);

SearchItem.propTypes = {
	_id: PropTypes.string,
	name: PropTypes.string,
	category: PropTypes.string,
	likes: PropTypes.number
};
export default SearchItem;
