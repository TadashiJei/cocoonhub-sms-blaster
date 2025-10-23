export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  guidelines: string;
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'default',
    name: 'Bangko Maharlika Logistics',
    description: 'Default template for delivery fee notifications',
    template: `Hello, {Name}! Good day. This is the Bangko Maharlika Logistics Department. The delivery fee of your {ItemType} via J&T is ₱{Price} pesos. Please send payment to this bank account. Thank you very much!

*THIS BPI ACCOUNT IS STRICTLY FOR DELIVERY FEE PAYMENTS ONLY*

Bank: BPI
Account Name: Jose Piero Longa
Account Number: 4489069194`,
    variables: ['Name', 'ItemType', 'Price'],
    guidelines: `Guidelines:
• Keep message under 160 characters per SMS (will split automatically)
• Use {Name}, {ItemType}, {Price} as placeholders
• Include clear payment instructions
• Add account details for reference
• Professional and courteous tone`,
  },
  {
    id: 'simple',
    name: 'Simple Payment Reminder',
    description: 'Concise payment notification',
    template: `Hi {Name}, your {ItemType} delivery fee is ₱{Price}. Please send payment to BPI Account: 4489069194 (Jose Piero Longa). Thank you!`,
    variables: ['Name', 'ItemType', 'Price'],
    guidelines: `Guidelines:
• Keep it short and direct
• Suitable for follow-up reminders
• Include essential payment info only
• Friendly but professional tone`,
  },
  {
    id: 'urgent',
    name: 'Urgent Payment Notice',
    description: 'For overdue or urgent payments',
    template: `URGENT: {Name}, please send the delivery fee of ₱{Price} for your {ItemType} to BPI Account 4489069194 (Jose Piero Longa) as soon as possible. Thank you.`,
    variables: ['Name', 'ItemType', 'Price'],
    guidelines: `Guidelines:
• Use for overdue payments only
• Include "URGENT" keyword
• Maintain professional tone despite urgency
• Provide clear action items`,
  },
  {
    id: 'confirmation',
    name: 'Payment Confirmation',
    description: 'Confirm receipt of payment',
    template: `Thank you, {Name}! We have received your payment of ₱{Price} for {ItemType}. Your delivery will proceed shortly. Ref: {Price}`,
    variables: ['Name', 'ItemType', 'Price'],
    guidelines: `Guidelines:
• Use after payment is received
• Express gratitude
• Provide next steps
• Include reference information`,
  },
];

export function generateMessage(
  template: MessageTemplate,
  data: {
    name: string;
    itemType: string;
    price: number;
  }
): string {
  let message = template.template;

  message = message.replace(/{Name}/g, data.name);
  message = message.replace(/{ItemType}/g, data.itemType);
  message = message.replace(/{Price}/g, data.price.toFixed(2));

  return message;
}

export function getTemplateById(id: string): MessageTemplate | undefined {
  return MESSAGE_TEMPLATES.find((t) => t.id === id);
}
