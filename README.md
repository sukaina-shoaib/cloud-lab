# CloudSphere — Netlify + PostgreSQL

This version replaces Netlify Blobs with Netlify Database (PostgreSQL), using
`getDatabase()` from `@netlify/database`, as in the teacher repository.
The existing HTML/CSS pages and the student API URL are preserved.

## Publish the fix

1. Extract the supplied ZIP. Upload the CONTENTS of the `cloud-lab` folder to
   the root of `sukaina-shoaib/cloud-lab`, preserving the folder structure.
   Replace existing files and commit to `main`. Do not upload the ZIP itself.
2. In Netlify, open the existing `cloud-labbb` project. Make sure its connected
   repository is `sukaina-shoaib/cloud-lab` and production branch is `main`.
   If the site was deployed by drag-and-drop, connect this repository first.
   A static drag-and-drop upload does not build the database function.
3. Build settings: base directory empty, build command empty, publish directory
   `.`, functions directory `netlify/functions`. The included `netlify.toml`
   supplies publish/functions settings. Netlify installs npm dependencies.
4. Deploy the latest commit. The `@netlify/database` dependency enables Netlify
   Database provisioning; Netlify applies the migration in
   `netlify/database/migrations/0001_create_students.sql` before publishing.
   If necessary, open Data & Storage > Database > Create a database manually,
   then redeploy. Database availability depends on the account's supported plan.
5. Open `https://cloud-labbb.netlify.app/students.html` and add one test student.
   Refresh the page: the student should remain. Reusing the same roll number
   should show a duplicate message rather than create another record.
6. In Netlify, open Data & Storage > Database and inspect the `students` table.
   Verify the row is there. The API at `/.netlify/functions/students` should
   return an array with name, email, rollNumber, semester, id and createdAt.

No database password belongs in browser JavaScript or GitHub. Netlify supplies
its managed database connection to the server function automatically.

## Files changed

- `package.json`: use `@netlify/database` instead of `@netlify/blobs`.
- `netlify/functions/students.js`: SQL SELECT/INSERT, validation, duplicate checks.
- `netlify/database/migrations/0001_create_students.sql`: students table.
- `netlify.toml`: explicit deploy settings.
- `js/students.js`: database comment and safe semester rendering.
- `.gitignore`: keep local dependencies and secrets out of Git.

## Existing Blobs records

The change does not delete or copy the old Blobs records. PostgreSQL starts
with an empty students table. If you need the existing records, export the
`students` store's `all` JSON before switching and migrate it separately.
Do not delete that store until you have verified any data you need is preserved.

## Troubleshooting

- If the URL redirects to Netlify sign-in, review the site's access/deploy
  protection settings. This is separate from the database implementation.
- If the build fails, inspect its deploy log and confirm the package installed.
- If the API returns 500, inspect the students function log and confirm that
  Database exists and the migration completed for that deployment.
- The lab API retains the original public read/add behavior. Use fictitious
  student details for testing.

## Reference

https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/
https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/
