import crypto from 'node:crypto';
import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { createApartment, getApartments } from '../../database/apartments';
import { createSession } from '../../database/sessions';
import {
  createUser,
  getUserById,
  getUserBySessionToken,
  getUserByUsername,
  getUserByUsernameWithPasswordHash,
  getUsers,
  isUserAdminBySessionToken,
} from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';
import { createCsrfSecret } from '../../utils/csrf';

console.log('Hello');

type Args = {
  id: string;
};
type UserInput = {
  id: string;
  username: string;
  password: string;
  avatar: string;
};
type LoginArgument = {
  username?: string;
  password?: string;
  id: string;
};
type UserAuthenticationContext = {
  res: {
    setHeader: (setCookie: string, cookieValue: string) => void;
  };
};

type ApartmentInput = {
  id: string;
  userId: number;
  name: string;
  address: string;
  city: string;
  unit: string;
  zip: string;
  rent: string;
  occupied: boolean;
  image: string;
};

const typeDefs = gql`
  type User {
    id: ID!
    username: String
    password: String
    avatar: String
    apartments: [Apartment!]
  }

  type Apartment {
    id: ID!
    user: User!
    name: String!
    address: String!
    city: String!
    unit: String!
    zip: String!
    rent: String!
    occupied: Boolean!
    image: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    getLoggedInUser(username: String): User
    apartments: [Apartment]
  }

  type Mutation {
    createUser(username: String!, password: String!, avatar: String): User
    login(username: String!, password: String!): User
    createApartment(
      userId: ID
      name: String!
      address: String!
      city: String!
      unit: String!
      zip: String!
      rent: String!
      occupied: Boolean!
      image: String
    ): Apartment
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return await getUsers();
    },
    getLoggedInUser: async (parent: string, args: { username: string }) => {
      return await getUserBySessionToken(args.username);
    },
    user: async (parent: string, args: Args) => {
      return getUserById(parseInt(args.id));
    },
    apartments: async () => {
      return await getApartments();
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

    createApartment: async (parent: string, args: ApartmentInput) => {
      console.log('args:', args);
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
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

/* ----- CONTEXT: ----- */
/* Here i am adding the hashPassword function to the context
  object that is passed to each resolver function. This will make the
  hashPassword function available in the resolver functions.  */

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    /* const hashedPassword = await hashPassword(password); */
    // FIXME: Implement secure authentication
    const isAdmin = await isUserAdminBySessionToken(
      req.cookies.fakeSessionToken!,
    );
    return { req, res, isAdmin };
  },
});
