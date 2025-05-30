# Development Guide

This document outlines the development setup for the CV Parser System.

## Development Mode

The application automatically switches to development mode when:
- Running in `NODE_ENV=development`
- Missing Firebase credentials
- Missing Resume Parser API key

## Data Structure

All data follows TypeScript interfaces defined in `types/index.ts`:

- `Resume`: Basic resume information
- `Kandidat`: Detailed candidate profile
- `AccountManager`: Account manager information

## Development Configuration

The development configuration is managed in `config/dev.config.ts` and includes:

- Development mode settings
- API rate limiting
- Firebase configuration
- Resume parser settings
- Logging configuration

## API Routes

The following API routes are available:

- `GET /api/get-resumes`: List resumes with filtering
- `GET /api/resume/[id]`: Get single resume details
- `POST /api/parse-resume`: Parse uploaded resume

## Best Practices

1. Always use TypeScript interfaces for data structures
2. Keep data anonymized
3. Use helper functions for common operations
4. Document any special behavior
5. Keep data structures consistent with Firebase schema

## Testing

For testing:

1. Use TypeScript interfaces for test data
2. Create specific test cases
3. Use the development configuration to control test behavior

Example test:

```typescript
import { Resume } from '@/lib/firebase';

describe('Resume API', () => {
  it('should return resumes with pagination', async () => {
    const response = await fetch('/api/get-resumes');
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data.data)).toBe(true);
  });
}); 