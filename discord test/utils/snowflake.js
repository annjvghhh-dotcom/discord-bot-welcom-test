/**
 * التحقق من أن القيمة معرف Discord صالح (Snowflake)
 * @param {string} id
 * @returns {boolean}
 */
function isSnowflake(id) {
  return typeof id === 'string' && /^\d{17,20}$/.test(id);
}

module.exports = { isSnowflake };
