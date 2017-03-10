const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define the model
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true },
  password: String,
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  //the context of this function is the user model
  //get user model
  const user = this; //can access user.email, or user.password
  //generate a salt - takes some time
  //so pass callback function that genSalt should run after genSalt is created
  bcrypt.genSalt(10, function(err, salt) {
    if(err) {
      return next(err);
    }
    // hash(encrypt) our passord using the salt
    // this gives us another callback becuase it takes some time which is our hash
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err){
        return next(err);
      }
      //overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

// whenever we create a user object we have access to any methods defined here
// userSchema.methods.comparePassword = function(candidatePassword, callback) {
//   //this.password referes to our model - salted stored on
//   //
//   //callback is equal to the result of the function(err, isMatch) so either err or isMatch
//   brcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if(err){
//       return callback(err);
//     }
//     callback(null,isMatch)
//   });
// }


userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}


//Create the model class
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;
