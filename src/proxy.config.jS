const PROXY_CONFIG = [
  {
    context: ["/api"],
    target: "https://jonatasnote:8080",
    secure: false,
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;
