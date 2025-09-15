require("dotenv").config({ path: ".env.qa" });

module.exports = {
  apps: [
    {
      name: "motor-ocatain",
      cwd: "/root/new-mo-next-app",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: "4000",
        NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
      },
    },
  ],
};
