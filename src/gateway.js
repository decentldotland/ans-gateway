import express from "express";
import cors from "cors";
import axios from "axios";

import { getRecordValue } from "./utils/req.js";

const app = express();

const port = process.env.PORT || 2023;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  try {
  const domain = req.headers.host?.split(".")?.[0];
  const content = await getRecordValue(domain);
  res.setHeader("Content-Type", Object.values(content?.headers)?.[0]);
  res.send(Buffer.from(content?.data, "binary"));
  res.end();
  } catch(error) {
    res.redirect(`https://decent.land`);
    res.end();
  }
});

app.listen(port, async () => {
  console.log(`listening at PORT: ${port}`);
});


