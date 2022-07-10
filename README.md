# Ensemble-takehome
### Description
This is the movie API for the Ensemble take home assignament (backend).

## Installation
Change directory to project folder and install with NPM.

```bash
npm install
```

## Usage
Upon the installation, user can run the project and use with the below listed API endpoints.

```bash
npm start
```

## Assignment Technology
The API is built with Node.js and Express.js. 
The database used is SQLite.

## API Endpoints
| Endpoint        | Method           | Description  |
| ------------- |:-------------:|:-----:|
/api/movies | GET | Get all movies
/api/movies?name=*titanic* | GET | Search movies with search term
/api/movies/:id | GET | Get a movie by ID
/api/movies | POST | Create a new movie
/api/movies/:id | PUT | Update a movie
/api/movies/:id | DELETE | Delete a movie
/api/movies/:id/like | POST | Increment movie's vote by 1
/api/movies/:id/dislike | POST | Decrement movie's vote by 1

### Request Body for POST & PUT methods
A request body is needed for creating and updating a movie row.
| Field name        | Type           | Mandatory  |
| ------------- |:-------------:|:-----:|
| "title"      | String           | Mandatory  |
| "description"      | String           | Mandatory  |
| "year"      | Integer           | Mandatory  |
| "duration"      | String           | Mandatory  |
| "rating"      | String           | Mandatory  |

 Example:
 
    {
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
        "year": 2010,
        "duration": "194",
        "rating": "8.8"
    }

## Model
The movie model is:

    {
        id INTEGER PK,
        title TEXT UNIQUE, 
        description TEXT, 
        year NUMBER, 
        duration TEXT, 
        rating TEXT,
        vote NUMBER DEFAULT 0
    }
    
