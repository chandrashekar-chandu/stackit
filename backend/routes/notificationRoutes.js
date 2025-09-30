const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

// All notification routes require authentication
router.use(authenticateToken);

// Get user notifications
router.get('/', getUserNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.patch('/:id/read', markNotificationAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllNotificationsAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

module.exports = router; 