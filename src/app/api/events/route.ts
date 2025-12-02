import { faker } from '@faker-js/faker';

const events = [
  {
      "id": 43178,
      "name": "Lowell Gerhold",
      "nodeType": "STRATEGY_EVENT",
      "duration": 53,
      "durationUnit": "MINUTES"
  },
  {
      "id": 43917,
      "name": "Otis Walter IV",
      "nodeType": "STRATEGY_EVENT",
      "duration": 18,
      "durationUnit": "MINUTES"
  },
  {
      "id": 49956,
      "name": "Alex Vandervort",
      "nodeType": "STRATEGY_EVENT",
      "duration": 5,
      "durationUnit": "MINUTES"
  },
  {
      "id": 42308,
      "name": "Sam Powlowski",
      "nodeType": "DISCOVERY_EVENT",
      "duration": 42,
      "durationUnit": "HOURS"
  },
  {
      "id": 46818,
      "name": "Gilbert D'Amore",
      "nodeType": "DISCOVERY_EVENT",
      "duration": 34,
      "durationUnit": "HOURS"
  },
  {
      "id": 42857,
      "name": "Lee Schmitt Jr.",
      "nodeType": "STRATEGY_EVENT",
      "duration": 26,
      "durationUnit": "HOURS"
  },
  {
      "id": 41441,
      "name": "Bill Mayert",
      "nodeType": "DISCOVERY_EVENT",
      "duration": 13,
      "durationUnit": "MINUTES"
  },
  {
      "id": 46661,
      "name": "Pam Roberts",
      "nodeType": "DISCOVERY_EVENT",
      "duration": 49,
      "durationUnit": "HOURS"
  },
  {
      "id": 47315,
      "name": "Lori Larson",
      "nodeType": "STRATEGY_EVENT",
      "duration": 19,
      "durationUnit": "HOURS"
  },
  {
      "id": 42240,
      "name": "Leonard Hintz",
      "nodeType": "DISCOVERY_EVENT",
      "duration": 20,
      "durationUnit": "MINUTES"
  }
]

export async function GET() {
  return Response.json(events);
}