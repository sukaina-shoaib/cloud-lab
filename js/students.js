const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const formMessage = document.getElementById("formMessage");
const studentCount = document.querySelector(".student-count");


// ========================================
// LOAD STUDENTS FROM POSTGRESQL
// ========================================

async function loadStudents() {

    try {

        const response = await fetch(
            "/.netlify/functions/students",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        const students = await response.json();


        console.log("Students received:", students);


        displayStudents(students);


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        studentTable.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    Unable to load students.
                </td>
            </tr>
        `;


        studentCount.textContent = "0 Students";


        formMessage.textContent =
            "Could not connect to student database.";

        formMessage.style.color =
            "#dc2626";
    }
}


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents(students) {

    studentTable.innerHTML = "";


    if (!Array.isArray(students) ||
        students.length === 0) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No students registered yet.
                </td>
            </tr>
        `;


        studentCount.textContent =
            "0 Students";

        return;
    }


    students.forEach(function(student) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                ${escapeHTML(student.name)}
            </td>

            <td>
                ${escapeHTML(student.rollNumber)}
            </td>

            <td>
                ${escapeHTML(student.email)}
            </td>

            <td>
                Semester ${escapeHTML(student.semester)}
            </td>
        `;


        studentTable.appendChild(row);

    });


    studentCount.textContent =
        `${students.length} Student${
            students.length === 1 ? "" : "s"
        }`;
}


// ========================================
// ADD STUDENT
// ========================================

studentForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value
                .trim();


        const email =
            document.getElementById("email")
                .value
                .trim();


        const rollNumber =
            document.getElementById("rollNumber")
                .value
                .trim();


        const semester =
            Number(
                document.getElementById("semester").value
            );


        if (
            !name ||
            !email ||
            !rollNumber ||
            !semester
        ) {

            formMessage.textContent =
                "Please fill in all fields.";

            formMessage.style.color =
                "#dc2626";

            return;
        }


        formMessage.textContent =
            "Saving student...";

        formMessage.style.color =
            "#2563eb";


        try {

            const response =
                await fetch(
                    "/.netlify/functions/students",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            rollNumber:
                                rollNumber,

                            semester:
                                semester

                        })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Could not save student."
                );
            }


            formMessage.textContent =
                "Student saved successfully!";

            formMessage.style.color =
                "#16a34a";


            studentForm.reset();


            // Reload from Netlify database
            await loadStudents();


        } catch (error) {

            console.error(
                "Save error:",
                error
            );


            formMessage.textContent =
                error.message ||
                "Could not save student.";

            formMessage.style.color =
                "#dc2626";
        }

    }
);


// ========================================
// SECURITY
// ========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


// ========================================
// START
// ========================================

loadStudents();
