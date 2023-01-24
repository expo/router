export default function getPosts(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      me: true,
    })
  );
}
