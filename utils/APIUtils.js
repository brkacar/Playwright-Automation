class APIUtils {

    constructor(apiContext,loginPayload) {

        this.apiContext = apiContext;
        this.loginPayload=loginPayload;

    }

    async getToken() {

        const loginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
            {
                data: this.loginPayload
            }
        )
        const loginResponseJson = await loginResponse.json();
        return loginResponseJson.token;

    }

    async createOrder(orderPayload) {

        let response={};
        const token=await this.getToken();
        response.token=token;
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayload,
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        )
        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);
        const orderId = orderResponseJson.orders[0];
        response.orderId=orderId;

        return response;
    }
}

module.exports={APIUtils}