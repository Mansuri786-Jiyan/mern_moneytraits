require("dotenv").config();

const { createApp } = require("./src-js/app");
const { PORT } = require("./src-js/config/app.config");

const app = createApp();

app.listen(PORT, () => {
  console.log(`JavaScript backend running at http://localhost:${PORT}`);
});
