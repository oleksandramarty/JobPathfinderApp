import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { GraphQlProfileService } from './graph-ql-profile.service';
import { apolloEnvironments } from '@amarty/utils';

// Import all GraphQL documents used by the service
import { PROFILE_CURRENT_USER_PROFILE } from '../queries/profiles/current-user-profile.mutation';
import { PROFILE_USER_SKILL_BY_ID } from '../queries/profiles/user-skill-by-id.query';
import { PROFILE_CREATE_USER_SKILL } from '../mutations/profiles/create-user-skill.mutation';
import { PROFILE_UPDATE_USER_SKILL } from '../mutations/profiles/update-user-skill.mutation';
import { PROFILE_DELETE_USER_SKILL } from '../mutations/profiles/delete-user-skill.mutation';
import { PROFILE_CREATE_USER_LANGUAGE } from '../mutations/profiles/create-user-language.mutation';
import { PROFILE_UPDATE_USER_LANGUAGE } from '../mutations/profiles/update-user-language.mutation';
import { PROFILE_DELETE_USER_LANGUAGE } from '../mutations/profiles/delete-user-language.mutatuion'; // Note typo
import { PROFILE_CREATE_USER_PROFILE_ITEM } from '../mutations/profiles/create-user-profile-item.mutation';
import { PROFILE_UPDATE_USER_PROFILE_ITEM } from '../mutations/profiles/update-user-profile-item.mutation';
import { PROFILE_DELETE_USER_PROFILE_ITEM } from '../mutations/profiles/delete-user-profile-item.mutation';
import { PROFILE_USER_PROFILE_BY_ID } from '../queries/profiles/user-profile-by-id.query';

