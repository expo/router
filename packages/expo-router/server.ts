export type Request = import("node-fetch").Request;

export type Response = import("node-fetch").Response & {
  json: (data: any) => Response;
};

export type RequestHandler = (request: Request) => Response;
