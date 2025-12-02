import { faker } from '@faker-js/faker';

export async function GET() {
  const contacts = Array.from({ length: 15 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    status: faker.helpers.arrayElement(['lead', 'prospect', 'customer', 'closed']),
    source: faker.helpers.arrayElement(['Website', 'Referral', 'Cold Call', 'Email Campaign']),
    createdAt: faker.date.past().toISOString(),
    assignedTo: faker.person.fullName()
  }));

  return Response.json(contacts);
}