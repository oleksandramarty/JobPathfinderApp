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