import crypto from 'node:crypto';

interface MercadoPagoPreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description?: string;
}

const MANUAL_MERCADOPAGO_CONFIG = {
  accessToken: '', // Pega aquí tu MP_ACCESS_TOKEN si quieres configurarlo manualmente
  publicKey: '', // Pega aquí tu MP_PUBLIC_KEY si quieres configurarlo manualmente
  webhookSecret: '', // Pega aquí tu MP_WEBHOOK_SECRET si quieres configurarlo manualmente
};

interface CreatePreferenceInput {
  externalReference: string;
  title: string;
  description: string;
  amount: number;
  currencyId?: string;
  payerEmail?: string;
  successUrl?: string;
  failureUrl?: string;
  pendingUrl?: string;
  notificationUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
  client_id?: string;
  collector_id?: number;
  external_reference?: string;
}

interface WebhookSignatureParts {
  ts: string;
  v1: string;
}

interface MercadoPagoResourceResponse {
  id?: string;
  status?: string;
  external_reference?: string;
  transaction_amount?: number;
  total_amount?: number;
  amount?: number;
  metadata?: Record<string, unknown>;
  payer?: { email?: string };
  order_id?: string;
  payment_id?: string;
  preference_id?: string;
}

class MercadoPagoService {
  private accessToken: string;
  private publicKey: string;
  private webhookSecret: string;
  private apiUrl = 'https://api.mercadopago.com/checkout/preferences';

  constructor() {
    this.accessToken = MANUAL_MERCADOPAGO_CONFIG.accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || '';
    this.publicKey = MANUAL_MERCADOPAGO_CONFIG.publicKey || process.env.MERCADOPAGO_PUBLIC_KEY || process.env.MP_PUBLIC_KEY || '';
    this.webhookSecret = MANUAL_MERCADOPAGO_CONFIG.webhookSecret || process.env.MERCADOPAGO_WEBHOOK_SECRET || process.env.MP_WEBHOOK_SECRET || '';
  }

  isConfigured(): boolean {
    return Boolean(this.accessToken);
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  getWebhookSecret(): string {
    return this.webhookSecret;
  }

  parseWebhookSignature(signatureHeader: string | string[] | undefined): WebhookSignatureParts | null {
    if (!signatureHeader) return null;

    const rawSignature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    const parts = rawSignature.split(',').map((part) => part.trim());

    const signature = parts.reduce<WebhookSignatureParts | null>((accumulator, part) => {
      const [key, value] = part.split('=', 2);
      if (!key || !value) return accumulator;

      if (!accumulator) {
        accumulator = { ts: '', v1: '' };
      }

      if (key === 'ts') accumulator.ts = value;
      if (key === 'v1') accumulator.v1 = value;
      return accumulator;
    }, null);

    if (!signature?.ts || !signature?.v1) return null;
    return signature;
  }

  buildWebhookManifest(dataId: string, requestId: string, ts: string): string {
    return `id:${dataId};request-id:${requestId};ts:${ts};`;
  }

  verifyWebhookSignature(params: {
    dataId: string;
    requestId: string;
    signatureHeader: string | string[] | undefined;
  }): boolean {
    if (!this.webhookSecret) return false;

    const signature = this.parseWebhookSignature(params.signatureHeader);
    if (!signature) return false;

    const normalizedDataId = params.dataId.toLowerCase();
    const manifest = this.buildWebhookManifest(normalizedDataId, params.requestId, signature.ts);

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(manifest)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const receivedBuffer = Buffer.from(signature.v1, 'hex');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  }

  private async fetchResource(resourcePath: string): Promise<MercadoPagoResourceResponse | null> {
    if (!this.accessToken) return null;

    const response = await fetch(`https://api.mercadopago.com${resourcePath}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as MercadoPagoResourceResponse;
  }

  async resolveWebhookResource(params: {
    resourceType?: string;
    resourceId: string;
  }): Promise<MercadoPagoResourceResponse | null> {
    const resourceType = String(params.resourceType || '').toLowerCase();
    const resourceId = params.resourceId.trim();

    const candidatePaths = resourceType === 'order'
      ? [`/v1/orders/${resourceId}`, `/v1/payments/${resourceId}`]
      : resourceType === 'payment'
        ? [`/v1/payments/${resourceId}`, `/v1/orders/${resourceId}`]
        : [`/v1/payments/${resourceId}`, `/v1/orders/${resourceId}`];

    for (const path of candidatePaths) {
      const resource = await this.fetchResource(path);
      if (resource) return resource;
    }

    return null;
  }

  async createPreference(input: CreatePreferenceInput): Promise<MercadoPagoPreferenceResponse> {
    if (!this.isConfigured()) {
      throw new Error('Mercado Pago no está configurado. Define MERCADOPAGO_ACCESS_TOKEN o MP_ACCESS_TOKEN.');
    }

    const payload: Record<string, unknown> = {
      items: [
        {
          title: input.title,
          quantity: 1,
          unit_price: input.amount,
          currency_id: input.currencyId || 'CLP',
          description: input.description,
        } as MercadoPagoPreferenceItem,
      ],
      external_reference: input.externalReference,
      back_urls: {
        success: input.successUrl,
        failure: input.failureUrl,
        pending: input.pendingUrl,
      },
      auto_return: 'approved',
      payer: input.payerEmail ? { email: input.payerEmail } : undefined,
      notification_url: input.notificationUrl,
      metadata: input.metadata,
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      const message = responseBody?.message || responseBody?.error || 'Error desconocido de Mercado Pago';
      throw new Error(`Mercado Pago rechazó la creación de la preferencia: ${message}`);
    }

    return {
      id: responseBody.id,
      init_point: responseBody.init_point,
      sandbox_init_point: responseBody.sandbox_init_point,
      client_id: responseBody.client_id,
      collector_id: responseBody.collector_id,
      external_reference: responseBody.external_reference,
    };
  }
}

export const mercadoPagoService = new MercadoPagoService();