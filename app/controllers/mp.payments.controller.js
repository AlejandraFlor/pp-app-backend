var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("TEST-6463212366339059-062418-83d742c2ac3ad9c5e966455267fc24ef-438980755");

const axios = require('axios');

const data_subs = {
  preapproval_plan_id: '2c938084726fca480172750000000000',
  reason: 'Yoga classes',
  external_reference: 'YG-1234',
  payer_email: 'test_user_645071474@testuser.com',
  card_token_id: '8cfd74088721b2459099bb6cf45d8c81',
  auto_recurring: {
    frequency: 1,
    frequency_type: 'months',
    start_date: '2023-07-11T13:07:14.260Z',
    end_date: '2024-07-20T15:59:52.581Z',
    transaction_amount: 980,
    currency_id: 'ARS'
  },
  back_url: 'https://www.mercadopago.com.ar',
  status: 'authorized'
};


exports.createSubscription = async (req, res) => {
    axios.post('https://api.mercadopago.com/preapproval', data_subs, {
    headers: {
        'Authorization': 'Bearer TEST-6463212366339059-062418-83d742c2ac3ad9c5e966455267fc24ef-438980755',
        'Content-Type': 'application/json'
    }
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
};


const data = {
  reason: 'Yoga classes',
  auto_recurring: {
    frequency: 1,
    frequency_type: 'months',
    repetitions: 12,
    billing_day: 10,
    billing_day_proportional: true,
    free_trial: {
      frequency: 1,
      frequency_type: 'months'
    },
    transaction_amount: 10,
    currency_id: 'ARS'
  },
  payment_methods_allowed: {
    payment_types: [{}],
    payment_methods: [{}]
  },
  back_url: 'https://www.yoursite.com'
};

exports.createSubscription = async (req, res) => {
axios.post('https://api.mercadopago.com/preapproval_plan', data, {
  headers: {
    'Authorization': 'Bearer TEST-6463212366339059-062418-83d742c2ac3ad9c5e966455267fc24ef-438980755',
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    console.log(response.data);
    res.send(response.data)
  })
  .catch(error => {
    console.error(error);
  });
};

exports.getPlan = async (req, res) => {
    axios.get('https://api.mercadopago.com/preapproval_plan/search', {
    headers: {
        'Authorization': 'Bearer TEST-6463212366339059-062418-83d742c2ac3ad9c5e966455267fc24ef-438980755'
    }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data)
    })
    .catch(error => {
        console.error(error);
    });

}


exports.mpCheckout = async (req, res) => {
    console.log(req.body)
    console.log("hola")
    mercadopago.payment.save(req.body)
    .then(function(response) {
        console.log("ok")
        const { status, status_detail, id } = response.body;
        res.status(response.status).json({ status, status_detail, id });
    })
    .catch(function(error) {
        console.log("error")
        console.log(error)
        res.status(500).send({ message: error.message });
    });
}


