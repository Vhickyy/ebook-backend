import nodemailer from "nodemailer";

export const sendEmail = async ({subject,email, message}) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASS
      }
    });
    await transporter.sendMail({
        from: '"Victoria from e-book" <victoriaokonnah@gmail.com>',
        to: email, 
        subject: subject,
        html: `<b>${message}</b>`,
    });
}


export const calculateTotal = cartItem => {
  // console.log(cartItem);
  return cartItem.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
};