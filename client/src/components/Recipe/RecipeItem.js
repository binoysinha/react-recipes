import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { DELETE_USER_RECIPE, GET_USER_RECIPES, GET_ALL_RECIPES, GET_CURRENT_USER } from '../../queries';

const handleDelete = deleteUserRecipe => {
	const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
	if (confirmDelete) {
		deleteUserRecipe().then(() => {});
	}
};

const RecipeItem = ({ _id, name, category, likes, deleteItem, username }) => (
	<li>
		<Link to={`/recipes/${_id}`}>
			<h4>{name}</h4>
		</Link>
		{category !== null ? (
			<p>
				<strong>{category}</strong>
			</p>
		) : null}
		{likes !== null ? (
			<p>
				<strong>Likes: {likes}</strong>
			</p>
		) : null}
		{deleteItem ? (
			<Mutation
				mutation={DELETE_USER_RECIPE}
				variables={{ _id }}
				refetchQueries={() => [{ query: GET_ALL_RECIPES }, { query: GET_CURRENT_USER }]}
				update={(cache, { data: { deleteUserRecipe } }) => {
					const { getUserRecipes } = cache.readQuery({
						query: GET_USER_RECIPES,
						variables: { username }
					});

					cache.writeQuery({
						query: GET_USER_RECIPES,
						variables: { username },
						data: {
							getUserRecipes: getUserRecipes.filter(recipe => recipe._id !== deleteUserRecipe._id)
						}
					});
				}}
			>
				{(deleteUserRecipe, attrs = {}) => (
					<p className="delete-button" onClick={() => handleDelete(deleteUserRecipe)}>
						{attrs.loading ? 'deleting...' : 'X'}
					</p>
				)}
			</Mutation>
		) : null}
	</li>
);

RecipeItem.propTypes = {
	_id: PropTypes.string,
	name: PropTypes.string,
	likes: PropTypes.number,
	deleteItem: PropTypes.bool,
	category: PropTypes.string,
	username: PropTypes.string
};
export default RecipeItem;
