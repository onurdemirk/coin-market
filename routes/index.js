const express = require("express");
const router = express.Router();
const db = require("../db/queries")

router.get("/", async (req, res) => {
    try {
        const categoriesRaw = await db.getAllCategories();
        const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
        console.log('>>> categories:', categories);
        res.render("index", { categories })
    } catch(err) {
        console.log(`Error: ${err}`)
        res.status(500).send("server error")
    }
})

router.get("/categories/new", async (req, res) => {
    try {
        res.render("add-category")
    } catch(err) {
        console.log(`Error: ${err}`)
        res.status(500).send("server error")
    }
})

router.get("/coins", async (req, res) => {
    try {
        const coins = await db.getAllCoins();
        res.render("coins", { coins })
    } catch(err) {
        console.log(`Error: ${err}`)
        res.status(500).send("server error")
    }
})

router.get("/coins/new", async (req, res) => {
    try {
        const categoriesRaw = await db.getAllCategories();
        const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
        res.render("add-coin", { categories })
    } catch(err) {
        console.log(`Error: ${err}`)
        res.status(500).send("server error")
    }
})

router.get("/coins/:id", async (req, res) => {
    const coinId = req.params.id
    try {
        const coin = await db.getCoinDetails(coinId);
        const categories = await db.getCategoriesByCoin(coinId);
        res.render("coin-details", { categories, coin })
    } catch(err) {
        console.log(`Error: ${err}`)
        res.status(500).send("server error")
    }
})

router.get("/categories/:id/coins", async (req, res) => {
    const categoryId = Number(req.params.id);
    try {
        const category = await db.getCategoryDetails(categoryId)
        if (!category) return res.status(404).send('Category not found');

        const coins = await db.getCoinsByCategory(categoryId);

        res.render("category-details", { category, coins })
    } catch(err) {
        console.log(`Error: ${err}`)
        res.status(500).send("server error")
    }
})

router.post("/categories/:id/delete", async(req, res) => {
    const categoryId =  Number(req.params.id);

    try {
        await db.deleteCategory(categoryId)
        res.redirect(`/`);
    } catch(err) {
        console.log(`Error: ${err}`)
        res.status(500).send("server error")
    }
})

router.post("/coins/:id/delete", async(req, res) => {
    const coinId =  Number(req.params.id);
    try {
        const coin = await db.deleteCoin(coinId)
        res.redirect(`/coins`);
    } catch(err) {
        console.log(`Error: ${err}`)
        res.status(500).send("server error")
    }
})

router.post("/categories", async(req, res) => {
    const categoryName = req.body.categoryName;
    const categoryImage = req.body.categoryImage;
    const categoryDesc = req.body.categoryDesc;

    try {
        await db.insertCategory(categoryName, categoryImage, categoryDesc)
        res.redirect("/")
    } catch(err) {
        console.error("Category cannot be added:", err);
        res.status(500).send("Category cannot be added (Error)");
    }
})

router.post("/coins/add", async(req, res) => {
    const coinName = req.body.coinName;
    const coinSymbol = req.body.coinSymbol;
    const logoUrl = req.body.logoUrl;
    const bannerUrl = req.body.bannerUrl;
    const categoryIds = req.body.categoryIds;
    const coinDesc = req.body.coinDesc;

    let cats = categoryIds || [];
    if (!Array.isArray(cats)) cats = [cats];
     const categoryIdsNum = cats.map(id => Number(id));

    try {
        const newCoinId = await db.insertCoin(coinName, coinSymbol, logoUrl, bannerUrl, coinDesc)
        for(const catid of categoryIdsNum) {
            await db.insertCoinCategRel(newCoinId, catid)
        }

        res.redirect(`/coins/${newCoinId}`);
    } catch(err) {
        console.error("Coin cannot be added:", err);
        res.status(500).send("Coin cannot be added (Error)");
    }
})

module.exports = router;