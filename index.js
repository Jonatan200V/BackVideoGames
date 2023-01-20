import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';
import sequelize from './db/db.js';
import Games from './models/Games.model.js';
import Categories from './models/Categorias.model.js';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.get('/', (req, res) => {
  res.send('GraphQl');
});

async function main() {
  try {
    app.listen(process.env.PORT);

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
    sequelize.sync({ force: false });
    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.use('*', (_, res) => {
      res.status(404).send('Not Found');
    });

    console.log(`listening on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
}
main();
