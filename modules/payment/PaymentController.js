
class PayStackService {
  
  initializePayment = async (paymentDetails) => {
    try {
      const response = await fetch(`${process.env.PAYSTACK_BASE_URL}/transaction/initialize`, {
        body: JSON.stringify(paymentDetails),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        },
      });
      if (!response.ok) {
        throw new Error(await response.text());
      } 
      const result = await response.json();
      return result
    } catch (error) {
      console.log({error});
      throw new Error(error.message);
    }
  }


  verifyPayment = async (paymentReference) => {
    console.log({paymentReference});
    try {
      const response = await fetch(`${process.env.PAYSTACK_BASE_URL}/transaction/verify/${paymentReference}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        },
      })
      if(response && !response.ok) {
        console.log("hey");
        throw new Error(await response.text());
      }
      const result = await response.json();
      console.log({result});
      return result
    } catch (error) {
      console.error({error});
      throw new Error(error.message);
    }
  }
}

const paymentService = new PayStackService();

class PaystackController {

  async initializePayment (order) {
    console.log(order);
    // const {amount,email,callbackUrl,name} = req.body;
    // if(!amount || !email || !name) return res.status(400).json({success:false,message:"Please provide all fields."});
    // const payment = {amount,email,callback_url:process.env.CALL_BACK_URL, metadata:{amount,email,name}}
    // const data = await paymentService.initializePayment(payment);
    // console.log(data);
    // return res.status(200).json({data})
    const payment = {...order,callback_url:process.env.CALL_BACK_URL, metadata:order}
    const data = await paymentService.initializePayment(payment);
    return data;
  }

  async verifyPayment (reference) {
    // const data = await paymentService.verifyPayment(req.query.reference);
    const data = await paymentService.verifyPayment(reference);
    // console.log(data);
    return data;
    // return res.status(200).json({data})
  }

}

export default PaystackController;

