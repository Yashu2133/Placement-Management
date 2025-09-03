const express = require("express");
const { 
  createNotification, 
  getNotifications, 
  markAsRead, 
  deleteNotification 
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/", createNotification);           
router.get("/:userId", getNotifications);       
router.patch("/:id/read", markAsRead);          
router.delete("/:id", deleteNotification);      

module.exports = router;
