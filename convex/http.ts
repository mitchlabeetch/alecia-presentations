import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { auth } from './auth';

const http = httpRouter();

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Add CORS middleware for all routes
http.route({
  path: '/.*/',
  method: 'OPTIONS',
  handler: httpAction(async () => new Response(null, {
    status: 204,
    headers: corsHeaders,
  })),
});

auth.addHttpRoutes(http);

export default http;
