import { gql } from 'apollo-boost';

export const recipeFragments = {
	recipe: gql`
		fragment CompleteRecipe on Recipe {
			_id
			imageUrl
			name
			category
			description
			instructions
			createdDate
			likes
			username
		}
	`,
	like: gql`
		fragment LikeRecipe on Recipe {
			_id
			likes
		}
	`
};
