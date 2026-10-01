// ========================================
// STUDENT PAGE ELEMENTS
// ========================================

const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const formMessage = document.getElementById("formMessage");
const studentCount = document.querySelector(".student-count");


// ========================================
// LOAD STUDENTS FROM NETLIFY
// ========================================

async function loadStudents() {

    try {

        const response = await fetch(
            "/.netlify/functions/students"
        );


        if (!response.ok) {
            throw new Error("Could not load students.");
        }


        const students = await response.json();


        displayStudents(students);


    } catch (error) {

        console.error("Load error:", error);


        studentTable.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    Could not load students.
                </td>
            </tr>
        `;


        formMessage.textContent =
            "Database connection error.";

        formMessage.style.color = "#dc2626";
    }
}


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents(students) {

    studentTable.innerHTML = "";


    // No students
    if (!students || students.length === 0) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No students registered yet.
                </td>
            </tr>
        `;


        studentCount.textContent = "0 Students";

        return;
    }


    // Display students
    students.forEach(function (student) {

        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${escapeHTML(student.name)}</td>

            <td>${escapeHTML(student.rollNumber)}</td>

            <td>${escapeHTML(student.email)}</td>

            <td>Semester ${student.semester}</td>
        `;


        studentTable.appendChild(row);

    });


    // Update count
    studentCount.textContent =
        `${students.length} Student${students.length === 1 ? "" : "s"}`;
}


// ========================================
// ADD STUDENT
// ========================================

studentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Get form values
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


        // Basic validation
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


        // Show saving message
        formMessage.textContent =
            "Saving student...";

        formMessage.style.color =
            "#2563eb";


        try {

            // Send student to Netlify Function
            const response = await fetch(
                "/.netlify/functions/students",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        rollNumber: rollNumber,

                        semester: semester

                    })
                }
            );


            const result =
                await response.json();


            // Check server response
            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Could not save student."
                );
            }


            // Success
            formMessage.textContent =
                "Student saved successfully!";

            formMessage.style.color =
                "#16a34a";


            // Clear form
            studentForm.reset();


            // Reload students from cloud storage
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
// PROTECT TABLE FROM HTML INJECTION
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
// LOAD DATA WHEN PAGE OPENS
// ========================================

loadStudents();
