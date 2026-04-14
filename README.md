# Bondeappen 2.0 / The farmers app
A web platform aimed to help farmers find and organize information about important regulations and requirements.

-- NEW VERSION

## Project Overview, first hand-in SE_19
- 3 static HTML pages linked to each other:
    - Landing Page (index.html)
    - About Page (about.html)
    - Legal Page (legal.html)
- Styled using CSS (style.css)
- Responsive layout

## Updated overview, second hand-in SE_19
- 2 pages added:
    - news.ejs: Overview page of all news articles
        - Currently connected to a mock article database (data/news.js)
    - article.ejs: function in backend allows users to access different articles with different URLs. 
- Contact-form added to about-page:
    - Allows users to write a message, submit name, email, and phone nr. 
    - Logger function (middlewares/logger.js) ensures request from user is posted in server console.

## Updated overview, third hand-in SE_19
- Several features added:
    - Signing up as a user (no password hashing or anything yet, just for demonstration purposes):
        - Sign Up page: Allowing users to create profiles
        - Login page: Allowing users to log in using their user data
            - New .css file (login.css)
            - .ejs templates: login-head.ejs, login-header.ejs
            - Connected to MongoDB, using /models/users.js model
    - Profile page: Select options to register new certificate, see list of all certificates, or read latest news
    - Certificates:
        - Register new certificates
        - See list of all certificates
            - Connected to MongoDB Community Edition
            - Users can create, read, update and delete records (CRUD)

## Updated overview, fourth hand-in SE_19:
- Started new project and new github repo, lost the overview a bit
    - After learning more and more, wanted a fresh start
- Removed news pages, focus only on certificate funcionality and user creation/login
    - Now users can log in, stay logged in, create, read, delete and edit certificates
    - Users only have access to their own certificates
    - When logged in, users receive a cookie in the browser
        - I have middleware function that checks each get request to continuously verify the user
        - When user logs out, they get sent a replacement cookie which replaces the former cookie and expires immediately


## How to run 
- NB: Always make sure that the dependencies you install show up in the package.json file
1. Ensure you have Node.js installed --> node -v
2. Initialize npm --> npm init
3. Install Express --> npm install express
4. To start server --> npm run start
    - Also install nodemon to keep server running and auto update when saving --> npm install nodemon --save-dev
    - To start nodemon, run --> npm run dev
    - To stop server --> ctrl + c
5. Install EJS templating engine --> npm install ejs
6. Install mongodb --> npm install mongodb
7. Install mongoose --> npm install mongoose
    - I use MongoDB Atlas as an online database
    - I have one cluster called "new-project" with two collections, "certificates" and "users"
    - After signing up to MongoDB Atlas, on the dash, you can click "connect" -> "connect to driver"
    - Find the connection string, keep until next step, step 8 below
8. Install env --> npm install dotenv
    - Important: add .env to .gitignore file -> This file is for adding secret keys and code, you do not want it public on the internet
    - After installing .env, create a .env file
        - Add the following: 
            1. MONGODB_URI=xyz
            - Paste connection string here, make sure to add your db key to the link
            2. PORT=xyz
            - Add whichever port you are using
9. Install eslint for finding style errors
10. Install bcrypt --> npm install bcrypt
    - Used to hash passwords before storing them to db
11. Install jwsonwebtoken --> npm install jsonwebtoken
    - Use it to create the cookie and for user authentication
12. Install validator for email validation --> npm install validator
    - Library used to validate whether an email actually exists
13. Install cookie-parser --> npm install cookie-parser
    - Needed to use the cookie

## Features (goal down the line)
- Personalized dashboard to store relevant files, deadlines, news feature, blog

## Author
Developed by Maja Lie for SE modules SE_01, SE_19, SE_14, SE_10.