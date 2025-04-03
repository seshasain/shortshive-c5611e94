
const express = require('express');
const { generateStory } = require('../controllers/storyController');

const router = express.Router();

// Route to generate story from prompt
router.post('/generate-story', generateStory);

module.exports = {
  storyRoutes: router
};
