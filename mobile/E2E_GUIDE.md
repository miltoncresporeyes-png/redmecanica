# E2E Tests Configuration

## Prerequisites

1. Install Detox CLI:
```bash
npm install -g detox-cli
```

2. Install Detox and dependencies:
```bash
npm install --save-dev detox @wix/detox-expo-adapter
```

## Setup

1. Initialize Detox in your project:
```bash
detox init --configuration ios.simulator
```

2. Update your `package.json`:
```json
{
  "scripts": {
    "e2e": "detox test",
    "e2e:build": "detox build",
    "e2e:run": "detox test"
  }
}
```

## Test Example

Create `e2e/example.spec.ts`:

```typescript
import { expect } from 'detox';

describe('Example E2E Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen', async () => {
    await expect(element(by.text('RedMecánica'))).toBeVisible();
  });

  it('should be able to login', async () => {
    await element(by.id('emailInput')).typeText('test@example.com');
    await element(by.id('passwordInput')).typeText('password123');
    await element(by.id('loginButton')).tap();
    
    await expect(element(by.text('Bienvenido'))).toBeVisible();
  });

  it('should navigate to search screen', async () => {
    await element(by.text('Buscar')).tap();
    await expect(element(by.id('searchInput'))).toBeVisible();
  });
});
```

## Running Tests

```bash
# Build the app
npm run e2e:build

# Run tests
npm run e2e
```

## Best Practices

1. Use unique IDs for elements: `testID="login-button"`
2. Wait for elements: `await waitFor(element).toBeVisible()`
3. Handle loading states
4. Clean up test data after each test
