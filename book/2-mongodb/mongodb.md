# MongoDB

In the example code that follows we will be persisting data using MongoDB.
This choice is strictly based on ease of setup and use.
It is not the best choice for every application.
You should also consider using PostgreSQL and other databases.

MongoDB is a NoSQL database implemented in C++.
It stores documents in collections. Documents are JSON objects.
They are stored in a binary JSON format (BSON).

All documents have an id stored in a property named `_id`.
This is guaranteed to be unique within a collection.

Each collection can have multiple indexes to make queries faster.
Indexes are implemented as B-tree data structures.

There is no need to define a schema that describes
the properties of the document objects.
This speeds up development when the structure changes often
since no schema changes are required.
It also allows properties present in the objects of a collection to vary.
But typically all documents in the same collection have similar properties.

A document property value can be the id of another object,
even in a different collection.
This supports associations between documents.

The free version of MongoDB is called the "Community Edition".

To install the Community Edition on other platforms,
browse <https://docs.mongodb.com/manual/installation/>,
click "Install MongoDB Community Edition" in the left nav.,
click the "Install on" link for your platform (Linux, macOS, or Windows),
and follow the instructions.

To start the MongoDB server, ...
To stop the MongoDB server, ...

MongoDB Shell is a kind of REPL that supports using
JavaScript to interact with a MongoDB database.
To start it, enter `mongo`.
To get help, enter `help`.
To exit, enter `exit` or press ctrl-d.

To see a list of the current databases, enter `show dbs`.

To use a specific database, enter `use {db-name}`.

New databases are created automatically when a document is added to a collection.
For example:

```js
use animals
db.dogs.insert({name: 'Dasher', breed: 'Whippet'})
```

To list all the documents in a collection,
enter `db.{coll-name}.find()`.

To delete a collection, enter `db.{coll-name}.drop()`.

To delete the current database, enter `db.dropDatabase()`.

To add a document to a collection, enter `db.{coll}.insert(obj)`.
For example, `db.dogs.insert({breed: 'Whippet', name: 'Dasher'})`.

- to **get first** 20 documents in a collection,
  `db.{coll}.find()`
  - ex. `db.dogs.find()`
- to **get all objects that match criteria**,
  `db.{coll}.find(criteria)`
  - ex. `db.dogs.find({breed: 'whippet')`
  - ex. `db.tjs.find({lastName: {$gt: 'H'}})`
- to **get number of documents** in a collection,  
  `db.{coll}.find().count() or db.{coll}.find().length()`
- to **find document in collection**,
  `db.{coll}.findOne(query)`
  - a query is just a JavaScript object where
    the keys are document property names and
    the values are document property values
- to **delete a document from collection**,  
  `db.{coll}.deleteOne(query)`
- to **delete documents from collection**,  
  `db.{coll}.deleteMany(query)`
- to **update a document in a collection**,  
  `db.{coll}.updateOne(query, { $set: {key: value, key: value, ...} })`
- to **replace a document in a collection**,  
  `db.{coll}.replaceOne(query, newDocument)`
- to **add an index** to a collection,  
  `db.{coll}.createIndex({ {prop-name}: 1});`
  - 1 means ascending order, -1 means descending

### Joins

Joins can be performed across collections using the `aggregate` method
and the `$lookup` operator.

For example, suppose we have a collection of colors
and a collection of people that have a favorite color.
We would like to determine for each color which people like it.

The following Mongo shell commands populate the `color` collection:

```js
db.colors.insert({_id: 1, name: 'red'});
db.colors.insert({_id: 2, name: 'orange'});
db.colors.insert({_id: 3, name: 'yellow'});
db.colors.insert({_id: 4, name: 'green'});
db.colors.insert({_id: 5, name: 'blue'});
db.colors.insert({_id: 6, name: 'purple'});
```

The following Mongo shell commands populate the `people` collection.

```js
db.people.insert({name: 'Mark', favoriteColor: 3});
db.people.insert({name: 'Tami', favoriteColor: 5});
db.people.insert({name: 'Amanda', favoriteColor: 6});
db.people.insert({name: 'Jeremy', favoriteColor: 3});
```

The following Mongo shell command returns a cursor
for iterating over documents where data
from the documents above are combined.
It will return a set of documents that are
similar to the documents in the `colors` collection,
but they will have an added property `people`
that is an array of documents from the `people` collection
whose `favoriteColor` matches.

```js
db.colors.aggregate([
  {
    $lookup: {
      from: 'people',
      localField: '_id',
      foreignField: 'favoriteColor',
      as: 'people'
    }
  }
]);
```

The documents returned are shown below:

```json
{ "_id" : 1, "name" : "red", "people" : [ ] }
{ "_id" : 2, "name" : "orange", "people" : [ ] }
{ "_id" : 3, "name" : "yellow", "people" : [ { "_id" : ObjectId("5daa32fc3bed06a14673ca80"), "name" : "Mark", "favoriteColor" : 3 }, { "_id" : ObjectId("5daa32fd3bed06a14673ca83"), "name" : "Jeremy", "favoriteColor" : 3 } ] }
{ "_id" : 4, "name" : "green", "people" : [ ] }
{ "_id" : 5, "name" : "blue", "people" : [ { "_id" : ObjectId("5daa32fc3bed06a14673ca81"), "name" : "Tami", "favoriteColor" : 5 } ] }
{ "_id" : 6, "name" : "purple", "people" : [ { "_id" : ObjectId("5daa32fc3bed06a14673ca82"), "name" : "Amanda", "favoriteColor" : 6 } ] }
```

The `localField` property value can be an array in which case the
`foreignField` is checked for a match with any of the array values.

This does not work if the "from" collection is sharded.

Can you specify the properties from each collection to be included in the result?
See the `$replaceRoot` and `$mergeObject` operators.
It is probably easier to process the result with JavaScript
to create the kind of objects desired.

To join on multiple properties,
use the `pipeline` property of `$lookup`
combined with the `$match` operator.
