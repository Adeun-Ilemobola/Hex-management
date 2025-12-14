// You may need to update this import path depending on where your types live
// or simply use the interfaces defined below.
import { PropertyTypeEnum, StatusEnum } from "@/lib/ZodObject";

// ─── 1. AMENITIES ────────────────────────────────────────────────────────────
export const amenitiesItems: { value: string; label: string }[] = [
  { value: "elevator", label: "Elevator" },
  { value: "gym", label: "Gym" },
  { value: "fireplace", label: "Fireplace" },
  { value: "pool", label: "Swimming Pool" },
  { value: "garden", label: "Garden" },
  { value: "garage", label: "Garage" },
  { value: "balcony", label: "Balcony" },
  { value: "terrace", label: "Terrace" },
  { value: "bbq_area", label: "BBQ Area" },
  { value: "roof_deck", label: "Roof Deck" },
  { value: "concierge", label: "Concierge Service" },
  { value: "doorman", label: "Doorman" },
  { value: "security", label: "24/7 Security" },
  { value: "cctv", label: "CCTV" },
  { value: "playground", label: "Playground" },
  { value: "sports_court", label: "Sports Court" },
  { value: "clubhouse", label: "Clubhouse" },
  { value: "spa", label: "Spa" },
  { value: "sauna", label: "Sauna" },
  { value: "steam_room", label: "Steam Room" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "laundry_room", label: "Laundry Room" },
  { value: "storage", label: "Storage Room" },
  { value: "basement", label: "Basement" },
  { value: "attic", label: "Attic" },
  { value: "office", label: "Home Office" },
  { value: "library", label: "Library" },
  { value: "wine_cellar", label: "Wine Cellar" },
  { value: "media_room", label: "Media Room" },
  { value: "home_theater", label: "Home Theater" },
  { value: "game_room", label: "Game Room" },
  { value: "guest_room", label: "Guest Room" },
  { value: "maid_room", label: "Maid’s Room" },
  { value: "pet_friendly", label: "Pet Friendly" },
  { value: "wheelchair_access", label: "Wheelchair Access" },
  { value: "solar_panels", label: "Solar Panels" },
  { value: "energy_efficient", label: "Energy Efficient Appliances" },
  { value: "double_glazing", label: "Double Glazing" },
  { value: "soundproofing", label: "Soundproofing" },
  { value: "central_heating", label: "Central Heating" },
  { value: "underfloor_heating", label: "Underfloor Heating" },
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "ceiling_fan", label: "Ceiling Fan" },
  { value: "smart_home", label: "Smart Home System" },
  { value: "alarm_system", label: "Alarm System" },
  { value: "intercom", label: "Intercom" },
  { value: "waterfront", label: "Waterfront" },
  { value: "mountain_view", label: "Mountain View" },
  { value: "city_view", label: "City View" },
  { value: "ocean_view", label: "Ocean View" },
  { value: "park_view", label: "Park View" },
  { value: "golf_course", label: "Golf Course Nearby" },
  { value: "ski_in_out", label: "Ski In/Ski Out" },
  { value: "horse_stables", label: "Horse Stables" },
  { value: "farm_area", label: "Farm Area" },
  { value: "boat_dock", label: "Boat Dock" },
  { value: "helipad", label: "Helipad" },
  { value: "greenhouse", label: "Greenhouse" },
  { value: "workshop", label: "Workshop" },
  { value: "charging_station", label: "EV Charging Station" },
  { value: "covered_parking", label: "Covered Parking" },
  { value: "open_parking", label: "Open Parking" },
  { value: "valet_parking", label: "Valet Parking" },
  { value: "bicycle_storage", label: "Bicycle Storage" },
  { value: "package_room", label: "Package Room" },
  { value: "cold_storage", label: "Cold Storage" }
];

// ─── 2. SAMPLE PROPERTIES ────────────────────────────────────────────────────
// Simple interface for the mock cards
export interface MockPropertyCard {
  id: string;
  img?: string;
  name: string;
  address: string;
  status: string;
  saleStatus: "SELL" | "RENT" | "LEASE";
}

