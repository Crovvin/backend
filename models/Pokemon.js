import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true },

  type: {
    type: Array,
    required: true
  },

  abilities: {
    type: Array,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  height: {
    type: String,
    required: true
  },

  weight: {
    type: String,
  }
});

export default mongoose.model("Pokemon", PokemonSchema);