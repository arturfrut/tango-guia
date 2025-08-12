import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { WhatsAppContact, WhatsAppMessage, WhatsAppWebhookBody } from '@/app/types/whatsapp';

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
const APP_SECRET = process.env.META_WEBHOOK_SECRET;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

// Función para verificar la firma del webhook
function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!APP_SECRET || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', APP_SECRET)
    .update(payload, 'utf8')
    .digest('hex');

  return signature === `sha256=${expectedSignature}`;
}

// Función para enviar mensaje de respuesta
async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Error enviando mensaje:', result);
      return false;
    }

    console.log('Mensaje enviado exitosamente:', result);
    return true;
  } catch (error) {
    console.error('Error en sendWhatsAppMessage:', error);
    return false;
  }
}

// Función para procesar mensajes entrantes
async function processIncomingMessage(
  message: WhatsAppMessage,
  contact: WhatsAppContact
): Promise<void> {
  const phoneNumber = message.from;
  const contactName = contact.profile.name;

  console.log(`📱 Mensaje de ${contactName} (${phoneNumber})`);

  switch (message.type) {
    case 'text':
      const messageText = message.text?.body || '';
      console.log(`💬 Texto: ${messageText}`);

      // Respuesta automática simple por ahora
      const response = `¡Hola ${contactName}! 👋\n\nRecibí tu mensaje: "${messageText}"\n\n🤖 Soy un bot educativo y estoy en desarrollo. ¡Pronto tendré más funciones!`;

      await sendWhatsAppMessage(phoneNumber, response);
      break;

    case 'button':
      const buttonPayload = message.button?.payload || '';
      console.log(`🔘 Botón presionado: ${buttonPayload}`);

      await sendWhatsAppMessage(phoneNumber, `Presionaste el botón: ${buttonPayload}`);
      break;

    case 'interactive':
      if (message.interactive?.button_reply) {
        const buttonId = message.interactive.button_reply.id;
        console.log(`🔘 Botón interactivo: ${buttonId}`);

        await sendWhatsAppMessage(phoneNumber, `Seleccionaste: ${buttonId}`);
      } else if (message.interactive?.list_reply) {
        const listId = message.interactive.list_reply.id;
        console.log(`📋 Lista seleccionada: ${listId}`);

        await sendWhatsAppMessage(phoneNumber, `Seleccionaste de la lista: ${listId}`);
      }
      break;

    default:
      console.log(`📎 Tipo de mensaje no soportado: ${message.type}`);
      await sendWhatsAppMessage(
        phoneNumber,
        `Recibí un ${message.type}, pero aún no puedo procesarlo. ¡Envíame un mensaje de texto! 😊`
      );
  }
}

// GET - Verificación del webhook
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('🔍 Verificando webhook...');
  console.log('Mode:', mode);
  console.log('Token recibido:', token);
  console.log('Token esperado:', VERIFY_TOKEN);

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado exitosamente');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.log('❌ Verificación fallida');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

// POST - Procesamiento de mensajes
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: WhatsAppWebhookBody = await request.json();
    const rawBody = JSON.stringify(body);
    const signature = request.headers.get('x-hub-signature-256') || '';

    // Verificar firma si está configurada
    if (APP_SECRET && !verifyWebhookSignature(rawBody, signature)) {
      console.log('❌ Firma inválida del webhook');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📨 Webhook recibido:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const { messages, contacts, statuses } = change.value;

            // Procesar mensajes entrantes
            if (messages && contacts) {
              for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                const contact = contacts.find((c) => c.wa_id === message.from);

                if (contact) {
                  await processIncomingMessage(message, contact);
                }
              }
            }

            // Procesar estados de mensajes (entregado, leído, etc.)
            if (statuses) {
              statuses.forEach((status) => {
                console.log(`📋 Estado del mensaje ${status.id}: ${status.status}`);
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
