import { NextResponse, type NextRequest } from "next/server";

const REALM = "Dashboard";

function unauthorizedResponse() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });
}

export function middleware(req: NextRequest) {
  const username = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASS;

  if (!username || !password) {
    console.warn("Basic auth credentials are not configured in environment variables.");
    return unauthorizedResponse();
  }

  const authorization = req.headers.get("authorization");

  if (authorization?.startsWith("Basic ")) {
    try {
      const [, encoded] = authorization.split(" ");
      const decoded = atob(encoded);
      const [incomingUser, incomingPass] = decoded.split(":");

      if (incomingUser === username && incomingPass === password) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error("Failed to decode basic auth header", error);
      return unauthorizedResponse();
    }
  }

  return unauthorizedResponse();
}

export const config = {
  matcher: ["/:path*"],
};
