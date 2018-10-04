import React from 'react';
import { Query } from 'react-apollo';
import { GET_CURRENT_USER } from '../queries';
import Redirect from 'react-router-dom/Redirect';

const withAuth = conditionFunc => Component => props => (
	<Query query={GET_CURRENT_USER}>
		{({ data, loading }) => {
			if (loading) return null;
			return conditionFunc(data) ? <Component {...props} /> : <Redirect to="/" />;
		}}
	</Query>
);

export default withAuth;
