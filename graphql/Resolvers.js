const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
	const { username, email } = user;
	return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.RESOLVERS = {
	Query: {
		getAllRecipes: async (root, args, { Recipe }) =>
			await Recipe.find().sort({
				createdDate: 'desc'
			}),
		getUserRecipes: async (root, { username }, { Recipe }) =>
			await Recipe.find({ username }).sort({
				createdDate: 'desc'
			}),
		getCurrentUser: async (root, args, { currentUser, User }) => {
			if (!currentUser) return null;
			return await User.findOne({ username: currentUser.username }).populate({
				path: 'favorites',
				model: 'Recipe'
			});
		},
		getRecipe: async (root, { _id }, { Recipe }) => await Recipe.findOne({ _id }),
		searchRecipes: async (root, { searchTerm }, { Recipe }) => {
			if (searchTerm) {
				return await Recipe.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } }).sort({
					score: { $meta: 'textScore' }
				});
			} else {
				return await Recipe.find().sort({ likes: 'desc', createdDate: 'desc' });
			}
		}
	},
	Mutation: {
		addRecipe: async (root, { name, imageUrl, category, description, instructions, username }, { Recipe }) =>
			await new Recipe({
				name,
				imageUrl,
				description,
				category,
				instructions,
				username
			}).save(),
		likeRecipe: async (root, { _id, username }, { Recipe, User }) => {
			const recipe = await Recipe.findOneAndUpdate({ _id }, { $inc: { likes: 1 } });
			const user = await User.findOneAndUpdate(
				{ username },
				{
					$addToSet: {
						favorites: _id
					}
				}
			);
			return recipe;
		},

		unlikeRecipe: async (root, { _id, username }, { Recipe, User }) => {
			const recipe = await Recipe.findOneAndUpdate({ _id }, { $inc: { likes: -1 } });
			const user = await User.findOneAndUpdate(
				{ username },
				{
					$pull: {
						favorites: _id
					}
				}
			);
			return recipe;
		},
		deleteUserRecipe: async (root, { _id }, { Recipe }) => await Recipe.findOneAndRemove({ _id }),
		updateUserRecipe: async (root, { _id, name, imageUrl, category, description }, { Recipe }) =>
			await Recipe.findOneAndUpdate({ _id }, { $set: { name, imageUrl, description, category } }, { new: true }),
		signinUser: async (root, { username, password }, { User }) => {
			const user = await User.findOne({ username });
			if (!user) {
				throw new Error('User not found');
			}

			const isValidPassword = await bcrypt.compare(password, user.password);

			if (!isValidPassword) {
				throw new Error('Password wrong');
			}

			return { token: createToken(user, process.env.SECRET, '5hr') };
		},
		signupUser: async (root, { username, email, password }, { User }) => {
			const user = await User.findOne({ username });
			if (user) {
				throw new Error('User already exists');
			}
			const newUser = await new User({
				username,
				email,
				password
			}).save();
			return { token: createToken(newUser, process.env.SECRET, '5hr') };
		}
	}
};
