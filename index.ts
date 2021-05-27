import app from "./app";
import Api from "./client";
const cors = require("cors");

const PORT = 8000;

const isEntryPoint = () => {
  return require.main === module;
};

app.use(cors());

if (isEntryPoint()) {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
}

export default Api;
