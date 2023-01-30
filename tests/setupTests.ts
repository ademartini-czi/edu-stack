import {installGlobals} from '@remix-run/node';
import dotenv from 'dotenv';
import '@testing-library/jest-dom';

// Ensures globals such as "fetch", "Response", "Request", and "Headers" are present. These are
// needed by Remix.
installGlobals();

// Ensure env variables defined in .env are present during tests.
dotenv.config();
