## VerifyCode Class

The `VerifyCode` class is responsible for managing the verification process for user codes. It interacts with the NeDB database to store, verify, and delete verification codes and associated email addresses.

### Methods

1. **Constructor**

    - `constructor(code, email)`: Initializes a new `VerifyCode` object with the provided verification code and email.

2. **storeCodeAndEmail**

    - `storeCodeAndEmail()`: Stores the verification code and email in the NeDB database.

3. **verifyCodeAndEmail**

    - `verifyCodeAndEmail()`: Verifies the provided code against the stored code associated with the given email.

4. **deleteCodeAndEmail**

    - `deleteCodeAndEmail()`: Deletes the verification code and email after successful verification.

## User Class

The `User` class manages user credentials, including email and hashed passwords. It provides methods for user creation, authentication, and password updates.

### Methods

1. **Constructor**

    - `constructor(email, password)`: Initializes a new `User` object with the provided email and hashed password.

2. **createUser**

    - `createUser()`: Creates a new user in the database, checking for existing emails to avoid duplicates.

3. **checkId (Static Method)**

    - `static checkId(id)`: Checks if a user with the provided ID exists in the database.

4. **checkEmail (Static Method)**

    - `static checkEmail(email)`: Checks if a user with the provided email exists in the database.

5. **getEmail (Static Method)**

    - `static getEmail(id)`: Retrieves the email associated with the provided user ID.

6. **authWithPassword (Static Method)**

    - `static authWithPassword(id, password)`: Authenticates a user by verifying the provided password against the stored hashed password.

7. **updateUserPassword (Static Method)**

    - `static updateUserPassword(userId, current_password, new_password)`: Updates the user's password after verifying the current password.


## Uploads Class

The `Uploads` class manages video uploads, providing blueprints for video objects and methods to initialize, retrieve, and update video information. It interacts with the NeDB database to store and retrieve video data.

### Methods

1. **Constructor**

    - `constructor(creatorId, title, description, category, thumbnailUrl, streamUrl, tags, privacy, locale, license, duration)`: Initializes a new `Uploads` object with video properties.

2. **init**

    - `init()`: Initializes the video object and stores it in the NeDB database, handling authentication and profile picture retrieval.

3. **getCreatorUploads (Static Method)**

    - `static getCreatorUploads(creatorId)`: Fetches video uploads for a given creator from the database.

4. **getVideoObject (Static Method)**

    - `static getVideoObject(videoId)`: Retrieves a specified video object by ID from the database.

5. **getRecommendations (Static Method)**

    - `static getRecommendations(license, tags, category)`: Retrieves video recommendations based on license, tags, and category.

6. **fetchUserFeedByLimit (Static Method)**

    - `static fetchUserFeedByLimit()`: Fetches a user feed from the database with a specified limit.

7. **updateVideo (Static Method)**

    - `static updateVideo(id, query, value)`: Updates video information in the database (Admin-only).

## Profile Class

The `Profile` class manages user profiles, providing blueprints for profile objects and methods to initialize, update, and retrieve user profiles. It interacts with the NeDB database to store and retrieve profile data.

### Methods

1. **Constructor**

    - `constructor(id)`: Initializes a new `Profile` object with the provided user ID.

2. **init**

    - `init()`: Initializes the user profile after user ID authentication, storing default values in the NeDB database.

3. **checkProfile (Static Method)**

    - `static checkProfile(id)`: Checks if a user profile exists for the provided user ID.

4. **checkUsernameExists (Static Method)**

    - `static checkUsernameExists(username, password)`: Checks if a username exists and authenticates it against the provided password.

5. **verifyUsername (Static Method)**

    - `static verifyUsername(username)`: Verifies if a username exists in the database.

6. **updateUserFirstAndLastNames (Static Method)**

    - `static updateUserFirstAndLastNames(id, lastname, firstname)`: Updates the user's last name and first name in the database.

7. **updateDobAndGender (Static Method)**

    - `static updateDobAndGender(id, dob, gender)`: Updates the user's date of birth and gender in the database.

8. **updateUsername (Static Method)**

    - `static updateUsername(id, username)`: Updates the user's username in the database.

9. **updatePictureUrl (Static Method)**

    - `static updatePictureUrl(id, profilePicUrl)`: Updates the user's profile picture URL in the database.

10. **getUserProfileById (Static Method)**

    - `static getUserProfileById(id)`: Fetches the user's profile by ID from the database.

11. **getUserProfilePicture (Static Method)**

    - `static getUserProfilePicture(id)`: Fetches the user's profile picture URL by ID from the database.

## ReportError Class

The `ReportError` class manages error reporting, providing blueprints for error report objects and methods to create and retrieve error reports. It interacts with the NeDB database to store and retrieve error data.

### Class Initialization

```javascript
const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const filepath = path.join(__dirname, "../DB/neDB/errors.db");
const db = loadDB(filepath);
```

### Class Definition

```javascript
class ReportError {
    status = 0;
    constructor(errorObject) {
        this._errorObject = errorObject;
    }

    /**
     * createReport - creates a new error report in the database.
     * @returns {Promise} - resolves with success message or rejects with an error.
     */
    createReport() {
        return new Promise((resolve, reject) => {
            db.insert(this._errorObject, (error, document) => {
                if (error) reject({ error: true, message: "Error creating report" });
                else {
                    resolve({ error: false, message: "Report created successfully" });
                }
            });
        });
    }

    /**
     * loadAllReports - retrieves all error reports from the database.
     * @returns {Promise} - resolves with an array of error reports or rejects with an error.
     */
    static loadAllReports() {
        return new Promise((resolve, reject) => {
            db.find({}, { multi: true }, (error, documents) => {
                if (error) reject({ error: true, reports: null });
                else {
                    resolve({ error: false, reports: documents });
                }
            });
        });
    }
}

module.exports = ReportError;
```

### Class Methods

1. **Constructor**

   - `constructor(errorObject)`: Initializes a new `ReportError` object with the provided error object.

2. **createReport**

   - `createReport()`: Creates a new error report in the database.

3. **loadAllReports (Static Method)**

   - `static loadAllReports()`: Retrieves all error reports from the database.



