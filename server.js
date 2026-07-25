const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const { ObjectId } = require("mongodb");

const connectDB = require("./db");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const db = await connectDB();

  // GET /register
  if (req.url === "/register" && req.method === "GET") {
    const html = fs.readFileSync("./views/index.html", "utf8");

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    return res.end(html);
  }

  // GET /style.css
  if (req.url === "/style/css" && req.method === "GET") {
    const css = fs.readFileSync("./views/index.css", "utf8");

    res.writeHead(200, {
      "Content-Type": "text/css",
    });

    return res.end(css);
  }

  // POST /register
  if (req.url === "/submit" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const formData = querystring.parse(body);

      console.log(formData);

      await db.collection("users").insertOne(formData);

      // res.writeHead(201, {
      //   "Content-Type": "text/html",
      // });

      res.writeHead(302, {
        Location: "/users",
      });

      res.end("<h1>User Registered Successfully</h1>");
    });

    return;
  }

  if (req.url === "/users" && req.method === "GET") {
    const users = await db.collection("users").find().toArray();

    let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Users</title>

    <style>
      body{
        font-family: Arial, sans-serif;
        padding:20px;
        background:#f4f4f4;
      }

      h1{
        text-align:center;
      }

      table{
        width:100%;
        border-collapse:collapse;
        background:white;
      }

      th,td{
        border:1px solid #ddd;
        padding:10px;
        text-align:center;
      }

      th{
        background:#333;
        color:white;
      }

      img{
        width:80px;
        height:80px;
        border-radius:50%;
        object-fit:cover;
      }

      button{
        padding:8px 12px;
        margin:2px;
        cursor:pointer;
      }

      a{
        text-decoration:none;
      }
    </style>

  </head>

  <body>

    <h1>All Registered Users</h1>

    <table>

      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Gender</th>
        <th>Skills</th>
        <th>City</th>
        <th>About</th>
        <th>Actions</th>
      </tr>
  `;

    users.forEach((user) => {
      html += `
      <tr>

        <td>
          <img
            src="${
              user.imageUrl?.trim() ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }"
            alt="Profile"
            onerror="this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png'"
          />
        </td>

        <td>${user.name || ""}</td>
        <td>${user.email || ""}</td>
        <td>${user.phone || ""}</td>
        <td>${user.gender || ""}</td>
        <td>${user.skills || ""}</td>
        <td>${user.city || ""}</td>
        <td>${user.about || ""}</td>

        <td>

          <a href="/edit/${user._id}">
            <button>Edit</button>
          </a>

          <a href="/delete/${user._id}">
            <button>Delete</button>
          </a>

          <a href="/info/${user._id}">
            <button>Info</button>
          </a>

        </td>

      </tr>
    `;
    });

    html += `
    </table>
<a href="/register">
  <button>Back to Register</button>
</a>
  </body>
  </html>
  `;

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    return res.end(html);
  }

  if (req.url.startsWith("/edit/") && req.method === "GET") {
    const id = req.url.split("/")[2];

    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    });

    const html = `
  <form action="/update/${user._id}" method="POST">
    <input type="text" name="name" value="${user.name}">
    <br><br>

    <input type="email" name="email" value="${user.email}">
    <br><br>

    <input type="tel" name="phone" value="${user.phone}">
    <br><br>

    <button type="submit">Update</button>
  </form>
  `;

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    return res.end(html);
  }

  if (req.url.startsWith("/update/") && req.method === "POST") {
    const id = req.url.split("/")[2];

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const data = querystring.parse(body);

      await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
        },
      );

      res.writeHead(302, {
        Location: "/users",
      });

      res.end();
    });

    return;
  }

  if (req.url === "/user-details/css") {
    res.writeHead(200, {
      "Content-Type": "text/css",
    });

    return fs.createReadStream("./views/user-details.css").pipe(res);
  }

  if (req.url.startsWith("/info/") && req.method === "GET") {
    const id = req.url.split("/")[2];

    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    });

    let html = fs.readFileSync("./views/user-details.html", "utf8");

    const imageUrl =
      user.imageUrl?.trim() ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    html = html
      .replace("{{imageUrl}}", imageUrl || "")
      .replace("{{name}}", user.name || "")
      .replace("{{email}}", user.email || "")
      .replace("{{phone}}", user.phone || "")
      .replace("{{password}}", user.password || "")
      .replace("{{gender}}", user.gender || "")
      .replace("{{skills}}", user.skills || "")
      .replace("{{city}}", user.city || "")
      .replace("{{about}}", user.about || "");

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    return res.end(html);
  }

  if (req.url.startsWith("/delete/")) {
    const id = req.url.split("/")[2];

    await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    res.writeHead(302, {
      Location: "/users",
    });

    return res.end();
  }
  res.writeHead(404, {
    "Content-Type": "text/plain",
  });

  res.end("Route Not Found");
});

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
