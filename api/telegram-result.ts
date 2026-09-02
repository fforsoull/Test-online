import type { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================================
//  Serverless-функция для отправки результата теста в Telegram.
//
//  ВАЖНО: токен бота (TELEGRAM_BOT_TOKEN) и TELEGRAM_CHAT_ID
//  берутся из переменных окружения на сервере. Они НИКОГДА не
//  попадают во фронтенд и не видны пользователю.
//
//  Endpoint: POST /api/telegram-result
// ============================================================

// Описание тела запроса (то, что присылает фронтенд).
interface AnswerDetail {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  type: 'choice' | 'text';
}

interface ResultPayload {
  name: string;
  group: string;
  testTitle: string;
  total: number;
  score: number;
  percentage: number;
  submissionId: string;
  date: string;
  answers: AnswerDetail[];
}

// Экранирование спецсимволов для HTML-разметки Telegram.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Формирует красивый текст сообщения для Telegram.
function buildMessage(data: ResultPayload): string {
  const lines: string[] = [];

  lines.push('🆕 <b>НОВЫЙ РЕЗУЛЬТАТ ТЕСТА</b>');
  lines.push('');
  lines.push(`👤 <b>Участник:</b> ${escapeHtml(data.name)}`);
  if (data.group) {
    lines.push(`🎓 <b>Группа:</b> ${escapeHtml(data.group)}`);
  }
  lines.push(`📝 <b>Тест:</b> ${escapeHtml(data.testTitle)}`);
  lines.push(`📊 <b>Результат:</b> ${data.score} из ${data.total}`);
  lines.push(`📈 <b>Процент:</b> ${data.percentage}%`);
  lines.push(`🗓 <b>Дата:</b> ${escapeHtml(data.date)}`);
  lines.push('');
  lines.push('<b>ОТВЕТЫ:</b>');

  data.answers.forEach((a, i) => {
    lines.push('');
    lines.push(`<b>${i + 1}. ${escapeHtml(a.question)}</b>`);
    lines.push(`Ответ участника: ${escapeHtml(a.userAnswer)}`);
    if (a.type === 'choice') {
      lines.push(`Правильный ответ: ${escapeHtml(a.correctAnswer)}`);
    } else if (!a.isCorrect) {
      // Для открытых вопросов правильный ответ показываем только если ошибка.
      lines.push(`Правильный ответ: ${escapeHtml(a.correctAnswer)}`);
    }
    lines.push(`Статус: ${a.isCorrect ? '✅ Правильно' : '❌ Неправильно'}`);
  });

  lines.push('');
  lines.push(`🔑 <b>ID прохождения:</b> ${escapeHtml(data.submissionId)}`);

  return lines.join('\n');
}

// Простая проверка, что тело запроса корректное.
function isValidPayload(body: unknown): body is ResultPayload {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === 'string' &&
    b.name.trim() !== '' &&
    Array.isArray(b.answers) &&
    typeof b.total === 'number'
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Разрешаем только POST.
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Метод не поддерживается' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    return res
      .status(500)
      .json({ ok: false, error: 'Сервер не настроен (нет токена или chat_id)' });
  }

  // Тело может прийти строкой или уже объектом — обрабатываем оба случая.
  let body: unknown = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: 'Некорректный JSON' });
    }
  }

  if (!isValidPayload(body)) {
    return res.status(400).json({ ok: false, error: 'Пустой или некорректный запрос' });
  }

  const message = buildMessage(body);

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const tgData = (await tgRes.json()) as { ok: boolean; description?: string };

    if (!tgRes.ok || !tgData.ok) {
      console.error('Ошибка Telegram API:', tgData);
      return res
        .status(502)
        .json({ ok: false, error: tgData.description || 'Ошибка Telegram API' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Не удалось связаться с Telegram:', err);
    return res.status(502).json({ ok: false, error: 'Не удалось связаться с Telegram' });
  }
}
