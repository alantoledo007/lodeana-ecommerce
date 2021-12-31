import { Resolver } from "@lib/collections";

const resolver = new Resolver("categories");

export default async function handler(req, res) {
  switch (req.method) {
    case "GET": {
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

async function list(req, res) {
  resolver.list({ sort: { enabled: -1 } }, req, res);
}

async function add(req, res) {
  resolver.add(req, res);
}

async function update(req, res) {
  resolver.update(req, res);
}

async function remove(req, res) {
  resolver.remove(req, res);
}
