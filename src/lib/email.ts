type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

const resendEndpoint = "https://api.resend.com/emails";

async function sendViaResend({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      "Email skipped: RESEND_API_KEY or EMAIL_FROM is missing. Set env vars to enable transactional emails."
    );
    return { sent: false, reason: "missing_env" } as const;
  }

  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.warn("Failed to send email via Resend:", response.status, body);
    return { sent: false, reason: "provider_error" } as const;
  }

  return { sent: true } as const;
}

export async function sendEmail(input: SendEmailInput) {
  try {
    return await sendViaResend(input);
  } catch (error) {
    console.warn("Email send failed unexpectedly:", error);
    return { sent: false, reason: "unexpected_error" } as const;
  }
}

function getBaseUrl() {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "مرحبًا بكِ في مقرأة مُزن الخير",
    html: `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height:1.8; color:#1f2937;">
        <h2 style="margin:0 0 12px;">مرحبًا ${name}</h2>
        <p>تم إنشاء حسابكِ بنجاح في مقرأة مُزن الخير.</p>
        <p>يمكنكِ الآن تسجيل الدخول والبدء في رحلتكِ التعليمية.</p>
        <p><a href="${getBaseUrl()}/login" style="color:#1B6B7A;">تسجيل الدخول</a></p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${getBaseUrl()}/reset-password?token=${encodeURIComponent(
    resetToken
  )}`;

  return sendEmail({
    to,
    subject: "إعادة تعيين كلمة المرور",
    html: `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height:1.8; color:#1f2937;">
        <h2 style="margin:0 0 12px;">طلب إعادة تعيين كلمة المرور</h2>
        <p>تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابكِ.</p>
        <p>اضغطي على الرابط التالي لإكمال العملية (صالح لمدة ساعة واحدة):</p>
        <p><a href="${resetUrl}" style="color:#1B6B7A;">إعادة تعيين كلمة المرور</a></p>
        <p>إذا لم تطلبي ذلك، يمكنكِ تجاهل هذه الرسالة.</p>
      </div>
    `,
  });
}

export async function sendPurchaseSuccessEmail(
  to: string,
  name: string,
  courseTitle: string
) {
  return sendEmail({
    to,
    subject: "تأكيد شراء الدورة",
    html: `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height:1.8; color:#1f2937;">
        <h2 style="margin:0 0 12px;">تم تأكيد عملية الشراء</h2>
        <p>مرحبًا ${name}،</p>
        <p>تم تأكيد اشتراككِ بنجاح في الدورة: <strong>${courseTitle}</strong>.</p>
        <p>يمكنكِ الوصول إلى الدورة من لوحة التحكم.</p>
        <p><a href="${getBaseUrl()}/dashboard/courses" style="color:#1B6B7A;">الانتقال إلى دوراتي</a></p>
      </div>
    `,
  });
}
