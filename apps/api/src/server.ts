import { json, urlencoded } from "body-parser";
import cors from "cors";
import morgan from "morgan";
import express, { Express } from "express";
import session from "express-session";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(
      session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: "shhhh, very secret",
      }),
    )
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .post("/login", (req, res, next) => {
      // login logic to validate req.body.user and req.body.pass
      // would be implemented here. for this example any combo works

      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err: any) {
        if (err) next(err);

        // store user information in session, typically a user id
        req.session.user = req.body.user;

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err);
          res.redirect("/");
        });
      });
    });

  return app;
};
