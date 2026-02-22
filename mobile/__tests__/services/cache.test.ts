import cacheService from '../../src/services/cache';

describe('Cache Service', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  describe('get/set', () => {
    it('should return null for non-existent key', () => {
      const result = cacheService.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should store and retrieve data', () => {
      const key = 'test-key';
      const data = { name: 'test', value: 123 };

      cacheService.set(key, data);
      const result = cacheService.get(key);

      expect(result).toEqual(data);
    });

    it('should return null after TTL expires', () => {
      const key = 'test-key';
      const data = { name: 'test' };

      cacheService.set(key, data);
      
      jest.advanceTimersByTime(100);
      expect(cacheService.get(key, 50)).toBeNull();

      jest.advanceTimersByTime(100);
      expect(cacheService.get(key)).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete specific key', () => {
      const key = 'test-key';
      cacheService.set(key, { data: 'test' });

      cacheService.delete(key);
      expect(cacheService.get(key)).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cached data', () => {
      cacheService.set('key1', { data: '1' });
      cacheService.set('key2', { data: '2' });

      cacheService.clear();

      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
    });
  });

  describe('invalidatePattern', () => {
    it('should invalidate keys matching pattern', () => {
      cacheService.set('users_1', { data: 'user1' });
      cacheService.set('users_2', { data: 'user2' });
      cacheService.set('products_1', { data: 'product1' });

      cacheService.invalidatePattern('users_');

      expect(cacheService.get('users_1')).toBeNull();
      expect(cacheService.get('users_2')).toBeNull();
      expect(cacheService.get('products_1')).toEqual({ data: 'product1' });
    });

    it('should handle regex special characters', () => {
      cacheService.set('users.test', { data: 'test' });
      cacheService.set('users*', { data: 'wildcard' });

      cacheService.invalidatePattern('users\\.');

      expect(cacheService.get('users.test')).toBeNull();
      expect(cacheService.get('users*')).toEqual({ data: 'wildcard' });
    });
  });
});
