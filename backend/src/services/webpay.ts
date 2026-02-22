/**
 * Webpay Service - Integración con Transbank Webpay Plus
 * 
 * Este servicio maneja la integración con Webpay Plus de Transbank.
 * Para producción, necesitas:
 * 1. Cuenta comercial Webpay Plus en Transbank
 * 2. Credenciales (commerceCode y apiKey)
 * 
 * Documentación: https://www.transbankdevelopers.cl/
 */

interface CreateTransactionResult {
  token: string;
  url: string;
  buyOrder: string;
  sessionId: string;
  amount: number;
}

interface CommitTransactionResult {
  vci: string;
  amount: number;
  status: string;
  buyOrder: string;
  sessionId: string;
  cardDetail: {
    card_number: string;
  };
  accountingDate: string;
  transactionDate: string;
  authorizationCode: string;
  paymentTypeCode: string;
  responseCode: number;
}

const Environment = {
  Integration: 'https://webpay3gint.transbank.cl',
  Production: 'https://webpay3g.transbank.cl'
};

class WebpayService {
  private commerceCode: string;
  private apiKey: string;
  private environment: string;
  private isConfigured: boolean = false;

  constructor() {
    this.commerceCode = process.env.WEBPAY_COMMERCE_CODE || '';
    this.apiKey = process.env.WEBPAY_API_KEY || '';

    if (this.commerceCode && this.apiKey) {
      this.isConfigured = true;
      this.environment = process.env.NODE_ENV === 'production' 
        ? Environment.Production 
        : Environment.Integration;
      console.log('✅ Webpay configurado en modo:', this.isConfigured ? (process.env.NODE_ENV === 'production' ? 'PRODUCCIÓN' : 'INTEGRACIÓN') : 'NO CONFIGURADO');
    } else {
      console.warn('⚠️ Webpay no configurado. Usando modo simulación.');
      this.environment = Environment.Integration;
      this.commerceCode = '597055555532';
      this.apiKey = '579B532A4D93CB346FF21B291E2A0FF17937CCAS';
    }
  }

  isWebpayConfigured(): boolean {
    return this.isConfigured;
  }

  getEnvironment(): string {
    return this.environment;
  }

  async createTransaction(
    buyOrder: string,
    sessionId: string,
    amount: number,
    returnUrl: string,
    finalUrl: string
  ): Promise<CreateTransactionResult> {
    if (!this.isConfigured) {
      return this.simulateCreateTransaction(buyOrder, sessionId, amount);
    }

    try {
      const response = await this.callWebpayApi('create', {
        buyOrder,
        sessionId,
        amount,
        returnUrl,
        finalUrl
      });

      return {
        token: response.token,
        url: response.url,
        buyOrder,
        sessionId,
        amount
      };
    } catch (error) {
      console.error('Error creating Webpay transaction:', error);
      throw error;
    }
  }

  async commitTransaction(token: string): Promise<CommitTransactionResult> {
    if (!this.isConfigured) {
      return this.simulateCommitTransaction(token);
    }

    try {
      const response = await this.callWebpayApi('commit', { token });

      return {
        vci: response.vci,
        amount: response.amount,
        status: response.status,
        buyOrder: response.buyOrder,
        sessionId: response.sessionId,
        cardDetail: response.cardDetail,
        accountingDate: response.accountingDate,
        transactionDate: response.transactionDate,
        authorizationCode: response.authorizationCode,
        paymentTypeCode: response.paymentTypeCode,
        responseCode: response.responseCode
      };
    } catch (error) {
      console.error('Error committing Webpay transaction:', error);
      throw error;
    }
  }

  async refundTransaction(
    token: string,
    amount: number,
    authorizationCode: string,
    buyOrder: string
  ): Promise<any> {
    if (!this.isConfigured) {
      return this.simulateRefundTransaction(token, amount);
    }

    try {
      return await this.callWebpayApi('refund', {
        token,
        amount,
        authorizationCode,
        buyOrder
      });
    } catch (error) {
      console.error('Error refunding Webpay transaction:', error);
      throw error;
    }
  }

