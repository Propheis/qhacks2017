# myEats Grocery Inventory App
This web app helps you keep track of what grocery items you have in your house as well as to find new & interesting recipes based on the ingredients you have.

## Installation
To install this web app, make sure you have [NodeJS](http://nodejs.org), [NPM](http://npmjs.com/), and [CouchDb](http://couchdb.apache.org/) installed.

```
git clone https://github.com/devenbernard/qhacks2017.git
cd qhacks2017
npm install
```

### Configuration

You will also need an API key from [Edamam.com](https://developer.edamam.com/). Once you have an API key, create a file `Config.js` at `qhacks2017/Config.js`: 

```
module.exports = {
  dbUrl: "http://localhost:5984",
  edamamAPI: {
    app_id: "<your_app_id>",
    app_key: "<your_app_key>"
  }
};
```

## Starting the App
To start the app, make sure you have CouchDB running on localhost (see [CouchDB docs](http://docs.couchdb.org/en/2.0.0/)).

```
npm start
```

Point your browser to `http://localhost:3000/api/seed`. This will populate the database with sample data. You can visit this URL any time to delete and recreate the database with sample data.

## Visiting the app
Visit the app at [http://localhost:3000](http://localhost:3000)