export const sampleProperties: MockPropertyCard[] = [
  {
    id: "prop-001",
    img: "https://via.placeholder.com/300x200?text=House+1",
    name: "Maple Grove Estate",
    address: "123 Maple St, Vancouver, BC",
    status: "active",
    saleStatus: "SELL",
  },
  {
    id: "prop-002",
    img: "https://via.placeholder.com/300x200?text=Condo+2",
    name: "Downtown Skyloft",
    address: "456 Granville Ave, Vancouver, BC",
    status: "pending",
    saleStatus: "RENT",
  },
  {
    id: "prop-003",
    img: "https://via.placeholder.com/300x200?text=Townhouse+3",
    name: "Riverside Townhomes",
    address: "789 River Rd, Richmond, BC",
    status: "sold",
    saleStatus: "SELL",
  },
  {
    id: "prop-004",
    name: "Forest Heights Cabin",
    address: "12 Pine Needle Dr, Squamish, BC",
    status: "active",
    saleStatus: "LEASE",
  },
  {
    id: "prop-005",
    img: "https://via.placeholder.com/300x200?text=Luxury+Villa",
    name: "Seaside Luxury Villa",
    address: "34 Oceanview Blvd, West Vancouver, BC",
    status: "pending",
    saleStatus: "SELL",
  },
  {
    id: "prop-006",
    img: "https://via.placeholder.com/300x200?text=Loft+6",
    name: "Granite Loft Suites",
    address: "56 Coal Harbour, Vancouver, BC",
    status: "active",
    saleStatus: "RENT",
  },
  {
    id: "prop-007",
    name: "Countryside Bungalow",
    address: "78 Meadow Ln, Langley, BC",
    status: "sold",
    saleStatus: "SELL",
  },
  {
    id: "prop-008",
    img: "https://via.placeholder.com/300x200?text=Modern+Flat",
    name: "Highland Modern Flat",
    address: "90 Mountain Rd, Whistler, BC",
    status: "active",
    saleStatus: "LEASE",
  },
  {
    id: "prop-009",
    img: "https://via.placeholder.com/300x200?text=Studio+9",
    name: "Harbourfront Studio",
    address: "101 Water St, Victoria, BC",
    status: "pending",
    saleStatus: "RENT",
  },
  {
    id: "prop-010",
    name: "Lakeview Cottage",
    address: "202 Lakeshore Dr, Kelowna, BC",
    status: "sold",
    saleStatus: "LEASE",
  },
  {
    id: "prop-011",
    img: "https://via.placeholder.com/300x200?text=Penthouse+11",
    name: "Summit Penthouse",
    address: "303 Skyline Blvd, North Vancouver, BC",
    status: "active",
    saleStatus: "SELL",
  },
];

// ─── 3. ORGANIZATION MOCK DATA ───────────────────────────────────────────────

export type Role = "member" | "owner" | "admin";
export type InvitationStatus = "pending" | "accepted" | "rejected" | "canceled" | "expired";

export type MockOrganization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string | Date;
  logo?: string | null;
  metadata: {
    limits: {
      orgMembers: number;
      ChatBoxs: number;
      chatMessagesImage: number;
      maxProjects: number;
      maxProjectImages: number;
      maxOrg: number;
      PoolInvestor: boolean;
    };
    priceId: string;
    id: string;
    plan: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    referenceId: string;
    status: string;
    periodStart: Date;
    periodEnd: Date;
    cancelAtPeriodEnd: boolean;
    seats: number;
    daysLeft: number;
  };
  members: {
    id: string;
    organizationId: string;
    role: Role;
    createdAt: string;
    userId: string;
    user: {
      email: string;
      name: string;
      image?: string;
    };
  }[];
  invitations: {
    id: string;
    organizationId: string;
    email: string;
    role: Role;
    status: InvitationStatus;
    inviterId: string;
    expiresAt: string;
  }[];
};

// --- Helpers ---

