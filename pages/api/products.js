import { Resolver } from "@lib/collections";

const resolver = new Resolver("products");

export default async function handler(req, res) {
  switch (req.method) {
    case "GET": {
      if (req.query._id) {
        return one(req, res);
      }
      return list(req, res);
    }
  }
}

async function one(req, res) {
  return resolver.one({ find: { published: true } }, req, res);
}

async function list(req, res) {
  return resolver.list({ find: { published: true } }, req, res);
}
