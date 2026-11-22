export interface User {
  userId: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  userId: string;
  createdAt: string;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  intervalSeconds: number;
  isActive: boolean;
  lastCheckedAt: string | null;
}

export interface Check {
  id: string;
  isUp: boolean;
  statusCode: number | null;
  responseTimeMs: number | null;
  error: string | null;
  checkedAt: string;
}

export interface Incident {
  id: string;
  startedAt: string;
  resolvedAt: string | null;
  cause: string | null;
}

export interface PublicStatus {
  name: string;
  slug: string;
  monitors: Array<{
    id: string;
    name: string;
    checks: Array<{
      isUp: boolean;
      checkedAt: string;
      responseTimeMs: number | null;
    }>;
  }>;
}
