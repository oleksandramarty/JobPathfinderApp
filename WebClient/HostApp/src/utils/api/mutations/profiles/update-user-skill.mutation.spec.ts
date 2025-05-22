import { PROFILE_UPDATE_USER_SKILL } from './update-user-skill.mutation';
import { DocumentNode } from 'graphql';

describe('PROFILE_UPDATE_USER_SKILL Mutation', () => {
  it('should be defined', () => {
    expect(PROFILE_UPDATE_USER_SKILL).toBeDefined();
  });

  it('should be a valid GraphQL DocumentNode', () => {
    expect(PROFILE_UPDATE_USER_SKILL.kind).toEqual('Document');
    expect(PROFILE_UPDATE_USER_SKILL.definitions).toBeDefined();
    expect(PROFILE_UPDATE_USER_SKILL.definitions.length).toBeGreaterThan(0);
  });

  it('should contain a single definition of kind "OperationDefinition"', () => {
    expect(PROFILE_UPDATE_USER_SKILL.definitions.length).toBe(1);
    const definition = PROFILE_UPDATE_USER_SKILL.definitions[0];
    expect(definition.kind).toEqual('OperationDefinition');
  });

  it('the operation definition should be a mutation', () => {
    const definition = PROFILE_UPDATE_USER_SKILL.definitions[0] as any;
    expect(definition.operation).toEqual('mutation');
  });
  
  it('the mutation name should be "ProfileUpdateUserSkill"', () => {
    const definition = PROFILE_UPDATE_USER_SKILL.definitions[0] as any;
    expect(definition.name?.kind).toEqual('Name');
    expect(definition.name?.value).toEqual('ProfileUpdateUserSkill');
  });
});
