const POSTS = [
  {
    id: 1,
    title: "Hello World",
    content: "This is my first post!",
  },
  {
    id: 2,
    title: "Back Again!",
    content: "This is my second post!",
  },
];

export default function getPosts(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(POSTS));
}
