import { faker } from '@faker-js/faker';

export async function GET() {
  const roles = ['Closer', 'Setter', 'Sales Manager', 'superadmin'];
  
  const users = Array.from({ length: 10 }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const randomRole = faker.helpers.arrayElement(roles);
    const hasAvailability = faker.datatype.boolean();
    
    return {
      id: faker.number.int({ min: 40000, max: 50000 }),
      firstName,
      lastName,
      isCompleted: faker.datatype.boolean(),
      email,
      lastLoggedIn: faker.date.recent().toISOString(),
      previewId: `host_${faker.string.alphanumeric(10)}`,
      UserRoles: [{
        deletedAt: null,
        role: {
          accountId: 5842,
          name: randomRole,
          deletedAt: null
        }
      }],
      calendarConnected: faker.datatype.boolean(),
      zoomConnected: faker.datatype.boolean(),
      availabilitySet: hasAvailability,
      inviteNotAccepted: faker.datatype.boolean(),
      activeAvailability: hasAvailability ? {
        id: faker.number.int({ min: 10000, max: 20000 }),
        name: "Working Hours",
        timeZone: "Asia/Karachi",
        availabilityDays: [
          {
            id: 1,
            name: "monday",
            timings: faker.datatype.boolean() ? [{
              startTime: faker.helpers.arrayElement(['09:00', '10:00', '08:00']),
              endTime: faker.helpers.arrayElement(['17:00', '18:00', '19:00'])
            }] : [],
            active: faker.datatype.boolean()
          },
          {
            id: 2,
            name: "tuesday",
            timings: faker.datatype.boolean() ? [{
              startTime: faker.helpers.arrayElement(['09:00', '10:00', '08:00']),
              endTime: faker.helpers.arrayElement(['17:00', '18:00', '19:00'])
            }] : [],
            active: faker.datatype.boolean()
          },
          {
            id: 3,
            name: "wednesday",
            timings: faker.datatype.boolean() ? [{
              startTime: faker.helpers.arrayElement(['09:00', '10:00', '08:00']),
              endTime: faker.helpers.arrayElement(['17:00', '18:00', '19:00'])
            }] : [],
            active: faker.datatype.boolean()
          },
          {
            id: 4,
            name: "thursday",
            timings: faker.datatype.boolean() ? [{
              startTime: faker.helpers.arrayElement(['09:00', '10:00', '08:00']),
              endTime: faker.helpers.arrayElement(['17:00', '18:00', '19:00'])
            }] : [],
            active: faker.datatype.boolean()
          },
          {
            id: 5,
            name: "friday",
            timings: faker.datatype.boolean() ? [{
              startTime: faker.helpers.arrayElement(['09:00', '10:00', '08:00']),
              endTime: faker.helpers.arrayElement(['17:00', '18:00', '19:00'])
            }] : [],
            active: faker.datatype.boolean()
          },
          {
            id: 6,
            name: "saturday",
            timings: [],
            active: false
          },
          {
            id: 7,
            name: "sunday",
            timings: [],
            active: false
          }
        ]
      } : null,
      userAccounts: [{
        accountId: 5842,
        trackedUser: true,
        inviteNotAccepted: faker.datatype.boolean()
      }],
      signedUrl: faker.image.avatar(),
      Team: faker.datatype.boolean() ? [] : null,
      contactsCount: faker.number.int({ min: 0, max: 1000 }),
      userCalls: faker.number.int({ min: 0, max: 500 }),
      strategyCalls: faker.number.int({ min: 0, max: 200 }),
      salesCount: faker.number.int({ min: 0, max: 100 }),
      salesRevenue: faker.number.int({ min: 0, max: 1000000 }),
      depositsCount: faker.number.int({ min: 0, max: 50 }),
      trackedUser: true,
      showUpRate: `${faker.number.int({ min: 0, max: 100 })}%`,
      noShowRate: `${faker.number.int({ min: 0, max: 100 })}%`,
      closingRate: `${faker.number.int({ min: 0, max: 100 })}%`,
      totalCashCollected: faker.number.int({ min: 0, max: 2000000 }),
      totalCashCollectedPerCall: faker.number.int({ min: 0, max: 10000 }),
      recurringCashCollected: faker.number.int({ min: 0, max: 500000 }),
      engagementRate: `${faker.number.int({ min: 0, max: 100 })}%`,
      userNoShows: faker.number.int({ min: 0, max: 50 }),
      liveClosingRate: `${faker.number.int({ min: 0, max: 100 })}%`,
      liveEngagementRate: `${faker.number.int({ min: 0, max: 100 })}%`
    };
  });

  return Response.json(users);
}