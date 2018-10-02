import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const handleSignout = (client, history) => {
	localStorage.removeItem('token');
	client.resetStore();
	history.push('/');
};
const Signout = ({ history }) => (
	<ApolloConsumer>{client => <button onClick={() => handleSignout(client, history)}>Signout</button>}</ApolloConsumer>
);

Signout.propTypes = {
	history: PropTypes.any
};
export default withRouter(Signout);
