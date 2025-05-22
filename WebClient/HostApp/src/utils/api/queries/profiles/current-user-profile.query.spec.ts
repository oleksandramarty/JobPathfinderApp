import { PROFILE_CURRENT_USER_PROFILE } from './current-user-profile.mutation'; // Import from the .mutation.ts file
import { DocumentNode } from 'graphql';

describe('PROFILE_CURRENT_USER_PROFILE Query', () => {
  it('should be defined', () => {
    expect(PROFILE_CURRENT_USER_PROFILE).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(PROFILE_CURRENT_USER_PROFILE.kind).toEqual('Document');
    expect(PROFILE_CURRENT_USER_PROFILE.definitions).toBeDefined();
    expect(PROFILE_CURRENT_USER_PROFILE.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(PROFILE_CURRENT_USER_PROFILE.definitions.length).toBe(1);
    const definition = PROFILE_CURRENT_USER_PROFILE.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a query', () => {
    const definition = PROFILE_CURRENT_USER_PROFILE.definitions[0] as any; 
    expect(definition.operation).toEqual('query'); // Key check as per instruction
  });
  
  it('the query name should be "UserProfile"', () => {
    const definition = PROFILE_CURRENT_USER_PROFILE.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('UserProfile');
  });
});
