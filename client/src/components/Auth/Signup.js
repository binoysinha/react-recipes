import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { SIGNUP_USER } from '../../queries';
import Error from '../Error';

const initialState = {
	username: '',
	email: '',
	password: '',
	passwordConfirmation: ''
};
class Signup extends Component {
	static propTypes = {
		refetch: PropTypes.func,
		history: PropTypes.any
	};
	state = { ...initialState };

	handleChange = event => {
		const { value, name } = event.target;
		this.setState({ [name]: value });
	};

	clearState = () => {
		this.setState({ ...initialState });
	};

	handleSubmit = (event, signupUser) => {
		event.preventDefault();
		signupUser().then(async ({ data }) => {
			localStorage.setItem('token', data.signupUser.token);
			await this.props.refetch();

			this.clearState();
			this.props.history.push('/');
		});
	};

	validateForm = () => {
		const { username, email, password, passwordConfirmation } = this.state;
		const isInvalid = !username || !email || !password || password !== passwordConfirmation;
		return isInvalid;
	};

	render() {
		const { username, email, password, passwordConfirmation } = this.state;
		return (
			<div className="App">
				<h2>Signup</h2>
				<Mutation mutation={SIGNUP_USER} variables={{ username, email, password }}>
					{(signupUser, { data, loading, error }) => (
						<form className="form" onSubmit={event => this.handleSubmit(event, signupUser)}>
							<input type="text" name="username" placeholder="Username" value={username} onChange={this.handleChange} />
							<input type="email" name="email" placeholder="Email Address" value={email} onChange={this.handleChange} />
							<input
								type="password"
								name="password"
								placeholder="Password"
								value={password}
								onChange={this.handleChange}
							/>
							<input
								type="password"
								name="passwordConfirmation"
								value={passwordConfirmation}
								placeholder="Confirm Password"
								onChange={this.handleChange}
							/>
							<button type="submit" disabled={loading || this.validateForm()} className="button-primary">
								Submit
							</button>
							{error && <Error error={error} />}
						</form>
					)}
				</Mutation>
			</div>
		);
	}
}

export default withRouter(Signup);
