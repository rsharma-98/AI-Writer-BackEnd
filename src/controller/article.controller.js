const Article = require('../models/Article');


// Helper function for sending a 400 Bad Request response with a list of missing fields
const validateFields = (body, requiredFields, res) => {
  const missingFields = requiredFields.filter(field => !body[field]);
  if (missingFields.length > 0) {
    res.status(400).json({ error: 'Missing required fields', missing: missingFields });
    return false;
  }
  return true;
};


const createArticle = async (req, res) => {
  try {
    // Validation: Check for required fields
    if (!validateFields(req.body, ['title', 'content'], res)) return;

    const { title, content, tags } = req.body;
    const article = await Article.create({ title, content, tags, owner: req.user._id });
    res.status(201).json(article); // Use 201 for resource creation
  } catch (error) {
    console.error(error); // Log the error for debugging
    // Handle database or other server errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getArticles = async (req, res) => {
  try {
    const q = req.query.search || '';
    // Mongoose will throw an error if the $text index isn't available, caught below
    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const articles = await Article.find(filter).sort({ updatedAt: -1 }).limit(200);
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getArticle = async (req, res) => {
  try {
    const art = await Article.findById(req.params.id);
    if (!art) return res.status(404).json({ error: 'Article not found' });
    res.json(art);
  } catch (error) {
    // Catch Mongoose casting error for invalid ID format, or other DB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid Article ID format' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateArticle = async (req, res) => {
  try {
    // Optional: You might want to ensure at least one field is provided for update
    if (!req.body.title && !req.body.content && !req.body.tags) {
        return res.status(400).json({ error: 'At least one field (title, content, or tags) is required for update' });
    }
    
    const { title, content, tags } = req.body;
    const art = await Article.findById(req.params.id);

    if (!art) return res.status(404).json({ error: 'Article not found' });

    // simple ownership check: allow if owner or admin
    if (!art.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You do not own this article or lack admin rights' });
    }
    
    // Update fields only if they are present in the request body
    if (title) art.title = title;
    if (content) art.content = content;
    if (tags) art.tags = tags;
    
    // Note: The original file used logical OR assignment (art.title = title || art.title),
    // which would incorrectly set the field to the old value if the new value was an empty string ('').
    // The explicit 'if (field)' check above handles this more cleanly by only updating if the field is present/truthy.
    
    await art.save();
    res.json(art);

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid Article ID format' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const deleteArticle = async (req, res) => {
  try {
    const art = await Article.findById(req.params.id);

    if (!art) return res.status(404).json({ error: 'Article not found' });

    // simple ownership check: allow if owner or admin
    if (!art.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You do not own this article or lack admin rights' });
    }

    await Article.deleteOne({ _id: art._id });
    // Use 204 No Content for successful deletion if no response body is needed, or 200/202 with a success message
    res.status(200).json({ ok: true, message: 'Article deleted successfully' }); 

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid Article ID format' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
}