import { AUTH_GATEWAY_SIGN_UP } from './auth-sign-up.mutation';
import { DocumentNode } from 'graphql';

describe('AUTH_GATEWAY_SIGN_UP Mutation', () => {
  it('should be defined', () => {
    expect(AUTH_GATEWAY_SIGN_UP).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    // Basic checks for a DocumentNode object
    expect(AUTH_GATEWAY_SIGN_UP.kind).toEqual('Document');
    expect(AUTH_GATEWAY_SIGN_UP.definitions).toBeDefined();
    expect(AUTH_GATEWAY_SIGN_UP.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(AUTH_GATEWAY_SIGN_UP.definitions.length).toBe(1);
    const definition = AUTH_GATEWAY_SIGN_UP.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a mutation', () => {
    const definition = AUTH_GATEWAY_SIGN_UP.definitions[0] as any; // Cast to any to access operation type
    expect(definition.operation).toEqual('mutation');
  });
  
  it('the mutation name should be "SignUp"', () => {
    const definition = AUTH_GATEWAY_SIGN_UP.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('SignUp');
  });
});
