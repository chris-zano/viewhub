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