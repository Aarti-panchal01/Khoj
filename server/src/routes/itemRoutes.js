const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Item = require("../models/Item");
const { itemSchema } = require("../utils/validators");
const authMiddleware = require("../middleware/authMiddleware");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();
router.use(authMiddleware);

// Multer setup – store temporarily before upload to Cloudinary
const upload = multer({ dest: "uploads/" });

// 📦 Get items for the user's college (with filters)
router.get("/", async (req, res) => {
  try {
    const { type, category, status, campus, search } = req.query;
    const filters = { college: req.user.college };

    if (type) filters.type = type;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (campus) filters.campus = campus;
    if (search) {
      const regex = new RegExp(search, "i");
      filters.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
        { category: regex },
      ];
    }

    const items = await Item.find(filters).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (error) {
    console.error("Get items error", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// 📦 Get items created by logged-in user
router.get("/mine", async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Get user items error", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// 📦 Create new item (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const payload = itemSchema.parse(req.body);

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "khoj-items",
      });
      imageUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path); // delete temp file
    }

    const item = await Item.create({
      ...payload,
      images: imageUrl ? [imageUrl] : [],
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone,
      college: req.user.college,
      campus: payload.campus || req.user.campus,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create item error", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: error.errors[0]?.message });
    }
    res.status(500).json({ message: "Failed to create item" });
  }
});

// 📦 Get single item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error("Get item error", error);
    res.status(500).json({ message: "Failed to fetch item" });
  }
});

// 📦 Update an item
router.put("/:id", async (req, res) => {
  try {
    const payload = itemSchema.partial().parse(req.body);
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ message: "Item not found" });

    Object.assign(item, payload);
    await item.save();
    res.json(item);
  } catch (error) {
    console.error("Update item error", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: error.errors[0]?.message });
    }
    res.status(500).json({ message: "Failed to update item" });
  }
});

// 📦 Delete an item
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error("Delete item error", error);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

module.exports = router;
