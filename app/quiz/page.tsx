import { PageHead } from "@/components/PageHead";
import { QuizApp } from "@/components/QuizApp";
import { LOOKALIKE_COUNT, TRIVIA_COUNT } from "@/lib/quiz";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "퀴즈",
  description: "수도, 국기, 지도, 인구, 언어, 시차, 상식. 10문제와 오답노트, 날짜로 고정되는 오늘의 도전.",
  path: "/quiz",
});

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead kicker="QUIZ" title="퀴즈" lead={`상식 은행 ${TRIVIA_COUNT}문항, 헷갈리는 국기 ${LOOKALIKE_COUNT}묶음. 채점은 이 브라우저 안에서만 합니다.`} />
      <div className="mt-6">
        <QuizApp />
      </div>
    </div>
  );
}
