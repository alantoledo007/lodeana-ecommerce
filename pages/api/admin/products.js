import { Resolver } from "@lib/collections";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

const resolver = new Resolver("products");

async function handler(req, res) {
  switch (req.method) {
    case "GET": {
      if (req.query._id) {
        return one(req, res);
      }
      return list(req, res);
    }

    case "POST": {
      return add(req, res);
    }

    case "PUT": {
      return update(req, res);
    }

    case "DELETE": {
      return remove(req, res);
    }
  }
}

async function one(req, res) {
  return resolver.one({}, req, res);
}

async function list(req, res) {
  return resolver.list({ find: {} }, req, res);
}

async function add(req, res) {
  return resolver.add(req, res);
}

async function update(req, res) {
  return resolver.update(req, res);
}

async function remove(req, res) {
  return resolver.remove(req, res);
}

export default handler;
