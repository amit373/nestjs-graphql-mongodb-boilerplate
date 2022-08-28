export const emailVerifyTemplate = (
    otp: string = null,
    minutes = 10,
    brand = 'Something'
) => {
    const subject = `Verify your ${brand} account`;
    const text = `Hi there!\nWe are really excited to have you on ${brand}. To begin creating your profile and explore the ${brand}, please verify your email address using the OTP below.\nOTP is valid for 10 minutes\n\n `;
    const html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"> <div style="margin:50px auto;width:70%;padding:20px 0"> <div style="border-bottom:1px solid #eee"> <a href="" style="font-size:1.4em;color: #FFA236;text-decoration:none;font-weight:600">One More Light</a> </div> <p style="font-size:1.1em">Hi there!</p> <p>We are really excited to have you on ${brand}. To begin creating your profile and explore the ${brand}, please verify your email address using the OTP below. OTP is valid for ${minutes} minutes</p> <h2 style="background: #FFA236;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2> <p style="font-size:0.9em;">Regards,<br />${brand}</p> </div> </div>`;
    return { subject, text, html };
};
