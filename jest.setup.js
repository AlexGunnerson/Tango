// Mock global CSS import
jest.mock('./global.css', () => {});

// Setup global test environment
global.__TEST__ = true;