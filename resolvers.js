import fetch from 'node-fetch';
import Games from './models/Games.model.js';
import Categories from './models/Categorias.model.js';
import Platforms from './models/Platforms.model.js';
import User from './models/User.model.js';
import Order from './models/Order.model.js';
import Factura from './models/Factura.model.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Carruzel from './models/Carruzel.model.js';
import Notification from './models/Notification.model.js';
import Reviews from './models/Posts.model.js';
dotenv.config();
const stripe = new Stripe(process.env.API_STRIPE);
const images = [
  {
    carruzel_img:
      'https://res.cloudinary.com/di0jcyqyv/image/upload/v1671851258/images-users/gqoyzjqid5brcguwfcqp.jpg',
  },
  {
    carruzel_img:
      'https://res.cloudinary.com/di0jcyqyv/image/upload/v1671851258/images-users/xbyrl1p58f4wqtltwaam.jpg',
  },
  {
    carruzel_img:
      'https://res.cloudinary.com/di0jcyqyv/image/upload/v1671851256/images-users/eldxenva2ce5w7amwyvz.jpg',
  },
  {
    carruzel_img:
      'https://res.cloudinary.com/di0jcyqyv/image/upload/v1671851256/images-users/hmxjevqs9izhnuiekl4z.jpg',
  },
  {
    carruzel_img:
      'https://res.cloudinary.com/di0jcyqyv/image/upload/v1671851255/images-users/ym91zynsuzod2jgft4ca.jpg',
  },
];
const resolver = {
  Query: {
    getAllGames: async () => {
      try {
        let allPlatforms = [];
        const gamesDB = await Games.findAll();
        const gamesNonSuspense = gamesDB.filter(
          (game) => game.games_suspense === false
        );
        if (gamesDB.length > 0) {
          return gamesNonSuspense;
        }

        for (let i = 1; i <= 10; i++) {
          const res = await fetch(
            `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${i}`
          );
          const data = await res.json();
          const games = data.results.map((game) => {
            const recommended =
              game?.platforms[0]?.requirements_en?.recommended || '';
            const minimum = game?.platforms[0]?.requirements_en?.minimum || '';
            const genres = game.genres.map(({ name }) => name);
            const platforms = game.parent_platforms.map(
              (plat) => plat.platform.name
            );

            allPlatforms.push(...platforms);
            return {
              games_name: game.name,
              games_slug: game.slug,
              games_background_image: game.background_image,
              games_rating: game.rating,
              games_date: game.updated,
              games_minimun: minimum,
              games_maximun: recommended,
              games_price: game.ratings_count,
              games_in_ofert: Math.random() - 0.5 > 0 ? false : true,
              games_genres: genres,
              games_platforms: platforms,
            };
          });
          await Games.bulkCreate(games);
        }
        const platforms = [...new Set(allPlatforms)];
        const PlatformsGraph = platforms.map((name) => ({
          platform_name: name,
        }));
        await Platforms.bulkCreate(PlatformsGraph);
        const gamesAllDB = await Games.findAll();
        return gamesAllDB;
      } catch (error) {
        return error.message;
      }
    },
    getGames: async () => {
      try {
        const games = await Games.findAll();
        return games;
      } catch (error) {
        return error;
      }
    },
    getGenres: async () => {
      let allGenres = [];
      const genresAll = await Categories.findAll();
      if (genresAll.length > 0) {
        const GenresGraphQL = genresAll.map((genre) => genre.category_name);
        return GenresGraphQL;
      }

      for (let i = 1; i <= 10; i++) {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${i}`
        );
        const data = await res.json();
        data.results.forEach((game) => {
          const genres = game.genres.map(({ name }) => name);
          allGenres.push(...genres);
        });
      }

      const genres = new Set(allGenres);
      const Genres = [...genres];
      const GenresPostgres = Genres.map((genre) => ({ category_name: genre }));
      await Categories.bulkCreate(GenresPostgres);
      return Genres;
    },
    getGame: async (_, { id }) => {
      try {
        const Game = await Games.findByPk(id, {
          include: [{ model: Reviews, include: User }],
        });
        const reviewsUser = Game.reviews.map((review) => {
          return {
            review_id: review.review_id,
            review_content: review.review_content,
            user: review.user,
          };
        });
        const oneGame = {
          game: {
            games_id: Game.games_id,
            games_name: Game.games_name,
            games_slug: Game.games_slug,
            games_background_image: Game.games_background_image,
            games_rating: Game.games_rating,
            games_date: Game.games_date,
            minimun: Game.games_minimun,
            maximun: Game.games_maximun,
            games_price: Game.games_price,
            games_in_ofert: Game.games_in_ofert,
            games_genres: Game.games_genres,
            games_platforms: Game.games_platforms,
            games_count: Game.games_count,
            games_suspense: Game.games_suspense,
          },
          reviews: reviewsUser,
        };
        return oneGame;
      } catch (error) {
        return error.message;
      }
    },
    getPlatform: async () => {
      const platformsAll = await Platforms.findAll();
      const PlatformsGraph = platformsAll.map(
        ({ platform_name }) => platform_name
      );

      return PlatformsGraph;
    },
    getuser: async (_, { user_email, user_password }) => {
      try {
        console.log(user_email, user_password);
        const existUser = await User.findOne({
          where: {
            user_email,
          },
        });
        if (existUser.user_suspense) {
          throw new Error('Su cuenta se encuentra en suspenso');
        }
        if (!existUser) {
          throw new Error('Correo o contraseña incorrectos');
        }
        if (existUser.user_password === user_password) {
          return existUser;
        }
        console.log(existUser);
        throw new Error('Correo o contraseña incorrectos');
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        return error;
      }
    },
    getOrders: async () => {
      try {
        const orders = await Order.findAll({ include: { model: User } });
        console.log(orders);
        return orders;
      } catch (error) {
        return error;
      }
    },
    getFacture: async (_, { id }) => {
      try {
        const factures = await Factura.findAll({
          where: {
            userUserId: Number(id),
          },
          include: Order,
        });
        const FACGRAPHQL = factures.map((facture) => {
          return {
            factura_description: facture.factura_description,
            factura_total: facture.factura_total,
            order_status: facture.order.order_status,
          };
        });
        return FACGRAPHQL;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    getImage: async () => {
      try {
        const carrLength = await Carruzel.findAll();
        if (carrLength.length > 0) {
          return carrLength;
        }
        const carruzel = await Carruzel.bulkCreate(images);
        return carruzel;
      } catch (error) {
        return error;
      }
    },
    getNotifications: async () => {
      try {
        const notifications = await Notification.findAll();
        return notifications;
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    createGame: async (_, args) => {
      console.log(args);
      try {
        const game = await Games.create({
          games_name: args.name,
          games_date: args.date,
          games_slug: args.name,
          games_background_image: args.image,
          games_rating: args.rating,
          games_price: args.price,
          games_genres: args.genres,
          games_platforms: args.platforms,
        });
        console.log(game);
        return game;
      } catch (error) {
        console.log(error);
      }
    },
    createUser: async (_, args) => {
      try {
        const userExist = await User.findOne({
          where: {
            user_email: args.user_email,
          },
        });
        console.log(userExist);
        if (userExist) {
          throw new Error('El correo electronico ya esta registrado');
        }
        console.log(args);
        const user = await User.create({
          user_user: args.user_user,
          user_profile: args.user_profile,
          user_email: args.user_email,
          user_password: args.user_password,
          // user_direction: args.user_direction,
          // user_payment: args.user_payment,
          // user_phone: args.user_phone,
        });
        console.log(user);
        return user;
      } catch (error) {
        return error;
      }
    },
    createPayment: async (_, args) => {
      try {
        // console.log(args);

        const order = await Order.create({
          order_status: 'pagado',
          userUserId: Number(args.user_id),
        });
        const products = JSON.parse(args.products);
        const namesAndPrices = products.map((product) => {
          return {
            games_name: product.games_name,
            games_price: product.games_price,
            games_count: product.games_count,
          };
        });
        const pricesGames = products.reduce(
          (a, b) => a + Number(b.games_price) * Number(b.games_count),
          0
        );
        // console.log(namesAndPrices);
        const description = JSON.stringify(namesAndPrices);
        const factura = await Factura.create({
          orderOrderId: order.order_id,
          userUserId: Number(args.user_id),
          factura_total: pricesGames,
          factura_description: description,
        });
        const payment = await stripe.paymentIntents.create({
          amount: Number(pricesGames),
          currency: 'ARS',
          description: 'Has realizado una compra en Escorpio Games',
          payment_method: args.id,
          confirm: true,
        });
        console.log(payment);
        return {
          price_total: factura.factura_total,
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    changeDatesUser: async (_, args) => {
      try {
        console.log(args);
        const user = await User.update(
          {
            user_city: args.user_city,
            user_code: args.user_code,
            user_email: args.user_email,
            user_name: args.user_name,
            user_payment: args.user_payment,
            user_phone: args.user_phone,
            user_province: args.user_province,
            user_surname: args.user_surname,
            user_user: args.user_user,
            user_profile: args.user_profile,
          },

          {
            where: {
              user_email: args.user_email,
            },
          }
        );
        const userUpdated = User.findOne({
          where: { user_email: args.user_email },
        });
        console.log(user);
        return userUpdated;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    changeImageCarruzel: async (_, args) => {
      try {
        const image = await Carruzel.update(
          {
            carruzel_img: args.carruzel_img,
          },
          {
            where: {
              carruzel_id: args.carruzel_id,
            },
          }
        );
        const IMAGE = await Carruzel.findByPk(args.carruzel_id);
        return IMAGE;
      } catch (error) {
        return error;
      }
    },
    deleteGame: async (_, args) => {
      try {
        console.log(args);
        await Games.destroy({
          where: {
            games_id: args.games_id,
          },
        });
        return `El juego de id ${args.games_id} se a eliminado.`;
      } catch (error) {
        return error;
      }
    },
    suspenseGames: async (_, args) => {
      try {
        await Games.update(
          {
            games_suspense: args.games_suspense,
          },
          {
            where: {
              games_id: args.games_id,
            },
          }
        );
        return args.games_suspense
          ? `El juego con id ${args.games_id} a sido suspendido`
          : `El juego con id ${args.games_id} a vuelto a estar en la tienda.`;
      } catch (error) {
        return error;
      }
    },
    suspensUser: async (_, args) => {
      try {
        await User.update(
          {
            user_suspense: args.user_suspense,
          },
          {
            where: {
              user_id: args.user_id,
            },
          }
        );
        return args.user_suspense
          ? `El usuario con id ${args.user_id} a sido suspendido.`
          : `El usuario con id ${args.user_id} a vuelto a la actividad.`;
      } catch (error) {
        return error;
      }
    },
    adminUser: async (_, args) => {
      try {
        await User.update(
          {
            user_isAdmin: args.user_isAdmin,
          },
          {
            where: {
              user_id: args.user_id,
            },
          }
        );
        return args.user_isAdmin
          ? `EL usuario con id ${args.user_id} es un nuevo admin`
          : `El usuario de id ${args.user_id} ya no es admin`;
      } catch (error) {
        return error;
      }
    },
    changeStatusInvoice: async (_, args) => {
      try {
        await Order.update(
          {
            order_status: args.order_status,
          },
          { where: { order_id: args.order_id } }
        );
        return `El estado de la compra paso a ser ${args.order_status}.`;
      } catch (error) {
        return error;
      }
    },
    createNotification: async (_, args) => {
      try {
        console.log(args);
        const notification = await Notification.create({
          notification_image: args.image,
          notification_title: args.title,
          notification_description: args.description,
          notification_view: args.view,
        });
        return notification;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    createReview: async (_, args) => {
      try {
        const review = await Reviews.create({
          review_content: args.content,
          gameGamesId: args.games_id,
          userUserId: args.user_id,
        });
        return review;
      } catch (error) {
        return error;
      }
    },
  },

  Games: {
    games_requeriments: (root) => {
      return {
        minimun: root.games_minimun,
        maximun: root.games_maximun,
      };
    },
  },
  User: {
    user_direction: (root) => {
      return {
        user_province: root.user_province,
        user_city: root.user_city,
        user_code: root.user_code,
      };
    },
  },
};

export default resolver;
