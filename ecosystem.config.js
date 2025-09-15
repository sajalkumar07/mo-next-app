require("dotenv").config({ path: "/root/new-mo-next-app/.env.qa" });

module.exports = {
  apps: [
    {
      name: "motor-ocatain",
      cwd: "/root/new-mo-next-app",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: "4000",
        HOST: "0.0.0.0",
        NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
      },
    },
  ],
};
