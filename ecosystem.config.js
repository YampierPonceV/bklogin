module.exports = {
  apps: [
    {
      name: "backend-api",
      script: "./src/app.js", // o tu archivo principal (server.js, app.js)
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
