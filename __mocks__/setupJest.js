jest.mock('rn-fetch-blob', () => {
    return {
        DocumentDir: () => { },
        fetch: () => { },
        base64: () => { },
        android: () => { },
        ios: () => { },
        config: () => { },
        session: () => { },
        fs: () => { },
        wrap: () => { },
        polyfill: () => { },
        JSONStream: () => { }
    };
});

jest.mock('@react-native-community/google-signin', () => {
    return {
        open: jest.fn(),
    };
});
jest.mock('react-native-permissions', () => {
    return {
        open: jest.fn(),
    };
});
jest.mock('react-native-share', () => {
    return {
        open: jest.fn(),
    };
});
jest.mock('react-native-firebase', () => {
    return {
      messaging: jest.fn(() => {
        return {
          hasPermission: jest.fn(() => Promise.resolve(true)),
          subscribeToTopic: jest.fn(),
          unsubscribeFromTopic: jest.fn(),
          requestPermission: jest.fn(() => Promise.resolve(true)),
          getToken: jest.fn(() => Promise.resolve('myMockToken'))
        };
      }),
      notifications: jest.fn(() => {
        return {
          onNotification: jest.fn(),
          onNotificationDisplayed: jest.fn()
        };
      })
    };
  });

  jest.mock("react-native-reanimated", () => {
    return {
      Value: jest.fn(() => 0),
      event: jest.fn(),
      add: jest.fn(() => 0),
      eq: jest.fn(() => true),
      set: jest.fn(() => 0),
      cond: jest.fn(),
      interpolate: jest.fn(() => {}),
      Extrapolate: { CLAMP: jest.fn() }
    };
  });
  jest.mock("react-native-tab-view", () => {
    return {
      out: jest.fn(() => 0),
    };
  });
  require('jest-fetch-mock').enableMocks()
  jest.useFakeTimers();