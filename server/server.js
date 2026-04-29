const app = require("./app");

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
  });
}

// For Vercel serverless
module.exports = app;
