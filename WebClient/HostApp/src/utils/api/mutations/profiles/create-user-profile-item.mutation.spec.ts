import { PROFILE_CREATE_USER_PROFILE_ITEM } from './create-user-profile-item.mutation';
import { DocumentNode } from 'graphql';

describe('PROFILE_CREATE_USER_PROFILE_ITEM Mutation', () => {
  it('should be defined', () => {
    expect(PROFILE_CREATE_USER_PROFILE_ITEM).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(PROFILE_CREATE_USER_PROFILE_ITEM.kind).toEqual('Document');
    expect(PROFILE_CREATE_USER_PROFILE_ITEM.definitions).toBeDefined();
    expect(PROFILE_CREATE_USER_PROFILE_ITEM.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(PROFILE_CREATE_USER_PROFILE_ITEM.definitions.length).toBe(1);
    const definition = PROFILE_CREATE_USER_PROFILE_ITEM.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a mutation', () => {
    const definition = PROFILE_CREATE_USER_PROFILE_ITEM.definitions[0] as any;
    expect(definition.operation).toEqual('mutation');
  });
  
  it('the mutation name should be "ProfileCreateUserProfileItem"', () => {
    const definition = PROFILE_CREATE_USER_PROFILE_ITEM.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('ProfileCreateUserProfileItem');
  });
});
