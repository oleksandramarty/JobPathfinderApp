import { AUTH_GATEWAY_CURRENT_USER } from './curent-user.query'; // Note the typo in the import path
import { DocumentNode } from 'graphql';

describe('AUTH_GATEWAY_CURRENT_USER Query', () => {
  it('should be defined', () => {
    expect(AUTH_GATEWAY_CURRENT_USER).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(AUTH_GATEWAY_CURRENT_USER.kind).toEqual('Document');
    expect(AUTH_GATEWAY_CURRENT_USER.definitions).toBeDefined();
    expect(AUTH_GATEWAY_CURRENT_USER.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(AUTH_GATEWAY_CURRENT_USER.definitions.length).toBe(1);
    const definition = AUTH_GATEWAY_CURRENT_USER.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a query', () => {
    const definition = AUTH_GATEWAY_CURRENT_USER.definitions[0] as any; 
    expect(definition.operation).toEqual('query');
  });
  
  it('the query name should be "UserDetails"', () => {
    const definition = AUTH_GATEWAY_CURRENT_USER.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('UserDetails');
  });
});
