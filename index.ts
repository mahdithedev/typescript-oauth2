import express, { Express } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import PostgresRegistry from './lib/ClientRegistry/postgres';
import { Client as PgClient } from 'pg';
import cookieParser from 'cookie-parser';
import MemoryRegistry from './lib/TemporaryRegistry/memory';
import { RigisterRoute, AuthenticateRoute, RootRoute, RedirectRoute, TokenRoute } from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const pc = new PgClient({
  host:"localhost",
  database:process.env.DB_NAME,
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD
});

const AvailableScopes = [
  "user.identity",
];

const registry = new PostgresRegistry(pc);
let memoryRegistry = new MemoryRegistry();

(async function() {
  registry.connect();
})();

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser(process.env.SECRET));

app.get('/', RootRoute(registry , AvailableScopes , memoryRegistry));
app.post('/rigister' , RigisterRoute(registry));
app.post('/authenticate' , AuthenticateRoute(memoryRegistry));
app.post('/redirect' , RedirectRoute(memoryRegistry));
app.post("/token" , TokenRoute(registry , memoryRegistry));

app.listen(port, () => {
  console.log(`💽 [server]: Server is running at http://localhost:${port}`);
});