import argparse
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST  = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT  = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER  = os.environ["SMTP_USER"]
SMTP_PASS  = os.environ["SMTP_PASS"]
EMAIL_FROM = os.environ.get("EMAIL_FROM", SMTP_USER)

JOB_NAME   = os.environ.get("JOB_NAME", "minimalist-ci")
BUILD_URL  = os.environ.get("BUILD_URL", "")
BUILD_ID   = os.environ.get("BUILD_ID", "?")


def build_email(status: str, to: str) -> MIMEMultipart:
    ok = status == "SUCCESS"
    color  = "#16a34a" if ok else "#dc2626"
    label  = "✅ PIPELINE PASSOU" if ok else "❌ PIPELINE FALHOU"
    report_link = f"{BUILD_URL}Playwright%20Report/" if BUILD_URL else ""

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:48px 20px">
<table width="580" cellpadding="0" cellspacing="0"
       style="background:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5)">
  <tr>
    <td style="background:{color};padding:32px 36px">
      <p style="margin:0 0 4px;color:rgba(255,255,255,.7);font-size:11px;letter-spacing:3px;text-transform:uppercase">
        Minimalist Store · CI Pipeline
      </p>
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800">{label}</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:24px 36px;color:#e2e8f0;font-size:14px">
      <p style="margin:0 0 8px"><span style="color:#64748b">Job:</span> {JOB_NAME}</p>
      <p style="margin:0 0 8px"><span style="color:#64748b">Build:</span> #{BUILD_ID}</p>
      <p style="margin:0 0 8px"><span style="color:#64748b">Status:</span> {status}</p>
      {"" if not report_link else f'<p style="margin:16px 0 0"><a href="{report_link}" style="background:#2563eb;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600">Ver Relatório Playwright</a></p>'}
    </td>
  </tr>
  <tr>
    <td style="padding:16px 36px;background:#0f172a;color:#475569;font-size:12px">
      Minimalist Store · Notificação automática de CI
    </td>
  </tr>
</table>
</td></tr>
</table>
</body></html>"""

    plain = f"Pipeline: {JOB_NAME} #{BUILD_ID}\nStatus: {status}\n{f'Relatório: {report_link}' if report_link else ''}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{'✅' if ok else '❌'} [{status}] {JOB_NAME} #{BUILD_ID}"
    msg["From"]    = EMAIL_FROM
    msg["To"]      = to
    msg.attach(MIMEText(plain, "plain"))
    msg.attach(MIMEText(html, "html"))
    return msg


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--status", required=True, choices=["SUCCESS", "FAILURE"])
    parser.add_argument("--email",  required=True)
    args = parser.parse_args()

    msg = build_email(args.status, args.email)
    print(f"Enviando e-mail para {args.email} via {SMTP_HOST}:{SMTP_PORT}…")
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        s.ehlo()
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.sendmail(EMAIL_FROM, [args.email], msg.as_string())
    print("✅ E-mail enviado!")


if __name__ == "__main__":
    main()
