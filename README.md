# Movie CRUD - Corrected Version

## Folder structure

Movie-CRUD/
├── index.html
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js

## Important

This project uses Firebase Realtime Database through its REST API. It is NOT Cloud Firestore.

The sample code points to your friend's Firebase Realtime Database URL:
https://posts-50d7d-default-rtdb.firebaseio.com

If you do not have permission to use that Firebase project, replace `base_url` in `assets/js/app.js` with your own Realtime Database URL.

## Run

1. Open the folder in VS Code.
2. Install/use the Live Server extension.
3. Right-click `index.html`.
4. Select "Open with Live Server".
5. Open DevTools Console and check for errors.

## CRUD operations

CREATE  = POST /movies.json
READ    = GET /movies.json
READ ONE = GET /movies/:id.json
UPDATE  = PATCH /movies/:id.json
DELETE  = DELETE /movies/:id.json
