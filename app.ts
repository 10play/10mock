import express, { Router } from 'express';
import { Method, AddRouteBody } from "./types"

const { PROXY_URL } = process.env

let mockHandlers: any = {};
const adminPath = '/_routes'
const adminPathDeleteAll = `${adminPath}/all`

const getRouteKey = (method: Method, path: string) => `[${method}]${path}`

const extractRouteKey = (route: string) => {
  const splittedRoute = route.split("]")
  const path = splittedRoute[1];
  const method = splittedRoute[0].split("[")[1]
  return ({ path, method })
}


const removeMiddlewares = (route: any, i: number, routes: any, method: Method, path: string) => {
  const existingMock = mockHandlers[getRouteKey(method, path)];
  if (existingMock && existingMock.middleware === route.handle) {
    console.log("deleted", path);
    routes.splice(i, 1);
  }
  if (route.route)
    route.route.stack.forEach((route: any, i: number, routes: any) => removeMiddlewares(route, i, routes, method, path));
}

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  // TODO: That should log only route that not related to adminPath
  if (req.url !== adminPath && req.url !== adminPathDeleteAll) {
    console.log('Got request:', req.url)
  }
  next();
})

app.get('/', (req, res) => res.send('hello'));

app.get(adminPath, (req, res) => {
  const { method: queryMethod, path: queryPath } = req.query;
  if (queryMethod && queryPath) {
    const routeKey = getRouteKey(queryMethod as Method, queryPath as string);
    if (!mockHandlers[routeKey]) {
      console.log('mock not found');
      return res.status(500).json({ error: 'mock not found' });
    }
    const { count, method, path, stubRequests, response } = mockHandlers[routeKey];
    return res.json({
      count, method, path, stubRequests, response
    });
  }
  return res.json(Object.keys(mockHandlers).map(routeKey => {
    const { count, method, path, stubRequests } = mockHandlers[routeKey];
    return {
      count, method, path, stubRequests
    }
  }))
});

app.post(adminPath, (req, res) => {
  const {
    method,
    path,
    response,
  }: AddRouteBody = req.body
  console.log(`New mock for route: [${method}]${path}`)
  if (!method || !path || !response) {
    return res.status(500).json('Should provide : !method || ! path || !response')
  }

  const routes = app._router.stack;
  routes.forEach((route: any, i: number, routes: any) => removeMiddlewares(route, i, routes, method, path));

  const newRouteKey = getRouteKey(method, path);

  mockHandlers[newRouteKey] = {
    count: 0,
    method,
    path,
    response,
    stubRequests: [],
    middleware: (req: any, res: any) => {
      mockHandlers[newRouteKey].count += 1;
      mockHandlers[newRouteKey].stubRequests.push({ params: req.params, query: req.query, body: req.body, headers: req.headers });
      if (PROXY_URL) {
        return res.status(301).redirect(PROXY_URL + path)
      }
      console.log(`Mock [${method}]${path} response with body:`, JSON.stringify(response.body, null, 2))
      return res.status(response.status || 200).json(response.body)
    }
  }

  app[method](path, mockHandlers[newRouteKey].middleware);
  return res.json({ success: 'added' })
});




app.delete(adminPath, (req, res) => {
  const { path, method } = req.body
  const routes = app._router.stack;
  routes.forEach((route: any, i: number, routes: any) => removeMiddlewares(route, i, routes, method, path));
  return res.json({ success: 'canceled' })
});


app.delete(adminPathDeleteAll, (req, res) => {
  try {
    for (const handler in mockHandlers) {
      const { method, path } = extractRouteKey(handler)
      const routes = app._router.stack;
      //@ts-ignore
      routes.forEach((route: any, i: number, routes: any) => removeMiddlewares(route, i, routes, method, path));
    }
    return res.json({ success: true })
  } catch (e) {

    res.status(400).json({ error: e.message })
  }
})

export default app;