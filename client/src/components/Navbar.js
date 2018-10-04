import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Signout from './Auth/Signout';

const Navbar = ({ session }) => (
	<nav>{session && session.getCurrentUser ? <NavbarAuth session={session} /> : <NavbarUnAuth />}</nav>
);

const NavbarAuth = ({ session }) => (
	<Fragment>
		<ul>
			<li>
				<NavLink to="/" exact>
					Home
				</NavLink>
			</li>
			<li>
				<NavLink to="/search">Search</NavLink>
			</li>
			<li>
				<NavLink to="/recipe/add">Add Recipe</NavLink>
			</li>
			<li>
				<NavLink to="/profile">Profile</NavLink>
			</li>
			<li>
				<span className="user-name">Welcome, {session.getCurrentUser.username}</span>
				<Signout />
			</li>
		</ul>
	</Fragment>
);

const NavbarUnAuth = () => (
	<ul>
		<li>
			<NavLink to="/" exact>
				Home
			</NavLink>
		</li>
		<li>
			<NavLink to="/search">Search</NavLink>
		</li>
		<li>
			<NavLink to="/signin">Signin</NavLink>
		</li>
		<li>
			<NavLink to="/signup">Signup</NavLink>
		</li>
	</ul>
);

export default Navbar;
