export const SELLERS = {
  JASWIK: {
    id: "JASWIK",
    name: "JASWIK TECHNOLOGIES INDIA",
    address: "THIRED FLOOR, FLAT.NO-3/3-A, DOUBLE STOREY, MOTI NAGAR, West Delhi, Delhi, 110015",
    gstin: "07AEFPH1117L3ZO",
    contact: "+91 9711933958",
    prefix: "JTI",
    bankDetails: {
      bankName: "HDFC BANK, PATEL NAGAR (NEW DELHI)",
      accountNo: "50200079881127",
      ifsc: "HDFC0000144",
      vpa: "9711933958@hdfcbank"
    }
  },
  DBI: {
    id: "DBI",
    name: "DIGITAL BOOK OF INDIA PRIVATE LIMITED",
    address: "Floor No. -7, Site-IV, Behind Venice Mall, Surajpur, Greater Noida, Gautambuddha Nagar, Uttar Pradesh - 201310",
    gstin: "09AAMCD4741J1ZA",
    contact: "+91 9711933958", // Defaulting to same contact unless specified
    prefix: "DBI",
    bankDetails: {
      bankName: "AXIS BANK LTD, GREATER NOIDA",
      accountNo: "926020014657893",
      ifsc: "UTIB0005930",
      vpa: "digitalbookofindia@axisbank" // Placeholder VPA
    }
  }
};

export type SellerKey = keyof typeof SELLERS;
