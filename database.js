var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE movie (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text UNIQUE, 
            description text, 
            year number, 
            duration text, 
            rating text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO movie (title, description, year, duration, rating) VALUES (?,?,?,?,?)'
                db.run(insert, ["Titanic", "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", 1997, "194", "7.9"])
            }
        });  
    }
});


module.exports = db