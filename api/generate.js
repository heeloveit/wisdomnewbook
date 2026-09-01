// Vercel 서버리스 함수 (Google Gemini API 무료 티어 사용)
// mode: 'book'  -> 신간 소개 카피 (파일 첨부 탭 = 새로나온책)
// mode: 'review'-> 위뷰 서평단 모집 카피 (직접 붙여넣기 탭 = 위뷰)

const BOOK_INTRO_PROMPT = `너는 출판사 '위즈덤하우스'의 인스타그램 신간 소개 카피를 쓰는 에디터야.
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
- 전체 분량은 400~700자 내외

[참고 예시 – 실제 위즈덤하우스 게시물 발췌]
"《여행의 감각》은 유명한 장소를 더 많이 찍고, 특별한 일정을 채우는 여행보다
낯선 도시에서 나다운 하루를 살아보는 법을 이야기합니다.
늦잠을 자고, 동네를 걷고, 시장에서 장을 보고, 마음에 드는 카페를 다시 찾는 시간들.💓
저자는 지난 10년간의 여행 기록을 통해 어디를 다녀왔는가보다 어떤 하루를 보냈는지가
오래 남는 여행의 감각이 된다고 말합니다.🌿
여행이 자꾸 소비처럼 느껴졌던 사람에게, 나만의 속도와 방향을 다시 찾아주는 책입니다."

위 예시의 리듬감, 줄바꿈 방식, 어미 처리, 이모지 밀도를 참고해서 새 원고를 써.
결과물은 카피 텍스트만 출력해. 제목, 설명, 마크다운 기호 없이 바로 게시할 수 있는 형태로.`;

const REVIEW_RECRUIT_PROMPT = `너는 출판사 위즈덤하우스의 서평단 '위뷰' 모집 게시물에 들어갈 신간 소개 카피를 쓰는 에디터야.
아래 형식과 톤을 참고해서, 주어진 도서 정보를 바탕으로 짧고 임팩트 있는 소개 카피를 작성해.

[형식]
1행: "📃《책 제목》" (책 제목은 반드시 겹낫표)
빈 줄
그다음: 강렬하고 임팩트 있는 후킹 문구 1~2줄 (놀라운 사실, 반전, 도발적 질문, 추천사 인용 등 활용)
빈 줄
그다음: 책의 핵심 매력을 2~4문장으로 짧고 담백하게 소개. 저자 이력, 추천사, 베스트셀러 기록이 소스에 있으면 자연스럽게 녹여서 언급
필요하면 ✔️ 같은 체크 아이콘으로 핵심 포인트를 짧게 나열해도 좋음 (선택 사항)

[문체]
- 문장은 짧고 임팩트 있게. 한두 문장마다 줄바꿈
- 트렌디하고 힙한 톤. 존댓말 위주지만 살짝 캐주얼해도 됨
- 이모지는 3~6개 내외, 문장 끝이나 강조 지점에 배치

[참고 예시]
"📃《감각의 신세계》

《이기적 유전자》 리처드 도킨스 추천!

"기묘하고 초현실적으로 느껴지는 진실이 우리의 상상력을 뒤흔들 것이다"

당신은 어쩌면 5감이 아닌
12감을 가진 '초능력자'일 수도 있다!

동물의 불가사의한 능력에서 시작되는
신기하고 낯선 인간의 초감각 탐험을 시작해 보세요 ✨"

"📃《두 번 일하지 않는 회사의 언어》

AI 시대에 더 선명해지는 직장인의 핵심 역량

말하기와 소통의 기술🧑‍💼💬

앞으로 더욱 중요해질 것은
AI가 대체하기 어려운 소프트 스킬입니다.

✔️일의 맥락을 정확히 파악하는 능력
✔️대화 목적을 맞추는 소통 능력
✔️협업 과정에서 신뢰를 쌓는 언어 사용 능력

IT 대기업에서 근무 중인 11년 차 기획자가
알려주는 직장인의 언어생활 노하우를 만나 보세요🙌"

위 예시들의 리듬감과 톤을 참고해서 새 원고를 써.
결과물은 이 소개 카피 부분만 출력해. 신청 기간이나 신청 방법 같은 안내 문구는 절대 직접 쓰지 마 (그 부분은 시스템이 자동으로 붙여줘).
마크다운 기호 없이 바로 게시할 수 있는 형태로.`;

// ---- 위뷰 모집 안내 날짜 자동 계산 ----
function formatKoreanDate(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const dow = days[date.getUTCDay()];
  return `${m}/${d} (${dow})`;
}

function buildReviewFooter() {
  // 서버는 UTC로 동작하므로 KST(UTC+9) 기준 '오늘'을 계산
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const dow = kstNow.getUTCDay(); // 0=일 ... 6=토
  const daysSinceMonday = (dow + 6) % 7; // 월=0 ... 일=6
  const monday = new Date(kstNow);
  monday.setUTCDate(kstNow.getUTCDate() - daysSinceMonday);

  const applyStart = new Date(monday); applyStart.setUTCDate(monday.getUTCDate() + 5);  // 이번 주 토요일
  const applyEnd = new Date(monday); applyEnd.setUTCDate(monday.getUTCDate() + 11);      // 차주 금요일
  const announce = new Date(monday); announce.setUTCDate(monday.getUTCDate() + 14);      // 차차주 월요일

  return `\n\n✅ 신청 기간: ${formatKoreanDate(applyStart)} ~ ${formatKoreanDate(applyEnd)}\n✅ 신청 방법: 댓글에 '위뷰'를 남겨주시면 DM으로 신청 링크를 보내드립니다.\n✅ 당첨자 개별 안내: ${formatKoreanDate(announce)}\n\n💡 위뷰 미션:\n\n책을 받은 후 2주 안에 본인 SNS(인스타그램/블로그/X)와 온라인 서점 한 곳 이상 리뷰를 올립니다.`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, mode } = req.body || {};
  if (!input || !input.trim()) {
    return res.status(400).json({ error: '입력 내용이 비어 있어요.' });
  }

  const systemPrompt = mode === 'review' ? REVIEW_RECRUIT_PROMPT : BOOK_INTRO_PROMPT;
  const userLabel = mode === 'review'
    ? '아래는 이번에 위뷰 서평단을 모집할 도서 정보야. 이 내용을 바탕으로 소개 카피를 작성해줘.'
    : '아래는 이번 신간의 보도자료 또는 편집자 기획의도야. 이 내용을 바탕으로 위즈덤하우스 톤에 맞춘 인스타그램 소개 카피를 작성해줘.';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버에 GEMINI_API_KEY 환경변수가 설정되어 있지 않아요.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${userLabel}\n\n---\n${input}\n---`,
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
      return res.status(502).json({ error: 'AI 응답 생성에 실패했어요: ' + errText.slice(0, 300) });
    }

    const data = await response.json();
    let text = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || '')
      .join('\n')
      .trim();

    if (!text) {
      return res.status(502).json({ error: '빈 응답을 받았어요. 다시 시도해 주세요.' });
    }

    if (mode === 'review') {
      text = text + buildReviewFooter();
    }

    return res.status(200).json({ output: text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류가 발생했어요.' });
  }
}
