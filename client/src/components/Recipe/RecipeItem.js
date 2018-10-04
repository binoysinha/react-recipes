import React from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';

import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { DELETE_USER_RECIPE, GET_USER_RECIPES, GET_ALL_RECIPES, GET_CURRENT_USER } from '../../queries';

const RecipeItem = posed.li({
	shown: { opacity: 1 },
	hidden: { opacity: 0 }
});

const handleDelete = deleteUserRecipe => {
	const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
	if (confirmDelete) {
		deleteUserRecipe().then(() => {});
	}
};

export default ({ _id, name, category, likes, deleteItem, description, username, imageUrl, editRecipe }) => (
	<RecipeItem style={{ backgroundImage: `url(${imageUrl})` }} className="card img-c">
		{category !== undefined ? <span className={category}>{category}</span> : null}

		<div className="card-text">
			<Link to={`/recipes/${_id}`}>
				<h4>
					{name}{' '}
					{likes !== undefined ? (
						<span role="img" aria-labelledby="likes" className="like-c">
							{likes} ❤️
						</span>
					) : null}
				</h4>
			</Link>
		</div>

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
					<div className="btn-group">
						<button
							className="btn button-primary"
							onClick={editRecipe.bind(null, { _id, name, category, description, imageUrl })}
						>
							Edit
						</button>
						<button className="btn delete-button" onClick={() => handleDelete(deleteUserRecipe)}>
							{attrs.loading ? 'deleting...' : 'Delete'}
						</button>
					</div>
				)}
			</Mutation>
		) : null}
	</RecipeItem>
);

// RecipeItem.propTypes = {
// 	_id: PropTypes.string,
// 	name: PropTypes.string,
// 	likes: PropTypes.number,
// 	deleteItem: PropTypes.bool,
// 	category: PropTypes.string,
// 	username: PropTypes.string
// };
