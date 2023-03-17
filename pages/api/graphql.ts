import crypto from 'node:crypto';
import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import {
  createApartment,
  getApartmentById,
  getApartmentByTenantId,
  getApartmentByUserId,
  getApartments,
} from '../../database/apartments';
import {
  createRequest,
  getRequestByTenantId,
  getRequests,
} from '../../database/requests';
import { createSession, deleteSessionByToken } from '../../database/sessions';
import {
  createTenant,
  getTenantBySessionToken,
  getTenantByUserId,
  getTenantByUsernameWithPasswordHash,
  getTenants,
  getTenantsById,
  getTenantsByUsername,
  getTenantsWithApartments,
} from '../../database/tenants';
import {
  createTenantSession,
  deleteTenantSessionByToken,
} from '../../database/tenantSessions';
import {
  createUser,
  getUserById,
  getUserBySessionToken,
  getUserByUsername,
  getUserByUsernameWithPasswordHash,
  getUsers,
  getUserWithApartments,
} from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';
import { createCsrfSecret } from '../../utils/csrf';

type Args = {
  id: string;
};
type ArgsId = {
  userId: string;
};
type ArgsTenantId = {
  tenantId: string;
};
type Token = {
  token: string;
};
type UserInput = {
  id: string;
  username: string;
  password: string;
  avatar: string;
};
type TenantInput = {
  id: string;
  username: string;
  password: string;
  userId: number;
  avatar: string;
};
type LoginArgument = {
  username?: string;
  password?: string;
  id: string;
};

type UserAuthenticationContext = {
  isLoggedIn: boolean;
  reg: { cookies: { sessionToken: string } };
  user: {
    id: number;
    username: string;
  };
  res: {
    setHeader: (setCookie: string, cookieValue: string) => void;
  };
};

type RequestInput = {
  id: string;
  tenantId: number;
  message: string;
  picture: string;
};

type ApartmentInput = {
  id: string;
  userId: number;
  name: string;
  address: string;
  city: string;
  unit: string;
  zip: string;
  rent: number;
  occupied: boolean;
  image: string;
};

const typeDefs = gql`
  type User {
    id: ID!
    username: String
    password: String
    avatar: String
    apartments: [Apartment]
    tenants: [Tenant]
  }

  type Apartment {
    id: ID!
    userId: ID!
    tenantId: ID
    name: String!
    address: String!
    city: String!
    unit: String!
    zip: String!
    rent: Int!
    occupied: Boolean!
    image: String!
    tenant: Tenant
    requests: Request
  }

  type Tenant {
    id: ID!
    username: String
    password: String
    avatar: String
    apartmentId: ID
    apartment: Apartment
    requests: [Request]
  }

  type Request {
    id: ID!
    tenantId: ID!
    message: String
    picture: String
    tenant: Tenant
    apartmentId: ID
    apartment: Apartment
  }

  type Token {
    token: String
  }

  type Query {
    """
    Getting the Logged In User's
    """
    getLoggedInUser(username: String): User
    getLoggedInTenant(username: String): Tenant
    """
    Users Section:
    """
    # users: [User]
    user(id: ID!): User
    """
    Requests Section:
    """
    requests: [Request]
    requestByTenantId(tenantId: String): [Request]
    """
    Apartments Section:
    """
    apartment: [Apartment]
    apartments(id: ID!): Apartment
    apartmentByUserId(userId: String): [Apartment]
    apartmentByTenantId(tenantId: String): [Apartment]
    """
    Tenants Section:
    """
    tenants: [Tenant]
    tenant(id: ID!): Tenant
    tenantByUserId(userId: String): [Tenant]
  }

  type Mutation {
    createUser(username: String!, password: String!, avatar: String): User
    createTenant(
      username: String!
      password: String!
      userId: ID
      avatar: String
    ): Tenant
    login(username: String!, password: String!): User
    tenantLogin(username: String!, password: String!): Tenant
    createApartment(
      userId: ID
      name: String!
      address: String!
      city: String!
      unit: String!
      zip: String!
      rent: Int!
      occupied: Boolean!
      image: String
    ): Apartment
    createRequest(tenantId: ID, message: String!, picture: String): Request
    logout(token: String!): Token
    tenantLogout(token: String!): Token
  }
`;

