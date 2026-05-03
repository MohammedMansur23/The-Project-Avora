import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const { email, firstName } = await request.json()

  const code = Math.floor(100000 + Math.random() * 900000).toString()

  try {
    await resend.emails.send({
      from: 'Avora <onboarding@resend.dev>',
      to: email,
      subject: 'Your Avora Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 2rem;">
          <h2 style="font-family: Georgia, serif; color: #0a0a0a; font-weight: 400;">
            AV<span style="color: #C9A84C;">O</span>RA
          </h2>
          <p style="color: #6a6a6a; font-size: 0.9rem;">Hi ${firstName},</p>
          <p style="color: #6a6a6a; font-size: 0.9rem;">Your verification code is:</p>
          <div style="background: #0a0a0a; color: #C9A84C; font-size: 2.5rem; 
            letter-spacing: 0.5em; text-align: center; padding: 1.5rem; 
            font-family: Georgia, serif; margin: 1.5rem 0;">
            ${code}
          </div>
          <p style="color: #6a6a6a; font-size: 0.8rem;">
            This code expires in 10 minutes. Do not share it with anyone.
          </p>
          <p style="color: #C9A84C; font-size: 0.75rem; margin-top: 2rem;">
            Buy. Sell. Connect — On Campus.
          </p>
        </div>
      `,
    })

    return Response.json({ success: true, code })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}