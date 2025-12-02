/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod"

export const CustomFieldOptionsSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayIndex: z.number(),
  isArchived: z.boolean(),
  color: z.string().nullable(),
  icon: z.any().nullable(),
  isDefault: z.boolean()
})

export const FieldsSchema = z.object({
  id: z.number(),
  name: z.string(),
  identifier: z.string(),
  description: z.string(),
  inputType: z.string(),
  type: z.string(),
  isSystemField: z.boolean(),
  hidden: z.boolean(),
  configuration: z.any().optional(),
  createdAt: z.string(),
  isSecondaryQuestion: z.boolean(),
  isTableColumn: z.boolean(),
  CustomFieldOptions: z.array(CustomFieldOptionsSchema).optional(),
  slug: z.string(),
  isSystemCustomField: z.boolean()
})

export type ObjectField = z.infer<typeof FieldsSchema>

const contactObjects: ObjectField[] = [
  {
    "id": 1203,
    "name": "Contact Stage",
    "identifier": "{{contact.contact_stage}}",
    "description": "System custom field for contact life cycle stage",
    "inputType": "RADIO_BUTTON",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": null,
    "createdAt": "2025-09-18T21:39:18.926Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5442,
        "name": "New Lead",
        "displayIndex": 0,
        "isArchived": false,
        "color": "",
        "icon": "🆕",
        "isDefault": true
      },
      {
        "id": 5443,
        "name": "Nurturing",
        "displayIndex": 1,
        "isArchived": false,
        "color": "",
        "icon": "🌱",
        "isDefault": false
      },
      {
        "id": 5444,
        "name": "Contacted",
        "displayIndex": 2,
        "isArchived": false,
        "color": "",
        "icon": "📞",
        "isDefault": false
      },
      {
        "id": 5445,
        "name": "Follow-Up Scheduled",
        "displayIndex": 3,
        "isArchived": false,
        "color": "",
        "icon": "⏰",
        "isDefault": false
      },
      {
        "id": 5446,
        "name": "Engaged",
        "displayIndex": 4,
        "isArchived": false,
        "color": "",
        "icon": "📧",
        "isDefault": false
      },
      {
        "id": 5447,
        "name": "Customer",
        "displayIndex": 5,
        "isArchived": false,
        "color": "",
        "icon": "🎉",
        "isDefault": false
      },
      {
        "id": 5448,
        "name": "Onboarded",
        "displayIndex": 6,
        "isArchived": false,
        "color": "",
        "icon": "🔧",
        "isDefault": false
      },
      {
        "id": 5449,
        "name": "Premium Client",
        "displayIndex": 7,
        "isArchived": false,
        "color": "",
        "icon": "💎",
        "isDefault": false
      },
      {
        "id": 5450,
        "name": "Ghosting",
        "displayIndex": 8,
        "isArchived": false,
        "color": "",
        "icon": "👻",
        "isDefault": false
      },
      {
        "id": 5451,
        "name": "Budget Issue",
        "displayIndex": 9,
        "isArchived": false,
        "color": "",
        "icon": "💸",
        "isDefault": false
      },
      {
        "id": 5452,
        "name": "No Decision",
        "displayIndex": 10,
        "isArchived": false,
        "color": "",
        "icon": "⏳",
        "isDefault": false
      },
      {
        "id": 5453,
        "name": "Not a Fit",
        "displayIndex": 11,
        "isArchived": false,
        "color": "",
        "icon": "🚫",
        "isDefault": false
      }
    ],
    "slug": "contact_stage",
    "isSystemCustomField": true
  },
  {
    "id": 1509,
    "name": "First name",
    "identifier": "{{contact.firstName}}",
    "description": "Contact first name",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 0
    },
    "createdAt": "2025-09-29T15:02:12.835Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "firstName",
    "isSystemCustomField": false
  },
  {
    "id": 1510,
    "name": "Last name",
    "identifier": "{{contact.lastName}}",
    "description": "Contact last name",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 1
    },
    "createdAt": "2025-09-29T15:02:12.849Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "lastName",
    "isSystemCustomField": false
  },
  {
    "id": 1511,
    "name": "Email",
    "identifier": "{{contact.email}}",
    "description": "Contact email",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 2
    },
    "createdAt": "2025-09-29T15:02:12.861Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "email",
    "isSystemCustomField": false
  },
  {
    "id": 1512,
    "name": "Phone number",
    "identifier": "{{contact.phoneNumber}}",
    "description": "Contact phone number",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 3
    },
    "createdAt": "2025-09-29T15:02:12.874Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "phoneNumber",
    "isSystemCustomField": false
  },
  {
    "id": 1513,
    "name": "Event(s)",
    "identifier": "{{contact.events}}",
    "description": "Event(s)",
    "inputType": "MULTIPLE_SELECT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 3
    },
    "createdAt": "2025-09-29T15:02:12.887Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "events",
    "isSystemCustomField": false
  },
  {
    "id": 1514,
    "name": "Name",
    "identifier": "{{contact.name}}",
    "description": "Contact name",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 4
    },
    "createdAt": "2025-09-29T15:02:12.902Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "name",
    "isSystemCustomField": false
  },
  {
    "id": 1515,
    "name": "Scheduling Status",
    "identifier": "{{contact.status}}",
    "description": "Scheduling status",
    "inputType": "SINGLE_SELECT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 5
    },
    "createdAt": "2025-09-29T15:02:12.915Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5792,
        "name": "Potential",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2DD4BF",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5793,
        "name": "Qualified",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5794,
        "name": "Disqualified",
        "displayIndex": 2,
        "isArchived": false,
        "color": "#DC2626",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5795,
        "name": "Strategy Call Booked",
        "displayIndex": 3,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5796,
        "name": "Discovery Call Booked",
        "displayIndex": 4,
        "isArchived": false,
        "color": "#9333EA",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "status",
    "isSystemCustomField": false
  },
  {
    "id": 1516,
    "name": "Initial contact status",
    "identifier": "{{contact.initialStatus}}",
    "description": "Status where the lead left last time",
    "inputType": "SINGLE_SELECT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 6
    },
    "createdAt": "2025-09-29T15:02:12.983Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5797,
        "name": "Potential",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2DD4BF",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5798,
        "name": "Qualified",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5799,
        "name": "Disqualified",
        "displayIndex": 2,
        "isArchived": false,
        "color": "#DC2626",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5800,
        "name": "Strategy Call Booked",
        "displayIndex": 3,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5801,
        "name": "Discovery Call Booked",
        "displayIndex": 4,
        "isArchived": false,
        "color": "#9333EA",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "initialStatus",
    "isSystemCustomField": false
  },
  {
    "id": 1517,
    "name": "Status last modified at",
    "identifier": "{{contact.statusUpdatedAt}}",
    "description": "Last contact status modified at time",
    "inputType": "DATE",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 7
    },
    "createdAt": "2025-09-29T15:02:13.050Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "statusUpdatedAt",
    "isSystemCustomField": false
  },
  {
    "id": 1518,
    "name": "Last interaction type",
    "identifier": "{{contact.lastInteraction}}",
    "description": "Last interaction of lead (e.g cancelled...)",
    "inputType": "SINGLE_SELECT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 8
    },
    "createdAt": "2025-09-29T15:02:13.064Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "lastInteraction",
    "isSystemCustomField": false
  },
  {
    "id": 1519,
    "name": "Closer owner",
    "identifier": "{{contact.user}}",
    "description": "Closer owner",
    "inputType": "USER",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 9
    },
    "createdAt": "2025-09-29T15:02:13.075Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "user",
    "isSystemCustomField": false
  },
  {
    "id": 1520,
    "name": "Number of strategy call booked",
    "identifier": "{{contact.strategyCallsBooked}}",
    "description": "Number of strategy calls booked with lead",
    "inputType": "NUMBER",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 10
    },
    "createdAt": "2025-09-29T15:02:13.088Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "strategyCallsBooked",
    "isSystemCustomField": false
  },
  {
    "id": 1521,
    "name": "Number of discovery call booked",
    "identifier": "{{contact.discoveryCallsBooked}}",
    "description": "Number of discovery calls booked with lead",
    "inputType": "NUMBER",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 11
    },
    "createdAt": "2025-09-29T15:02:13.100Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "discoveryCallsBooked",
    "isSystemCustomField": false
  },
  {
    "id": 1522,
    "name": "Number of calls booked",
    "identifier": "{{contact.totalCallsBooked}}",
    "description": "Total sum of all calls booked",
    "inputType": "NUMBER",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 12
    },
    "createdAt": "2025-09-29T15:02:13.115Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "totalCallsBooked",
    "isSystemCustomField": false
  },
  {
    "id": 1523,
    "name": "UTM Campaign",
    "identifier": "{{contact.utmCampaign}}",
    "description": "UTM Campaign",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 13
    },
    "createdAt": "2025-09-29T15:02:13.126Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "utmCampaign",
    "isSystemCustomField": false
  },
  {
    "id": 1524,
    "name": "UTM Source",
    "identifier": "{{contact.utmSource}}",
    "description": "UTM Source",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 14
    },
    "createdAt": "2025-09-29T15:02:13.141Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "utmSource",
    "isSystemCustomField": false
  },
  {
    "id": 1525,
    "name": "UTM Medium",
    "identifier": "{{contact.utmMedium}}",
    "description": "UTM Medium",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 15
    },
    "createdAt": "2025-09-29T15:02:13.153Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "utmMedium",
    "isSystemCustomField": false
  },
  {
    "id": 1526,
    "name": "UTM Content",
    "identifier": "{{contact.utmContent}}",
    "description": "UTM Content",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 16
    },
    "createdAt": "2025-09-29T15:02:13.163Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "utmContent",
    "isSystemCustomField": false
  },
  {
    "id": 1527,
    "name": "UTM Term",
    "identifier": "{{contact.utmTerm}}",
    "description": "UTM Term",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 17
    },
    "createdAt": "2025-09-29T15:02:13.174Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "utmTerm",
    "isSystemCustomField": false
  },
  {
    "id": 1528,
    "name": "Country",
    "identifier": "{{contact.country}}",
    "description": "Contact country",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 18
    },
    "createdAt": "2025-09-29T15:02:13.185Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "country",
    "isSystemCustomField": false
  },
  {
    "id": 1529,
    "name": "Timezone",
    "identifier": "{{contact.timeZone}}",
    "description": "Contact timezone",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 19
    },
    "createdAt": "2025-09-29T15:02:13.196Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "timeZone",
    "isSystemCustomField": false
  },
  {
    "id": 1530,
    "name": "Contact creation date",
    "identifier": "{{contact.createdAt}}",
    "description": "Contact creation date",
    "inputType": "DATE",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 20
    },
    "createdAt": "2025-09-29T15:02:13.210Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "createdAt",
    "isSystemCustomField": false
  },
  {
    "id": 1531,
    "name": "Contact secondary email",
    "identifier": "{{contact.secondary_email}}",
    "description": "Contact secondary email",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 21
    },
    "createdAt": "2025-09-29T15:02:13.221Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "secondary_email",
    "isSystemCustomField": false
  },
  {
    "id": 1532,
    "name": "Contact secondary phone number",
    "identifier": "{{contact.secondary_phoneNumber}}",
    "description": "Contact secondary phone number",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 22
    },
    "createdAt": "2025-09-29T15:02:13.233Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "secondary_phoneNumber",
    "isSystemCustomField": false
  },
  {
    "id": 1533,
    "name": "IP address",
    "identifier": "{{contact.ipAddress}}",
    "description": "Contact ip address",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 23
    },
    "createdAt": "2025-09-29T15:02:13.247Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "ipAddress",
    "isSystemCustomField": false
  },
  {
    "id": 1534,
    "name": "Updated On",
    "identifier": "{{contact.updatedAt}}",
    "description": "Contact updation time",
    "inputType": "DATE",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 24
    },
    "createdAt": "2025-09-29T15:02:13.259Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "updatedAt",
    "isSystemCustomField": false
  },
  {
    "id": 1535,
    "name": "Contact card link",
    "identifier": "{{contact.previewId}}",
    "description": "Contact card link",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 25
    },
    "createdAt": "2025-09-29T15:02:13.271Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "previewId",
    "isSystemCustomField": false
  },
  {
    "id": 1536,
    "name": "Contact source",
    "identifier": "{{contact.createdVia}}",
    "description": "Contact source",
    "inputType": "TEXT",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 26
    },
    "createdAt": "2025-09-29T15:02:13.283Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "createdVia",
    "isSystemCustomField": false
  },
  {
    "id": 1537,
    "name": "id",
    "identifier": "{{contact.previewId}}",
    "description": "Contact id",
    "inputType": "NUMBER",
    "type": "CONTACT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 27
    },
    "createdAt": "2025-09-29T15:02:13.296Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "previewId",
    "isSystemCustomField": false
  }
]

