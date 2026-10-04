import { getDatabase } from "@netlify/database";

function json(body, status = 200, headers = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            ...headers
        }
    });
}

export default async (request) => {
    if (!["GET", "POST"].includes(request.method)) {
        return json({ error: "Method not allowed" }, 405, { Allow: "GET, POST" });
    }

    let student;
    if (request.method === "POST") {
        let body;
        try {
            body = await request.json();
        } catch {
            return json({ error: "Request must contain valid JSON." }, 400);
        }

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return json({ error: "Student details are required." }, 400);
        }

        const name = typeof body.name === "string" ? body.name.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const rollNumber = typeof body.rollNumber === "string" ? body.rollNumber.trim() : "";
        const semester = typeof body.semester === "number" || typeof body.semester === "string"
            ? Number(body.semester) : NaN;

        if (!name || name.length > 100 || !rollNumber || rollNumber.length > 50 ||
            email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            !Number.isInteger(semester) || semester < 1 || semester > 8) {
            return json({ error: "Enter a name (up to 100 characters), valid email, roll number (up to 50 characters), and semester from 1 to 8." }, 400);
        }
        student = { name, email, rollNumber, semester };
    }

    try {
        const db = getDatabase();

        if (request.method === "GET") {
            const students = await db.sql`
                SELECT id, name, email, roll_number AS "rollNumber",
                       semester, created_at AS "createdAt"
                FROM students
                ORDER BY id ASC
            `;
            return json(students);
        }

        // Interpolated values are parameterized by the database driver.
        const rows = await db.sql`
            INSERT INTO students (name, email, roll_number, semester)
            VALUES (${student.name}, ${student.email}, ${student.rollNumber}, ${student.semester})
            RETURNING id, name, email, roll_number AS "rollNumber",
                      semester, created_at AS "createdAt"
        `;
        return json({ success: true, student: rows[0] }, 201);
    } catch (error) {
        if (error.code === "23505" || error.cause?.code === "23505") {
            return json({ error: "A student with this roll number already exists." }, 409);
        }
        console.error("Student database request failed:", error);
        return json({ error: "Could not access the student database. Check the Netlify database setup and function logs." }, 500);
    }
};
