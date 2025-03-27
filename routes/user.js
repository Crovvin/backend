import express from "express";
import User from "../models/User.js";
import Pokemon from "../models/Pokemon.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userRouter = express.Router();

// GET users
userRouter.get("/", async (req, res) => {
    try {
        const user = await User.find();
        res.json(user)
    } catch (e) {
        res.status(500).json({ message: "Users cannot be found" });
    }
})

// GET user by ID
userRouter.get("/:username", async (req, res) => {
  try {
      const user = await User.findOne({username: req.params.username});
      if (!user) return res.status(404).json({ message: "User cannot be found" });
      res.json(user);
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
});

//POST a new user
userRouter.post("/register", async (req, res) => {
    try{
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, favorites: [] });
        await user.save();
        res.json({ message: "User created" });
    } catch(e){
        res.status(400).json({ message: e.message });
    }
});

userRouter.post("/login", async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    } catch(e){
        res.status(400).json({ message: e.message });
    }
});

// PATCH a user
userRouter.patch("/:username", async (req, res) => {
  try {
      const updateUser = await User.findOne({username: req.params.username}, req.body, { new: true });
      if (!updateUser) return res.status(404).json({ message: "User cannot be found" });
      res.json(updateUser);
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
});

// DELETE a user
userRouter.delete("/:username", async (req, res) => {
  try {
      const deleteUser = await User.findOne({username: req.params.username});
      if (!deleteUser) return res.status(404).json({ message: "User cannot be found" });
      res.json({ message: "User has been deleted" });
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
});

//Route to favorite a pokemon
userRouter.post("/:username/favorites/:pokemonName", async (req, res) => {
    try {
        const { username, pokemonName } = req.params;

        const user = await User.findOne({username: username});
        const pokemon = await Pokemon.findOne({ name: pokemonName.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "User cannot be found" });
        }
        if (!pokemon) {
            return res.status(404).json({ message: "Pokemon cannot be found" });
        }

        if (!user.favorites.includes(pokemon._id)) {
            user.favorites.push(pokemon._id);
            await user.save();
        }

        res.status(200).json({ message: "Pokemon added to the user's favorites", user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//Route to get a user's favorite Pokémon
userRouter.get("/:username/favorites", async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username}).populate('favorites');
        if (!user) return res.status(404).json({ message: "User cannot be found" });
        res.json(user.favorites);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.delete("/:username/favorites/:pokemonName", async(req,res) => {
    try{
        const { username } = req.params;
        const { pokemonId } = req.body;  // Get the Pokémon ID from request body
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.favorites = user.favorites.filter((id) => id !== pokemonId);
        await user.save();
        res.json({ message: "Removed from user's favorites", favorites: user.favorites });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});