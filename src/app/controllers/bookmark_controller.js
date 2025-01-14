const Bookmark = require("../models/bookmark_model");

const addBookmark = async (req, res) => {
  const { idUser } = req.params; 
  const { id, posterPath, title, popularity, ratingPoint, isRating, isBookmark } = req.body; 

  try {
    const newBookmark = new Bookmark({
      userId: idUser, 
      id,
      posterPath,
      title,
      popularity,
      ratingPoint,
      isRating,
      isBookmark,
    });

    await newBookmark.save();
    res.status(201).json({ message: "Bookmark added successfully.", bookmark: newBookmark });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

const getBookmarksByUser = async (req, res) => {
    const { idUser } = req.params;
    const { page = 1, limit = 10 } = req.query; 
  
    const skip = (page - 1) * limit; 
  
    try {
      const bookmarks = await Bookmark.find({ userId: idUser })
        .skip(skip)   
        .limit(parseInt(limit)) 
        .exec();
  
      const totalBookmarks = await Bookmark.countDocuments({ userId: idUser }); 
      
      const totalPages = Math.ceil(totalBookmarks / limit); 
      res.status(200).json({
        message: "Bookmarks retrieved successfully.",
        bookmarks,
        pagination: {
          totalBookmarks,
          totalPages,
          currentPage: page,
          pageSize: limit
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error.", error });
    }
  };
  
const deleteBookmark = async (req, res) => {
  const { idMovie } = req.params; 

  try {
    const bookmark = await Bookmark.findOneAndDelete({ id: idMovie });
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found for deletion." });
    }

    res.status(200).json({ message: "Bookmark deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

module.exports = { addBookmark, getBookmarksByUser, deleteBookmark };
