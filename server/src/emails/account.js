import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendWelcomeEmail(email, name) {
    sgMail.send({
        to: email,
        from: "marlon2025@marlonleon.net",
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

function sendCancellationEmail(email, name) {
    sgMail.send({
        to: email,
        from: "marlon2025@marlonleon.net",
        subject: "Sorry to see you go!",
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

export {sendWelcomeEmail, sendCancellationEmail}