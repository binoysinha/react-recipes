import React from 'react';
import withRouter from 'react-router-dom/withRouter';
import { Query } from 'react-apollo';
import { GET_RECIPE } from '../../queries';
import LikeRecipe from './LikeRecipe';
import Spinner from '../Spinner';

const RecipeDetail = ({ match }) => {
	const { _id } = match.params;
	return (
		<Query query={GET_RECIPE} variables={{ _id }}>
			{({ data, loading, error }) => {
				if (loading) return <Spinner />;
				if (error) return <div>Error</div>;
				return (
					<div className="App">
						<div className="recipe-image img-c" style={{ backgroundImage: `url(${data.getRecipe.imageUrl})` }} />
						<div className="recipe">
							<div className="recipe-header">
								<h2 className="recipe-name">
									<strong>{data.getRecipe.name}</strong>
								</h2>
								<h5>
									<strong>{data.getRecipe.category}</strong>
								</h5>
								<p>
									Created By: <strong>{data.getRecipe.username}</strong>
								</p>
								<p>
									{data.getRecipe.likes}
									<span role="img" aria-label="heart">
										❤️
									</span>
								</p>
							</div>
							<blockquote className="recipe-description">{data.getRecipe.description}</blockquote>
							<h3 className="recipe-instructions__title">Instructions</h3>
							<div className="recipe-instructions" dangerouslySetInnerHTML={{ __html: data.getRecipe.instructions }} />
							<LikeRecipe _id={_id} />
						</div>
					</div>
				);
			}}
		</Query>
	);
};

export default withRouter(RecipeDetail);
