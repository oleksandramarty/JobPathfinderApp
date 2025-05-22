import { PROFILE_USER_PROFILE_BY_ID } from './user-profile-by-id.query';
import { DocumentNode } from 'graphql';

describe('PROFILE_USER_PROFILE_BY_ID Query', () => {
  it('should be defined', () => {
    expect(PROFILE_USER_PROFILE_BY_ID).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(PROFILE_USER_PROFILE_BY_ID.kind).toEqual('Document');
    expect(PROFILE_USER_PROFILE_BY_ID.definitions).toBeDefined();
    expect(PROFILE_USER_PROFILE_BY_ID.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(PROFILE_USER_PROFILE_BY_ID.definitions.length).toBe(1);
    const definition = PROFILE_USER_PROFILE_BY_ID.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a query', () => {
    const definition = PROFILE_USER_PROFILE_BY_ID.definitions[0] as any; 
    expect(definition.operation).toEqual('query');
  });
  
  it('the query name should be "ProfileUserProfileById"', () => {
    const definition = PROFILE_USER_PROFILE_BY_ID.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('ProfileUserProfileById');
  });
});
