import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheKeyService {
  userProfile(userId: string): string {
    return `users:profile:${userId}`;
  }

  userPermissions(userId: string): string {
    return `users:permissions:${userId}`;
  }

  courseDetails(courseId: string): string {
    return `courses:details:${courseId}`;
  }

  courseList(filtersHash: string): string {
    return `courses:list:${filtersHash}`;
  }

  authSession(sessionId: string): string {
    return `auth:sessions:${sessionId}`;
  }
}
