import {
  addDocument,
  deleteDocument,
  getDocuments,
  getOneDocument,
  updateDocument,
} from "@lib/mongodb";
import { ObjectId } from "mongodb";

export function onError(error) {
  return {
    message: new Error(error).message,
    success: false,
  };
}

export function onSuccess(action, collection) {
  return {
    message: `The action ${action} on collection ${collection} succeeded.`,
    success: true,
  };
}

const ACTIONS = {
  ADD: "add",
  DELETE: "delete",
  UPDATE: "update",
};

export class Resolver {
  constructor(collection) {
    this.collection = collection;
  }

  one = async (mongoConfig, req, res) => {
    let find = { _id: ObjectId(req.query._id) };
    try {
      const config = {
        collection: this.collection,
        ...mongoConfig,
        find: { ...find, ...mongoConfig.find },
      };
      const item = await getOneDocument(config);
      res.json({
        message: item,
        success: true,
      });
      return res.status(200).end();
    } catch (error) {
      res.json(onError(error));
      return res.status(500).end();
    }
  };

  list = async (mongoConfig = {}, req, res) => {
    let find = {};
    if (req.query.search) {
      find["$text"] = { $search: `"\"${req.query.search}\""` };
    }
    try {
      const config = {
        collection: this.collection,
        ...mongoConfig,
        find: { ...mongoConfig.find, ...find },
      };
      const items = await getDocuments(config);
      res.json({
        message: items,
        success: true,
      });
      return res.status(200).end();
    } catch (error) {
      res.json(onError(error));
      return res.status(500).end();
    }
  };

  add = async (req, res) => {
    try {
      await addDocument({ collection: this.collection, body: req.body });
      res.json(onSuccess(this.collection, ACTIONS.ADD));
      res.status(200).end();
    } catch (error) {
      res.json(onError(error));
      return res.status(500).end();
    }
  };

  update = async (req, res) => {
    try {
      await updateDocument({ collection: this.collection, body: req.body });
      res.json(onSuccess(this.collection, ACTIONS.update));
      res.status(200).end();
    } catch (error) {
      res.json(onError(error));
      return res.status(500).end();
    }
  };

  remove = async (req, res) => {
    try {
      await deleteDocument({ collection: this.collection, _id: req.body });
      res.json(onSuccess(this.collection, ACTIONS.DELETE));
      res.status(200).end();
    } catch (error) {
      res.json(onError(error));
      return res.status(500).end();
    }
  };
}