  private async callWebpayApi(action: string, params: any): Promise<any> {
    const endpoint = this.environment + '/webpayserver/v3.cgi';
    
    const xmlRequest = this.buildSoapRequest(action, params);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Authorization': `Basic ${Buffer.from(this.commerceCode + ':' + this.apiKey).toString('base64')}`
      },
      body: xmlRequest
    });

    const text = await response.text();
    return this.parseSoapResponse(action, text);
  }

  private buildSoapRequest(action: string, params: any): string {
    const timestamp = new Date().toISOString();
    
    switch (action) {
      case 'create':
        return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wps="http://webservices.webpay.cl/">
  <soapenv:Header/>
  <soapenv:Body>
    <wps:initTransaction>
      <wsTransaction>
        <buyOrder>${params.buyOrder}</buyOrder>
        <sessionId>${params.sessionId}</sessionId>
        <amount>${params.amount}</amount>
        <returnUrl>${params.returnUrl}</returnUrl>
        <finalUrl>${params.finalUrl}</finalUrl>
      </wsTransaction>
      <wpmDetail>
        <businessToken/>
      </wpmDetail>
    </wps:initTransaction>
  </soapenv:Body>
</soapenv:Envelope>`;
      
      case 'commit':
        return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
    <ws:getTransactionResult>
      <token>${params.token}</token>
    </ws:getTransactionResult>
  </soapenv:Body>
</soapenv:Envelope>`;
      
      case 'refund':
        return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
    <ws>nullify>
      <token>${params.token}</token>
      <authorizationCode>${params.authorizationCode}</authorizationCode>
      <authorizedAmount>${params.amount}</authorizedAmount>
      <buyOrder>${params.buyOrder}</buyOrder>
    </ws>nullify>
  </soapenv:Body>
</soapenv:Envelope>`;
      
      default:
        return '';
    }
  }

  private parseSoapResponse(action: string, xml: string): any {
    return {
      token: this.extractXmlValue(xml, 'token') || this.extractXmlValue(xml, 'tokenWS'),
      url: this.environment + '/webpayserver/v3.cgi',
      vci: this.extractXmlValue(xml, 'vci'),
      amount: parseFloat(this.extractXmlValue(xml, 'amount') || '0'),
      status: this.extractXmlValue(xml, 'status') || 'AUTHORIZED',
      buyOrder: this.extractXmlValue(xml, 'buyOrder'),
      sessionId: this.extractXmlValue(xml, 'sessionId'),
      cardDetail: {
        card_number: this.extractXmlValue(xml, 'cardNumber') || '**** **** **** 0000'
      },
      accountingDate: this.extractXmlValue(xml, 'accountingDate') || '',
      transactionDate: this.extractXmlValue(xml, 'transactionDate') || new Date().toISOString(),
      authorizationCode: this.extractXmlValue(xml, 'authorizationCode') || '000000',
      paymentTypeCode: this.extractXmlValue(xml, 'paymentTypeCode') || 'CO',
      responseCode: parseInt(this.extractXmlValue(xml, 'responseCode') || '0')
    };
  }

  private extractXmlValue(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  }

  private simulateCreateTransaction(
    buyOrder: string,
    sessionId: string,
    amount: number
  ): CreateTransactionResult {
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      token: mockToken,
      url: this.environment + '/webpayserver/v3.cgi',
      buyOrder,
      sessionId,
      amount
    };
  }

  private simulateCommitTransaction(token: string): CommitTransactionResult {
    return {
      vci: 'TSN',
      amount: 0,
      status: 'AUTHORIZED',
      buyOrder: token.split('_')[2] || 'mock_order',
      sessionId: token.split('_')[3] || 'mock_session',
      cardDetail: {
        card_number: '**** **** **** 1234'
      },
      accountingDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      transactionDate: new Date().toISOString(),
      authorizationCode: '123456',
      paymentTypeCode: 'CO',
      responseCode: 0
    };
  }

  private simulateRefundTransaction(token: string, amount: number): any {
    return {
      token,
      authorizationCode: '123456',
      nullifiedAmount: amount,
      responseCode: 0,
      description: 'Reembolso procesado (simulación)'
    };
  }
}

export const webpayService = new WebpayService();
export default webpayService;
