const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
	facebook: {
		id: String,
		name: String,
		email: String,
		placeid: String,
		going: Boolean
	}
})

const clubSchema = new Schema({
	placeid: String,
	peopleid: []
})

const User = mongoose.model('user', userSchema);

const Club = mongoose.model('club', clubSchema);

module.exports = {User: User,
				  Club: Club};