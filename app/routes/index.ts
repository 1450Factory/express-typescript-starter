import * as express from 'express';
import { isAuthenticated } from '../middlewares/authenticate';

import usersRoutes from './users.route';

const router = express.Router();

router.use('/users', isAuthenticated(), usersRoutes);

export = router;
