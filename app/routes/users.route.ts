import * as express from 'express';
import usersController from '../controllers/users.controller';

const router = express.Router();

router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.post('/', usersController.create);
router.put('/:id', usersController.updateById);
router.delete('/:id', usersController.deleteById);

// Export the router
export = router;
