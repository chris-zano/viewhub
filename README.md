# ViewHub

ViewHub is a video sharing platform built with Node.js and Express. Users can upload and share videos, customize their profiles, and interact with a community of creators.

## Features

- **User Authentication**: Secure user authentication system for login and signup.
- **Profile Management**: Users can update their profile information, including name, username, and profile picture.
- **Video Upload**: Creators can upload videos, with support for thumbnails and video streaming.
- **Video Feed**: Users have access to a personalized video feed based on their preferences.
- **Recommendations**: The platform provides video recommendations based on license, tags, and category.
- **Error Reporting**: Users can report errors through the platform.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web application framework for Node.js.
- **Multer**: Middleware for handling file uploads.
- **EJS**: Embedded JavaScript templates for rendering views.
- **Mail**: Utilized for sending verification codes and notifications.
- **FFprobe-static**: Used for extracting video information.
- **Git**: Version control for source code.

## Project Structure

- **`app.js`**: Main application file containing server setup and middleware configuration.
- **`routes`**: Directory containing route files for different sections of the application.
- **`controllers`**: Logic for handling different routes and interacting with models.
- **`models`**: Database models for handling user profiles, videos, errors, etc.
- **`utils`**: Utility functions and modules used across the application.
- **`DB`**: Directories for storing user profile images and video thumbnails.

## Getting Started

1. Install dependencies: `npm install`
2. Run the application: `node app.js`

