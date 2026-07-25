const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const { ObjectId } = require("mongodb");

const connectDB = require("./db");

const PORT = 3000;

// =====================
// Helper Functions
// =====================

function redirect(res, path) {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
}

function getBody(req) {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(querystring.parse(body));
    });
  });
}

// =====================
// Server
// =====================

const server = http.createServer(async (req, res) => {
  const db = await connectDB();

  // =====================
  // Register Page
  // =====================

  if (req.url === "/" || req.url === "/register") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    return fs.createReadStream("./views/index.html").pipe(res);
  }

  // =====================
  // CSS
  // =====================

  if (req.url === "/style/css") {
    res.writeHead(200, {
      "Content-Type": "text/css",
    });

    return fs.createReadStream("./views/index.css").pipe(res);
  }

  // =====================
  // Create User
  // =====================

  if (req.url === "/submit" && req.method === "POST") {
    const formData = await getBody(req);

    await db.collection("users").insertOne(formData);

    return redirect(res, "/users");
  }

  // =====================
  // Read Users
  // =====================

  if (req.url === "/users" && req.method === "GET") {
    const users = await db.collection("users").find().toArray();

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Users</title>
      <style>
        body{
          font-family: Arial;
          padding:20px;
        }

        table{
          border-collapse:collapse;
          width:100%;
        }

        th,td{
          border:1px solid #ddd;
          padding:10px;
          text-align:left;
        }

        th{
          background:#f4f4f4;
        }

        button{
          padding:6px 12px;
          cursor:pointer;
          margin-right:5px;
        }

        a{
          text-decoration:none;
        }
      </style>
    </head>
    <body>

      <h1>All Registered Users</h1>

      <a href="/register">
        <button>Add User</button>
      </a>

      <br><br>

      <table>
        <tr>
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
        </td>
      </tr>
      `;
    });

    html += `
      </table>
    </body>
    </html>
    `;

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    return res.end(html);
  }

  // =====================
  // Delete User
  // =====================

  if (req.url.startsWith("/delete/") && req.method === "GET") {
    const id = req.url.split("/")[2];

    await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    return redirect(res, "/users");
  }

  // =====================
  // Edit Page
  // =====================

  if (req.url.startsWith("/edit/") && req.method === "GET") {
    const id = req.url.split("/")[2];

    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    });

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Edit User</title>
    </head>
    <body>

      <h1>Edit User</h1>

      <form action="/update/${user._id}" method="POST">

        <input
          type="text"
          name="name"
          value="${user.name || ""}"
          placeholder="Name"
        />

        <br><br>

        <input
          type="email"
          name="email"
          value="${user.email || ""}"
          placeholder="Email"
        />

        <br><br>

        <input
          type="tel"
          name="phone"
          value="${user.phone || ""}"
          placeholder="Phone"
        />

        <br><br>

        <button type="submit">
          Update User
        </button>

      </form>

    </body>
    </html>
    `;

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    return res.end(html);
  }

  // =====================
  // Update User
  // =====================

  if (req.url.startsWith("/update/") && req.method === "POST") {
    const id = req.url.split("/")[2];

    const data = await getBody(req);

    await db.collection("users").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      },
    );

    return redirect(res, "/users");
  }

  // =====================
  // 404
  // =====================

  res.writeHead(404, {
    "Content-Type": "text/plain",
  });

  res.end("Route Not Found");
});

server.listen(PORT, () => {
  console.log(`Server Running : http://localhost:${PORT}`);
});
