namespace CommonModule.Shared.Constants;

public class ErrorMessages
{
    public const string NotFound = "ERROR.NOT_FOUND";
    public const string EntityNotFound = "ERROR.ENTITY_NOT_FOUND";
    public const string EntityWithIdNotFound = "ERROR.ENTITY_WITH_ID_NOT_FOUND";
    public const string EntityWithEmailAlreadyExists = "ERROR.ENTITY_WITH_EMAIL_ALREADY_EXISTS";
    public const string EntityWithLoginAlreadyExists = "ERROR.ENTITY_WITH_LOGIN_ALREADY_EXISTS";
    public const string ValidationError = "ERROR.VALIDATION_ERROR";
    public const string EntityAlreadyExists = "ERROR.ENTITY_ALREADY_EXISTS";
    public const string InternalServerError = "ERROR.INTERNAL_SERVER_ERROR";
    public const string Blocked = "ERROR.BLOCKED";
    public const string ResourceNotFound = "ERROR.RESOURCE_NOT_FOUND";
    public const string EntityBlocked = "ERROR.ENTITY_BLOCKED";
    public const string EntityPessimisticLocked = "ERROR.ENTITY_PESSIMISTIC_LOCKED";
    public const string WrongAuth = "ERROR.WRONG_AUTH";
    public const string Forbidden = "ERROR.FORBIDDEN";
    public const string UserBlocked = "ERROR.USER_BLOCKED";
    public const string PotentialHarmfulContent = "ERROR.POTENTIAL_HARMFUL_CONTENT";
    public const string JwtMinLength = "ERROR.JWT_MIN_LENGTH";
    public const string JwtInvalidFormat = "ERROR.JWT_INVALID_FORMAT";
    public const string JwtUserClaimNotFound = "ERROR.JWT_USER_CLAIM_NOT_FOUND";
    public const string JwtUserClaimInvalidConversion = "ERROR.JWT_USER_CLAIM_INVALID_CONVERSION";
    public const string ForgotPasswordRequestTooSoon = "ERROR.FORGOT_PASSWORD_REQUEST_TOO_SOON";
    public const string RestorePasswordProcessingIssue = "ERROR.RESTORE_PASSWORD_PROCESSING_ISSUE";
    public const string VersionNotSpecified = "ERROR.VERSION_NOT_SPECIFIED";
    public const string RoleNotSupported = "ERROR.ROLE_NOT_SUPPORTED";
    public const string StatusNew = "STATUS.NEW";
    public const string StatusActive = "STATUS.ACTIVE";
    public const string StatusInactive = "STATUS.INACTIVE";
    public const string StatusBlocked = "STATUS.BLOCKED";
    public const string StatusDeleted = "STATUS.DELETED";
    public const string StatusPending = "STATUS.PENDING";
    public const string StatusApproved = "STATUS.APPROVED";
    public const string StatusRejected = "STATUS.REJECTED";
    public const string StatusCompleted = "STATUS.COMPLETED";
    public const string StatusCancelled = "STATUS.CANCELLED";
    public const string StatusArchived = "STATUS.ARCHIVED";
    public const string UpdateOnlyOwnSettings = "ERROR.UPDATE_ONLY_OWN_SETTINGS";
    public const string InvalidUrl = "ERROR.INVALID_URL";
    public const string InvalidHttpsUrl = "ERROR.URL_NOT_HTTPS";
    public const string UnknownUrl = "ERROR.UNKNOWN_URL_TYPE";
}