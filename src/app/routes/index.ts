import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AgencyRoutes } from "../modules/Agency/agency.routes";
import { LandlordRoutes } from "../modules/Landlord/landlord.routes";
import { TenantRoutes } from "../modules/Tenant/tenant.routes";
import { PropertyRoutes } from "../modules/Property/property.routes";
import { ContractRoutes } from "../modules/Contract/contract.routes";
import { MaintenanceRoutes } from "../modules/Maintenance/maintenance.routes";

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
    path: "/landlord",
    route: LandlordRoutes,
  },
  {
    path: "/tenant",
    route: TenantRoutes,
  },
  {
    path: "/properties",
    route: PropertyRoutes,
  },
  {
    path: "/contract",
    route: ContractRoutes,
  },
  {
    path: "/maintenance",
    route: MaintenanceRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
