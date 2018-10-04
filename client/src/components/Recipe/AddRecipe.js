import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import CKEditor from 'react-ckeditor-component';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import Error from '../Error';
import withRouter from 'react-router-dom/withRouter';
import withAuth from '../withAuth';

const initialState = {
	name: '',
	imageUrl: '',
	description: '',
	category: 'Breakfast',
	instructions: '',
	username: ''
};
class AddRecipe extends Component {
	state = { ...initialState };

	static propTypes = {
		session: PropTypes.object,
		history: PropTypes.any
	};

	handleChange = event => {
		const { value, name } = event.target;
		this.setState({ [name]: value });
	};
	handleInstructionsChange = event => {
		const newContent = event.editor.getData();
		this.setState({ instructions: newContent });
	};

	componentDidMount = () => {
		this.setState({
			username: this.props.session.getCurrentUser.username
		});
	};
	clearState = () => {
		this.setState({ ...initialState });
	};

	handleSubmit = (event, addRecipe) => {
		event.preventDefault();
		addRecipe().then(async ({ data }) => {
			this.clearState();
			this.props.history.push('/');
		});
	};

	updateCache = (cache, { data: { addRecipe } }) => {
		const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });

		cache.writeQuery({
			query: GET_ALL_RECIPES,
			data: {
				getAllRecipes: [addRecipe, ...getAllRecipes]
			}
		});
	};

	validateForm = () => {
		const { name, category, imageUrl, description, instructions } = this.state;
		const isInvalid = !name || !imageUrl || !category || !description || !instructions;
		return isInvalid;
	};
	render() {
		const { name, category, imageUrl, description, instructions, username } = this.state;
		return (
			<Mutation
				mutation={ADD_RECIPE}
				variables={{ name, category, imageUrl, description, instructions, username }}
				refetchQueries={() => [{ query: GET_USER_RECIPES, variables: { username } }]}
				update={this.updateCache}
			>
				{(addRecipe, { data, loading, error }) => (
					<div className="App">
						<h2 className="App">Add Recipe</h2>
						<form className="form" onSubmit={evt => this.handleSubmit(evt, addRecipe)}>
							<input type="text" name="name" value={name} placeholder="Recipe Name" onChange={this.handleChange} />
							<input
								type="text"
								name="imageUrl"
								value={imageUrl}
								placeholder="Recipe Image"
								onChange={this.handleChange}
							/>

							<select name="category" value={category} onChange={this.handleChange}>
								<option value="Breakfast">Breakfast</option>
								<option value="Lunch">Lunch</option>
								<option value="Snack">Snack</option>
								<option value="Dinner">Dinner</option>
							</select>
							<textarea
								name="description"
								value={description}
								placeholder="Add Description"
								onChange={this.handleChange}
							/>
							<label htmlFor="instructions">Add Instructions</label>
							<CKEditor name="instructions" content={instructions} events={{ change: this.handleInstructionsChange }} />

							<button type="submit" className="button-primary" disabled={loading || this.validateForm()}>
								Submit
							</button>
							{error && <Error error={error} />}
						</form>
					</div>
				)}
			</Mutation>
		);
	}
}

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddRecipe));