The application will be accessible at [http://localhost:5500](http://localhost:5500).

## Usage

- Navigate to [http://localhost:5500/signup](http://localhost:5500/signup) to create an account.
- After signing up, you can log in at [http://localhost:5500/login](http://localhost:5500/login).
- Explore the platform, upload videos, and interact with other users.

## Development

Feel free to contribute to the project by opening issues or submitting pull requests. Report any errors using the error reporting feature.

## License

This project is licensed under the [MIT License](LICENSE).

Enjoy using ViewHub! 🚀

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


---

# Code Documentation

Below is a README template for the provided JavaScript functions. The documentation includes a brief description of each function, parameters, return types, and usage examples.

---

## JavaScript Functions README

This README provides documentation for a set of JavaScript functions used in a web application.

### `getUserProfile(id)`

#### Description
Fetches the user profile based on the provided `id`.

#### Parameters
- `id` (string): The user ID.

#### Returns
- An object representing the user profile.

#### Example
```javascript
const userProfile = await getUserProfile("user123");
console.log(userProfile);
```

### `reportError(reportObject)`

#### Description
Reports a runtime error for logging and potential fixes.

#### Parameters
- `reportObject` (JSON): The error report object.

#### Returns
- An object containing the status of the server's response and a JSON message.

#### Example
```javascript
const errorReport = await reportError({ errorType: "RuntimeError", details: "Something went wrong" });
console.log(errorReport);
```

### `addeventlistener(element, event, callback)`

#### Description
Adds an event listener to the specified HTML element.

#### Parameters
- `element` (HTMLElement): The HTML element.
- `event` (string): The event type.
- `callback` (CallableFunction): The callback function to be executed on the event.

#### Example
```javascript
const button = getId("myButton");
addeventlistener(button, "click", () => {
    console.log("Button clicked!");
});
```

### `getId(id)`

#### Description
Simplifies `document.getElementById` by returning an HTML element based on its ID.

#### Parameters
- `id` (string): The ID of the HTML element.

#### Returns
- An HTML element or `null` if not found.

#### Example
```javascript
const myElement = getId("myElementId");
console.log(myElement);
```

### `getattribute(element, attribute)`

#### Description
Gets the attribute value of an HTML element.

#### Parameters
- `element` (HTMLElement): The HTML element.
- `attribute` (string): The attribute name.

#### Returns
- The attribute value.

#### Example
```javascript
const value = getattribute(myElement, "data-custom");
console.log(value);
```

### `setattribute(element, key, value)`

#### Description
Sets the attribute of an HTML element.

#### Parameters
- `element` (HTMLElement): The HTML element.
- `key` (string): The attribute key.
- `value` (string): The attribute value.

#### Example
```javascript
setattribute(myElement, "data-custom", "new value");
```

### `getLocalStorage(key)`

#### Description
Simplifies `localStorage.getItem` by getting the value associated with the given key.

#### Parameters
- `key` (string): The key to retrieve from `localStorage`.

#### Returns
- The stored value or `null` if not found.

#### Example
```javascript
const storedValue = getLocalStorage("myKey");
console.log(storedValue);
```

### `setLocalStorage(key, value)`

#### Description
Simplifies `localStorage.setItem` by setting the value for the given key.

#### Parameters
- `key` (string): The key to store in `localStorage`.
- `value` (string): The value to associate with the key.

#### Example
```javascript
setLocalStorage("myKey", "myValue");
```

### `main()`

#### Description
Main function that initializes and sets up various event listeners and functionality.

#### Example
```javascript
if (document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", main);
else
    main();
```

### `checkLoginState()`

#### Description
Checks the login state, authenticates the user, and performs necessary actions.

#### Example
```javascript
checkLoginState();
```

### `listenOnLogout(id)`

#### Description
Listens for user logout and performs logout-related actions.

#### Parameters
- `id` (string): The user ID.

#### Returns
- An object representing the logout response.

#### Example
```javascript
const logoutResponse = await listenOnLogout("user123");
console.log(logoutResponse);
```

### `getVideoRecommendations()`

#### Description
Fetches video recommendations.

#### Returns
- An array of video recommendations.

#### Example
```javascript
const recommendations = await getVideoRecommendations();
console.log(recommendations);
```

### `activateButtonElements()`

#### Description
Activates various button elements.

#### Example
```javascript
activateButtonElements();
```

### `getEmail(id)`

#### Description
Fetches the email associated with the given user ID.

#### Parameters
- `id` (string): The user ID.

#### Returns
- The user's email.

#### Example
```javascript
const userEmail = await getEmail("user123");
console.log(userEmail);
```

### `setOverlay()`

#### Description
Sets up an overlay with confirmation buttons.

#### Example
```javascript
setOverlay();
```

### `enableVerificationButton()`

#### Description
Enables the verification button.

#### Returns
- An object indicating success or failure.

#### Example
```javascript
const enableResult = enableVerificationButton();
console.log(enableResult);
```

### `authenticateUserEmail(email)`

#### Description
Authenticates the user based on the provided email.

#### Parameters
- `email` (string): The user's email.

#### Returns
- An object representing the authentication response.

#### Example
```javascript
const authResponse = await authenticateUserEmail("user@example.com");
console.log(authResponse);
```

### `main()`

#### Description
Main function for handling the page's initialization and functionality.

#### Example
```javascript
if (document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", main);
else
    main();
```

### `main()`

#### Description
Main function for handling the page's initialization and functionality.

#### Example
```javascript
main();
```

### `sendCodeFrm.addEventListener()`

#### Description
Event listener for submitting the user's email for authentication and code verification.

#### Example
```javascript
sendCodeFrm.addEventListener("submit", (e) => {
    // Logic for sending and verifying code
});
```

### `verifyCodeWithEmailAndCode(email, code)`

#### Description
Verifies the provided code with the user's email.

#### Parameters
- `email` (string): The user's email.
- `code` (string): The verification code.

#### Returns
- An object representing the verification response.

#### Example
```javascript
const verificationResult = await verifyCodeWithEmailAndCode("user@example.com", "123456");
console.log(verificationResult);
```
---

# Video Platform JavaScript Functions

This repository contains a set of JavaScript functions used in a video platform. These functions handle various tasks such as fetching user profiles, reporting errors, managing event listeners, and interacting with the user interface.

## Table of Contents
- [Functions](#functions)
  - [getUserProfile](#getuserprofile)
  - [reportError](#reporterror)
  - [addeventlistener](#addeventlistener)
  - [getId](#getid)
  - [getattribute](#getattribute)
  - [setattribute](#setattribute)
  - [getLocalStorage](#getlocalstorage)
  - [setLocalStorage](#setlocalstorage)
  - [main](#main)
  - [getVideoRecommendations](#getvideorecommendations)
  - [checkLoginState](#checkloginstate)
  - [listenOnLogout](#listenonlogout)
  - [getEmail](#getemail)
  - [activateButtonElements](#activatebuttonelements)
  - [twof_a](#twof_a)
  - [private](#private)
  - [manage](#manage)
  - [download](#download)
  - [watchHistory](#watchhistory)
  - [searchHistory](#searchhistory)
  - [deleteButton](#deletebutton)
  - [deactivate](#deactivate)
  - [setOverlay](#setoverlay)
  - [indexMain](#indexmain)
  - [fetchVideos](#fetchvideos)
  - [sendVerificationCodeViaEmail](#sendverificationcodeviaemail)
  - [verifyCodeWithEmailAndCode](#verifycodeWithEmailAndCode)
  - [getPastTime](#getpasttime)
  - [Tview](#tview)
  - [requestPasswordChange](#requestpasswordchange)

## Functions

### getUserProfile
```javascript
/**
 * Fetches the user profile
 * @param {string} id 
 * @returns {object}
 */
async function getUserProfile(id) {
  // Implementation
}
```

### reportError
```javascript
/**
 * Reports an error that was encountered at runtime to be logged.
 * So a fix can be made.
 * @param {JSON} reportObject 
 * @returns {object} The status of the post request from the server as well as a JSON.
 */
async function reportError(reportObject) {
  // Implementation
}
```

### addeventlistener
```javascript
/**
 * @param {HTMLElement} element 
 * @param {HTMLElementEventMap} event 
 * @param {CallableFunction} callback 
 */
function addeventlistener(element, event, callback) {
  // Implementation
}
```

### getId
```javascript
/**
 * Simplifies document.getElementById
 * @param {HTMLElement.id} id 
 * @returns {HTMLElement | null}
 */
function getId(id) {
  // Implementation
}
```

### getattribute
```javascript
/**
 * Gets the attribute of an element
 * @param {HTMLElement} element 
 * @param {HTMLElement.attribute} attribute 
 */
function getattribute(element, attribute) {
  // Implementation
}
```

### setattribute
```javascript
/**
 * Sets the attribute of an element
 * @param {HTMLElement} element
 * @param {HTMLElement.attributeKey} key
 * @param {HTMLElement.attributeValue} value
 */
function setattribute(element, key, value) {
  // Implementation
}
```

### getLocalStorage
```javascript
/**
 * Simplifies localStorage.getItem
 * @param {WindowLocalStorage.key} key 
 */
function getLocalStorage(key) {
  // Implementation
}
```

### setLocalStorage
```javascript
/**
 * Simplifies localStorage.setItem
 * @param {WindowLocalStorage.key} key
 * @param {WindowLocalStorage.value} value
 */
function setLocalStorage(key, value) {
  // Implementation
}
```

### main
```javascript
// Main function for initializing the application
function main() {
  // Implementation
}
```

### getVideoRecommendations
```javascript
/**
 * Fetches video recommendations
 * @returns {object}
 */
async function getVideoRecommendations() {
  // Implementation
}
```

### checkLoginState
```javascript
/**
 * Checks the login state of the user and performs related actions
 */
function checkLoginState() {
  // Implementation
}
```

### listenOnLogout
```javascript
/**
 * Listens for user logout and performs necessary actions
 * @param {string} id
 * @returns {object}
 */
async function listenOnLogout(id) {
  // Implementation
}
```

### getEmail
```javascript
/**
 * Fetches user email
 * @param {string} id
 * @returns {object}
 */
async function getEmail(id) {
  // Implementation
}
```

### activateButtonElements
```javascript
// Activates button elements
function activateButtonElements() {
  // Implementation
}
```

### twof_a
```javascript
// Event listener for two-factor authentication button
function twof_a(twof_a) {
  // Implementation
}
```

### private
```javascript
// Event listener for private button
function private(private) {
  // Implementation
}
```

### manage
```javascript
// Event listener for manage button
function manage(manage) {
  // Implementation
}
```

### download
```javascript
// Event listener for download button
function download(download) {
  // Implementation
}
```

### watchHistory
```javascript
// Event listener for watch history button
function watchHistory(watchHistory) {
  // Implementation
}
```

### searchHistory
```javascript
// Event listener for search history button
function searchHistory(searchHistory) {
  // Implementation
}
```

### deleteButton
```javascript
// Event listener for delete button
function deleteButton(btndeleteButton) {
  // Implementation
}
```

### deactivate
```javascript
// Event listener for deactivate button
function deactivate(deactivate) {
  // Implementation
}
```

### setOverlay
```javascript
// Sets an overlay with confirmation buttons
function setOverlay() {
  // Implementation
}
```

### indexMain
```javascript
// Main entry point for the index page
function indexMain() {
  // Implementation
}
```

### fetchVideos
```javascript
/**
 * Fetches videos for the user
 * @param {string} userId
 * @returns {object}
 */
async function fetchVideos(userId) {
  // Implementation
}
```

### sendVerificationCodeViaEmail
```javascript
/**
 * Requests a verification code via email
 * @param {string} email
 * @returns {object}
 */
async function sendVerificationCodeViaEmail(email) {
  // Implementation
}
```

### verifyCodeWithEmailAndCode
```javascript
/**
 * Verifies a code with email and code
 * @param {string} email
 * @param {string} code
 * @returns {object}
 */
async function verifyCodeWithEmailAndCode(email, code) {
  // Implementation
}
```

### getPastTime
```javascript
/**
 * Gets the past time from a given timestamp
 * @param {Date} time
 * @returns {string}
 */
function getPastTime(time) {
  // Implementation
}
```

### Tview
```javascript
/**
 * Represents a video view template


 * @class
 * @param {object} videoObject
 */
class Tview {
  constructor(videoObject) {
    this.videoObject = videoObject;
  }

  /**
   * Renders the video object template
   * @returns {HTMLElement}
   */
  renderObjectTemlate() {
    // Implementation
  }
}
```

### requestPasswordChange
```javascript
/**
 * Requests a password change for the user
 * @param {string} current_password
 * @param {string} new_password
 * @returns {object}
 */
async function requestPasswordChange(current_password, new_password) {
  // Implementation
}
```
