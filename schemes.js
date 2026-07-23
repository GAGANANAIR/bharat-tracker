// Curated database of major Indian government schemes.
// Info is for general reference only — always verify current eligibility,
// deadlines, and amounts on the official scheme website before applying.
const SCHEMES = [
  {
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "Agriculture",
    who: "All landholding farmer families",
    benefit: "₹6,000/year in 3 installments of ₹2,000, direct bank transfer",
    how: "Apply via pmkisan.gov.in or Common Service Centre (CSC)",
    link: "https://pmkisan.gov.in"
  },
  {
    name: "Ayushman Bharat (PM-JAY)",
    category: "Health",
    who: "Families identified via SECC 2011 database (mostly BPL/rural poor)",
    benefit: "₹5 lakh/family/year health insurance cover for secondary & tertiary care",
    how: "Check eligibility at pmjay.gov.in, get Ayushman Card via CSC/hospital",
    link: "https://pmjay.gov.in"
  },
  {
    name: "PM Awas Yojana (PMAY)",
    category: "Housing",
    who: "Economically weaker sections, LIG/MIG families without a pucca house",
    benefit: "Financial assistance/subsidy for building or buying a home",
    how: "Apply online at pmaymis.gov.in (urban) or pmayg.nic.in (rural)",
    link: "https://pmaymis.gov.in"
  },
  {
    name: "PM Ujjwala Yojana",
    category: "Energy",
    who: "Women from BPL households without an LPG connection",
    benefit: "Free LPG gas connection with first refill and stove",
    how: "Apply through nearest LPG distributor or pmuy.gov.in",
    link: "https://pmuy.gov.in"
  },
  {
    name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    category: "Financial Inclusion",
    who: "Any unbanked citizen",
    benefit: "Zero-balance bank account, RuPay debit card, accident insurance cover",
    how: "Open account at any bank branch or Bank Mitra with basic KYC",
    link: "https://pmjdy.gov.in"
  },
  {
    name: "Atal Pension Yojana (APY)",
    category: "Pension",
    who: "Any citizen aged 18–40 with a bank/post office account",
    benefit: "Guaranteed monthly pension of ₹1,000–₹5,000 after age 60",
    how: "Apply through your bank or post office account",
    link: "https://npscra.nsdl.co.in/scheme-details.php"
  },
  {
    name: "PM Suraksha Bima Yojana (PMSBY)",
    category: "Insurance",
    who: "Citizens aged 18–70 with a bank account",
    benefit: "₹2 lakh accidental death/disability cover for ~₹20/year premium",
    how: "Enroll via net banking or at your bank branch",
    link: "https://jansuraksha.gov.in"
  },
  {
    name: "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
    category: "Insurance",
    who: "Citizens aged 18–50 with a bank account",
    benefit: "₹2 lakh life insurance cover for ~₹436/year premium",
    how: "Enroll via net banking or at your bank branch",
    link: "https://jansuraksha.gov.in"
  },
  {
    name: "National Scholarship Portal (NSP) Schemes",
    category: "Education",
    who: "Students from pre-matric to post-doctoral level, income-based criteria vary by scheme",
    benefit: "Scholarship amounts vary — covers tuition, maintenance allowance, and more",
    how: "Register and apply at scholarships.gov.in",
    link: "https://scholarships.gov.in"
  },
  {
    name: "Sukanya Samriddhi Yojana",
    category: "Savings",
    who: "Parents/guardians of a girl child under 10",
    benefit: "High-interest savings scheme for a girl child's education/marriage",
    how: "Open account at any post office or authorized bank",
    link: "https://www.india.gov.in/sukanya-samriddhi-yojana"
  },
  {
    name: "PM Mudra Yojana",
    category: "Business",
    who: "Non-corporate, non-farm small/micro enterprises",
    benefit: "Collateral-free loans up to ₹20 lakh (Shishu/Kishor/Tarun/Tarun Plus categories)",
    how: "Apply through any bank, NBFC, or MFI",
    link: "https://www.mudra.org.in"
  },
  {
    name: "PM Fasal Bima Yojana",
    category: "Agriculture",
    who: "Farmers growing notified crops in notified areas",
    benefit: "Crop insurance against yield loss due to natural calamities",
    how: "Apply through banks, CSCs, or the national crop insurance portal",
    link: "https://pmfby.gov.in"
  },
  {
    name: "National Pension System (NPS)",
    category: "Pension",
    who: "Any Indian citizen aged 18–70",
    benefit: "Voluntary, market-linked retirement savings with tax benefits",
    how: "Register at enps.nsdl.com or through a bank/POP",
    link: "https://www.npscra.nsdl.co.in"
  },
  {
    name: "Stand-Up India",
    category: "Business",
    who: "SC/ST and women entrepreneurs setting up a greenfield enterprise",
    benefit: "Bank loans between ₹10 lakh and ₹1 crore",
    how: "Apply via standupmitra.in or directly at a bank branch",
    link: "https://www.standupmitra.in"
  },
  {
    name: "PM Vishwakarma Yojana",
    category: "Skill/Business",
    who: "Traditional artisans and craftspeople (18 trades)",
    benefit: "Skill training, toolkit incentive, collateral-free loans up to ₹3 lakh",
    how: "Apply at pmvishwakarma.gov.in or through a CSC",
    link: "https://pmvishwakarma.gov.in"
  }
];
