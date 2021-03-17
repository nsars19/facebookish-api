const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 100,
    validate: {
      validator: (addr) => {
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
          addr
        );
      },
      message: (props) => `${props.value} is not a valid email.`,
    },
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
