
const express = require('express');
const router = express.Router();
module.exports = router;
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");

// הגדרות שרתי המייל
const emailUsername = 'mybusiness@ez4tackit.com'; // שם משתמש לחשבון המייל
const emailPassword = 'Zion.1460'; // סיסמה לחשבון המייל
const emailService = 'cpanel'; // שימוש בשירות המייל שצוין
const emailHost = 'mail.ez4tackit.com'; // שם השרת (רק אם אינך משתמש בשירות מוכן)
const emailPort = 465; // הפורט של השרת (עם SSL/TLS)
const isSecure = true; // משתמשים ב-SSL/TLS

router.get("/", (req, res) => {
    res.render("coffee", { pageTitle: "Employees" });
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

router.post("/add", (req, res) => {
    let name = req.body.name;
    let choice = req.body.choice;

    // השתמש ב-moment-timezone כדי לקבוע את השעה לשעון ישראל
    let now = moment().tz('Israel');
    const date = now.format('YYYY-MM-DD'); // משיג תאריך בפורמט "YYYY-MM-DD"
    let time = now.format('HH:mm:ss');

    let Query = "INSERT INTO data";
    Query += " (name, choice, date, time)";
    Query += " VALUES (";
    Query += ` '${name}', '${choice}', '${date}', '${time}')`;
    console.log("adding task", Query);

    db_pool.query(Query, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ message: err });
        } else {
            // שלח מייל לאיימייל הרלוונטי כאשר המידע הוסף בהצלחה
            sendEmail(name, date, time, choice);
            res.status(200).json({ message: "OK" });
        }
    });
});

// פונקציה לשליחת מייל
async function sendEmail(name, date, time, choice) {
    const transporter = nodemailer.createTransport({
        host: emailHost, // אם אינך משתמש בשירות מוכן
        port: emailPort, // הפורט של השרת
        secure: isSecure, // משתמשים ב-SSL/TLS
        service: emailService, // שירות המייל
        auth: {
            user: emailUsername, // שם המשתמש לחשבון המייל
            pass: emailPassword, // סיסמה לחשבון המייל
        }
    });

    const mailOptions = {
        from: emailUsername,
        to: 'zion0549774827@gmail.com',
        subject: "Coffee and Cake",
        text: `היי, בתאריך:${date} ,בשעה:${time} ,${name}  קנה ${choice} `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ' + error);
    }
}
