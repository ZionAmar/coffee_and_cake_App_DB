const express = require('express');
const router = express.Router();
module.exports = router;
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const { use } = require("express/lib/router");

// הגדרות שרתי המייל
const emailUsername = 'mybusiness@ez4tackit.com'; // שם משתמש לחשבון המייל
const emailPassword = 'Zion.1460'; // סיסמה לחשבון המייל
const emailService = 'cpanel'; // שימוש בשירות המייל שצוין
const emailHost = 'mail.ez4tackit.com'; // שם השרת (רק אם אינך משתמש בשירות מוכן)
const emailPort = 465; // הפורט של השרת (עם SSL/TLS)
const isSecure = true; // משתמשים ב-SSL/TLS

router.get("/", (req, res) => {
    res.render("coffee", { pageTitle: "coffee and cake" });
});

router.get("/data", (req, res) => {
    let q = `SELECT *, DATE_FORMAT(date, '%Y.%m.%d') AS FormattedDate FROM \`data\``;
    db_pool.query(q, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ message: err });
        } else {
            res.status(200).json({ rows: rows });
        }
    });
});

router.post("/addUser", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;

    // הוספת המשתמש לטבלת USERS
    addUserToTable(name, email);

    res.status(200).json({ message: "OK" });
});

function addUserToTable(name, email) {
    // בדיקה האם המשתמש כבר קיים בטבלה
    let checkUserQuery = "SELECT * FROM USERS WHERE name = ? AND email = ?";
    db_pool.query(checkUserQuery, [name, email], function (err, rows, fields) {
        if (err) {
            console.error("Error checking user in USERS table: ", err);
        } else {
            // אם המשתמש לא קיים, הוספתו לטבלה
            if (rows.length === 0) {
                let userQuery = "INSERT INTO USERS (name, email) VALUES (?, ?)";
                db_pool.query(userQuery, [name, email], function (err, rows, fields) {
                    if (err) {
                        console.error("Error adding user to USERS table: ", err);
                    }
                });
            } else {
                console.log("User already exists in USERS table");
            }
        }
    });
}

router.post("/add", (req, res) => {
    let name = req.body.name;
    let choice = req.body.choice;
    let userEmail = req.body.userEmail;


    // השתמש ב-moment-timezone כדי לקבוע את השעה לשעון ישראל
    let now = moment().tz('Israel');
    const date = now.format('YYYY-MM-DD');
    let time = now.format('HH:mm:ss');

    let Query = "INSERT INTO data";
    Query += " (name, choice, date, time)";
    Query += " VALUES (";
    Query += ` '${name}', '${choice}', '${date}', '${time}')`;

    db_pool.query(Query, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ message: err });
        } else {
            // שלח מייל לכל הכתובות בטבלת users כאשר המידע הוסף בהצלחה
            sendEmailToUsers(name, date, time, choice);
            res.status(200).json({ message: "OK" });
        }
    });
});


// פונקציה לשליחת מייל לכל הכתובות בטבלת USERS
function sendEmailToUsers(name, date, time, choice) {
    let getUsersQuery = "SELECT email FROM users";

    db_pool.query(getUsersQuery, function (err, rows, fields) {
        if (err) {
            console.error("Error getting users from USERS table: ", err);
        } else {
            rows.forEach(row => {
                const userEmail = row.email;
                sendEmail(name, date, time, choice, userEmail);
            });
        }
    });
}

// פונקציה לשליחת מייל
async function sendEmail(name, date, time, choice, userEmail) {
    const transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: isSecure,
        service: emailService,
        auth: {
            user: emailUsername,
            pass: emailPassword,
        }
    });

    // שימוש ב-CSS עבור עיצוב הטקסט
    const heyTag = "<p style='text-align: right; font-weight: bold;'>,היי</p>";
    const dateTag = `<p style='text-align: right;'>בתאריך:${date} ,בשעה:${time}</p>`;
    const nameTag = `<p style='text-align: right;'><span style='font-weight: bold; color: red;'>${name}</span></p>`;
    const buyTag = "<p style='text-align: right;'>קנה";
    const choiceTag = `<span style="font-weight: bold; color: green;">${choice}</span></p>`;

    // הכנסת פסיק אחרי המילה "היי" ושורה חדשה
    const mailText = `${heyTag}\n${dateTag}\n${nameTag}\n${buyTag} `;

    const mailOptions = {
        from: emailUsername,
        to: userEmail,
        subject: "Coffee and Cake",
        // שימוש בתגי HTML עבור עיצוב הטקסט
        html: `${heyTag}${dateTag}${nameTag}${buyTag} ${choiceTag}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ' + error);
    }
}



