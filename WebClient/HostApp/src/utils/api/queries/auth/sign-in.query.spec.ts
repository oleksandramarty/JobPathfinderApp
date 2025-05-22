import { AUTH_GATEWAY_SIGN_IN } from './sign-in.query';
import { DocumentNode } from 'graphql';

describe('AUTH_GATEWAY_SIGN_IN Query', () => {
  it('should be defined', () => {
    expect(AUTH_GATEWAY_SIGN_IN).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(AUTH_GATEWAY_SIGN_IN.kind).toEqual('Document');
    expect(AUTH_GATEWAY_SIGN_IN.definitions).toBeDefined();
    expect(AUTH_GATEWAY_SIGN_IN.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(AUTH_GATEWAY_SIGN_IN.definitions.length).toBe(1);
    const definition = AUTH_GATEWAY_SIGN_IN.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a query', () => {
    const definition = AUTH_GATEWAY_SIGN_IN.definitions[0] as any; // Cast to any to access operation type
    expect(definition.operation).toEqual('query');
  });
  
  it('the query name should be "SignIn"', () => {
    const definition = AUTH_GATEWAY_SIGN_IN.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('SignIn');
  });
});
