import { Injectable } from '@nestjs/common';

/**
 * ActiveUserService is a lightweight placeholder for authentication.
 * For the MVP we only have a single personal account, so the ID can
 * be provided through the environment or fall back to `1`.
 */
@Injectable()
export class ActiveUserService {
  private readonly userId: number;

  constructor() {
    const raw = process.env.DEMO_USER_ID ?? process.env.DEFAULT_USER_ID ?? '1';
    const parsed = Number.parseInt(raw, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error(
        'Invalid DEMO_USER_ID/DEFAULT_USER_ID. Expecting a positive integer.',
      );
    }

    this.userId = parsed;
  }

  getUserId(): number {
    return this.userId;
  }
}
