import joi from 'joi';
// @ts-check
import mypath,{ resolve } from "path";
import { fileURLToPath } from 'url';
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = mypath.dirname(__filename);
const schema = joi.object({
    shop_name: joi.string().min(3).required().regex(/myshopify.com$/).regex(/^((?!https:).)*$/).regex(/^((?!http:).)*$/)
})

export default async function addShopValidation(req,res,next) {
        const result = await schema.validate(req.body);  
        if(result.error){
        res.render('D:/shopify-project/demo_app/server/views/index.ejs',{error: result.error.message});
        }
        else
        {
        next();
        }
    }