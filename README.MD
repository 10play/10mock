# 10mock

**mockserver** is a lightweight library that will help you mock your APIs
requests fast and easy.

## Installation

10mock can be installed globally :

```bash
npm install -g 10mock

10mock -p 8080
[10mock]: Server is running at http://localhost:8080
```

or as a regular NPM module:

```bash
npm install -D 10mock
npx 10mock

[10mock]: Server is running at http://localhost:8000

```

Available options:
<br/>

1.  -p run the mock server on the specified port.
2.  -x run the mock server as proxy server

10mock also supplies easy to use client:

```bash
import Api from '10mock';
export const api = new Api(optional-port);

```

## 10mock server client usage:

1. api.finishTest() - remove all mocked routes.
2. api.nock(path).method(method).status(status).send(mocked-response);

- create new mocked route &#8594; return object with these entities:
  - getCount &#8594; function thats returns the number of requests sent to this route.
  - getStubRequests &#8594; function thats returns all the requests sent to this route.
  - getStats &#8594; function thats returns getStubRequests and getCount results.
  - deleteRoute &#8594; function thats remove this mocked route.
