const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { createArticle, getArticles, getArticle, updateArticle, deleteArticle } = require('../controller/article.controller');

// Create
router.post('/', auth, createArticle);

// Read (list + search)
router.get('/', auth, getArticles);

// Read single
router.get('/:id', auth, getArticle);

// Update
router.put('/:id', auth, updateArticle);

// Delete
router.delete('/:id', auth, deleteArticle);

module.exports = router;
