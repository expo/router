import chalk from "chalk";

export default function Foobar(req, res, next) {
  console.log("Foobar API called " + chalk.green("successfully") + "!");

  res.setHeader("Content-Type", "text/html");
  res.end("<h1>Hello World!</h1>");
}