describe('GraphQlProfileService', () => {
  let service: GraphQlProfileService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [GraphQlProfileService],
    });

    service = TestBed.inject(GraphQlProfileService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should use the "profile" apollo client for its operations', () => {
    service.currentUserProfile().subscribe();
    const op = controller.expectOne(PROFILE_CURRENT_USER_PROFILE);
    expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
    op.flush({ data: { profile_current_user_profile: {} } });
  });

  // === CURRENT USER PROFILE ===
  describe('currentUserProfile', () => {
    it('should call watchQuery with PROFILE_CURRENT_USER_PROFILE', () => {
      const mockResponse = { data: { profile_current_user_profile: { id: 'profile1' } } };
      service.currentUserProfile().subscribe(response => {
        expect(response.data?.profile_current_user_profile?.id).toEqual('profile1');
      });
      const op = controller.expectOne(PROFILE_CURRENT_USER_PROFILE);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });

  // === SKILLS ===
  describe('userSkillById', () => {
    it('should call watchQuery with PROFILE_USER_SKILL_BY_ID', () => {
      const mockResponse = { data: { profile_user_skill_by_id: { id: 'skill1' } } };
      service.userSkillById().subscribe(response => {
        expect(response.data?.profile_user_skill_by_id?.id).toEqual('skill1');
      });
      const op = controller.expectOne(PROFILE_USER_SKILL_BY_ID);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });

  describe('createUserSkill', () => {
    it('should call mutate with PROFILE_CREATE_USER_SKILL and variables', () => {
      const input = { skillId: 1, skillLevelId: 2 };
      const mockResponse = { data: { profile_create_user_skill: { id: 'newSkill1' } } };
      service.createUserSkill(input).subscribe(response => {
        expect(response.data?.profile_create_user_skill?.id).toEqual('newSkill1');
      });
      const op = controller.expectOne(PROFILE_CREATE_USER_SKILL);
      expect(op.operation.variables).toEqual(input);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });

  describe('updateUserSkill', () => {
    it('should call mutate with PROFILE_UPDATE_USER_SKILL and variables', () => {
      const id = 'skillToUpdate';
      const input = { skillId: 1, skillLevelId: 3 };
      const mockResponse = { data: { profile_update_user_skill: { success: true } } };
      service.updateUserSkill(id, input).subscribe(response => {
        expect(response.data?.profile_update_user_skill?.success).toBe(true);
      });
      const op = controller.expectOne(PROFILE_UPDATE_USER_SKILL);
      expect(op.operation.variables.id).toEqual(id);
      expect(op.operation.variables.skillId).toEqual(input.skillId);
      expect(op.operation.variables.skillLevelId).toEqual(input.skillLevelId);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });

  describe('deleteUserSkill', () => {
    it('should call mutate with PROFILE_DELETE_USER_SKILL and id variable', () => {
      const id = 'skillToDelete';
      const mockResponse = { data: { profile_delete_user_skill: { success: true } } };
      service.deleteUserSkill(id).subscribe(response => {
        expect(response.data?.profile_delete_user_skill?.success).toBe(true);
      });
      const op = controller.expectOne(PROFILE_DELETE_USER_SKILL);
      expect(op.operation.variables.id).toEqual(id);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });

  // === LANGUAGES ===
  describe('createUserLanguage', () => {
    it('should call mutate with PROFILE_CREATE_USER_LANGUAGE and variables', () => {
      const input = { languageId: 1, languageLevelId: 2 };
      const mockResponse = { data: { profile_create_user_language: { id: 'newLang1' } } };
      service.createUserLanguage(input).subscribe(response => {
        expect(response.data?.profile_create_user_language?.id).toEqual('newLang1');
      });
      const op = controller.expectOne(PROFILE_CREATE_USER_LANGUAGE);
      expect(op.operation.variables).toEqual(input);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });
  
  describe('updateUserLanguage', () => {
    it('should call mutate with PROFILE_UPDATE_USER_LANGUAGE and variables', () => {
      const id = 'langToUpdate';
      const input = { languageId: 1, languageLevelId: 3 };
      const mockResponse = { data: { profile_update_user_language: { success: true } } };
      service.updateUserLanguage(id, input).subscribe(response => {
        expect(response.data?.profile_update_user_language?.success).toBe(true);
      });
      const op = controller.expectOne(PROFILE_UPDATE_USER_LANGUAGE);
      expect(op.operation.variables.id).toEqual(id);
      expect(op.operation.variables.languageId).toEqual(input.languageId);
      expect(op.operation.variables.languageLevelId).toEqual(input.languageLevelId);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });

  describe('deleteUserLanguage', () => {
    it('should call mutate with PROFILE_DELETE_USER_LANGUAGE and id variable', () => {
      const id = 'langToDelete';
      const mockResponse = { data: { profile_delete_user_language: { success: true } } };
      service.deleteUserLanguage(id).subscribe(response => {
        expect(response.data?.profile_delete_user_language?.success).toBe(true);
      });
      const op = controller.expectOne(PROFILE_DELETE_USER_LANGUAGE); // Uses the one with typo
      expect(op.operation.variables.id).toEqual(id);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });

  // === PROFILE ITEMS ===
   describe('createUserProfileItem', () => {
    it('should call mutate with PROFILE_CREATE_USER_PROFILE_ITEM and variables', () => {
      const input = { profileItemType: 1, startDate: '2023-01-01', position: 'Dev' };
      const mockResponse = { data: { profile_create_user_profile_item: { id: 'newItem1' } } };
      service.createUserProfileItem(input as any).subscribe(response => {
        expect(response.data?.profile_create_user_profile_item?.id).toEqual('newItem1');
      });
      const op = controller.expectOne(PROFILE_CREATE_USER_PROFILE_ITEM);
      expect(op.operation.variables).toEqual(input);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });
  
  describe('updateUserProfileItem', () => {
    it('should call mutate with PROFILE_UPDATE_USER_PROFILE_ITEM and variables', () => {
      const id = 'itemToUpdate';
      const input = { profileItemType: 1, startDate: '2023-01-01', position: 'Sr. Dev' };
      const mockResponse = { data: { profile_update_user_profile_item: { success: true } } };
      service.updateUserProfileItem(id, input as any).subscribe(response => {
        expect(response.data?.profile_update_user_profile_item?.success).toBe(true);
      });
      const op = controller.expectOne(PROFILE_UPDATE_USER_PROFILE_ITEM);
      expect(op.operation.variables.id).toEqual(id);
      expect(op.operation.variables.position).toEqual(input.position); // Check one of the input fields
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });

  describe('deleteUserProfileItem', () => {
    it('should call mutate with PROFILE_DELETE_USER_PROFILE_ITEM and id variable', () => {
      const id = 'itemToDelete';
      const mockResponse = { data: { profile_delete_user_profile_item: { success: true } } };
      service.deleteUserProfileItem(id).subscribe(response => {
        expect(response.data?.profile_delete_user_profile_item?.success).toBe(true);
      });
      const op = controller.expectOne(PROFILE_DELETE_USER_PROFILE_ITEM);
      expect(op.operation.variables.id).toEqual(id);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });
  
  describe('userProfileById', () => {
    it('should call watchQuery with PROFILE_USER_PROFILE_BY_ID and id variable', () => {
      const id = 'profileId1';
      const mockResponse = { data: { profile_user_profile_by_id: { id: 'profileId1' } } };
      service.userProfileById(id).subscribe(response => {
        expect(response.data?.profile_user_profile_by_id?.id).toEqual('profileId1');
      });
      const op = controller.expectOne(PROFILE_USER_PROFILE_BY_ID);
      expect(op.operation.variables.id).toEqual(id);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.profile);
      op.flush(mockResponse);
    });
  });
});
