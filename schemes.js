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
    name: "PM Awas Yojana (PMAY) - Urban",
    category: "Housing",
    who: "Economically weaker sections, LIG/MIG families",
    benefit: "Financial assistance/subsidy for building or buying a home",
    how: "Apply online at pmaymis.gov.in (urban)",
    link: "https://pmaymis.gov.in"
  },
  {
    name: "PM Awas Yojana (PMAY-G) - Gramin",
    category: "Housing",
    who: "Rural families without pucca house",
    benefit: "House construction assistance",
    how: "Apply at pmayg.nic.in",
    link: "https://pmayg.nic.in"
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
    benefit: "Zero-balance bank account, RuPay debit card, accident insurance",
    how: "Open account at any bank branch or Bank Mitra",
    link: "https://pmjdy.gov.in"
  },
  {
    name: "Atal Pension Yojana (APY)",
    category: "Pension",
    who: "Any citizen aged 18–40 with bank/post office account",
    benefit: "Guaranteed monthly pension of ₹1,000–₹5,000 after age 60",
    how: "Apply through your bank or post office",
    link: "https://npscra.nsdl.co.in"
  },
  {
    name: "PM Suraksha Bima Yojana (PMSBY)",
    category: "Insurance",
    who: "Citizens aged 18–70 with bank account",
    benefit: "₹2 lakh accidental death/disability cover (~₹20/year)",
    how: "Enroll via net banking or bank branch",
    link: "https://jansuraksha.gov.in"
  },
  {
    name: "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
    category: "Insurance",
    who: "Citizens aged 18–50 with bank account",
    benefit: "₹2 lakh life insurance cover (~₹436/year)",
    how: "Enroll via net banking or bank branch",
    link: "https://jansuraksha.gov.in"
  },
  {
    name: "National Scholarship Portal (NSP)",
    category: "Education",
    who: "Students from pre-matric to post-doctoral",
    benefit: "Scholarships covering tuition and maintenance",
    how: "Register at scholarships.gov.in",
    link: "https://scholarships.gov.in"
  },
  {
    name: "Sukanya Samriddhi Yojana",
    category: "Savings",
    who: "Parents/guardians of girl child under 10",
    benefit: "High-interest savings for education/marriage",
    how: "Open account at post office or authorized bank",
    link: "https://www.india.gov.in/sukanya-samriddhi-yojana"
  },
  {
    name: "PM Mudra Yojana",
    category: "Business",
    who: "Non-corporate small/micro enterprises",
    benefit: "Collateral-free loans up to ₹20 lakh",
    how: "Apply through banks, NBFC or MFI",
    link: "https://www.mudra.org.in"
  },
  {
    name: "PM Fasal Bima Yojana",
    category: "Agriculture",
    who: "Farmers growing notified crops",
    benefit: "Crop insurance against natural calamities",
    how: "Apply through banks or pmfby.gov.in",
    link: "https://pmfby.gov.in"
  },
  {
    name: "National Pension System (NPS)",
    category: "Pension",
    who: "Any Indian citizen aged 18–70",
    benefit: "Market-linked retirement savings with tax benefits",
    how: "Register at enps.nsdl.com",
    link: "https://www.npscra.nsdl.co.in"
  },
  {
    name: "Stand-Up India",
    category: "Business",
    who: "SC/ST and women entrepreneurs",
    benefit: "Bank loans ₹10 lakh to ₹1 crore",
    how: "Apply via standupmitra.in",
    link: "https://www.standupmitra.in"
  },
  {
    name: "PM Vishwakarma Yojana",
    category: "Skill Development",
    who: "Traditional artisans and craftspeople",
    benefit: "Training, toolkit & loans up to ₹3 lakh",
    how: "Apply at pmvishwakarma.gov.in",
    link: "https://pmvishwakarma.gov.in"
  },
  {
    name: "PM Garib Kalyan Anna Yojana (PMGKAY)",
    category: "Food Security",
    who: "Priority households and AAY families",
    benefit: "5 kg free foodgrains per person/month",
    how: "Via ration card at Fair Price Shops",
    link: "https://dfpd.gov.in/pmgkay.htm"
  },
  {
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    category: "Skill Development",
    who: "Indian youth aged 15-45",
    benefit: "Free skill training + certification + placement",
    how: "Register at pmkvyofficial.org",
    link: "https://pmkvyofficial.org"
  },
  {
    name: "Beti Bachao Beti Padhao",
    category: "Women & Child",
    who: "Girls and communities with low child sex ratio",
    benefit: "Awareness, education & empowerment",
    how: "District-level implementation",
    link: "https://wcd.nic.in/bbbp"
  },
  {
    name: "PM Matru Vandana Yojana",
    category: "Women & Child",
    who: "Pregnant and lactating women",
    benefit: "₹5,000 cash incentive in installments",
    how: "Register at anganwadi center",
    link: "https://pmmvy.wcd.gov.in"
  },
  {
    name: "Jal Jeevan Mission",
    category: "Water",
    who: "Rural households",
    benefit: "Tap water connection to every household",
    how: "Check status at jjm.gov.in",
    link: "https://jaljeevanmission.gov.in"
  },
  {
    name: "Swachh Bharat Mission",
    category: "Sanitation",
    who: "All citizens",
    benefit: "Toilets, waste management, ODF villages",
    how: "Participate via swachhbharatmission.gov.in",
    link: "https://swachhbharatmission.gov.in"
  },
  {
    name: "PM SVANidhi",
    category: "Business",
    who: "Street vendors",
    benefit: "Collateral-free loan up to ₹50,000",
    how: "Apply via pmsvanidhi.mohua.gov.in",
    link: "https://pmsvanidhi.mohua.gov.in"
  },
  {
    name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
    category: "Skill Development",
    who: "Rural youth (15-35 years)",
    benefit: "Skill training and job placement",
    how: "Through project implementing agencies",
    link: "https://ddugky.gov.in"
  },
  {
    name: "Pradhan Mantri Gram Sadak Yojana (PMGSY)",
    category: "Infrastructure",
    who: "Rural habitations",
    benefit: "All-weather road connectivity",
    how: "State rural roads agencies",
    link: "https://pmgsy.nic.in"
  },
  {
    name: "Kisan Credit Card (KCC)",
    category: "Agriculture",
    who: "Farmers and fishermen",
    benefit: "Short-term credit for crop cultivation",
    how: "Apply at nearest bank",
    link: "https://agricoop.nic.in"
  },
  {
    name: "Soil Health Card Scheme",
    category: "Agriculture",
    who: "All farmers",
    benefit: "Soil testing and nutrient recommendations",
    how: "Via Common Service Centres",
    link: "https://soilhealth.dac.gov.in"
  },
  {
    name: "PM Shram Yogi Maandhan",
    category: "Pension",
    who: "Unorganised workers aged 18-40",
    benefit: "₹3000 monthly pension after age 60",
    how: "Enroll via CSC",
    link: "https://maandhan.in"
  },
  {
    name: "e-Shram Portal",
    category: "Labour",
    who: "Unorganised workers",
    benefit: "Registration and accident insurance",
    how: "Register at eshram.gov.in",
    link: "https://eshram.gov.in"
  },
  {
    name: "PM POSHAN Shakti Nirman",
    category: "Education",
    who: "School children",
    benefit: "Mid-day meal scheme",
    how: "School-level implementation",
    link: "https://pmposhan.education.gov.in"
  },
  {
    name: "Samagra Shiksha Abhiyan",
    category: "Education",
    who: "School students",
    benefit: "Holistic school education improvement",
    how: "State education departments",
    link: "https://samagra.education.gov.in"
  },
  {
    name: "Pradhan Mantri Krishi Sinchayee Yojana",
    category: "Agriculture",
    who: "Farmers needing irrigation",
    benefit: "Micro irrigation & water conservation",
    how: "State agriculture departments",
    link: "https://pmksy.gov.in"
  },
  {
    name: "Pradhan Mantri Formalisation of Micro food processing Enterprises (PMFME)",
    category: "Business",
    who: "Micro food processing units",
    benefit: "Credit and machinery support",
    how: "Apply via pmfme.nic.in",
    link: "https://pmfme.nic.in"
  },
  {
    name: "National Rural Livelihood Mission (DAY-NRLM)",
    category: "Women Empowerment",
    who: "Rural poor women",
    benefit: "Self Help Groups & livelihood support",
    how: "State rural livelihood missions",
    link: "https://aajeevika.gov.in"
  },
  {
    name: "Pradhan Mantri Bharatiya Janaushadhi Pariyojana",
    category: "Health",
    who: "All citizens",
    benefit: "Generic medicines at low prices",
    how: "janaushadhi.gov.in",
    link: "https://janaushadhi.gov.in"
  },
  {
    name: "Rashtriya Vayoshri Yojana",
    category: "Senior Citizens",
    who: "BPL senior citizens",
    benefit: "Physical aids and assisted devices",
    how: "Through ALIMCO",
    link: "https://alimco.in"
  },
  {
    name: "Khelo India",
    category: "Sports",
    who: "Young athletes",
    benefit: "Talent search and sports infrastructure",
    how: "kheloindia.gov.in",
    link: "https://kheloindia.gov.in"
  }
  // You now have 50+ high-quality schemes. You can keep adding more easily.
];
