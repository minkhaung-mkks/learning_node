

const getGoogleOAuthURL = () => {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const params = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        response_type: "code",
        prompt: "consent",
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ].join(" ")
    }
    const qs = new URLSearchParams(params)
    console.log(qs.toString())
    return `${oauth2Endpoint}?${qs.toString()}`
}

export default getGoogleOAuthURL