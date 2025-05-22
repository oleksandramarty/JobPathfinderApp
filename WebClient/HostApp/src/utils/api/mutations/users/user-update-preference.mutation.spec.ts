import { USER_UPDATE_PREFERENCE } from './user-update-preference.mutation';
import { DocumentNode } from 'graphql';

describe('USER_UPDATE_PREFERENCE Mutation', () => {
  it('should be defined', () => {
    expect(USER_UPDATE_PREFERENCE).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(USER_UPDATE_PREFERENCE.kind).toEqual('Document');
    expect(USER_UPDATE_PREFERENCE.definitions).toBeDefined();
    expect(USER_UPDATE_PREFERENCE.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(USER_UPDATE_PREFERENCE.definitions.length).toBe(1);
    const definition = USER_UPDATE_PREFERENCE.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a mutation', () => {
    const definition = USER_UPDATE_PREFERENCE.definitions[0] as any;
    expect(definition.operation).toEqual('mutation');
  });
  
  it('the mutation name should be "UpdateUserPreference"', () => {
    const definition = USER_UPDATE_PREFERENCE.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('UpdateUserPreference');
  });
});
