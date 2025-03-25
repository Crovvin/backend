import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        favorites: [
            { type: mongoose.Schema.Types.ObjectId,
              ref: 'Pokemon' 
            }
        ]
    }
);

export default mongoose.model("User", userSchema)