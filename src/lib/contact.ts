/**
 * H R Furniture contact details — from the client's business card.
 * Shared by the landing page and the collection pages.
 */
export const PHONE_PRIMARY = "+91 84609 75942";
export const PHONE_PRIMARY_TEL = "+918460975942";
export const PHONE_SECONDARY = "+91 70435 39676";
export const PHONE_SECONDARY_TEL = "+917043539676";

// wa.me needs the full international format — 91 (India) + 10-digit mobile.
export const WHATSAPP_NUMBER = "918460975942";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/** WhatsApp link with a pre-filled first message. */
export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const INSTAGRAM_URL = "https://instagram.com/hr_furniture_8";
export const ADDRESS =
  "03, G.F., Block - D, Amber Height, Nr. Marjan Residency, Canal Road, Vatva, Ahmedabad";
export const MAP_SRC =
  "https://www.google.com/maps?q=Amber%20Height%2C%20Canal%20Road%2C%20Vatva%2C%20Ahmedabad%2C%20Gujarat%2C%20India&output=embed";
