import { USER_INFO } from './user-by-id.query';
import { DocumentNode } from 'graphql';

describe('USER_INFO Query (from user-by-id.query.ts)', () => {
  it('should be defined', () => {
    expect(USER_INFO).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(USER_INFO.kind).toEqual('Document');
    expect(USER_INFO.definitions).toBeDefined();
    expect(USER_INFO.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(USER_INFO.definitions.length).toBe(1);
    const definition = USER_INFO.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a query', () => {
    const definition = USER_INFO.definitions[0] as any; 
    expect(definition.operation).toEqual('query');
  });
  
  it('the query name should be "UserInfoById"', () => {
    const definition = USER_INFO.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('UserInfoById');
  });
});
