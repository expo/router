export default function getPosts(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      applinks: {
        apps: [],
        details: [
          {
            appID: "9Y4W9Z9Y9L.com.expo.sandbox",
            paths: ["NOT /api/*"],
          },
        ],
      },
    })
  );
}
