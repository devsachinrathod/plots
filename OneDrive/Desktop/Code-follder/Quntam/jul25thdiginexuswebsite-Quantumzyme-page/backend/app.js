require("dotenv").config();
const express = require("express");
const mysql2 = require("mysql2/promise");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

// MySQL connection pool (reused everywhere)
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 },
  })
);

// Routes

// Updated /apply route to handle ISD code dropdown
// app.post("/apply", async (req, res) => {
//   console.log("Received form data:", req.body); // Debug log

//   const {
//     "first-name": firstName,
//     "last-name": lastName,
//     email,
//     "isd-code": isdCode,
//     tel,
//     "education-status": educationStatus,
//     "country-name": countryName,
//     "city-name": cityName,
//     "area-of-interest": areaOfInterest,
//     remote,
//     unpaid,
//     linkedin,
//   } = req.body;

//   // Combine ISD code with phone number
//   const fullPhoneNumber = `${isdCode} ${tel}`;

//   // Debug: log individual fields
//   console.log("Parsed fields:", {
//     firstName,
//     lastName,
//     email,
//     isdCode,
//     tel,
//     fullPhoneNumber,
//     educationStatus,
//     countryName,
//     cityName,
//     areaOfInterest,
//     remote,
//     unpaid,
//     linkedin,
//   });

//   try {
//     const [existing] = await pool.query(
//       "SELECT * FROM internship_applications WHERE email = ?",
//       [email]
//     );

//     if (existing.length > 0) {
//       return res
//         .status(400)
//         .json({ message: "Application already submitted with this email." });
//     }

//     const insertQuery = `
//       INSERT INTO internship_applications
//       (first_name, last_name, email, contact, education_status, country_name, city_name, department_applied, preferred_date, remote, unpaid, linkedin_url)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)
//     `;

//     const values = [
//       firstName,
//       lastName,
//       email,
//       fullPhoneNumber, // Combined ISD code + phone number
//       educationStatus,
//       countryName,
//       cityName,
//       areaOfInterest,
//       remote,
//       unpaid,
//       linkedin,
//     ];

//     console.log("Inserting values:", values); // Debug log

//     await pool.query(insertQuery, values);
//     res.redirect("/internappthanks.html");
//   } catch (err) {
//     console.error("DB error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });
// Updated /apply route with proper radio button handling
app.post("/apply", async (req, res) => {
  console.log("Received form data:", req.body); // Debug log

  const {
    "first-name": firstName,
    "last-name": lastName,
    email,
    "isd-code": isdCode,
    tel,
    "education-status": educationStatus,
    "country-name": countryName,
    "city-name": cityName,
    "area-of-interest": areaOfInterest,
    remote,
    unpaid,
    linkedin,
  } = req.body;

  // Combine ISD code with phone number
  const fullPhoneNumber = `${isdCode} ${tel}`;

  // Handle radio button values - convert to proper format
  const remoteValue = remote === "yes" ? 1 : remote === "no" ? 0 : null;
  const unpaidValue = unpaid === "yes" ? 1 : unpaid === "no" ? 0 : null;
  // Debug: log individual fields
  console.log("Parsed fields:", {
    firstName,
    lastName,
    email,
    isdCode,
    tel,
    fullPhoneNumber,
    educationStatus,
    countryName,
    cityName,
    areaOfInterest,
    remote: remoteValue,
    unpaid: unpaidValue,
    linkedin,
  });

  // // Validation - ensure radio buttons are selected
  // if (!remoteValue) {
  //   return res
  //     .status(400)
  //     .json({ message: "Please select if you agree to remote internship." });
  // }
  // if (!unpaidValue) {
  //   return res
  //     .status(400)
  //     .json({ message: "Please select if you agree to unpaid internship." });
  // }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM internship_applications WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Application already submitted with this email." });
    }

    const insertQuery = `
      INSERT INTO internship_applications 
      (first_name, last_name, email, contact, education_status, country_name, city_name, department_applied, preferred_date, remote, unpaid, linkedin_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)
    `;

    const values = [
      firstName,
      lastName,
      email,
      fullPhoneNumber,
      educationStatus,
      countryName,
      cityName,
      areaOfInterest,
      remoteValue, // Use processed radio button value
      unpaidValue, // Use processed radio button value
      linkedin,
    ];

    console.log("Inserting values:", values); // Debug log

    await pool.query(insertQuery, values);
    res.redirect("/internappthanks.html");
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// Applicant login page & dashboard
app.get("/applicants", async (req, res) => {
  if (!req.session.authenticated) {
    return res.sendFile(path.join(__dirname, "public", "login.html"));
  }

  try {
    const [rows] = await pool.execute(
      `SELECT first_name, last_name, email, contact, education_status, country_name, city_name, department_applied, preferred_date, remote, unpaid, linkedin_url 
       FROM internship_applications 
       ORDER BY submitted_at DESC`
    );

    const html = fs.readFileSync(
      path.join(__dirname, "public", "applicants.html"),
      "utf-8"
    );
    const rowHtml = rows
      .map(
        (r) => `
        <tr>
          <td>${r.first_name}</td>
          <td>${r.last_name}</td>
          <td>${r.email}</td>
          <td>${r.contact}</td>
          <td>${r.education_status}</td>
          <td>${r.country_name}</td>
          <td>${r.city_name}</td>
          <td>${r.department_applied}</td>
          <td>${r.preferred_date}</td>
          <td>${r.remote}</td>
          <td>${r.unpaid}</td>
          <td>${r.linkedin_url || "-"}</td>
        </tr>`
      )
      .join("");

    res.send(html.replace("<!-- ROWS_PLACEHOLDER -->", rowHtml));
  } catch (err) {
    res.status(500).send("Error loading applicants");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM applicationusers WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 1) {
      const user = { email: rows[0].email };
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Now fetch applications
      const [applications] = await pool.execute(
        `SELECT first_name, last_name, email, contact, education_status, country_name, city_name, department_applied, preferred_date, remote, unpaid, linkedin_url 
         FROM internship_applications 
         ORDER BY submitted_at DESC`
      );

      res.json({ token, applications });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/applicants.html"); // Redirect back to login page
  });
});

// Export CSV
app.get("/export-csv", async (req, res) => {
  if (!req.session.authenticated) {
    return res.status(403).send("Not authenticated");
  }

  try {
    const [rows] = await pool.execute(
      `SELECT first_name, last_name, email, contact, education_status, country_name, city_name, department_applied, preferred_date, remote, unpaid 
       FROM internship_applications`
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=DNA-${new Date().toISOString()}.csv`
    );

    res.write(
      [
        "First Name",
        "Last Name",
        "Email",
        "Contact",
        "Education Status",
        "Country",
        "City",
        "Department Applied",
        "Preferred Date",
        "Remote",
        "Unpaid",
      ].join(",") + "\n"
    );

    rows.forEach((r) => {
      res.write(
        [
          r.first_name,
          r.last_name,
          r.email,
          r.contact,
          r.education_status,
          r.country_name,
          r.city_name,
          r.department_applied,
          r.preferred_date,
          r.remote,
          r.unpaid,
        ].join(",") + "\n"
      );
    });

    res.end();
  } catch (err) {
    res.status(500).send("Export failed");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
