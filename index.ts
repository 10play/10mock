import app from "./app";
import Api from "./client";

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

export default Api;
