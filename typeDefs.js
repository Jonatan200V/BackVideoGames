import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Genre {
    name: String!
  }
  type Requeriments {
    minimun: String
    maximun: String
  }
  type Notification {
    notification_id: ID!
    notification_image: String
    notification_title: String
    notification_description: String
    notification_view: Boolean
  }

  type Games {
    games_id: ID!
    games_name: String!
    games_slug: String
    games_background_image: String!
    games_rating: Float!
    games_date: String!
    games_requeriments: Requeriments
    games_price: Int!
    games_in_ofert: Boolean!
    games_genres: [String]
    games_platforms: [String]
    games_count: Int
    games_suspense: Boolean
    # platforms: [Ratings]
  }
  enum Orders {
    pagado
    despachado
    entregado
  }

  type Direction {
    user_province: String
    user_city: String
    user_code: Int
  }
  type User {
    user_id: ID!
    user_name: String
    user_surname: String
    user_user: String
    user_profile: String
    user_email: String
    user_direction: Direction
    user_password: String
    user_payment: String
    user_phone: String
    user_suspense: Boolean
    user_isAdmin: Boolean
  }
  type Reviews {
    review_id: ID!
    review_content: String
    user: User
  }
  type OneGame {
    reviews: [Reviews]
    game: Games
  }
  type Carruzel {
    carruzel_id: ID!
    carruzel_img: String!
  }

  type Price {
    price_total: Int!
  }
  type Facture {
    factura_total: Int!
    factura_description: String!
    order_status: Orders
  }
  type OrderType {
    order_status: Orders
    order_id: ID
    user: User
  }
  type Query {
    getAllGames: [Games]
    getGenres: [String]
    getPlatform: [String]
    getGame(id: ID!): OneGame
    getuser(user_email: String!, user_password: String!): User
    getFacture(id: ID!): [Facture]
    getUsers: [User]
    getOrders: [OrderType]
    getImage: [Carruzel]
    getGames: [Games]
    getNotifications: [Notification]
  }
  type Mutation {
    createGame(
      id: ID
      name: String!
      slug: String
      price: Int!
      image: String!
      rating: Float!
      date: String!
      platforms: [String]!
      genres: [String]!
    ): Games
    createPayment(id: ID!, products: String!, user_id: ID!): Price
    createUser(
      user_name: String
      user_surname: String
      user_user: String!
      user_profile: String
      user_email: String!
      # user_direction: Direction
      user_password: String!
      user_payment: String
      user_phone: String # user_name: String! # user_profile: String # user_email: String! # user_password: String! # user_direction: String # user_payment: String # user_phone: String
    ): User
    changeDatesUser(
      user_name: String!
      user_surname: String!
      user_user: String!
      user_email: String!
      user_profile: String
      # user_direction: Direction
      # user_password: String!
      user_province: String!
      user_city: String!
      user_code: Int!
      user_payment: String!
      user_phone: String!
    ): User
    changeImageCarruzel(carruzel_id: ID!, carruzel_img: String!): Carruzel
    deleteGame(games_id: ID!): String
    suspenseGames(games_suspense: Boolean!, games_id: ID!): String
    suspensUser(user_suspense: Boolean!, user_id: ID!): String
    adminUser(user_isAdmin: Boolean!, user_id: ID!): String
    changeStatusInvoice(order_status: Orders!, order_id: ID!): String
    createNotification(
      image: String!
      title: String!
      description: String!
      view: Boolean!
    ): Notification
    createReview(content: String!, games_id: ID!, user_id: ID!): Reviews
  }
`;

export default typeDefs;
