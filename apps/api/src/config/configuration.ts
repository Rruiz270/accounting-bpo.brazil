export default () => ({
  // Application
  app: {
    port: parseInt(process.env.PORT, 10) || 3333,
    environment: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'BPO Financeiro',
    version: process.env.npm_package_version || '1.0.0',
    url: process.env.APP_URL || 'http://localhost:3333',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || 'bpo_financeiro',
    ssl: process.env.DATABASE_SSL === 'true',
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Encryption
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your-32-char-encryption-key-here',
    algorithm: 'aes-256-gcm',
  },

  // File upload
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/xml',
      'text/xml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    cdnUrl: process.env.CDN_URL,
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST || 'localhost',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@bpofinanceiro.com.br',
  },

  // SMS (Twilio)
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER,
  },

  // WhatsApp
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
  },

  // Brazilian APIs
  brazilian: {
    // Receita Federal
    receitaFederal: {
      baseUrl: 'https://www.receitaws.com.br/v1',
      timeout: 10000,
    },
    
    // ViaCEP
    viaCep: {
      baseUrl: 'https://viacep.com.br/ws',
      timeout: 5000,
    },
    
    // SPC/Serasa
    spc: {
      baseUrl: process.env.SPC_API_URL,
      token: process.env.SPC_API_TOKEN,
    },
    
    serasa: {
      baseUrl: process.env.SERASA_API_URL,
      clientId: process.env.SERASA_CLIENT_ID,
      clientSecret: process.env.SERASA_CLIENT_SECRET,
    },

    // PIX
    pix: {
      keyType: process.env.PIX_KEY_TYPE || 'cnpj',
      key: process.env.PIX_KEY,
      ispb: process.env.PIX_ISPB,
    },
  },

  // Bank integrations
  banks: {
    // Banco do Brasil
    bb: {
      clientId: process.env.BB_CLIENT_ID,
      clientSecret: process.env.BB_CLIENT_SECRET,
      environment: process.env.BB_ENVIRONMENT || 'sandbox',
      baseUrl: process.env.BB_ENVIRONMENT === 'production' 
        ? 'https://api.bb.com.br' 
        : 'https://api.sandbox.bb.com.br',
    },

    // Itaú
    itau: {
      clientId: process.env.ITAU_CLIENT_ID,
      clientSecret: process.env.ITAU_CLIENT_SECRET,
      environment: process.env.ITAU_ENVIRONMENT || 'sandbox',
      baseUrl: process.env.ITAU_ENVIRONMENT === 'production'
        ? 'https://api.itau.com.br'
        : 'https://api-sandbox.itau.com.br',
    },

    // Bradesco
    bradesco: {
      clientId: process.env.BRADESCO_CLIENT_ID,
      clientSecret: process.env.BRADESCO_CLIENT_SECRET,
      environment: process.env.BRADESCO_ENVIRONMENT || 'sandbox',
      baseUrl: process.env.BRADESCO_ENVIRONMENT === 'production'
        ? 'https://api.bradesco.com.br'
        : 'https://api-sandbox.bradesco.com.br',
    },

    // Santander
    santander: {
      clientId: process.env.SANTANDER_CLIENT_ID,
      clientSecret: process.env.SANTANDER_CLIENT_SECRET,
      environment: process.env.SANTANDER_ENVIRONMENT || 'sandbox',
      baseUrl: process.env.SANTANDER_ENVIRONMENT === 'production'
        ? 'https://api.santander.com.br'
        : 'https://api-sandbox.santander.com.br',
    },
  },

  // DOMINIO Integration
  dominio: {
    baseUrl: process.env.DOMINIO_API_URL || 'https://api.dominio.com.br',
    timeout: 30000,
    retries: 3,
  },

  // Open Banking
  openBanking: {
    baseUrl: process.env.OPEN_BANKING_URL || 'https://data.directory.openbankingbrasil.org.br',
    clientId: process.env.OPEN_BANKING_CLIENT_ID,
    clientSecret: process.env.OPEN_BANKING_CLIENT_SECRET,
    redirectUri: process.env.OPEN_BANKING_REDIRECT_URI,
  },

  // Payment gateways
  payments: {
    // PagSeguro
    pagSeguro: {
      email: process.env.PAGSEGURO_EMAIL,
      token: process.env.PAGSEGURO_TOKEN,
      environment: process.env.PAGSEGURO_ENVIRONMENT || 'sandbox',
    },

    // Mercado Pago
    mercadoPago: {
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      environment: process.env.MERCADOPAGO_ENVIRONMENT || 'sandbox',
    },

    // Stone
    stone: {
      clientId: process.env.STONE_CLIENT_ID,
      clientSecret: process.env.STONE_CLIENT_SECRET,
      environment: process.env.STONE_ENVIRONMENT || 'sandbox',
    },
  },

  // NFe/NFSe
  nfe: {
    environment: process.env.NFE_ENVIRONMENT || 'homologacao',
    certificatePath: process.env.NFE_CERTIFICATE_PATH,
    certificatePassword: process.env.NFE_CERTIFICATE_PASSWORD,
  },

  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    logLevel: process.env.LOG_LEVEL || 'info',
  },

  // Rate limiting
  rateLimiting: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    limit: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },

  // Security
  security: {
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    trustProxy: process.env.TRUST_PROXY === 'true',
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
  },
});