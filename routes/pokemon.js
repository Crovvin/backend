import express from "express";
import Pokemon from "../models/Pokemon.js"
import axios from "axios"

export const pokemonRouter = express.Router();

// Get Pokemon from API
pokemonRouter.get("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemonData = {
      name: response.data.name,
      type: response.data.types.map(t => t.type.name),
      abilities: response.data.abilities.map(a => a.ability.name),
      image: response.data.sprites.front_default,
      height: response.data.height,
      weight: response.data.weight,
    };

    res.json(pokemonData);
  } catch (e) {
    res.status(404).json({ message: "Pokemon cannot be found" });
  }
});

// GET pokemon
pokemonRouter.get("/", async (req, res) => {
  try {
    const savedPokemon = await Pokemon.find();
    res.json(savedPokemon);
  } catch (e) {
    res.status(500).json({ message: "Error getting Pokemon" });
  }
});

// DELETE pokemon
pokemonRouter.delete("/:name", async (req, res) => {
  try {
    await Pokemon.findOneAndDelete({ name: req.params.name });
    res.json({ message: "Pokémon deleted" });
  } catch (e) {
    res.status(500).json({ message: "Error deleting a Pokemon" });
  }
});