export async function verifyRecaptcha(token, action) {

    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${token}`,
        {
            method: 'POST'
        }
    );

    const data = await response.json();

    if (!response.ok) return false;

    return data.success && data.score >= 0.8 && data.action === action;
}


