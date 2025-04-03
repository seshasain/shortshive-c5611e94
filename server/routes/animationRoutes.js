
const express = require('express');
const { 
  generateScenes, 
  generateAnimation, 
  getAnimationProgress 
} = require('../controllers/animationController');

const router = express.Router();

// Routes for animation generation
router.post('/generate-scenes', generateScenes);
router.post('/generate-animation', generateAnimation);
router.get('/animation-progress', getAnimationProgress);

module.exports = {
  animationRoutes: router
};
