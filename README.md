# Group 6 - DubSpace
***Members: Ken Huang, Nic Chin, Benny Po***

## Project Description
In this project, our target audience is mostly UW students. We envision that students who are looking to get other students’ opinions on classes they are interested in taking, and gain additional insight into the class from students who have previously taken the class will find our application useful. Students who wish to share their experience on a course they took will also likely have an interest in using our application.

Our audience may want to use our application, as it acts like a central repository or resource where students can easily access and view information about different classes. For instance, instead of going to various individual sites like Reddit, RateMyProfessors, and question sites like Quora, students can just visit this app to get all that information in one place.

As fellow UW students, we are the ones taking the classes and looking all over the internet for reviews on the curriculum, courseload, the professor, and other general criticisms. It takes time for a user to look through all the different sites that may host this information, and for some classes and professors, they might not even have this information stored yet. Making a centralized platform for class reviews at UW will immensely help users researching and looking for classes to take. As developers, we want to be able to help UW students save their time, and a single platform like this will enable that.

## Technical Description
![Architectural_Diagram](img/architectural_diagram.png)

## User Stories
Priority | User | Description | Technical Implementation
--- | --- | --- | ---
P0 | As a student user | I want to be able to login to an account using my uw email. | Implement an user authorization/login system using Microsoft auth. Have client side code that allows users to view posts and view an account tab. Use Node.js server to handle authentication and authorization Then have a mongoDB database of a user’s posts.
P0 | As a student user | I want to post reviews about classes I have taken in the past. | Create an endpoint on Node.js server to handle review posts. Allow users to input details such as class name, professor and review comments. Store the review data in a MongoDB database and associate it with the user’s profile.
P0 | As a student user | I want to be able to read reviews from other students about classes I am potentially interested in taking. | Implement an endpoint to fetch class reviews based on the user request. Allow users to view reviews for the class they want and fetch data from the MongoDB database and send it to the client side code for display.
P1 | As a student user | I want to be able to have a user profile. | Upon successful authentication, create a user profile in a MongoDB user database. Include fields such as username, email and other relevant information.
P1 | As a student user | I want to be able to leave a rating (0 to 5 stars) on how I felt overall about a class. | Add a rating field to MongoDB schema for class reviews and create an endpoint on node js. Allow users to include a rating along with the reviews and run it through an average rating calculation function.
P1 | As a student user | I want to be able to leave a like on a post. | Add a likes field to MongoDB schema for class reviews and create an endpoint on node js. Allow users to view how many likes a post has on the client side.
P2 | As a course administrator | I want to be able to leave a short description about my course for potential students. | Extend MongoDB schema to allow for a course description field. Create a new endpoint on Node.js server and add client side code to display the descriptions.
P2 | As a teaching assistant or faculty or student user | I want to be able to like posts and view top rated posts or filter by the amount of likes a post has. | Add a likes field to MongoDB schema and create an api endpoint for likes on node js server. Then add a frontend icon that displays a button to like a post and a number that displays number of likes.
P3 | As a student user | I want to be able to view the top internet searches for specific queries. | Access various website’s REST API endpoints to gather the most relevant posts/articles (Reddit, etc.).
P3 | Student and faculty users | I want to be able to friend or follow other user profiles. | Add to the user profile mongoDB schema to add a friends or followers field. Create an API endpoint for friends and following with routes for sending/accepting follow requests.

##  Endpoints
- Endpoint: `posts/post`
  - Description: If search parameter is not included, provide all information from the post table, sorted in descending order of date.
  - Request Type: `GET`
  - Response Type: JSON
- Endpoint: `/posts/post?search=`
  - Description: If search parameter is included, provide all ids of the posts matching the term passed in the search query parameter, sorted in ascending order of ids.
  - Request Type: `GET`
  - Response Type: JSON
- Endpoint: `/posts/user/:user`
  - Description: Responds with a descending order date list of information from the post table based on :user.
  - Request Type: `GET`
  - Response Type: JSON
- Endpoint: `/posts/hashtag/:tag`
  - Description: Responds with a descending order date list of information from the post table based on :tag.
  - Request Type: `GET`
  - Response Type: JSON
- Endpoint: `/posts/likes`
  - Description: Increment the current value of likes of the given id by 1 and respond with the new value.
  - Request Type: `POST`
  - Response Type: Plain Text
- Endpoint: `/posts/new`
  - Description: Adds a new entry to the post table and respond with the newly added information.
  - Request Type: POST
  - Response Type: JSON

## Data Schemas
- userSchema
  - Username
  - Name
  - Pronouns
  - Email
  - Major
  - Year

- postSchema
  - Username
  - Post
  - Hashtag
  - Rating
  - Likes
  - Date
