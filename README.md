# Final Project - MONITO

This project is an application which allows tenants and landlords to communicate, share documents and pictures, and make service requests.

### Architecture

- **Frontend**: We'll be using Next.js 13 as the frontend framework to build our web app.
- **Backend**: We'll be using Node.js and Express.js to build the server-side of our app.
- **Database**: We'll be using PostgreSQL as our database management system.

---

### High-Level overview of the different components in our app

- **User Site**: This section of the app is where the tenant can log in, view information about the apartment, and send a service request to the landlord
- **Landlord Site**: This section of the app is where the landlord can log in, view a summary page of all tenants, and view detailed information about individual tenants.
- **GraphQL**: This is the backend server that will recieve requests from the frontend, interact with the database, and return data to the frontend.
