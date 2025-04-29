# Home Rental

This project implements a role-based system with three user types: Landlord, Tenant, and Agency. Landlords can post properties and create contracts with Tenants. When a contract is established, a Tenant account is automatically generated using the contract information, allowing the Tenant to log in, view their contract, and access payment details. Agencies have the ability to create and manage multiple Landlord accounts, handle property listings, and oversee contracts. They primarily assist Landlords who are unable to manage their properties directly. The system is designed to streamline property management and automate key processes for all user roles.

**Live Server Link:** https://rafik42-server.vercel.app/

## Technology used

1.  Backend: Prisma, Express.js, TypeScript
2.  Database: MongoDB
3.  Tools: cloudinary, Zod, EsLint


## Project Set-Up Instructions

#### 1. Clone the Repository

```
https://github.com/shahinexy/Home-Rental-Client.git
```

#### 2. Install Dependencies

```
npm install
```

#### 3. Set up Environment variables, create an .env file in the root directory, and include the following

```
NEXT_PUBLIC_BASE_URL="https://example.com"
GOOGLE_CLIENT_ID=622190425631-hogtursgu9fpvsf.......
GOOGLE_CLIENT_SECRET=GOCSPX-CVXTbA5.........
NEXTAUTH_SECRET=A3F9C7D.......
```

#### 4. Run the server in development mode

```
npm run dev
```
