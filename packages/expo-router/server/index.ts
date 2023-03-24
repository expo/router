import { Request, Response } from "@expo/server";

export type RequestHandler = (request: Request) => Response;

export { Request, Response };
