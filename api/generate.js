// Vercel 서버리스 함수 (Google Gemini API 무료 티어 사용)
// 이 파일은 서버에서만 실행되기 때문에, API 키가 브라우저(프론트엔드)에 절대 노출되지 않습니다.
// 배포 후 Vercel 대시보드 > Settings > Environment Variables 에서
// GEMINI_API_KEY 라는 이름으로 발급받은 키 값을 등록해야 동작합니다.

const TONE_SYSTEM_PROMPT = `너는 출판사 '위즈덤하우스'의 인스타그램 신간 소개 카피를 쓰는 에디터야.
아래 톤/스타일 규칙을 반드시 지켜서, 주어진 보도자료 또는 기획의도 내용을 바탕으로 인스타그램 게시물용 소개 카피를 작성해.

[문체]
- 다정하고 부드러운 존댓말체 ("~해요", "~보세요", "~습니다"를 섞어 쓰되 과하게 딱딱하지 않게)
- 한 문장 또는 한 호흡마다 줄바꿈해서 리듬감 있게 배치 (긴 문단으로 뭉치지 않기)
- 문장은 짧고 담백하게. 만연체 금지

[구성]
1. 첫 줄: 호기심을 자극하는 질문형 문장이나 감성적인 한 줄로 시작
2. 책이 다루는 핵심 내용/문제의식을 2~4문장으로 자연스럽게 풀어서 설명
3. 신뢰를 주는 근거(베스트셀러 기록, 저자 이력, 판매 부수, 추천사, 수상 이력 등)가 소스에 있다면 자연스럽게 녹여서 언급
4. 마지막 줄: "~만나보세요", "~읽어보세요", "~함께해보세요" 같은 다정한 초대 문장으로 마무리

[표기 규칙]
- 책 제목은 반드시 겹낫표 《 》 로 표기
- 이모지는 문단 시작이나 강조 지점에 절제해서 사용 (남발 금지, 3~6개 내외)
- 해시태그는 요청이 없으면 붙이지 않음
- 전체 분량은 200-350자 내외

[참고 예시 – 실제 위즈덤하우스 게시물 발췌]
"《여행의 감각》은 유명한 장소를 더 많이 찍고, 특별한 일정을 채우는 여행보다
낯선 도시에서 나다운 하루를 살아보는 법을 이야기합니다.
늦잠을 자고, 동네를 걷고, 시장에서 장을 보고, 마음에 드는 카페를 다시 찾는 시간들.💓
저자는 지난 10년간의 여행 기록을 통해 어디를 다녀왔는가보다 어떤 하루를 보냈는지가
오래 남는 여행의 감각이 된다고 말합니다.🌿
여행이 자꾸 소비처럼 느껴졌던 사람에게, 나만의 속도와 방향을 다시 찾아주는 책입니다."

위 예시의 리듬감, 줄바꿈 방식, 어미 처리, 이모지 밀도를 참고해서 새 원고를 써.
결과물은 카피 텍스트만 출력해. 제목, 설명, 마크다운 기호 없이 바로 게시할 수 있는 형태로.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body || {};
  if (!input || !input.trim()) {
    return res.status(400).json({ error: '입력 내용이 비어 있어요.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버에 GEMINI_API_KEY 환경변수가 설정되어 있지 않아요.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: TONE_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `아래는 이번 신간의 보도자료 또는 편집자 기획의도야. 이 내용을 바탕으로 위즈덤하우스 톤에 맞춘 인스타그램 소개 카피를 작성해줘.\n\n---\n${input}\n---`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(502).json({ error: 'AI 응답 생성에 실패했어요.' });
    }

    const data = await response.json();
    const text = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || '')
      .join('\n')
      .trim();

    if (!text) {
      return res.status(502).json({ error: '빈 응답을 받았어요. 다시 시도해 주세요.' });
    }

    return res.status(200).json({ output: text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류가 발생했어요.' });
  }
}