const resolvers = {
  Query: {
    getLoggedInUser: async (parent: string, args: { username: string }) => {
      return await getUserBySessionToken(args.username);
    },
    getLoggedInTenant: async (parent: string, args: { username: string }) => {
      return await getTenantBySessionToken(args.username);
    },
    /* users: async () => {
      return await getUsers();
    }, */
    user: async (parent: string, args: Args) => {
      return await getUserById(parseInt(args.id));
    },
    apartment: async () => {
      return await getApartments();
    },
    apartments: async (parent: string, args: Args) => {
      return await getApartmentById(parseInt(args.id));
    },
    apartmentByUserId: async (parent: string, args: ArgsId) => {
      return await getApartmentByUserId(parseInt(args.userId));
    },
    apartmentByTenantId: async (parent: string, args: ArgsTenantId) => {
      return await getApartmentByTenantId(parseInt(args.tenantId));
    },
    tenants: async () => {
      return await getTenants();
    },
    tenantByUserId: async (parent: string, args: ArgsId) => {
      return await getTenantByUserId(parseInt(args.userId));
    },
    tenant: async (parent: string, args: Args) => {
      return await getTenantsById(parseInt(args.id));
    },
    requests: async () => {
      return await getRequests();
    },
    requestByTenantId: async (parent: string, args: ArgsTenantId) => {
      return await getRequestByTenantId(parseInt(args.tenantId));
    },
  },
  // New Entry Point -- This is where the JOIN is happening
  Apartment: {
    tenant: async (parent: any) => {
      const tenant = await getTenantsById(parseInt(parent.tenantId));
      return tenant;
      // console.log('Apartment:', tenant);
    },
    requests: async (parent: any) => {
      const request = await getRequestByTenantId(parent.tenantId);
      return request;
      // console.log('Request:', parent);
    },
  },

  Request: {
    tenant: async (parent: any) => {
      const tenant = await getTenantsById(parent.tenantId);
      return tenant;
      // console.log('Request:', tenant);
    },
  },

  Tenant: {
    requests: async (parent: any) => {
      const tenantId = parent.id;
      const requests = await getRequestByTenantId(tenantId);
      return requests;
      // console.log('Tenant Request:', requests);
    },
  },

  Mutation: {
    createUser: async (
      parent: string,
      args: UserInput,
      context: UserAuthenticationContext,
    ) => {
      /* ----- Checking if the input field is empty ----- */
      if (
        !args.username ||
        !args.password ||
        typeof args.username !== 'string' ||
        typeof args.password !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      /* ----- Comparing with the database if the username already exist ----- */
      const user = await getUserByUsername(args.username);
      if (user) {
        throw new GraphQLError('User already exists');
      }
      /* ----- Create the password hash ----- */
      const passwordHash = await bcrypt.hash(args.password, 12);
      /* ----- Create the user with the password hash ----- */
      const newUser = await createUser(
        args.username,
        passwordHash,
        args.avatar,
      );
      if (!newUser) {
        throw new GraphQLError('User creation failed');
      }
      /* ----- Create the token ----- */
      const token = crypto.randomBytes(80).toString('base64');
      const csrfSecret = createCsrfSecret();
      /* ----- Create the session ----- */
      const session = await createSession(token, newUser.id, csrfSecret);
      if (!session) {
        throw new GraphQLError('The creation of the session has failed');
      }
      const serializedCookie = createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      context.res.setHeader('Set-Cookie', serializedCookie);
      /* ----- Return the new User ----- */
      return newUser;
    },
    createTenant: async (
      parent: string,
      args: TenantInput,
      context: UserAuthenticationContext,
    ) => {
      /* ----- Checking if the input field is empty ----- */
      if (
        !args.username ||
        !args.password ||
        typeof args.username !== 'string' ||
        typeof args.password !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      /* ----- Comparing with the database if the username already exist ----- */
      const user = await getTenantsByUsername(args.username);
      if (user) {
        throw new GraphQLError('User already exists');
      }
      /* ----- Create the password hash ----- */
      const passwordHash = await bcrypt.hash(args.password, 12);
      /* ----- Create the user with the password hash ----- */
      const newUser = await createTenant(
        args.username,
        passwordHash,
        args.userId,
        args.avatar,
      );
      if (!newUser) {
        throw new GraphQLError('User creation failed');
      }
      /* ----- Create the token ----- */
      const token = crypto.randomBytes(80).toString('base64');
      const csrfSecret = createCsrfSecret();
      /* ----- Create the session ----- */
      const session = await createTenantSession(token, newUser.id, csrfSecret);
      if (!session) {
        throw new GraphQLError('The creation of the session has failed');
      }
      const serializedCookie = createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      context.res.setHeader('Set-Cookie', serializedCookie);
      /* ----- Return the new User ----- */
      return newUser;
    },
    createApartment: async (parent: string, args: ApartmentInput) => {
      return await createApartment(
        args.userId,
        args.name,
        args.address,
        args.city,
        args.unit,
        args.zip,
        args.rent,
        args.occupied,
        args.image,
      );
    },
    createRequest: async (parent: string, args: RequestInput) => {
      return await createRequest(args.tenantId, args.message, args.picture);
    },
    login: async (
      parent: string,
      args: LoginArgument,
      context: UserAuthenticationContext,
    ) => {
      /* ----- Checking if the input field is empty ----- */
      if (
        typeof args.username !== 'string' ||
        typeof args.password !== 'string' ||
        !args.username ||
        !args.password
      ) {
        throw new GraphQLError('Required field missing');
      }

      /* ----- Getting the Users with the Password Hash from the database ----- */
      const userWithPasswordHash = await getUserByUsernameWithPasswordHash(
        args.username,
      );
      if (!userWithPasswordHash) {
        throw new GraphQLError(
          'Your Login credentials do not match, try again.',
        );
      }
      /* ----- Compare the password in the database with the hashed password ----- */
      const isPasswordValid = await bcrypt.compare(
        args.password,
        userWithPasswordHash.password,
      );
      if (!isPasswordValid) {
        throw new GraphQLError('Your credentials do not match, try again.');
      }
      /* ----- Create the token ----- */
      const token = crypto.randomBytes(80).toString('base64');
      const csrfSecret = createCsrfSecret();
      /* ----- Create the session ----- */
      const session = await createSession(
        token,
        userWithPasswordHash.id,
        csrfSecret,
      );
      if (!session) {
        throw new GraphQLError('The creation of the session has failed');
      }
      const serializedCookie = createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      context.res.setHeader('Set-Cookie', serializedCookie);

      return await getUserByUsername(args.username);
    },
    tenantLogin: async (
      parent: string,
      args: LoginArgument,
      context: UserAuthenticationContext,
    ) => {
      /* ----- Checking if the input field is empty ----- */
      if (
        typeof args.username !== 'string' ||
        typeof args.password !== 'string' ||
        !args.username ||
        !args.password
      ) {
        throw new GraphQLError('Required field missing');
      }

      /* ----- Getting the Users with the Password Hash from the database ----- */
      const userWithPasswordHash = await getTenantByUsernameWithPasswordHash(
        args.username,
      );
      if (!userWithPasswordHash) {
        throw new GraphQLError(
          'Your Login credentials do not match, try again.',
        );
      }
      /* ----- Compare the password in the database with the hashed password ----- */
      const isPasswordValid = await bcrypt.compare(
        args.password,
        userWithPasswordHash.password,
      );
      if (!isPasswordValid) {
        throw new GraphQLError('Your credentials do not match, try again.');
      }
      /* ----- Create the token ----- */
      const token = crypto.randomBytes(80).toString('base64');
      const csrfSecret = createCsrfSecret();
      /* ----- Create the session ----- */
      const session = await createTenantSession(
        token,
        userWithPasswordHash.id,
        csrfSecret,
      );
      if (!session) {
        throw new GraphQLError('The creation of the session has failed');
      }
      const serializedCookie = createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      context.res.setHeader('Set-Cookie', serializedCookie);

      return await getTenantsByUsername(args.username);
    },
    logout: async (parent: string, args: Token) => {
      return await deleteSessionByToken(args.token);
    },
    tenantLogout: async (parent: string, args: Token) => {
      return await deleteTenantSessionByToken(args.token);
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const user = await getUserBySessionToken(req.cookies.sessionToken!);
    const isLoggedIn = user ? true : false;
    return { req, res, isLoggedIn };
  },
});
