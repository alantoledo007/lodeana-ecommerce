import { MongoClient } from "mongodb";
const ObjectId = require("mongodb").ObjectId;

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.DB_NAME;

// check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

// check the MongoDB DB
if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to cluster
  let client = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  let db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}

export async function getOneDocument(config) {
  const { collection, find = {} } = config;
  let { db } = await connectToDatabase();
  let item = await db.collection(collection).findOne(find);
  return JSON.parse(JSON.stringify(item));
}

export async function getDocuments(config) {
  const { collection, find = {}, sort = {} } = config;
  let { db } = await connectToDatabase();
  let items = await db.collection(collection).find(find).toArray();
  return JSON.parse(JSON.stringify(items));
}

export async function addDocument(config) {
  const { collection, body } = config;
  let { db } = await connectToDatabase();
  await db.collection(collection).insertOne(JSON.parse(body));
}

export async function updateDocument(config) {
  const { collection, body } = config;
  let { db } = await connectToDatabase();
  const doc = JSON.parse(body);
  await db.collection(collection).updateOne(
    {
      _id: new ObjectId(doc._id),
    },
    { $set: doc.data }
  );
}

export async function deleteDocument(config) {
  const { collection, _id } = config;
  let { db } = await connectToDatabase();
  await db.collection(collection).deleteOne({
    _id: new ObjectId(_id),
  });
}
