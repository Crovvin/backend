import express from "express";
import User from "../models/User.js";
import Pokemon from "../models/Pokemon.js"

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
userRouter.get("/:id", async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User cannot be found" });
      res.json(user);
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
});

// POST a new user
userRouter.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
});

// PATCH a user
userRouter.patch("/:id", async (req, res) => {
  try {
      const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updateUser) return res.status(404).json({ message: "User not found" });
      res.json(updateUser);
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
});

// DELETE a user
userRouter.delete("/:id", async (req, res) => {
  try {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      if (!deleteUser) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
});

//Route to favorite a pokemon
userRouter.post('/:userId/favorites/:pokemonName', async (req, res) => {
    try {
        const { userId, pokemonName } = req.params;

        const user = await User.findById(userId);
        const pokemon = await Pokemon.findOne({ name: pokemonName.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "User cannot found" });
        }
        if (!pokemon) {
            return res.status(404).json({ message: "Pokemon cannot found" });
        }

        if (!user.favorites.includes(pokemon._id)) {
            user.favorites.push(pokemon._id);
            await user.save();
        }

        res.status(200).json({ message: "Pokemon added to user", user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Route to get a user's favorite Pokémon
userRouter.get('/:userId/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('favorites');
        if (!user) return res.status(404).json({ message: "User cannot be found" });
        res.json(user.favorites);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});