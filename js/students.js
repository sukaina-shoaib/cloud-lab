const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const formMessage = document.getElementById("formMessage");
const studentCount = document.querySelector(".student-count");

let students = [];


studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const semester = document.getElementById("semester").value;


    const student = {
        name: name,
        email: email,
        rollNumber: rollNumber,
        semester: semester
    };


    students.push(student);

    displayStudents();

    studentForm.reset();

    formMessage.textContent = "Student added successfully!";
    formMessage.style.color = "#16a34a";

});


function displayStudents() {

    studentTable.innerHTML = "";


    if (students.length === 0) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No students added yet.
                </td>
            </tr>
        `;

        return;
    }


    students.forEach(function (student) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNumber}</td>
            <td>${student.email}</td>
            <td>Semester ${student.semester}</td>
        `;

        studentTable.appendChild(row);

    });


    studentCount.textContent =
        `${students.length} Student${students.length === 1 ? "" : "s"}`;
}