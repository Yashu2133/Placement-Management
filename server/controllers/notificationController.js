const Notification = require("../models/Notification");

const notificationController={

createNotification : async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const notification = new Notification({ userId, message, type });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification", details: err.message });
  }
},

// Get all notifications for a user
getNotifications : async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications", details: err.message });
  }
},

// Mark a notification as read
markAsRead : async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read", details: err.message });
  }
},

// Delete a notification
deleteNotification : async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification", details: err.message });
  }
},

};

module.exports = notificationController;
