const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { loadConfig } = require('./config');
const { logError } = require('./errorHandler');

const WIDTH = 1100;
const HEIGHT = 500;
const GOLD = '#D4AF37';
const GOLD_DARK = '#8B7320';
const BLACK = '#0D0D0F';
const WHITE = '#F5F5F5';

/**
 * رسم خلفية افتراضية (أسود + تدرج ذهبي) — Welcomer style
 * @param {import('@napi-rs/canvas').SKRSContext2D} ctx
 */
function drawDefaultBackground(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#1a1a1e');
  gradient.addColorStop(0.5, '#0d0d0f');
  gradient.addColorStop(1, '#1f1a0d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
  ctx.beginPath();
  ctx.arc(WIDTH * 0.85, HEIGHT * 0.2, 200, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * تحميل خلفية مخصصة من الرابط
 */
async function drawCustomBackground(ctx, url) {
  try {
    const image = await loadImage(url);
    ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  } catch {
    drawDefaultBackground(ctx);
  }
}

/**
 * رسم صورة دائرية للعضو مع إطار ذهبي
 */
async function drawAvatar(ctx, member, x, y, size) {
  const avatarUrl = member.user.displayAvatarURL({ extension: 'png', size: 256 });
  const avatar = await loadImage(avatarUrl);
  const radius = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, x - radius, y - radius, size, size);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 3;
  ctx.stroke();
}

/**
 * إنشاء صورة ترحيب Welcomer-style
 * @param {import('discord.js').GuildMember} member
 * @returns {Promise<Buffer>}
 */
async function generateWelcomeImage(member) {
  const config = loadConfig();
  const { guild, user } = member;
  const memberCount = guild.memberCount;

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  const bgUrl = config.welcomeBackgroundUrl?.trim();
  if (bgUrl && /^https?:\/\//i.test(bgUrl)) {
    await drawCustomBackground(ctx, bgUrl);
  } else {
    drawDefaultBackground(ctx);
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = GOLD;
  ctx.fillRect(0, 0, WIDTH, 8);
  ctx.fillRect(0, HEIGHT - 8, WIDTH, 8);

  const panelX = 320;
  const panelY = 60;
  const panelW = WIDTH - panelX - 40;
  const panelH = HEIGHT - 120;

  ctx.fillStyle = 'rgba(13, 13, 15, 0.85)';
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  roundRect(ctx, panelX, panelY, panelW, panelH, 16);
  ctx.fill();
  ctx.stroke();

  await drawAvatar(ctx, member, 165, HEIGHT / 2, 220);

  ctx.textAlign = 'left';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 28px Arial';
  ctx.fillText('WELCOME TO', panelX + 30, panelY + 55);

  ctx.fillStyle = WHITE;
  ctx.font = 'bold 52px Arial';
  const displayName = user.username.length > 18 ? `${user.username.slice(0, 16)}…` : user.username;
  ctx.fillText(displayName, panelX + 30, panelY + 115);

  ctx.fillStyle = GOLD;
  ctx.font = '24px Arial';
  ctx.fillText(guild.name, panelX + 30, panelY + 155);

  ctx.strokeStyle = GOLD_DARK;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(panelX + 30, panelY + 175);
  ctx.lineTo(panelX + panelW - 30, panelY + 175);
  ctx.stroke();

  ctx.fillStyle = 'rgba(245, 245, 245, 0.9)';
  ctx.font = '22px Arial';
  ctx.fillText(`Member #${memberCount}`, panelX + 30, panelY + 215);
  ctx.fillText(`Username: ${user.username}`, panelX + 30, panelY + 255);

  const joinedDate = new Date(member.joinedTimestamp ?? Date.now()).toLocaleDateString(
    'ar-SA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  ctx.fillText(`Joined: ${joinedDate}`, panelX + 30, panelY + 295);

  ctx.fillStyle = GOLD;
  ctx.font = 'italic 20px Arial';
  ctx.fillText('نتمنى لك إقامة ممتعة في السيرفر', panelX + 30, panelY + 345);

  const guildIcon = guild.iconURL({ extension: 'png', size: 64 });
  if (guildIcon) {
    try {
      const icon = await loadImage(guildIcon);
      ctx.drawImage(icon, panelX + panelW - 80, panelY + panelH - 80, 64, 64);
    } catch {
      /* تجاهل */
    }
  }

  return canvas.toBuffer('image/png');
}

/**
 * مستطيل بزوايا دائرية
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * توليد الصورة مع معالجة الأخطاء
 */
async function createWelcomeCard(member) {
  try {
    return await generateWelcomeImage(member);
  } catch (error) {
    logError('welcomeCanvas', error);
    return null;
  }
}

module.exports = { generateWelcomeImage, createWelcomeCard };
