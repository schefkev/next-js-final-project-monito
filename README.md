# Final Project - MONITO

Monito is a Fullstack web app that helps apartment owners keeping track of there assets, communicating with the tenants and monitoring the financial aspect of the apartment.

Visit the live site of monito [here](https://monito-management.fly.dev/).
You can also just watch a quick demo video of the app [here](https://www.dropbox.com/s/73v3jnerxsjr5ip/intro.mp4?dl=0).

### Architecture

- **Frontend**: We'll be using Next.js 13 as the frontend framework to build our web app.
- **Backend**: We'll be using Node.js and Express.js to build the server-side of our app.
- **Database**: We'll be using PostgreSQL as our database management system.

---

### High-Level overview of the different components in our app

- **User Site**: This section of the app is where the tenant can log in, view information about the apartment, and send a service request to the landlord
- **Landlord Site**: This section of the app is where the landlord can log in, view a summary page of all tenants, and view detailed information about individual tenants.
- **GraphQL**: This is the backend server that will recieve requests from the frontend, interact with the database, and return data to the frontend.

### Technologies Used

- Next.js for server-side-rendering and Frontend development.
- PostgreSQL as Database
- GraphQL as API
- Chart.js for dynamic charting
- Formik for Input Validation
- TypeScript / JavaScript
- React
- Node.js
- Figma / Excalidraw
- DrawSQL
- Jest
- Playwright
- Fly.io

### Screenshots

**Monito's Landing Page where the user can check out which services are provided**
<br>
![landingPage](https://www.dropbox.com/s/5g5z45bcirzlcsq/Screenshot%202023-04-02%20at%2021.24.57.png?dl=0)

**Summary of all the assets a landlord has**
<br>
![apartments](https://www.dropbox.com/s/7q42mjav1dhy7hp/Screenshot%202023-04-02%20at%2021.26.37.png?dl=0)

**Landlord's Dashboard to have an Overview of a single apartment**
<br>
![dashboard](https://www.dropbox.com/s/gav7puvsg993l6s/Screenshot%202023-04-02%20at%2021.26.56.png?dl=0)

### Setup Instructions

- `git clone <repo>` the Github repo to your local machine
- Install Next.js `yarn add create-next-app`
- Setup the database by downloading and installing PostgreSQL
- Create a user and a database
- Copy the `.env.example` file to a new file called `.env` (this will be ignored from Git)
- Replace the ##### with username, password and name of your database
- Install dotenv-cli with `yarn add dotenv-cli`
- Run the migrations with `yarn migrate up`
- Finally, start the server by running `yarn dev`

### Instructions for the Deployment

Sign Up with Fly.io.
Open the Fly.io Tokens page, generate a new Fly.io access token named `Github Actions Deploy Token` and copy it. Attention: Token will only be shown once!

And then in the Github repo under Settings -> Secrets -> Actions, click `New Repository secret` and paste in the token in the token field and name the Token `FLY_API_TOKEN`.

Once this step is done, on the command line in your terminal, authenticate with Fly.io so you can run commands in the command line: `flyctl auth login`. Login in the browser Window and then return back to the terminal. If this was successfull, a success message appears in the terminal.

Now create an app, specifying the name using only lowercase letters and dashes:
`flyctl apps create --name <app name>``

Add the database credentials using Fly.io secrets:

```
flyctl secrets set PGHOST=localhost PGDATABASE=upleveled$(openssl rand -hex 16) PGUSERNAME=upleveled$(openssl rand -hex 16) PGPASSWORD=$(openssl rand -base64 32)
```

Next, create a 1GB volume for the PostgreSQL database in the Frankfurt Region:
`flyctl volumes create postgres --size 1 --region fra``

And finally, deploy the first version of the app:
`flyctl deploy`
