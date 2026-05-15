import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({ override: true });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`ResumeIQ API running on http://localhost:${port}`);
});
