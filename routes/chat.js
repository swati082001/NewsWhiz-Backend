const express = require("express");
const { handleChat, getHistory, resetSession } = require("../services/gemini");

const chatRoutes = express.Router()

chatRoutes.post("/", handleChat);
chatRoutes.get("/history/:sessionId", getHistory);
chatRoutes.post("/reset", resetSession);

module.exports = chatRoutes;