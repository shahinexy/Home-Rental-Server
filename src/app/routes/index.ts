import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AgencyRoutes } from "../modules/Agency/agency.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/agency",
    route: AgencyRoutes,
  },
  {
    path: "/landloard",
    route: AgencyRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
