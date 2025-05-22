import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { GraphQlAuthService } from './graph-ql-auth.service';
import { AUTH_GATEWAY_SIGN_IN } from '../queries/auth/sign-in.query';
import { AUTH_GATEWAY_SIGN_UP } from '../mutations/auth/auth-sign-up.mutation';
import { AUTH_GATEWAY_SIGN_OUT } from '../queries/auth/sign-out.query';
import { AUTH_GATEWAY_CURRENT_USER } from '../queries/users/curent-user.query'; // Note: uses 'curent-user.query'
import { USER_INFO } from '../queries/users/user-by-id.query';
import { USER_INFO_BY_LOGIN } from '../queries/users/user-by-login.query';
import { USER_UPDATE_PREFERENCE } from '../mutations/users/user-update-preference.mutation';
import { apolloEnvironments } from '@amarty/utils'; // For checking apollo client switch

describe('GraphQlAuthService', () => {
  let service: GraphQlAuthService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [GraphQlAuthService],
    });

    service = TestBed.inject(GraphQlAuthService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify(); // Verify that no unmatched operations are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use the "authGateway" apollo client for its operations', () => {
    // This test verifies the clientName context for one operation as a representative check.
    service.signOut().subscribe();
    const op = controller.expectOne(AUTH_GATEWAY_SIGN_OUT);
    expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.authGateway);
    op.flush({ data: { auth_gateway_sign_out: { success: true } } });
  });

  describe('signIn', () => {
    it('should call watchQuery with AUTH_GATEWAY_SIGN_IN and variables', () => {
      const login = 'testuser';
      const password = 'password';
      const rememberMe = true;
      const mockResponse = { data: { auth_gateway_sign_in: { token: 'test-token' } } };

      service.signIn(login, password, rememberMe).subscribe(response => {
        expect(response.data?.auth_gateway_sign_in?.token).toEqual('test-token');
      });

      const op = controller.expectOne(AUTH_GATEWAY_SIGN_IN);
      expect(op.operation.variables.input.login).toEqual(login);
      expect(op.operation.variables.input.password).toEqual(password);
      expect(op.operation.variables.input.rememberMe).toEqual(rememberMe);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.authGateway);
      op.flush(mockResponse);
    });
  });

  describe('signUp', () => {
    it('should call watchQuery with AUTH_GATEWAY_SIGN_UP and variables', () => {
      const input = { login: 'newuser', email: 'new@example.com', password: 'new', passwordAgain: 'new' };
      const mockResponse = { data: { auth_gateway_sign_up: { id: 'user-123' } } };

      service.signUp(input).subscribe(response => {
        expect(response.data?.auth_gateway_sign_up?.id).toEqual('user-123');
      });

      const op = controller.expectOne(AUTH_GATEWAY_SIGN_UP);
      expect(op.operation.variables.input).toEqual(input);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.authGateway);
      op.flush(mockResponse);
    });
  });

  describe('signOut', () => {
    it('should call watchQuery with AUTH_GATEWAY_SIGN_OUT', () => {
      const mockResponse = { data: { auth_gateway_sign_out: { success: true } } };
      service.signOut().subscribe(response => {
        expect(response.data?.success).toBe(true);
      });
      const op = controller.expectOne(AUTH_GATEWAY_SIGN_OUT);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.authGateway);
      op.flush(mockResponse);
    });
  });

  describe('currentUser', () => {
    it('should call watchQuery with AUTH_GATEWAY_CURRENT_USER', () => {
      const mockResponse = { data: { auth_gateway_current_user: { id: 'current-user' } } };
      service.currentUser().subscribe(response => {
        expect(response.data?.auth_gateway_current_user?.id).toBe('current-user');
      });
      const op = controller.expectOne(AUTH_GATEWAY_CURRENT_USER);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.authGateway);
      op.flush(mockResponse);
    });
  });

  describe('userById', () => {
    it('should call watchQuery with USER_INFO and id variable', () => {
      const id = 'user-id-1';
      const mockResponse = { data: { user_info_by_id: { id: 'user-id-1', login: 'test' } } };
      service.userById(id).subscribe(response => {
        expect(response.data?.user_info_by_id?.login).toBe('test');
      });
      const op = controller.expectOne(USER_INFO);
      expect(op.operation.variables.id).toEqual(id);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.authGateway);
      op.flush(mockResponse);
    });
  });

  describe('userByLogin', () => {
    it('should call watchQuery with USER_INFO_BY_LOGIN and login variable', () => {
      const login = 'userlogin1';
      const mockResponse = { data: { user_info_by_login: { id: 'user-id-2', login: 'userlogin1' } } };
      service.userByLogin(login).subscribe(response => {
        expect(response.data?.user_info_by_login?.id).toBe('user-id-2');
      });
      const op = controller.expectOne(USER_INFO_BY_LOGIN);
      expect(op.operation.variables.login).toEqual(login);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.authGateway);
      op.flush(mockResponse);
    });
  });
  
  describe('updateUserPreferences', () => {
    it('should call mutate with USER_UPDATE_PREFERENCE and variables', () => {
      const input = { applicationAiPrompt: true, showCurrentPosition: false, showHighestEducation: true, firstName: 'Test' };
      const mockResponse = { data: { user_update_preference: { success: true } } };

      service.updateUserPreferences(input as any).subscribe(response => { // Cast as any for partial input
        expect(response.data?.success).toBe(true);
      });

      const op = controller.expectOne(USER_UPDATE_PREFERENCE);
      expect(op.operation.variables.applicationAiPrompt).toEqual(input.applicationAiPrompt);
      expect(op.operation.variables.firstName).toEqual(input.firstName);
      expect(op.operation.getContext()['clientName']).toEqual(apolloEnvironments.authGateway);
      op.flush(mockResponse);
    });
  });
});
