import { AUTH_GATEWAY_SIGN_OUT } from './sign-out.query';
import { DocumentNode } from 'graphql';

describe('AUTH_GATEWAY_SIGN_OUT Query', () => {
  it('should be defined', () => {
    expect(AUTH_GATEWAY_SIGN_OUT).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(AUTH_GATEWAY_SIGN_OUT.kind).toEqual('Document');
    expect(AUTH_GATEWAY_SIGN_OUT.definitions).toBeDefined();
    expect(AUTH_GATEWAY_SIGN_OUT.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(AUTH_GATEWAY_SIGN_OUT.definitions.length).toBe(1);
    const definition = AUTH_GATEWAY_SIGN_OUT.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a query', () => {
    const definition = AUTH_GATEWAY_SIGN_OUT.definitions[0] as any; 
    expect(definition.operation).toEqual('query');
  });
  
  it('the query name should be "SignOut"', () => {
    const definition = AUTH_GATEWAY_SIGN_OUT.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('SignOut');
  });
});
