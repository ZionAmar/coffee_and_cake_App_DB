let raw_data = [];

// קריאה לשם המשתמש והאימייל מהעוגיות
const storedUsername = getCookieValue("userName");
const storedEmail = getCookieValue("userEmail");

// פונקציה שנקראת בלחיצה על כפתור הכניסה
function login() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (name && email) {
        // שמירת שם ואימייל בעוגיות
        document.cookie = `userName=${name}; path=/;`;
        document.cookie = `userEmail=${email}; path=/;`;

        // שמירה בדאטהבייס
        saveUserToDatabase(name, email);

        // הסתרת דף הכניסה והצגת הדף הראשי
        document.getElementById("login").style.display = "none";
        document.getElementById("main").style.display = "block";
    }
}

// פונקציה לשמירת המשתמש בדאטהבייס
function saveUserToDatabase(name, email) {
    const data = { name, email };

    fetch('/coffee/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Fetch error:', error));
}

// בדיקה אם יש עוגיות שמציינות שהמשתמש כבר התחבר
function checkUserLoggedIn() {
    return document.cookie.includes("userName=") && document.cookie.includes("userEmail=");
}

// בדיקה והצגת המסך הנכון בהתאם למצב התחברות המשתמש
if (checkUserLoggedIn()) {
    // המשתמש כבר התחבר - הצג את הדף הראשי
    document.getElementById("login").style.display = "none";
    document.getElementById("main").style.display = "block";
} else {
    // המשתמש טרם התחבר - הצג את דף הכניסה
    document.getElementById("login").style.display = "block";
    document.getElementById("main").style.display = "none";
}

// פונקציה לניקוי העוגיות
function clearCookies() {
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    close_menu();
    document.getElementById("login").style.display = "block";
    document.getElementById("main").style.display = "none";
}

function open_menu() {
    document.getElementById("overlay").style.display = "block";
    document.querySelector(".menu-card").style.display = "block";

    // הצגת השם והאימייל מהעוגיות
    document.getElementById("userName").textContent = storedUsername ? storedUsername : "שם המשתמש";
    document.getElementById("userEmail").textContent = storedEmail ? storedEmail : "user@example.com";
}

function close_menu() {
    document.getElementById("overlay").style.display = "none";
    document.querySelector(".menu-card").style.display = "none";
}

// פונקציה לקבלת ערך מעוגיה לפי שם
function getCookieValue(name) {
    const nameEQ = name.trim() + "=";
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

function addRow() {
    const name = storedUsername;
    const choice = document.getElementById("choice").value;

    if (name && choice) {
        const data = { name, choice, userEmail: storedEmail }; // הוסף פרמטר לכתובת האימייל

        fetch('/coffee/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                getList();
            })
            .catch(error => console.error('Fetch error:', error));
    }
}


function CreateTble() {
    let str = "";
    for (let line of raw_data) {
        str += "<tr>";
        str += `<td>${line.name}</td>`;
        str += `<td>${line.choice}</td>`;
        str += `<td>${line.FormattedDate}</td>`;
        str += `<td>${line.time}</td>`;
        str += "</tr>";
    }
    document.getElementById("dataTable").innerHTML = str;
}

async function getList() {
    try {
        let response = await fetch('/coffee/data');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        let data = await response.json();
        raw_data = data.rows;
        console.log(raw_data);
        raw_data.reverse();
        CreateTble();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

getList();
