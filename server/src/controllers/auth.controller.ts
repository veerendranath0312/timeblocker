/**
 * This file contains the authentication controller functions.
 * Controllers handle HTTP requests and responses for authentication-related endpoints.
 * They receive requests from routes, call service functions to process business logic,
 * and return appropriate HTTP responses to the client.
 * This file will contain functions like login, register, logout, etc.
 */
// import {ENV} from '../config/config.env'
import { Request, Response, NextFunction } from 'express';
import { emailPasswordSchema, EmailPasswordRequest, IdTokenRequest, idTokenSchema } from "../schemas/auth.schema";
import { regularUserLogin, regularUserRegistration, oauthLoginService } from "../services/auth.service";
import {handleAuth} from './auth.interface'
// Authentication controller functions will be implemented here
// Example:

export const regularRegistrationController = (req: Request, res: Response) =>
  handleAuth(req, res, emailPasswordSchema, ({ email, password }) => {
    console.log("Regular registration request:", { email, password });
    return regularUserRegistration(email, password);
  });

export const regularLoginController = (req: Request, res: Response) =>
  handleAuth(req, res, emailPasswordSchema, ({ email, password }) => {
    console.log("Regular login request:", { email, password });
    return regularUserLogin(email, password);
  });

export const oauthLoginController = (req: Request, res: Response) =>
  handleAuth(req, res, idTokenSchema, ({ idToken }) => {
    console.log("OAuth login request:", { idToken });
    return oauthLoginService(idToken);
  });
