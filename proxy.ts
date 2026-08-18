import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pais =
    request.headers.get("x-vercel-ip-country")?.toUpperCase();

  // Em desenvolvimento/local esse header normalmente não existe.
  // Permitimos para não quebrar localhost.
  if (!pais) {
    return NextResponse.next();
  }

  // SOMENTE BRASIL
  if (pais !== "BR") {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <title>Acesso indisponível</title>
        </head>

        <body
          style="
            margin:0;
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#050706;
            color:#ffffff;
            font-family:Arial,sans-serif;
            text-align:center;
            padding:24px;
          "
        >
          <div>
            <h1 style="margin-bottom:12px;">
              Acesso indisponível
            </h1>

            <p style="color:#9ca3af;">
              Este site está disponível somente no Brasil.
            </p>
          </div>
        </body>
      </html>
      `,
      {
        status: 403,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};