import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email обязателен" }, { status: 400 });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Always return success to prevent email enumeration (but only skip if user doesn't exist)
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Delete any existing token for this email
    await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail } });

    // Create new token (expires in 1 hour)
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.verificationToken.create({
      data: { identifier: normalizedEmail, token, expires },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const sendResult = await resend.emails.send({
      from: "MavenCode <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: "Сброс пароля — MavenCode",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#0D1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117;padding:40px 20px;">
            <tr><td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#161B22;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px;">
                <tr><td align="center" style="padding-bottom:24px;">
                  <div style="width:48px;height:48px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.15);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;">
                    <span style="color:#10B981;font-size:20px;font-weight:700;">M</span>
                  </div>
                </td></tr>
                <tr><td align="center" style="padding-bottom:8px;">
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Сброс пароля</h1>
                </td></tr>
                <tr><td align="center" style="padding-bottom:32px;">
                  <p style="margin:0;color:rgba(255,255,255,0.4);font-size:14px;line-height:1.6;">
                    Мы получили запрос на сброс пароля для аккаунта<br>
                    <span style="color:rgba(255,255,255,0.6);">${normalizedEmail}</span>
                  </p>
                </td></tr>
                <tr><td align="center" style="padding-bottom:32px;">
                  <a href="${resetUrl}" style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#10B981,#047857);color:#000;font-weight:700;font-size:14px;border-radius:12px;text-decoration:none;letter-spacing:0.02em;">
                    Сбросить пароль
                  </a>
                </td></tr>
                <tr><td align="center" style="padding-bottom:24px;">
                  <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;line-height:1.6;">
                    Ссылка действительна <strong style="color:rgba(255,255,255,0.4);">1 час</strong>.<br>
                    Если вы не запрашивали сброс — просто проигнорируйте это письмо.
                  </p>
                </td></tr>
                <tr><td align="center" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
                  <p style="margin:0;color:rgba(255,255,255,0.15);font-size:11px;">MavenCode — Платформа для обучения программированию</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[FORGOT PASSWORD] Error:", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
