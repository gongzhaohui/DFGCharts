const PROXY_CONFIG = [
  {
    context: ["/api", "/auth", "/users"],
    target: "http://localhost:4000",
    secure: false,
    logLevel: "debug",
  },
];

module.exports = PROXY_CONFIG;
