var mercadopago = require("mercadopago");
const { Movement, Shopping_cart } = require("../db");
require("dotenv").config();

mercadopago.configurations.setAccessToken(process.env.MERCADOPAGOACCESSTOKEN);
mercadopago.configure({
    access_token : process.env.MERCADOPAGOACCESSTOKEN
});

const crearOrden = async (req,res, next)=>{
    try {


    //     var preference = {
    //         items: [
    //             {
    //                 title : "Test",
    //                 quantity : 1,
    //                 currency_id : "ARS",
    //                 unit_price: 0.01
    //             }
    //         ]
    //         ,notification_url : "https://a3bb-190-225-7-52.ngrok.io/"
    //     }
    
    //     mercadopago.preferences.create(preference)
    //     .then((response)=>{
    //         return res.json(response);
    //     })
    //     .catch(console.log);
    
    

    //     res.send("orden creada");



        // Crea un objeto de preferencia
        //
        const { id, unit_price, bookRef, buyer } = req.body;

        // const buyer = carts[0].buyer_id.toString();

        const carts = await Shopping_cart.findAll({
          where : {
            buyer_id : buyer
          }
        });

        console.log(Array.isArray(carts));
        const totalPrice = carts.reduce((acc, curr)=>{
            return acc + (curr.unit_price * curr.quantity);
        }, 0);

        console.log("\n\n\TOTAL PRICE: ", totalPrice, "\n\n\n\n\n\n");
      
        let preference = {
          items: [
            {
              title: "Checkout",
              unit_price: totalPrice,
              quantity: 1,
              currency_id: "ARS",
              category_id : "Ecommerce",
              description : "Cart checkout"
            },
          ],
          back_urls: {
            success: "http://localhost:3000/mp_confirmation",
            failure: "http://localhost:3000/mp_confirmation",
          },
          auto_return: "approved",
          binary_mode: true,
          external_reference: buyer,
        };
      
        //  let preference = {
        //     items: [
        //         {
        //             title: "Mi producto",
        //             unit_price: 100,
        //             quantity: 1,
        //         }
        //     ],
        //     back_urls:{
        //       "success": "http://localhost:3000/payment",
        //       "pending": "https://localhost:3000/feedback",
        //       "failure": "https://localhost:3000/feedback"
        //     }, auto_return: "approved"
        // };
      
        mercadopago.preferences
          .create(preference)
          .then(async (response) => {
            // Este valor reemplazará el string "<%= global.id %>" en tu HTML
            //global.id = response.body.id;
            // await Booking.update(
            //   { preference_id: response.body.id },
            //   { where: { id: response.body.external_reference } }
            // );
            const { body } = response;

            // await Movement.create({
            //     order_id : response.body

            // })
            console.log("ID: ",body.id, "\nITEMS: ", body.items, "\nOPERATION_TYPE: ", body.operation_type,"\nPAYER: ", body.payer,"\nSANDBOX INIT POINT: ", body.sandbox_init_point,"\nTOTAL AMOUNT: ", body.total_amount, "\nEXTERNAL REFERENCE: ", body.external_reference);
            console.log("\n\nasí de cheto");
            res.json(response.body.init_point);
          })
          .catch(function (error) {
            next(error);
          })
















    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500)
    }
}

const notificacionOrden = async (req,res)=>{
    try {
        const { query } = req;

        console.log(query);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

module.exports = { crearOrden, notificacionOrden}