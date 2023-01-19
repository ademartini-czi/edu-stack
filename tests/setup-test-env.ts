import {installGlobals} from '@remix-run/node';
import dotenv from 'dotenv';
import '@testing-library/jest-dom';

installGlobals();
dotenv.config(); // Ensure `process.env` variables are defined
