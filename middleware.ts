import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Get password from environment variable
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Fail closed: deny access if password not configured
  if (!adminPassword) {
    return new NextResponse('Admin access not configured', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Get authorization header
  const authHeader = request.headers.get('authorization');

  // Check if Basic Auth header exists
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    // Return 401 with WWW-Authenticate header to trigger browser login prompt
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Panel", charset="UTF-8"',
        'Content-Type': 'text/plain',
      },
    });
  }

  // Decode and validate credentials
  try {
    // Extract base64 credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Validate credentials
    const isValidUsername = username === 'admin';
    const isValidPassword = password === adminPassword;

    if (isValidUsername && isValidPassword) {
      // Authentication successful - allow request to proceed
      return NextResponse.next();
    } else {
      // Invalid credentials - return 401 again
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Panel", charset="UTF-8"',
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error) {
    // Error decoding credentials
    return new NextResponse('Invalid authentication format', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

// Configure middleware to run only on /admin routes
export const config = {
  matcher: '/admin/:path*',
};
