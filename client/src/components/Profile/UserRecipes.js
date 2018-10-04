import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { GET_USER_RECIPES, UPDATE_USER_RECIPE } from '../../queries';
import RecipeItem from '../Recipe/RecipeItem';
import Spinner from '../Spinner';

class UserRecipes extends Component {
	static propTypes = {
		username: PropTypes.string
	};

	state = {
		_id: '',
		name: '',
		imageUrl: '',
		description: '',
		category: '',
		toggleModal: false
	};
	handleChange = event => {
		const { value, name } = event.target;
		this.setState({ [name]: value });
	};

	openEditModal = recipe => {
		this.setState(prevState => ({
			toggleModal: !prevState.toggleModal,
			...recipe
		}));
	};

	closeEditModal = () => {
		this.setState(prevState => ({
			toggleModal: !prevState.toggleModal
		}));
	};

	updateRecipeHandler = (evt, updateUserRecipe) => {
		evt.preventDefault();
		updateUserRecipe().then(({ data }) => {
			console.log(data);
			this.closeEditModal();
		});
	};
	render() {
		const { username } = this.props;
		const { toggleModal } = this.state;
		return (
			<Query query={GET_USER_RECIPES} variables={{ username }}>
				{({ data, loading, error }) => {
					if (loading) return <Spinner />;
					if (error) return <div>Error</div>;
					return (
						<Fragment>
							{toggleModal ? (
								<EditRecipeModal
									recipe={this.state}
									handleSubmit={this.updateRecipeHandler}
									handleChange={this.handleChange}
									closeModal={this.closeEditModal}
								/>
							) : null}
							<h3>Your Recipes</h3>

							<ul className="cards">
								{!data.getUserRecipes.length ? <p>You don't have any recipe added yet!!!</p> : null}
								{data.getUserRecipes.map(recipe => (
									<RecipeItem
										editRecipe={this.openEditModal}
										username={username}
										deleteItem
										key={recipe._id}
										{...recipe}
									/>
								))}
							</ul>
						</Fragment>
					);
				}}
			</Query>
		);
	}
}

const EditRecipeModal = ({ handleChange, closeModal, recipe, handleSubmit }) => {
	const { name, category, imageUrl, description, _id } = recipe;

	return (
		<Mutation mutation={UPDATE_USER_RECIPE} variables={{ _id, name, imageUrl, category, description }}>
			{updateUserRecipe => (
				<div className="modal modal-open">
					<div className="modal-inner">
						<div className="modal-content">
							<form onSubmit={event => handleSubmit(event, updateUserRecipe)} className="modal-content-inner">
								<h4>Edit Recipe</h4>
								<label htmlFor="name">Recipe Name</label>

								<input type="text" name="name" value={name} onChange={handleChange} />
								<label htmlFor="imageUrl">Recipe Image</label>

								<input type="text" name="imageUrl" value={imageUrl} onChange={handleChange} />
								<label htmlFor="category">Recipe Category</label>

								<select name="category" value={category} onChange={handleChange}>
									<option value="Breakfast">Breakfast</option>
									<option value="Lunch">Lunch</option>
									<option value="Snack">Snack</option>
									<option value="Dinner">Dinner</option>
								</select>
								<label htmlFor="description">Recipe Description</label>
								<textarea name="description" value={description} onChange={handleChange} />
								<hr />
								<div className="modal-buttons">
									<button type="submit" className="button-primary">
										Update
									</button>
									<button onClick={closeModal}>Cancel</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</Mutation>
	);
};

export default UserRecipes;
