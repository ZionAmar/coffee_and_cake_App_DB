let raw_data=[];

function addRow() {
    const name = document.getElementById("name").value;
    const choice = document.getElementById("choice").value;

    if (name && choice) {
        const data = { name, choice }; // יצירת אובייקט עם הנתונים

        fetch('/coffee/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // שליחת האובייקט בצורת JSON בגוף הבקשה
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // מציג את התשובה מהשרת בקונסול
                // displaySavedRows();
                getList();
            });
    }
}

function CreateTble(){
    let str="";
    for(let line of raw_data){
        str+="<tr>";
        str+=`<td>${line.name}</td>`;
        str+=`<td>${line.choice}</td>`;
        str+=`<td>${line.FormattedDate}</td>`;
        str+=`<td>${line.time}</td>`;
        str+="</tr>";
    }
    document.getElementById("dataTable").innerHTML=str;
}
async function getList() {
    let response = await fetch('/coffee/data');
    let data = await response.json();
    raw_data = data.rows;
    console.log(raw_data);
    CreateTble();
}
getList();
