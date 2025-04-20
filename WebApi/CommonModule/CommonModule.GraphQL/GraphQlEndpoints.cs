namespace CommonModule.GraphQL;

public static class GraphQlEndpoints
{
    public static readonly GraphQlEndpoint CurrentUser = new GraphQlEndpoint("auth_gateway_current_user");
    public static readonly GraphQlEndpoint SiteSettings = new GraphQlEndpoint("dictionaries_site_settings", false);
    public static readonly GraphQlEndpoint SignIn = new GraphQlEndpoint("auth_gateway_sign_in", false);
    public static readonly GraphQlEndpoint SignOut = new GraphQlEndpoint("auth_gateway_sign_out");
    public static readonly GraphQlEndpoint SignUp = new GraphQlEndpoint("auth_gateway_sign_up", false);
    public static readonly GraphQlEndpoint UserUpdatePreference = new GraphQlEndpoint("user_update_preference");
    public static readonly GraphQlEndpoint UserInfo = new GraphQlEndpoint("user_info_by_id");
    public static readonly GraphQlEndpoint ProfileCurrentUserProfile = new GraphQlEndpoint("profile_current_user_profile");
    public static readonly GraphQlEndpoint ProfileCreateUserSkill = new GraphQlEndpoint("profile_create_user_skill");
    public static readonly GraphQlEndpoint ProfileUpdateUserSkill = new GraphQlEndpoint("profile_update_user_skill");
    public static readonly GraphQlEndpoint ProfileDeleteUserSkill = new GraphQlEndpoint("profile_delete_user_skill");
    public static readonly GraphQlEndpoint ProfileCreateUserLanguage = new GraphQlEndpoint("profile_create_user_language");
    public static readonly GraphQlEndpoint ProfileUpdateUserLanguage = new GraphQlEndpoint("profile_update_user_language");
    public static readonly GraphQlEndpoint ProfileDeleteUserLanguage = new GraphQlEndpoint("profile_delete_user_language");
    public static readonly GraphQlEndpoint ProfileCreateUserProfileItem = new GraphQlEndpoint("profile_create_user_profile_item");
    public static readonly GraphQlEndpoint ProfileUpdateUserProfileItem = new GraphQlEndpoint("profile_update_user_profile_item");
    public static readonly GraphQlEndpoint ProfileDeleteUserProfileItem = new GraphQlEndpoint("profile_delete_user_profile_item");
    public static readonly GraphQlEndpoint ProfileUserSkillById = new GraphQlEndpoint("profile_user_skill_by_id");
    public static readonly GraphQlEndpoint ProfileUserLanguageById = new GraphQlEndpoint("profile_user_language_by_id");
    public static readonly GraphQlEndpoint ProfileUserProfileItemById = new GraphQlEndpoint("profile_user_profile_item_by_id");
    public static readonly GraphQlEndpoint ProfileUserProfileById = new GraphQlEndpoint("profile_user_profile_by_id");
    public static readonly GraphQlEndpoint UserInfoByLogin = new GraphQlEndpoint("user_info_by_login");
}


public class GraphQlEndpoint
{
    public GraphQlEndpoint(string name, bool isAuthenticated = true)
    {
        Name = name;
        IsAuthenticated = isAuthenticated;
    }
    
    public string Name { get; set; }
    public bool IsAuthenticated { get; set; }
}