import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS: 개발 단계(로컬 + codespaces) 허용
// - 프론트에서 fetch("/api/...")로 프록시 붙이면 사실 CORS 이슈가 거의 사라짐
// - 그래도 혹시 직접 호출하는 경우 대비해서 안전하게 처리
const allowlist = new Set([
  "http://localhost:5173",
  "http://localhost:3000"
  // codespaces는 매번 도메인이 바뀔 수 있어서
  // 일단 origin:true로 열어두거나, 아래처럼 정규식 처리할 수 있음
]);

app.use(
  cors({
    origin: (origin, cb) => {
      // Postman/curl 같은 origin 없는 요청 허용
      if (!origin) return cb(null, true);

      // allowlist에 있으면 허용
      if (allowlist.has(origin)) return cb(null, true);

      // ✅ github codespaces 도메인 허용
      // 예: https://xxxx-5173.app.github.dev
      if (/^https:\/\/.*\.app\.github\.dev$/.test(origin)) return cb(null, true);
      if (/^https:\/\/.*\.github\.dev$/.test(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true
  })
);

const { GOOGLE_CLIENT_ID, JWT_SECRET, PORT } = process.env;

if (!GOOGLE_CLIENT_ID) {
  console.error("❌ GOOGLE_CLIENT_ID is missing in server/.env");
}
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in server/.env");
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ✅ 헬스체크
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ 구글 로그인: idToken 검증 → 우리 JWT 발급
app.post("/api/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "idToken required" });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ message: "Invalid token" });

    const user = {
      id: payload.sub, // provider_id (google unique)
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      provider: "google"
    };

    // TODO: DB 연동 시 여기서 user를 find-or-create로 교체

    const accessToken = jwt.sign(
      { uid: user.id, email: user.email, provider: "google" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ accessToken, user });
  } catch (e) {
    console.error("❌ /api/auth/google error:", e?.message || e);
    return res.status(401).json({ message: "Invalid Google token" });
  }
});

app.listen(PORT || 3000, () => {
  console.log(`✅ API running on http://localhost:${PORT || 3000}`);
});