const callObjects: ObjectField[] = [
  {
    "id": 1199,
    "name": "Call Outcome",
    "identifier": "{{call.call_outcome}}",
    "description": "System custom field for call outcomes",
    "inputType": "RADIO_BUTTON",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": null,
    "createdAt": "2025-09-18T21:39:18.869Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5138,
        "name": "WON",
        "displayIndex": 0,
        "isArchived": false,
        "color": "green",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5139,
        "name": "NO_SALE",
        "displayIndex": 1,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5140,
        "name": "FOLLOW_UP_SCHEDULE",
        "displayIndex": 2,
        "isArchived": false,
        "color": "purple",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5141,
        "name": "PENDING",
        "displayIndex": 3,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5142,
        "name": "APPROVED",
        "displayIndex": 4,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5143,
        "name": "REJECTED",
        "displayIndex": 5,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "call_outcome",
    "isSystemCustomField": true
  },
  {
    "id": 1200,
    "name": "Appointment Setting Outcome",
    "identifier": "{{call.appointment_setting_outcome}}",
    "description": "System custom field for appointment setting outcomes",
    "inputType": "RADIO_BUTTON",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": null,
    "createdAt": "2025-09-18T21:39:18.881Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5198,
        "name": "WON",
        "displayIndex": 0,
        "isArchived": false,
        "color": "green",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5199,
        "name": "NO_SALE",
        "displayIndex": 1,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5200,
        "name": "FOLLOW_UP_SCHEDULE",
        "displayIndex": 2,
        "isArchived": false,
        "color": "purple",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5201,
        "name": "PENDING",
        "displayIndex": 3,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5202,
        "name": "APPROVED",
        "displayIndex": 4,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5203,
        "name": "REJECTED",
        "displayIndex": 5,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "appointment_setting_outcome",
    "isSystemCustomField": true
  },
  {
    "id": 1201,
    "name": "No Sale Reason",
    "identifier": "{{call.no_sale_reason}}",
    "description": "System custom field for no sale reasons",
    "inputType": "RADIO_BUTTON",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": null,
    "createdAt": "2025-09-18T21:39:18.896Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5267,
        "name": "UNQUALIFIED",
        "displayIndex": 0,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5268,
        "name": "NO_SHOW",
        "displayIndex": 1,
        "isArchived": false,
        "color": "yellow",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5269,
        "name": "CONTACT_CANCELLED",
        "displayIndex": 2,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5270,
        "name": "ADMIN_CANCELLED",
        "displayIndex": 3,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5271,
        "name": "NOT_INTERESTED",
        "displayIndex": 4,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5272,
        "name": "BAD_FIT",
        "displayIndex": 5,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5273,
        "name": "OTHER",
        "displayIndex": 6,
        "isArchived": false,
        "color": "gray",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "no_sale_reason",
    "isSystemCustomField": true
  },
  {
    "id": 1202,
    "name": "Objection",
    "identifier": "{{call.objection}}",
    "description": "System custom field for objections",
    "inputType": "RADIO_BUTTON",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": null,
    "createdAt": "2025-09-18T21:39:18.909Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5328,
        "name": "MONEY",
        "displayIndex": 0,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5329,
        "name": "LOGISTIC",
        "displayIndex": 1,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5330,
        "name": "PARTNER",
        "displayIndex": 2,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5331,
        "name": "FEAR",
        "displayIndex": 3,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5332,
        "name": "SMOKE_SCREEN",
        "displayIndex": 4,
        "isArchived": false,
        "color": "red",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5333,
        "name": "NO_OBJECTION",
        "displayIndex": 5,
        "isArchived": false,
        "color": "gray",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "objection",
    "isSystemCustomField": true
  },
  {
    "id": 1539,
    "name": "Call creation date",
    "identifier": "{{call.createdAt}}",
    "description": "Call creation time",
    "inputType": "DATE",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 30
    },
    "createdAt": "2025-09-29T15:02:13.319Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "createdAt",
    "isSystemCustomField": false
  },
  {
    "id": 1540,
    "name": "Call start date",
    "identifier": "{{call.dateTime}}",
    "description": "Call start date",
    "inputType": "DATE",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 31
    },
    "createdAt": "2025-09-29T15:02:13.329Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "dateTime",
    "isSystemCustomField": false
  },
  {
    "id": 1541,
    "name": "Call end date",
    "identifier": "{{call.endTime}}",
    "description": "Call end date",
    "inputType": "DATE",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 32
    },
    "createdAt": "2025-09-29T15:02:13.346Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "endTime",
    "isSystemCustomField": false
  },
  {
    "id": 1542,
    "name": "Invitee start date",
    "identifier": "{{call.inviteeDateTime}}",
    "description": "Invitee start date",
    "inputType": "DATE",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 33
    },
    "createdAt": "2025-09-29T15:02:13.364Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "inviteeDateTime",
    "isSystemCustomField": false
  },
  {
    "id": 1543,
    "name": "Invitee end date",
    "identifier": "{{call.inviteeEndTime}}",
    "description": "Invitee end date",
    "inputType": "DATE",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 34
    },
    "createdAt": "2025-09-29T15:02:13.377Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "inviteeEndTime",
    "isSystemCustomField": false
  },
  {
    "id": 1548,
    "name": "Discovery call outcome",
    "identifier": "{{call.discoveryCallOutcome}}",
    "description": "Discovery call outcome",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 34
    },
    "createdAt": "2025-09-29T15:02:13.622Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5820,
        "name": "Approved",
        "displayIndex": 0,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5821,
        "name": "Rejected",
        "displayIndex": 1,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5822,
        "name": "Pending",
        "displayIndex": 2,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "discoveryCallOutcome",
    "isSystemCustomField": false
  },
  {
    "id": 1544,
    "name": "Strategy call outcome",
    "identifier": "{{call.strategyCallOutcome}}",
    "description": "Strategy call outcome",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 35
    },
    "createdAt": "2025-09-29T15:02:13.390Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5802,
        "name": "Sale",
        "displayIndex": 0,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5803,
        "name": "No Sale",
        "displayIndex": 1,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5804,
        "name": "Pending",
        "displayIndex": 2,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "strategyCallOutcome",
    "isSystemCustomField": false
  },
  {
    "id": 1545,
    "name": "Strategy call no sale reason",
    "identifier": "{{call.strategyCallNoSaleReason}}",
    "description": "Strategy call no sale reason",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 36
    },
    "createdAt": "2025-09-29T15:02:13.436Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5805,
        "name": "No Show",
        "displayIndex": 0,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5806,
        "name": "Unqualified",
        "displayIndex": 1,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5807,
        "name": "Contact Cancelled",
        "displayIndex": 2,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5808,
        "name": "Admin Cancelled",
        "displayIndex": 3,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5809,
        "name": "Follow Up Schedule",
        "displayIndex": 4,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5810,
        "name": "Not Interested",
        "displayIndex": 5,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "strategyCallNoSaleReason",
    "isSystemCustomField": false
  },
  {
    "id": 1546,
    "name": "Strategy call objection",
    "identifier": "{{call.strategyCallObjection}}",
    "description": "Strategy call objection",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 37
    },
    "createdAt": "2025-09-29T15:02:13.501Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5811,
        "name": "Smoke Screen",
        "displayIndex": 0,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5812,
        "name": "Money",
        "displayIndex": 1,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5813,
        "name": "Partner",
        "displayIndex": 2,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5814,
        "name": "No Objection",
        "displayIndex": 3,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5815,
        "name": "Logistic",
        "displayIndex": 4,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5816,
        "name": "Fear",
        "displayIndex": 5,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "strategyCallObjection",
    "isSystemCustomField": false
  },
  {
    "id": 1547,
    "name": "Call status",
    "identifier": "{{call.status}}",
    "description": "Call status",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 38
    },
    "createdAt": "2025-09-29T15:02:13.584Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5817,
        "name": "Rescheduled",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5818,
        "name": "Cancelled",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#DC2626",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5819,
        "name": "Scheduled",
        "displayIndex": 2,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "status",
    "isSystemCustomField": false
  },
  {
    "id": 1549,
    "name": "Discovery call rejection reason",
    "identifier": "{{call.discoveryCallRejectionReason}}",
    "description": "Discovery call rejection reason",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 39
    },
    "createdAt": "2025-09-29T15:02:13.679Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5823,
        "name": "Not Interested",
        "displayIndex": 0,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5824,
        "name": "No Show",
        "displayIndex": 1,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5825,
        "name": "Contact Cancelled",
        "displayIndex": 2,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5826,
        "name": "Admin Cancelled",
        "displayIndex": 3,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5827,
        "name": "Bad Fit",
        "displayIndex": 4,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5828,
        "name": "Other",
        "displayIndex": 5,
        "isArchived": false,
        "color": null,
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "discoveryCallRejectionReason",
    "isSystemCustomField": false
  },
  {
    "id": 1550,
    "name": "Closer owner",
    "identifier": "{{call.user}}",
    "description": "Closer owner",
    "inputType": "USER",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 40
    },
    "createdAt": "2025-09-29T15:02:13.747Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "user",
    "isSystemCustomField": false
  },
  {
    "id": 1551,
    "name": "Setter owner",
    "identifier": "{{call.setter}}",
    "description": "Setter owner",
    "inputType": "USER",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 41
    },
    "createdAt": "2025-09-29T15:02:13.771Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "setter",
    "isSystemCustomField": false
  },
  {
    "id": 1552,
    "name": "Event",
    "identifier": "{{call.event}}",
    "description": "Event of the call",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 42
    },
    "createdAt": "2025-09-29T15:02:13.783Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "event",
    "isSystemCustomField": false
  },
  {
    "id": 1555,
    "name": "Cancel call link",
    "identifier": "{{call.cancelCallLink}}",
    "description": "Cancel call link",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 45,
      "selectionClause": {
        "previewId": true
      }
    },
    "createdAt": "2025-09-29T15:02:13.816Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "cancelCallLink",
    "isSystemCustomField": false
  },
  {
    "id": 1556,
    "name": "Reschedule call link",
    "identifier": "{{call.rescheduleCallLink}}",
    "description": "Reschedule call link",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 46,
      "selectionClause": {
        "previewId": true
      }
    },
    "createdAt": "2025-09-29T15:02:13.828Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "rescheduleCallLink",
    "isSystemCustomField": false
  },
  {
    "id": 1557,
    "name": "Call type",
    "identifier": "{{call.callType}}",
    "description": "Call type",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 47,
      "selectionClause": {
        "callType": true
      }
    },
    "createdAt": "2025-09-29T15:02:13.836Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5829,
        "name": "Strategy Call",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5830,
        "name": "Discovery Call",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "callType",
    "isSystemCustomField": false
  },
  {
    "id": 1558,
    "name": "Location",
    "identifier": "{{call.location}}",
    "description": "Location where call will be hosted",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 48,
      "selectionClause": {
        "location": true
      }
    },
    "createdAt": "2025-09-29T15:02:13.887Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5831,
        "name": "ZOOM",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5832,
        "name": "PHONE_CALL",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5833,
        "name": "GOOGLE_MEET",
        "displayIndex": 2,
        "isArchived": false,
        "color": "#DC2626",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "location",
    "isSystemCustomField": false
  },
  {
    "id": 1559,
    "name": "Host meeting link",
    "identifier": "{{call.locationLink}}",
    "description": "Host meeting link",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 49
    },
    "createdAt": "2025-09-29T15:02:13.927Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "locationLink",
    "isSystemCustomField": false
  },
  {
    "id": 1560,
    "name": "Invitee meeting link",
    "identifier": "{{call.locationLinkInvitee}}",
    "description": "Invitee meeting link",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 50
    },
    "createdAt": "2025-09-29T15:02:13.935Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "locationLinkInvitee",
    "isSystemCustomField": false
  },
  {
    "id": 1561,
    "name": "Duration of call",
    "identifier": "{{call.duration}}",
    "description": "Duration of call",
    "inputType": "NUMBER",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 51,
      "selectionClause": {
        "duration": true
      }
    },
    "createdAt": "2025-09-29T15:02:13.946Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "duration",
    "isSystemCustomField": false
  },
  {
    "id": 1562,
    "name": "Unit of duration of call",
    "identifier": "{{call.durationUnit}}",
    "description": "Unit of duration of call",
    "inputType": "SINGLE_SELECT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 52,
      "selectionClause": {
        "durationUnit": true
      }
    },
    "createdAt": "2025-09-29T15:02:13.976Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5834,
        "name": "Minutes",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5835,
        "name": "Hours",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "durationUnit",
    "isSystemCustomField": false
  },
  {
    "id": 1563,
    "name": "Invitee timezone",
    "identifier": "{{call.timeZone}}",
    "description": "Invitee timezone",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 53,
      "selectionClause": {
        "timeZone": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.024Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "timeZone",
    "isSystemCustomField": false
  },
  {
    "id": 1564,
    "name": "Reason of rescheduling",
    "identifier": "{{call.rescheduleReason}}",
    "description": "Reason of rescheduling",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 54,
      "selectionClause": {
        "rescheduleReason": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.039Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "rescheduleReason",
    "isSystemCustomField": false
  },
  {
    "id": 1565,
    "name": "Rescheduled by",
    "identifier": "{{call.rescheduledBy}}",
    "description": "Rescheduled by",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 55,
      "selectionClause": {
        "rescheduledBy": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.050Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "rescheduledBy",
    "isSystemCustomField": false
  },
  {
    "id": 1566,
    "name": "Cancellation reason",
    "identifier": "{{call.cancelReason}}",
    "description": "Cancellation reason",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 56,
      "selectionClause": {
        "cancelReason": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.077Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "cancelReason",
    "isSystemCustomField": false
  },
  {
    "id": 1567,
    "name": "Cancelled by",
    "identifier": "{{call.cancelledBy}}",
    "description": "Cancelled by",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 57,
      "selectionClause": {
        "cancelledBy": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.091Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "cancelledBy",
    "isSystemCustomField": false
  },
  {
    "id": 1568,
    "name": "Internal Call notes",
    "identifier": "{{call.notes}}",
    "description": "Internal Call notes",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 58,
      "selectionClause": {
        "notes": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.102Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "notes",
    "isSystemCustomField": false
  },
  {
    "id": 1569,
    "name": "Rescheduled",
    "identifier": "{{call.isRescheduled}}",
    "description": "Is rescheduled",
    "inputType": "CHECK_BOX",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 59,
      "selectionClause": {
        "isRescheduled": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.112Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5834,
        "name": "Minutes",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5835,
        "name": "Hours",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "isRescheduled",
    "isSystemCustomField": false
  },
  {
    "id": 1570,
    "name": "Cancelled",
    "identifier": "{{call.isCancelled}}",
    "description": "Is cancelled",
    "inputType": "CHECK_BOX",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 60,
      "selectionClause": {
        "isCancelled": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.125Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "isCancelled",
    "isSystemCustomField": false
  },
  {
    "id": 1571,
    "name": "Past call",
    "identifier": "{{call.isPastCall}}",
    "description": "Is past call",
    "inputType": "CHECK_BOX",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 61,
      "selectionClause": {
        "isPastCall": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.136Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "isPastCall",
    "isSystemCustomField": false
  },
  {
    "id": 1572,
    "name": "Overbooked",
    "identifier": "{{call.totalOverBooked}}",
    "description": "Overbooked",
    "inputType": "NUMBER",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 62,
      "selectionClause": {
        "totalOverBooked": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.146Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "totalOverBooked",
    "isSystemCustomField": false
  },
  {
    "id": 1573,
    "name": "Google calendar event status",
    "identifier": "{{call.googleResponseStatus}}",
    "description": "Google calendar event status",
    "inputType": "TEXT",
    "type": "CALL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 63,
      "selectionClause": {
        "googleResponseStatus": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.159Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "googleResponseStatus",
    "isSystemCustomField": false
  }
]

const eventObjects: ObjectField[] = [
  {
    "id": 1574,
    "name": "Event type",
    "identifier": "{{event.event_type}}",
    "description": "Event type",
    "inputType": "SINGLE_SELECT",
    "type": "EVENT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 59
    },
    "createdAt": "2025-09-29T15:02:14.173Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5836,
        "name": "Strategy Event",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5837,
        "name": "Discovery Event",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "event_type",
    "isSystemCustomField": false
  },
  {
    "id": 1575,
    "name": "Event",
    "identifier": "{{event.event}}",
    "description": "Event of the call",
    "inputType": "SINGLE_SELECT",
    "type": "EVENT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {},
    "createdAt": "2025-09-29T15:02:14.201Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "event",
    "isSystemCustomField": false
  },
  {
    "id": 1576,
    "name": "Location",
    "identifier": "{{event.location}}",
    "description": "Location where call will be hosted",
    "inputType": "SINGLE_SELECT",
    "type": "EVENT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 60,
      "selectionClause": {
        "location": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.212Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5838,
        "name": "ZOOM",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5839,
        "name": "PHONE_CALL",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5840,
        "name": "GOOGLE_MEET",
        "displayIndex": 2,
        "isArchived": false,
        "color": "#DC2626",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "location",
    "isSystemCustomField": false
  },
  {
    "id": 1577,
    "name": "Duration",
    "identifier": "{{event.duration}}",
    "description": "Duration of event",
    "inputType": "NUMBER",
    "type": "EVENT",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 61,
      "selectionClause": {
        "duration": true
      }
    },
    "createdAt": "2025-09-29T15:02:14.254Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "duration",
    "isSystemCustomField": false
  }
]

const dealObjects: ObjectField[] = [
  {
    "id": 1578,
    "name": "Product",
    "identifier": "{{deal.product}}",
    "description": "Product",
    "inputType": "SINGLE_SELECT",
    "type": "DEAL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 62
    },
    "createdAt": "2025-09-29T15:02:14.266Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "product",
    "isSystemCustomField": false
  },
  {
    "id": 1579,
    "name": "Payment type",
    "identifier": "{{deal.paymentType}}",
    "description": "Payment type",
    "inputType": "SINGLE_SELECT",
    "type": "DEAL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 63
    },
    "createdAt": "2025-09-29T15:02:14.277Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [
      {
        "id": 5841,
        "name": "One time",
        "displayIndex": 0,
        "isArchived": false,
        "color": "#2563EB",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5842,
        "name": "Deposit",
        "displayIndex": 1,
        "isArchived": false,
        "color": "#0D9488",
        "icon": null,
        "isDefault": false
      },
      {
        "id": 5843,
        "name": "Recurring",
        "displayIndex": 2,
        "isArchived": false,
        "color": "#DC2626",
        "icon": null,
        "isDefault": false
      }
    ],
    "slug": "paymentType",
    "isSystemCustomField": false
  },
  {
    "id": 1580,
    "name": "income",
    "identifier": "{{deal.income}}",
    "description": "Income",
    "inputType": "NUMBER",
    "type": "DEAL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 64
    },
    "createdAt": "2025-09-29T15:02:14.329Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "income",
    "isSystemCustomField": false
  },
  {
    "id": 1581,
    "name": "Sales",
    "identifier": "{{deal.sales}}",
    "description": "Sales",
    "inputType": "NUMBER",
    "type": "DEAL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 65
    },
    "createdAt": "2025-09-29T15:02:14.338Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "sales",
    "isSystemCustomField": false
  },
  {
    "id": 1582,
    "name": "Deal date",
    "identifier": "{{deal.date}}",
    "description": "Deal date",
    "inputType": "DATE",
    "type": "DEAL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 66
    },
    "createdAt": "2025-09-29T15:02:14.351Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "date",
    "isSystemCustomField": false
  },
  {
    "id": 1583,
    "name": "Closer owner",
    "identifier": "{{deal.user}}",
    "description": "Closer owner",
    "inputType": "USER",
    "type": "DEAL",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 67
    },
    "createdAt": "2025-09-29T15:02:14.363Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "user",
    "isSystemCustomField": false
  }
]

const userObjects: ObjectField[] = [
  {
    "id": 1587,
    "name": "id",
    "identifier": "{{user.id}}",
    "description": "User id",
    "inputType": "NUMBER",
    "type": "USER",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 68
    },
    "createdAt": "2025-09-29T15:02:14.413Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "id",
    "isSystemCustomField": false
  },
  {
    "id": 1588,
    "name": "Name",
    "identifier": "{{user.name}}",
    "description": "User name",
    "inputType": "TEXT",
    "type": "USER",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 69
    },
    "createdAt": "2025-09-29T15:02:14.428Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "name",
    "isSystemCustomField": false
  },
  {
    "id": 1589,
    "name": "Email",
    "identifier": "{{user.email}}",
    "description": "User email",
    "inputType": "TEXT",
    "type": "USER",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 70
    },
    "createdAt": "2025-09-29T15:02:14.440Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "email",
    "isSystemCustomField": false
  },
  {
    "id": 1590,
    "name": "Role",
    "identifier": "{{user.role}}",
    "description": "User role",
    "inputType": "SINGLE_SELECT",
    "type": "USER",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 71
    },
    "createdAt": "2025-09-29T15:02:14.452Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "role",
    "isSystemCustomField": false
  },
  {
    "id": 1591,
    "name": "Availability",
    "identifier": "{{user.availability}}",
    "description": "User availability",
    "inputType": "SINGLE_SELECT",
    "type": "USER",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 72
    },
    "createdAt": "2025-09-29T15:02:14.467Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "availability",
    "isSystemCustomField": false
  },
  {
    "id": 1592,
    "name": "Connected apps",
    "identifier": "{{user.connected_apps}}",
    "description": "User connected apps",
    "inputType": "MULTIPLE_SELECT",
    "type": "USER",
    "isSystemField": true,
    "hidden": false,
    "configuration": {
      "displayIndex": 73
    },
    "createdAt": "2025-09-29T15:02:14.477Z",
    "isSecondaryQuestion": false,
    "isTableColumn": true,
    "CustomFieldOptions": [],
    "slug": "connected_apps",
    "isSystemCustomField": false
  }
]

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const objectType = searchParams.get('objectType');

  let objects: ObjectField[] = [];
  switch (objectType) {
    case "CONTACT":
      objects = contactObjects;
      break;
    case "CALL":
      objects = callObjects;
      break;
    case "EVENT":
      objects = eventObjects;
      break;
    case "DEAL":
      objects = dealObjects;
      break;
    case "USER":
      objects = userObjects;
      break;
    default:
      objects = [];
  }

  return Response.json(objects);
}