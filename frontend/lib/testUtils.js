import casual from 'casual';

// seed it so we get consistent results
casual.seed(777);

const fakeTool = () => ({
  __typename: 'Tool',
  id: 'abc123',
  url: 'www.remotelix.com/tool/nikos',
  user: null,
  image: 'dog-small.jpg',
  title: 'dogs are best',
  titleToLowerCase: 'dogs are best',
  description: 'dogs',
  largeImage: 'dog.jpg',
  category: '',
});

const fakeUser = () => ({
  __typename: 'User',
  id: '4234',
  name: casual.name,
  email: casual.email,
  permissions: ['ADMIN'],
});

// Fake LocalStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

export {
  LocalStorageMock,
  fakeTool,
  fakeUser,
};
