# covid19-supplies-expressjs-backend
 covid19-supplies-expressjs-backend

This is an ExpressJS app that is being created to track medical supply needs due to COVID19 and a place for volunteers and makers to add their inventories. Fulfillment strategies for supply requests are still being discussed.

### Prerequisites
1. MongoDB 4+
2. NodeJS

### Setup
1. Download the repo and run npm install.
2. Once all packages are installed, update the following in app.js to point to your MongoDB instance

app.constants = {
  db: {
    url: 'mongodb://localhost:27017/',
    database: 'covid19'
  }
}

3. Run the command 'npm start' to start the Express App.
4. Access the app via http://localhost:3000/


