import app from "./app";
import Api from "./client";

const PORT = 8000;

const isEntryPoint = () => {
  return require.main === module;
};

if (isEntryPoint()) {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
}

export default Api;
