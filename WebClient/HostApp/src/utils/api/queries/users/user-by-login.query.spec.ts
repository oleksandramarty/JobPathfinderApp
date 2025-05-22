import { USER_INFO_BY_LOGIN } from './user-by-login.query';
import { DocumentNode } from 'graphql';

describe('USER_INFO_BY_LOGIN Query', () => {
  it('should be defined', () => {
    expect(USER_INFO_BY_LOGIN).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(USER_INFO_BY_LOGIN.kind).toEqual('Document');
    expect(USER_INFO_BY_LOGIN.definitions).toBeDefined();
    expect(USER_INFO_BY_LOGIN.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(USER_INFO_BY_LOGIN.definitions.length).toBe(1);
    const definition = USER_INFO_BY_LOGIN.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a query', () => {
    const definition = USER_INFO_BY_LOGIN.definitions[0] as any; 
    expect(definition.operation).toEqual('query');
  });
  
  it('the query name should be "UserInfoByLogin"', () => {
    const definition = USER_INFO_BY_LOGIN.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('UserInfoByLogin');
  });
});
