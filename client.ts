import { Method, Route } from "./types";

const API_URL = (port: number | string = 8000) => `http://localhost:${port}`;
const ADMIN_PATH = "/_routes";
global.fetch = require("node-fetch");

export default class Api {
  baseUrl: string;
  adminPath: string;
  addedRoutes: Route[];
  current: Route;
  constructor(port?: number | string) {
    this.baseUrl = API_URL(port);
    this.adminPath = ADMIN_PATH;
    this.addedRoutes = [];
    this.current = {};
  }

  nock(path: string) {
    this.current.path = path;
    return this;
  }

  method(method: Method) {
    this.current.method = method;
    return this;
  }

  status(status: number) {
    if (this.current?.response) {
      this.current.response.status = status;
    } else {
      this.current.response = { status };
    }
    return this;
  }

  async send(response: any) {
    if (response) {
      if (this.current?.response) {
        this.current.response.body = response;
      } else {
        this.current.response = { body: response, status: 200 };
      }
    }
    const res = await this._addRoute(this.current);
    const { method, path } = this.current;
    this.current = {};
    if (!res.error) {
      const getStats = () => this._getStats(method!, path!);
      return {
        getStats,
        getCount: async () => {
          const stats = await getStats();
          return stats.count;
        },
        getStubRequests: async () => {
          const stats = await getStats();
          return stats.stubRequests;
        },
        deleteRoute: () => {
          return this._handleRoutes({ method, path }, "delete");
        },
      };
    }
    return res;
  }

  async _getStats(method: Method, path: string) {
    const response = await fetch(
      `${this.baseUrl + this.adminPath}?method=${method}&path=${path}`,
      {
        method: "GET",
      }
    );
    return response.json();
  }

  async _handleRoutes(data: any, method: Method) {
    const response = await fetch(this.baseUrl + this.adminPath, {
      method: method.toLowerCase(),
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async _addRoute(routeData: any) {
    if (!routeData) {
      return { error: "Data not provided" };
    }
    try {
      const { method, path } = routeData;
      const response = await this._handleRoutes(routeData, "post");
      this.addedRoutes.push({ method, path });
      return response;
    } catch (e) {
      return { error: e.message };
    }
  }

  async finishTest() {
    try {
      const response = await fetch(`${this.baseUrl + this.adminPath}/all`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (e) {
      return { error: e.message };
    }
  }

  _removeQuery(route: string) {
    return route.split("?")[0];
  }
}
