module.exports = {
  apps: [
    {
      name: "new-mo-next-app",
      script: "npm",
      args: "start",
      cwd: "/root/new-mo-next-app",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