function m(
  id: string,
  role: Role,
  createdAtISO: string,
  email: string,
  name: string,
  imgSeed: number
): MockOrganization["members"][number] {
  return {
    id,
    organizationId: "org_01J9ACME1234XYZ",
    role,
    createdAt: createdAtISO,
    userId: `user_${id}`,
    user: {
      email,
      name,
      image: `https://i.pravatar.cc/100?img=${imgSeed}`,
    },
  };
}

function inv(
  id: string,
  status: InvitationStatus,
  expiresAtISO: string,
  email: string,
  role: Role,
  inviterMemberId: string
): MockOrganization["invitations"][number] {
  return {
    id,
    organizationId: "org_01J9ACME1234XYZ",
    email,
    role,
    status,
    inviterId: inviterMemberId,
    expiresAt: expiresAtISO,
  };
}

export const mockOrganization: MockOrganization = {
  id: "org_01J9ACME1234XYZ",
  name: "Aurora Labs",
  slug: "aurora-labs",
  createdAt: "2024-11-18T10:15:00.000Z",
  logo: null,
  metadata: {
    limits: {
      orgMembers: 12,
      ChatBoxs: 5,
      chatMessagesImage: 1000,
      maxProjects: 10,
      maxProjectImages: 500,
      maxOrg: 3,
      PoolInvestor: true,
    },
    priceId: "price_PREMIUM_CA",
    id: "sub_meta_01J9ACME",
    plan: "Premium",
    stripeCustomerId: "cus_9AbcXyZ123",
    stripeSubscriptionId: "sub_A1B2C3D4",
    referenceId: "ARL-REF-2025",
    status: "active",
    periodStart: new Date("2025-08-01T00:00:00.000Z"),
    periodEnd: new Date("2025-09-01T00:00:00.000Z"),
    cancelAtPeriodEnd: false,
    seats: 12,
    daysLeft: 5,
  },

  members: [
    m("mem_01", "owner", "2024-12-02T09:00:00.000Z", "jordan@aurora.dev", "Jordan Park", 11),
    m("mem_02", "admin", "2025-01-20T15:30:00.000Z", "sasha@aurora.dev", "Sasha Kim", 3),
    m("mem_03", "admin", "2025-02-08T11:10:00.000Z", "liam@aurora.dev", "Liam Patel", 7),
    m("mem_04", "member", "2025-03-01T08:45:00.000Z", "avery@aurora.dev", "Avery Chen", 15),
    m("mem_05", "member", "2025-03-12T17:22:00.000Z", "noah@aurora.dev", "Noah García", 22),
    m("mem_06", "member", "2025-04-03T13:05:00.000Z", "mia@aurora.dev", "Mia Rossi", 34),
    m("mem_07", "member", "2025-04-28T19:12:00.000Z", "zoe@aurora.dev", "Zoe Singh", 28),
    m("mem_08", "member", "2025-05-16T10:00:00.000Z", "ethan@aurora.dev", "Ethan Müller", 36),
    m("mem_09", "member", "2025-06-05T14:42:00.000Z", "amelia@aurora.dev", "Amelia Dubois", 41),
    m("mem_10", "member", "2025-07-09T09:33:00.000Z", "lucas@aurora.dev", "Lucas Novak", 52),
    m("mem_11", "member", "2025-08-10T16:18:00.000Z", "harper@aurora.dev", "Harper Ito", 64),
  ],

  invitations: [
    inv("inv_01", "pending", "2025-09-05T23:59:59.000Z", "nina@aurora.dev", "admin", "mem_02"),
    inv("inv_02", "accepted", "2025-07-01T23:59:59.000Z", "owen@aurora.dev", "member", "mem_01"),
    inv("inv_03", "rejected", "2025-06-15T23:59:59.000Z", "ruby@aurora.dev", "member", "mem_03"),
    inv("inv_04", "canceled", "2025-05-20T23:59:59.000Z", "sam@aurora.dev", "member", "mem_01"),
    inv("inv_05", "expired", "2025-08-15T23:59:59.000Z", "ivy@aurora.dev", "member", "mem_05"),
  ],
};