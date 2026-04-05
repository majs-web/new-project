# Bondeappen 2.0 / The farmers app
A web platform aimed to help farmers find and organize information about important regulations and requirements.

-- NEW VERSION -> old project got a bit out of hand.

?## Project Overview, first hand-in SE_19
- 3 static HTML pages linked to each other:
    - Landing Page (index.html)
    - About Page (about.html)
    - Legal Page (legal.html)
- Styled using CSS (style.css)
- Responsive layout

?## Updated overview, second hand-in SE_19
- 2 pages added:
    - news.ejs: Overview page of all news articles
        - Currently connected to a mock article database (data/news.js)
    - article.ejs: function in backend allows users to access different articles with different URLs. 
- Contact-form added to about-page:
    - Allows users to write a message, submit name, email, and phone nr. 
    - Logger function (middlewares/logger.js) ensures request from user is posted in server console.

?## Updated overview, third hand-in SE_19
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


## How to run
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
8. Install env --> npm install dotenv
    - Important: add .env to .gitignore file
9. Install eslint for finding style errors
10. Install supertest
11. Install bcrypt
12. install jwsonwebtoken

?## Features (goal down the line)
- Personalized dashboard to store relevant files, deadlines

## Author
Developed by Maja Lie for SE modules SE_01, SE_19, SE_14, SE_10.