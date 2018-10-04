import React from 'react';
import { Query } from 'react-apollo';
import { GET_USER_RECIPES } from '../../queries';
import RecipeItem from '../Recipe/RecipeItem';

const UserRecipes = ({ username }) => (
	<Query query={GET_USER_RECIPES} variables={{ username }}>
		{({ data, loading, error }) => {
			if (loading) return <div>Loading</div>;
			if (error) return <div>Error</div>;
			return (
				<ul>
					<h3>Your Recipes</h3>
					{data.getUserRecipes.map(recipe => (
						<RecipeItem username={username} deleteItem key={recipe._id} {...recipe} />
					))}
				</ul>
			);
		}}
	</Query>
);

export default UserRecipes;
