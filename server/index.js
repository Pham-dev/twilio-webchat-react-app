require("dotenv").config();
const express = require("express");
const { validateRequestOriginMiddleware } = require("./middlewares/validateRequestOriginMiddleware");
const { initWebchatController } = require("./controllers/initWebchatController");
const { refreshTokenController } = require("./controllers/refreshTokenController");
const cors = require("cors");
const { allowedOrigins } = require("./helpers/getAllowedOrigins");

const app = express();
const port = 3001;

app.use(express.json());
app.use(
    cors({
        origins: allowedOrigins
    })
);
app.listen(port, () => {
    console.log(`Twilio Webchat App server running on port ${port}`);
});

// For testing locally prepend "/webchat"
app.post("/init-webchat", validateRequestOriginMiddleware, initWebchatController);
app.post("/refresh-token", validateRequestOriginMiddleware, refreshTokenController);
