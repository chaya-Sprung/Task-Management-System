import expres from "express";

// עמודים שלא נמצאו
export const notFound = (req, res, next) => {
    next({
         status: 404,
         type: 'not found',
         msg: 'url not found',
    });
};

/**
 * מידלוואר לטיפול בשגיאות - נכניס את המשותף לכל השגיאות
 * @param {{ status?: Number, type?: String, msg: String }} err 
 * @param {expres.Request} req 
 * @param {expres.Response} res 
 * @param {Function} next 
 */
export const errorHandler = (err, req, res, next) => {
    console.log('errorHandler');
    const myError = {
        message: err.msg,
        type: err.type || 'Server Error...',
        fixLink: 'fix.html' // אפשר להוסיף הרבה שדות לאוביקט
    };
    res.status(err.status || 500).json({ error: myError });
};