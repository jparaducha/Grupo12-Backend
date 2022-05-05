const router = require("express").Router();
const { User, Product, Stock } = require("../db");

router.post("/delete", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

        // const uuidv4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

        // if(userId && !userId.match(uuidRegex)) return res.json("User ID must be an UUID");

        if (!Boolean(userId) && !Boolean(productId)) return res.json("Invalid inputs");

        //--------BUSCA EL USUARIO---------------//
        let usuario;
        if (userId) {
            usuario = await User.findOne({
                where: {
                    "user_id": userId
                }
            }).then((data) => {
                return data;
            }).catch((e) => {
                console.log(e);
            });
        }


        //--------BUSCA EL PRODUCTO---------------//
        let producto
        if (productId) {
            producto = await Product.findOne({
                where: {
                    "product_id": productId
                }
            }).then((data) => {
                return data;
            }).catch((e) => {
                console.log(e);
            });
        }
        //-----------SI SE PASAN IDS PERO NO SE ENCUENTRAN FILAS CON LAS MISMAS---------------//
        if (productId && !producto) return res.json("Product not found");

        if (userId && !usuario) return res.json("User not found");


        //------------SI SE ENCUENTRAN FILAS SE DESASOCIAN EL USUARIO Y EL PRODUCTO-----------//
        if (usuario && producto) {

            const decrease = await Stock.findOne({
                where: {
                    "user_id": userId,
                    "product_id": productId
                },
                attributes: ["quantity"]
            }).then((data) => {
                return data;
            }).catch((e) => {
                console.log(e);
            });

            await usuario.removeProducts(producto);
            producto.stock -= decrease.quantity;

            await producto.save();

            return res.json("User unassociated from product");
        }

        //--------------SI SOLO SE ENCUENTRA EL USUARIO SE LO BORRA-------------//
        if (usuario) {
            await usuario.destroy();

            return res.json("User deleted");
        }

        //-------------SI SOLO SE ENCUENTRA EL PRODUCTO SE LO BORRA--------------//
        if (producto) {
            await producto.destroy();

            return res.json("Product deleted");
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.post("/ban", async (req, res) => {
    try {
        const { userId } = req.body;

        // const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

        if (!Boolean(userId)) return res.json("Invalid input");
        // if(!userId.match(uuidRegex)) return res.json("User ID must be an UUID");


        const user = await User.findOne({
            where: {
                "user_id": userId
            }
        }).then((data) => {
            return data;
        }).catch((e) => {
            console.log(e);
        });

        const stocks = await Stock.findAll({
            where: {
                user_id: userId
            }
        })
            .then((data) => data).catch(console.log);

        if (stocks.length) {

            for (let stock of stocks) {
                stock.active = false;

                await stock.save();
            }
        }


        user.active = false;

        await user.save();

        return res.json("Account deactivated");
    } catch (error) {
        console.log(error);
    }
});

router.post("/unban", async (req, res) => {
    try {
        const { userId } = req.body;

        // const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

        if (!Boolean(userId)) return res.json("Invalid input");
        // if(!userId.match(uuidRegex)) return res.json("User ID must be an UUID");


        const user = await User.findOne({
            where: {
                "user_id": userId
            }
        }).then((data) => {
            return data;
        }).catch((e) => {
            console.log(e);
        });

        const stocks = await Stock.findAll({
            where: {
                user_id: userId
            }
        })
            .then((data) => data).catch(console.log);

        if (stocks.length) {

            for (let stock of stocks) {
                stock.active = true;

                await stock.save();
            }
        }

        user.active = true;

        await user.save();

        return res.json("Account activated");
    } catch (error) {
        console.log(error);
    }
});

router.post("/approve/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findOne({
            where: {
                "product_id": productId
            }
        });

        if (!product) return res.json("Product not found");

        product.approved = true;

        await product.save();

        return res.json("Product approved");
    } catch (error) {
        console.log(error);
    }
});

router.post("/disapprove/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findOne({
            where: {
                "product_id": productId
            }
        });

        if (!product) return res.json("Product not found");

        product.approved = false;

        await product.save();

        return res.json("Product disapproved");
    } catch (error) {
        console.log(error);
    }
})


router.patch("/giveAdmin/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.json("Must provide a user id");

        const user = await User.findOne({
            where: {
                user_id: userId
            }
        }).then((data) => {
            return data;
        }).catch(console.log);

        if (!user) return res.json("User not found");

        user.admin = !user.admin;

        await user.save();


        user.admin ? res.json("User made admin") : res.json("Administrator credentials taken away")
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

// router.patch("/giveProvider/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;

//         if (!userId) return res.json("Must provide a user id");

//         const user = await User.findOne({
//             where: {
//                 user_id: userId
//             }
//         }).then((data) => {
//             return data;
//         }).catch(console.log);

//         if (!user) return res.json("User not found");

//         user.provider = !user.provider;

//         await user.save();


//         user.provider ? res.json("User made provider") : res.json("Provider credentials taken away")
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(500);
//     }
// })

router.patch("/giveProvider/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { rejected } = req.query;

        if (!userId) return res.json("Must provide a user id");

        const user = await User.findOne({
            where: {
                user_id: userId
            }
        }).then((data) => {
            return data;
        }).catch(console.log);

        if (!user) return res.json("User not found");
        if (rejected) {
            if (user.provider !== "requested") return res.json("User didn't request a provider status");
            user.provider = "rejected";
            await user.save();

            return res.json("User request rejected");
        }
        console.log(user.provider, 'state provider----')

        user.provider = user.provider !== "true" ? "true" : "false";

        await user.save();


        user.provider == "true" ? res.json("User made a provider") : res.json("User is no longer a provider")
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

module.exports = router;