const SiteContent = require("../models/SiteContent");

// In-memory fallback if MongoDB connection is pending whitelist
let memoryContent = null;

const getContent = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne({ slug: "svv-clinic-main" }).catch(() => null);

    if (!content) {
      // Try to create initial document in MongoDB
      try {
        content = await SiteContent.create({ slug: "svv-clinic-main" });
      } catch (err) {
        // Fallback to in-memory instance if DB not ready
        if (!memoryContent) {
          const doc = new SiteContent({ slug: "svv-clinic-main" });
          memoryContent = doc.toObject();
        }
        return res.status(200).json({
          success: true,
          source: "local-fallback",
          data: memoryContent,
        });
      }
    }

    res.status(200).json({
      success: true,
      source: "database",
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

const updateContent = async (req, res, next) => {
  try {
    const updates = req.body;
    delete updates._id;
    delete updates.slug;

    let content = await SiteContent.findOneAndUpdate(
      { slug: "svv-clinic-main" },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    ).catch(() => null);

    if (!content) {
      // If DB is offline, update in memory
      if (!memoryContent) {
        const doc = new SiteContent({ slug: "svv-clinic-main" });
        memoryContent = doc.toObject();
      }
      memoryContent = { ...memoryContent, ...updates };
      content = memoryContent;
    }

    res.status(200).json({
      success: true,
      message: "Website content updated successfully!",
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

const uploadImageFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please choose an image file to upload",
    });
  }

  // Construct absolute URL
  const protocol = req.protocol;
  const host = req.get("host");
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    url: fileUrl,
    filename: req.file.filename,
    relativePath: `/uploads/${req.file.filename}`,
  });
};

const resetContent = async (req, res, next) => {
  try {
    await SiteContent.deleteOne({ slug: "svv-clinic-main" }).catch(() => null);
    const fresh = await SiteContent.create({ slug: "svv-clinic-main" }).catch(() => {
      const doc = new SiteContent({ slug: "svv-clinic-main" });
      memoryContent = doc.toObject();
      return memoryContent;
    });

    res.status(200).json({
      success: true,
      message: "Website content reset to factory defaults",
      data: fresh,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContent,
  updateContent,
  uploadImageFile,
  resetContent,
};
