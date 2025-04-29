const pool = require("./db");

async function getAllCategories() {
  const { rows } = await pool.query(`
      SELECT id, name, image_url, description
      FROM categories
      ORDER BY name
    `);
  return rows;
}

async function getAllCoins() {
  const { rows } = await pool.query(`
      SELECT id, name, symbol, logo_url, banner_url, description
      FROM coins
      ORDER BY name
    `);
  return rows;
}

async function deleteCategory(categoryId) {
  await pool.query(
    `DELETE FROM categories
     WHERE id = $1`,
    [categoryId]
  );
}

async function deleteCoin(coinId) {
  await pool.query(
    `DELETE FROM coins
     WHERE id = $1`,
    [coinId]
  );
}

async function getCoinsByCategory(categoryId) {
  const { rows } = await pool.query(
    `SELECT 
    c.id, c.name, c.symbol, c.logo_url, c.banner_url, c.description
  FROM coins AS c
  JOIN coin_categories AS cc
    ON cc.coin_id = c.id
  WHERE cc.category_id = $1
  ORDER BY c.name`,
    [categoryId]
  );
  return rows;
}

async function getCategoriesByCoin(coinId) {
  const { rows } = await pool.query(
    `SELECT c.id, c.name, c.image_url, c.description
     FROM categories AS c
     JOIN coin_categories AS cc
     ON cc.category_id = c.id
     WHERE cc.coin_id = $1
     ORDER BY c.name`,
    [coinId]
  );
  return rows;
}

async function getCoinDetails(coinId) {
  const { rows } = await pool.query(
    `SELECT id, name, symbol, logo_url, banner_url, description
     FROM coins WHERE id = $1`,
    [coinId]
  );
  return rows[0];
}

async function getCategoryDetails(categoryId) {
  const { rows } = await pool.query(
    `SELECT id, name, image_url, description
       FROM categories WHERE id = $1`,
    [categoryId]
  );
  return rows[0];
}

async function insertCategory(name, image_url, description) {
  await pool.query(
    "INSERT INTO categories (name, image_url, description) VALUES ($1, $2, $3)",
    [name, image_url, description]
  );
}

async function insertCoin(name, symbol, logo_url, banner_url, description) {
  const { rows } = await pool.query(
    "INSERT INTO coins (name, symbol, logo_url, banner_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [name, symbol, logo_url, banner_url, description]
  );
  return rows[0].id;
}

async function insertCoinCategRel(coin_id, category_id) {
  await pool.query(
    "INSERT INTO coin_categories (coin_id, category_id) VALUES ($1, $2)",
    [coin_id, category_id]
  );
}

module.exports = {
  getAllCategories,
  insertCategory,
  insertCoin,
  insertCoinCategRel,
  getCoinsByCategory,
  getCategoryDetails,
  getAllCoins,
  getCoinDetails,
  getCategoriesByCoin,
  deleteCategory,
  deleteCoin
};
