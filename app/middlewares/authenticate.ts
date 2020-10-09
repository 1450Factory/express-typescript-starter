import jwt from 'jsonwebtoken';
import config from '../../config/auth';
import { RequestHandler } from 'express';
import { IncomingHttpHeaders } from 'http';
import Users, { IUser } from '../models/users.model';

interface PayloadJWT {
  _id: string;
  lastName: string;
  firstName: string;
}

export function isAuthenticated (): RequestHandler {
  return async (req, res, next) => {
    const token = getToken(req.headers);

    if (!token) {
      return res.status(401).json({ message: 'Auth Error' });
    }

    try {
      const payload = jwt.verify(token, config.secret) as PayloadJWT

      if (typeof payload !== 'string') {
        // Fetch user object from database
        req.user = await Users.findById(payload._id) as IUser
        // Check if user and and status is activated
        if (req.user.status !== 'activated') {
          return res.status(500).send({ message: 'Unauthorized' })
        }
        return next()
      }
    } catch (e) {
      console.error(e)
      return res.status(500).send({ message: 'Invalid Token' })
    }
  };
}

function getToken (headers: IncomingHttpHeaders) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    } else {
      return null
    }
  } else {
    return null
  }
}
