/**
 * Normalizes user profilePictureUrl to an absolute URL if it's relative.
 */
export function formatUserResponse(user, req) {
    if (user.profilePictureUrl &&
        user.profilePictureUrl.startsWith("/") &&
        !user.profilePictureUrl.startsWith("//")) {
        const baseUrl = process.env.API_URL || `${req.protocol}://${req.get("host")}`;
        return {
            ...user,
            profilePictureUrl: `${baseUrl}${user.profilePictureUrl}`,
        };
    }
    return user;
}
