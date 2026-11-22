
require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Offer = require('./models/Offer');

// Food image URL generator
const foodImage = (tags, lock) =>
  `https://loremflickr.com/800/600/${tags}?lock=${lock}`;

// ==========================================
// COMPLETE RESTAURANT MENU
// ==========================================

const menu = [

  // ========================================
  // INDIAN STARTERS
  // ========================================
{
    name: 'Paneer Tikka',
    category: 'Starters',
    description: 'Smoky tandoor-grilled paneer with peppers and mint chutney.',
    price: 220,
    veg: true,
    spice: 2,
    emoji: '🧀',
    popular: true,
    image: 'https://images.openai.com/static-rsc-4/6SbW5xdMkpEyMz3f_GcEF7LzqRnimHmwBXccw719eCBoyzivb37XhbkMQUsQSx_I_tUTQpLTZpF7udaOT0aa33Etfg4zg4SjtLJZ93mze17KMDqQAATCwHyBNA_floeT8AMZmIFrmw-jlqK-PxBleDDygUr9VLyOC9Z2OT2BcSs0JtjtNiKvPTLZXfFtozMh?purpose=fullsize'
},
  {
    name: 'Veg Spring Rolls',
    category: 'Starters',
    description: 'Crispy rolls stuffed with seasoned vegetables.',
    price: 160, veg: true, spice: 1, emoji: '🥟',
    image: "https://images.openai.com/static-rsc-4/Dd_Xj6irrO2wSAVbTeCbsUZvy6LZfwKXGwYapd0_w6XdzWWvRQ1s6BVwuqseCcj3HrC7c3Lsjr_-j4QIl-aya_doQUXHRwQF_zhZwPNpfxkr_fCElbHIo-4C3ATwY5plX7r4Q_QbbQ90jv2xkJppToYylhfVZHhs6V756s-DGc-4W107E9zvCK0ulCQuumRb?purpose=fullsize"
  },
  {
    name: 'Chicken 65',
    category: 'Starters',
    description: 'Spicy, crunchy South Indian fried chicken with curry leaves.',
    price: 240, veg: false, spice: 3, emoji: '🍗',
    popular: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcg4w6kI3XiZy86o6a9UKtwVh53Dj2xiGe59sm7EWhpQ&s=10"
  },
  {
    name: 'Hara Bhara Kebab',
    category: 'Starters',
    description: 'Spinach and green pea patties, lightly pan-fried.',
    price: 180, veg: true, spice: 1, emoji: '🥬',
    image: "https://images.openai.com/static-rsc-4/Cg3efGGfYWYznBFA0-Xw3-UzRkFEoViwl7xGOI7USawiHKR0zCMogJixU_h2u6lKt1hg3aqCNIFrDC8U-My1qgUnuuEy6MhA4hKebHIscaobXtYeoj1P9rrcfGToieS7UDxBJQiJs6Yf4H-pMkFM71e1PiahBeWHkhf0jgh-SGHKsbRzCU5Sjx8J3BwsDTH-?purpose=fullsize"
  },
  {
    name: 'Veg Manchurian Dry',
    category: 'Starters',
    description: 'Crispy vegetable balls tossed in spicy Chinese sauce.',
    price: 190, veg: true, spice: 2, emoji: '🥗',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/x_Wy7muEYIqLjsdfkPVvX5xzyIiFFBczYsChHrLQ0_22DRIq2cXN8GwNrcNeUe6d5_7tzVlbaK16riwB-cEfPwuK2vVowUbsWK2nsuFRM6NthK-7ty4bAOqafHRAtzYY2JzuIyHVzU0O6Wmn2dFzIKgK8LYEO8nKhRinOM9zeHHC-NcaIVEHt4EX69Gvdzke?purpose=fullsize"
  },
  {
    name: 'Chicken Tikka',
    category: 'Starters',
    description: 'Juicy chicken pieces marinated in Indian spices and grilled.',
    price: 280, veg: false, spice: 2, emoji: '🍗',
    image: "https://images.openai.com/static-rsc-4/swe3OKnRO1sOEC-Lt9U4WBqt3Kn8iVSoVEJKFmxIuepKjYeu_f5_JuJhZAQzNihAP3FPuRIhDsKmTxe7mz2lbFvIcE3Gvd-WGUEK3BpI8Aynnuzvp7TqqdaCbABaFYty5APcVtxTI8Za6UFJyfMAGK8QQe3eG6VnpnqGhSyVtvSt12L886tVEEdlDSKZyoVf?purpose=fullsize"
  },
  {
    name: 'Onion Pakoda',
    category: 'Starters',
    description: 'Crispy onion fritters served with chutney.',
    price: 120, veg: true, spice: 2, emoji: '🧅',
    image: "https://images.openai.com/static-rsc-4/zC2VkPOnzRPDcx04VyQALzpQQDN9VngM0KyVNnHpHJssAi-3o-d6iTkxxnXKnvdmQWFlXE_Bwh0gtWHyMP6EbiHAfb-BjdKGDahiTt6rCsm9kWDfAgWnu4n12wRaNUorhJ3SGOVRTt0aDxTlZfSvtuWpbZItVPu3qKkVb-tuQ2uyCnUBdycEhipj-XnWVMPz?purpose=fullsize"
  },

  // ========================================
  // INDIAN MAIN COURSE
  // ========================================

  {
    name: 'Butter Chicken',
    category: 'Mains',
    description: 'Tender chicken in a rich, creamy tomato and butter gravy.',
    price: 320, veg: false, spice: 1, emoji: '🍛',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/uA_r2cmW8bOicU5TeJ3LeKiRrZak6wshmpolfRIVcuS4sQZk_x44wnjQXKNe0umI0jj3fFUPRMsTXoUb8sTAWzRbr6BGAe727b3fHYh2oduAmOSb5VtEikyO5UF73hKYJh2dVtgeoQJgltWy0bTa_IMCBXY7R9rCbvNu54nj1lhUH0AALGLN-a7gNeVX7Njr?purpose=fullsize"
  },
  {
    name: 'Paneer Butter Masala',
    category: 'Mains',
    description: 'Soft paneer cubes in a velvety tomato-cashew gravy.',
    price: 280, veg: true, spice: 1, emoji: '🍲',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/PLaZhcpXQBDrlqmM4jaNK9ylhdN6yfl4lvlen5VDGsrpWdhAo691zwXtSRNk-H34iFvtHAOvU8YDnTOoEIXD4RWKwFzLTlfOXZG7Jd2AUXH6rtHzd3EMEscYLfaTeFYWHZwH1SfI3TfVO0bM6-bg5eT0IHitX_cuTxU0alMRAMXcyJKo73vnvoIuXRr3ldVP?purpose=fullsize"
  },
  {
    name: 'Dal Tadka',
    category: 'Mains',
    description: 'Yellow lentils tempered with garlic, cumin and ghee.',
    price: 180, veg: true, spice: 1, emoji: '🥘',
    image: "https://images.openai.com/static-rsc-4/eaenWy0sap4ggJZpIkTcumv0KwYlah_nBYlhYjIuNYeIUIu3o9w9hYs9v3bhEWPO0541XZY8tZyrGdREEvs0mb6vIOcx57LgxawYcOnZzVULbzvXA1hVxhoNkP1UHeMvGRO_qKwC75JCIDuawRkfIHhE6itiayDCoTy-L7blZybrqSV10fMPoq-CB_7TIwIA?purpose=fullsize"
  },
  {
    name: 'Chana Masala',
    category: 'Mains',
    description: 'Chickpeas simmered in tangy onion-tomato masala.',
    price: 190, veg: true, spice: 2, emoji: '🫘',
    image: "https://images.openai.com/static-rsc-4/jmCTmeAlZMeWhUv81vQ_xErvClPuwtOGeTiXsZlQAotMAlhno3xVbX00oR0kADJIQ3YFUyuDQ4JAFsG-WuE7AHwhDbAKl5ZVE10NJ7oXbD0m3R0zPHLhqIq3lX6c59dm5DInAcFgsD7tXVaBUmC3lzehIZCKDTJY6kWLdXi2AesU2yH3QUXyDQB1EQZtYTU7?purpose=fullsize"
  },
  {
    name: 'Kadai Chicken',
    category: 'Mains',
    description: 'Chicken cooked with bell peppers and freshly ground spices.',
    price: 310, veg: false, spice: 3, emoji: '🌶️',
    image: "https://images.openai.com/static-rsc-4/HUkSq9gMmAz-v12140qbj7VBQl_Ty5o0q3pIioJMa8VGWRpu5WiIeeWXM33nwSoLF6QYyZ1CQ8th_KWwSrRM5vxL-8RYfGw2dSDi8Iw7tM0GBMNItH0eIpl5j2PZXbNjohjZDYQ5ImbSCrShRL5XGPhsDYg8_Z7ADHQiexPv2c9-Kma7FdzPc0SR8ny0QR7E?purpose=fullsize"
  },
  {
    name: 'Palak Paneer',
    category: 'Mains',
    description: 'Paneer in a smooth, lightly spiced spinach gravy.',
    price: 260, veg: true, spice: 1, emoji: '🥗',
    image: "https://images.openai.com/static-rsc-4/12En1Hk6jyX9l6uNqB-e8CU59A1LFon70lOAr9Wk7eo26cEKfVMuQmqPQ1wbMhwD8sO-WLJfAbzTCmp_gTN_ajJKIZAz4vRzzvlOPHb6slbHT4Rvur2FhaL6GH2vc9xqGo6_VlRSGS0d6sRCOdUpOZLJ2zPAzbvah8elYmJMXeIBrRKW1gQm1B1IBz4vLHQs?purpose=fullsize"
  },
  {
    name: 'Shahi Paneer',
    category: 'Mains',
    description: 'Paneer cooked in rich creamy cashew and tomato gravy.',
    price: 290, veg: true, spice: 1, emoji: '🍲',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/SShA8qFbYODDQuIEOs9MJi-rX7Xd-akALnY9MFP_QSzBnSOaF6ARUVQ3o-bNmPpPLxLY1Ex6qHf7aJ1U6pdkLZXzogqFk3fagqc26jMTaoYonqL32tBe7hQnIUE2f8e9bFHw6FtW8FJG23Uqwl7_9tjKz9BS-aMgOawTSl_O5OetKudU_LSVIedHh8MmUKie?purpose=fullsize"
  },
  {
    name: 'Malai Kofta',
    category: 'Mains',
    description: 'Soft vegetable dumplings in creamy cashew gravy.',
    price: 270, veg: true, spice: 1, emoji: '🥘',
    image: "https://images.openai.com/static-rsc-4/F7cOTKOXdIeccypVFMGTh1I9bEPdpsVXXat5wvWBPmSi2ND1y1EamK7NMr8VBM2uYWadtbe5LqvrXOJ9-h_XA1KGvDVZ45kJnsq2riZKU_eNOb9U3M65YHx3dfUaWR_kWcbROMVL14_8G29Fvxvtbm2J1oQTjDOFGjbUag1SsNpwvTQ0VQFfFaUdBIO7mbHx?purpose=fullsize"
  },
  {
    name: 'Kadai Paneer',
    category: 'Mains',
    description: 'Paneer with capsicum, onion and kadai spices.',
    price: 280, veg: true, spice: 2, emoji: '🍛',
    image: "https://images.openai.com/static-rsc-4/LKIyUf169KJR7eBDkTCXpg_o4KVH7Ufb9CkDuNxyw24GekX2g4TgjoN3rtFjTLlJW4wUcVGtl01cCZS2Hj09kYCSSuGzlgGW6VI1GPirCF7agAq9SWPYn3eJbHUr68cmK6BUXj7zeAB5nqjgg6QCqbqQkiy3F02ZJn0WczSGyW03FitA_7kLTOHZuX06YAZv?purpose=fullsize"
  },
  {
    name: 'Chicken Korma',
    category: 'Mains',
    description: 'Chicken cooked in a mild and creamy aromatic gravy.',
    price: 330, veg: false, spice: 1, emoji: '🍗',
    image: "https://images.openai.com/static-rsc-4/mY4A5D2GMTFCM5Dxy7h8WrwE7_f2bSzrD3pxTJtub25g51FONH84Gwgnqo6N23xHxRQVMzJVGKhjNvOYPIQ1qAVgggoMJydWb51AlAdGQ_sY_vjxb74Xc9A6LLw_bIFOi0VU0sMcVhU7wrDNKkTHkYg7Y56xvd6QvyVKOx2uquDWja9octvG-vt0cF4ksyDr?purpose=fullsize"
  },

  // ========================================
  // BIRYANI
  // ========================================

  {
    name: 'Veg Biryani',
    category: 'Biryani',
    description: 'Fragrant basmati layered with vegetables and whole spices. Served with raita.',
    price: 240, veg: true, spice: 2, emoji: '🍚',
    image: "https://images.openai.com/static-rsc-4/go2a0wXAD3ZgSaMDASlG6jxA4O6hSlD3uZpHUTxdd0Wdv__VWGFbPqw95ZX5oLs5VjPTw95M5Q10cPYRMZEAbgUv4lnfs3-OpqKsabfJJ-yl0pUZmmv9vu9JCE73XcVVJM9KxoUrGT7i_Wcxti3LI_Zd_nMG66OauGUf7TQFmeAt02id2UoSJErzVmziNnCZ?purpose=fullsize"
  },
  {
    name: 'Chicken Biryani',
    category: 'Biryani',
    description: 'Slow-cooked dum biryani with juicy chicken. Served with raita.',
    price: 300, veg: false, spice: 2, emoji: '🍗',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/5cOfZ8zGj-R5Qt_miVa6IusLT1087JJVDKJF5i7Y4NjGFZWxOaaSs19Tnd45jfEu2qR-nbPeNt0U7dX6iV3h-3tbyrt3xoLXQdQmWZK5ELNfH7eZDezU9rnSqH3c-dSHS1Bf92NMKiTsSXOLI_AIm8aSp4bHW-i9kkTYL6gFWPYgaAjU9pgTYI0JRo8h9e5_?purpose=fullsize"
  },
  {
    name: 'Egg Biryani',
    category: 'Biryani',
    description: 'Spiced basmati rice with masala-coated boiled eggs.',
    price: 250, veg: false, spice: 2, emoji: '🥚',
    image: "https://images.openai.com/static-rsc-4/oTQEVKnpldnZaF8rQzpten1HZQrsKqXVvxWfcWQGk2zpA_EMAMhV3mTjk1UHjdr7tYXmuLWrstRQGocw6eZ0kXWMudLoVGFAOOv3vvJgyqSo8zQRe99-OeubkT6AWhwc4o7YpZpa2zrodnL0TbJrlYAhyAwJYmgQYRHKIgGAPKZna7VJZ8fywtD-35K87aYf?purpose=fullsize"
  },
  {
    name: 'Hyderabadi Chicken Biryani',
    category: 'Biryani',
    description: 'Traditional aromatic dum biryani with spicy chicken.',
    price: 340, veg: false, spice: 3, emoji: '🍛',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/S-QWogA646QiyzWYgDtCebnj8Y6hGDxYO1noG6Z59Kl_qYXAgfnYpN_-rnt-KJPb6gKKPbXnWDKGsIfx6tz5ZozkeFekIlTP82m3YTxw_McunhFk2aXNX1-GgX1A8zKcupF26PmIKSNKplDOC6X8xVk8KZlHPUcHAJh7Hz2o0amBKjZxMAq51ya9OCBQ34Pz?purpose=fullsize"
  },

  // ========================================
  // BREADS
  // ========================================

  {
    name: 'Butter Naan',
    category: 'Breads',
    description: 'Soft tandoor-baked naan brushed with butter.',
    price: 55, veg: true, spice: 0, emoji: '🫓',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/Qn0E8UwMPFi4KQPqfpd-DFK00etfbyZP4x0Uda3_5PETgfmTygnpZoB409-LwClUAaDlI0Lzwuvp0RztFwPIvD0NcjImhqtD3xLjKrMn5g40NW-Cswh6gyq9IgoLUozkNx9zb1qJbFezHbf8Sb7t0pOTr8_DpeRS1ojxrJOElgDKfVpbyO2iDDrme1yRAiJO?purpose=fullsize"
  },
  {
    name: 'Garlic Naan',
    category: 'Breads',
    description: 'Naan topped with fresh garlic and coriander.',
    price: 65, veg: true, spice: 0, emoji: '🧄',
    image: "https://images.openai.com/static-rsc-4/jPp6VJmyoP845JnEyIm1_m2CrT6M4WkgpbZCspk-Kd109DpeLBCN3u7Zz_GVQn0gYKTAbJvnu8zIOd9MncYgCDU6-OzZjzMVh-avJpYi5QAhmkxRKliUvFoDM1e813WV_zqPITgKbsiixjBVpkF3ETyLb24XW3oBvrThZ_3xpzsbDgnBJS5Z2Nprg7G4kV4y?purpose=fullsize"
  },
  {
    name: 'Tandoori Roti',
    category: 'Breads',
    description: 'Whole wheat roti baked in the tandoor.',
    price: 30, veg: true, spice: 0, emoji: '🍞',
    image: "https://images.openai.com/static-rsc-4/JuXddARfqXC3lf24d05NTBcPgvGIc-jU64nrO9qIiN1T1f0mXgZxqeFKbAnSi45ogrWz7HZwdwKpn28xpe8NfsK-IA4vPBakB6CJYPKx7WXYtZ5FhjTicy13mRasUWnOeTS4n6pDOe-ZgG7VqtV5h1BrsfZGrYmrFpnrwrUu95o6TgqQe90n0t8tAKCuNmtz?purpose=fullsize"
  },

  // ========================================
  // DESSERTS
  // ========================================

  {
    name: 'Gulab Jamun',
    category: 'Desserts',
    description: 'Warm milk dumplings soaked in cardamom sugar syrup (2 pieces).',
    price: 90, veg: true, spice: 0, emoji: '🍮',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/zqRFM8zy5eZTXCXfpp8SNToCYVjlvFVmputwK-DKigYcHTOlYVzcKzHZbsufOiSk-9jhfBxEDEn8Jq77phQ4mQwmJsyZtXi47Nj8SI41-pk6kQ6SoR3JjJGf_gt-9d1NgoPEo8746WwNyZAJusGFVHdBzb0BWVZkgSdge9Zu2uxOpEXdSZNk_my53sHR0Hnc?purpose=fullsize"
  },
  {
    name: 'Rasmalai',
    category: 'Desserts',
    description: 'Soft paneer discs in chilled saffron milk (2 pieces).',
    price: 110, veg: true, spice: 0, emoji: '🥛',
    image: "https://images.openai.com/static-rsc-4/TCQednfJq0G9PkuOe1sJ8oz9C0sgezwvYB3icabDQcApm79wOD6TY8FwIxK5DsUmy7ISpFWPrt2iF7X_-bpZBtIMFh6ASHcxnOu90xESYfkDOFM4mxhnDaNBd1qgf-KhRGbeHB6XAm-lmdRj7VValuId9XUUWlkW4T6P-glGiedZGGKb4R6u1T4U12NI95Ia?purpose=fullsize"
  },
  {
    name: 'Kulfi Falooda',
    category: 'Desserts',
    description: 'Traditional kulfi with falooda noodles and rose syrup.',
    price: 130, veg: true, spice: 0, emoji: '🍨',
    image: "https://images.openai.com/static-rsc-4/Mmn6yUtM6p5OCJYZU8E4wgVuK3S-keIwXosU8jSA3GfRxHXc6CZODS3By3V1bIjWePBdXuC3JWfAiUJQxW0cfNn-90aNedkYP3Bmha5wlEQtU-YENpFYBHL8XFPPiXNGOOqF2l35HNsYqEL6WbVuwzGHXBFllYnOOwQ8LhK2vviOgkMUoXSoRIcyZuVk0o-3?purpose=fullsize"
  },
  {
    name: 'Chocolate Brownie',
    category: 'Desserts',
    description: 'Rich chocolate brownie served with chocolate sauce.',
    price: 150, veg: true, spice: 0, emoji: '🍫',
    image: "https://images.openai.com/static-rsc-4/Jp4yrO_9E2USzq4H75i5srFoCXqr-hkYt7W5m2xe2R-XK-cst6ytWdTfpDHsaivs75rkEwU2ahOc09Mei2SLAxs_94SuJp3pT_wQ4SG5ogA_6ynUzZf8xs1MoAaW7APJrtryz9utDO6JdQhg3PLqqjMEaD1HrGhSVmasFtm54SuTzSpclAPyVAlUSuyrWqG1?purpose=fullsize"
  },

  // ========================================
  // DRINKS
  // ========================================

  {
    name: 'Mango Lassi',
    category: 'Drinks',
    description: 'Thick, chilled yogurt drink blended with ripe mango.',
    price: 90, veg: true, spice: 0, emoji: '🥭',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/unqpw7wIVcjaZp5-T0w-CdCdcQ42v45lBAn2eTen-SuVTudmFNwWa3BmL5pGo5x7QMZTdpoPXUkO_crr_BHZelkgss0kIJ8MAdAQrlfSCTuLmc2EPLdn51V-A0fUzgG4xfzGvCAPw0UFG9gBe_4z_g1i9TqvTkxuiGAnhxnpiHyxPDnig_Zapcz61YMgiJxL?purpose=fullsize"
  },
  {
    name: 'Masala Chai',
    category: 'Drinks',
    description: 'Hot tea simmered with ginger, cardamom and spices.',
    price: 40, veg: true, spice: 0, emoji: '☕',
    image: "https://images.openai.com/static-rsc-4/r6rbo7tDY-5XDMD5OussGF4b9Y9QYJzh61JnoSdDhayumUEirm6nIkrQ7U4qrk8aNCpTtNG7Xf1fcbvKOsvjRZe0V1YuH89Pglc5dCr7rBchZBosVY59a-1205JnSJEB3DSCpYfBZvrDxV_Lg7k2a1Hx0DemKsE1dtSpbbEr34-ezm8t9rav0jdAjS8p7xzT?purpose=fullsize"
  },
  {
    name: 'Fresh Lime Soda',
    category: 'Drinks',
    description: 'Sweet or salted, fizzy and refreshing.',
    price: 70, veg: true, spice: 0, emoji: '🍋',
    image: "https://images.openai.com/static-rsc-4/REn2neUoabF2QZVCLurmuYwHqAX6BgNx6vYMgX2yHmmn8aQJhEQV-8GBWOlRqYasiGYROdJRf6_VCenl1kgH8MJHLR3GXqZp7dgtr2FkOhmz47jJeD9jvoBO514frS5GdWW9KBkoxW86V2WkhPGFQcaWYmjs46DPAmSRyhZZ5g6R1p25zUCiGbW6sCb0IIUW?purpose=fullsize"
  },

  // ========================================
  // CHINESE VEG STARTERS
  // ========================================

  {
    name: 'Veg Manchurian',
    category: 'Chinese',
    description: 'Crispy vegetable balls tossed in delicious Indo-Chinese sauce.',
    price: 190, veg: true, spice: 2, emoji: '🥗',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/djmrL-DkPjqK-_Z5bNuTIByQks0Wd6dGlZxoXBKJK8cdOyWFSyqnvuVNyjanzNoJWCZwuDtzR8hev95flvdSPZ4BqlMtQpnJK-OIj2jGsZHNKe2g1b2S8M8u8QmKEgI53aNvnOt9repcFAHy6NokhSDJPi_BOYX-eTRG2_LnnXM?purpose=inline"
  },
  {
    name: 'Gobi Manchurian',
    category: 'Chinese',
    description: 'Crispy cauliflower florets tossed in spicy Manchurian sauce.',
    price: 180, veg: true, spice: 2, emoji: '🥦',
    image: "https://images.openai.com/static-rsc-4/o7i27tWdTqOf7gu9WyRDuj1JVrXXqs-eKr2fqTv3eAd7flhDNECYGAT49wYVq_cTGYzCsE6BONPsautLdvfptNlp10N_xI6e3GFS3y0t0QQ1F7KebKI6DyyX-Thy7c24PatPuptV3mM5cB5qg_gxAeKYdv3Oor_QFbtAt21Seyo?purpose=inline"
  },
  {
    name: 'Paneer Chilli',
    category: 'Chinese',
    description: 'Fried paneer cubes tossed with capsicum, onion and chilli sauce.',
    price: 220, veg: true, spice: 3, emoji: '🌶️',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/BoF1tM2_W2C2nYb2LTa5YrEBR5BacU4hEJ8Ni8WAdeAKdYU6OXg2pGXGgrTIL6h3gMri4QplhKXMuAS1tHHbWisxeTVFaJ-muhsc2dhRpYJ11mijPY5g1GuSgvY0ObMEZGRVtfV6lNeJ5GS6rfYId8WkN0BRtcd6Vm2KzYkwsZLodlrz7AvsnskGshe3xZXV?purpose=fullsize"
  },
  {
    name: 'Crispy Corn',
    category: 'Chinese',
    description: 'Crunchy golden corn tossed with spices and herbs.',
    price: 170, veg: true, spice: 2, emoji: '🌽',
    image: "https://images.openai.com/static-rsc-4/U9pNATZFJlZY_ZpgXvHy5nIBAX1cgAUSmUKzFM4OhwxAtAyKSWAD_nBeCbo33L2me8ZYUbWlkXn2nUkoEsD9ZlVug4PvoKYQK2Ug1bUusrKQpWzkvvZTzbUrMM1pvlW_uGpWih9VukLlIsicfFAJVhUVRYxRDysK-2htXgEbIIJDB2jIGAxTiHgn5aAodWHj?purpose=fullsize"
  },
  {
    name: 'Chilli Mushroom',
    category: 'Chinese',
    description: 'Mushrooms tossed with green chillies and Chinese sauces.',
    price: 210, veg: true, spice: 3, emoji: '🍄',
    image: "https://images.openai.com/static-rsc-4/_JrkR3JDMIwHk_8GlROjGJy72gqaxrI6JA6X0wzEvles5XbSkL58FBAdQ3Qlnw_IXigxGri5KFMECACgFa6Cx1iFlILGG2JeI0ufnxID-TuX0ZRpa27wykLO5gzHVjg6-2wEWS0vJC8H5iMJaGOEp7eKHmfG08CPfvCmKSwHdtEGDS0xGdky1BcuM-IYKcTg?purpose=fullsize"
  },
  {
    name: 'Honey Chilli Potato',
    category: 'Chinese',
    description: 'Crispy potato fingers coated with honey and chilli sauce.',
    price: 180, veg: true, spice: 2, emoji: '🍟',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/nusgMY2g2hZyrxuQlPNWj74290CLY7cbNCgfscNKJK2jyOS8hLyFznCBPfhQLmGvxLBQ22Y32jb6a_UR152750LtfT8Vi0G5vyBFrMFB7rYbQNaV-fTeMdUd1eUekoq5rnCtr3El-i2MXPt5XDe_wZcbKixw5VHH7oPGR00f7on4DIJxSIsc0xOM4DhN4Hpc?purpose=fullsize"
  },
  {
    name: 'Veg Crispy',
    category: 'Chinese',
    description: 'Crispy fried vegetables tossed in spicy Chinese seasoning.',
    price: 190, veg: true, spice: 2, emoji: '🥕',
    image: "https://images.openai.com/static-rsc-4/9lHR8N_ttb8lS5a-0hDk2WLV-ifwt_Kibwhi_rh7AZNDVJEGN-aBGJuYiK0tvZuV-tiPiH09G5zfwthdRuBIDXEq07cLsIjnBcAakH5YPayWIDdeuMJ7o6lMwm8RCDplzasz93dhVPuOGk-YElHcwDFU51kQOJ1MsK8mT4LIuWGBEr5FuVnfHT-6kZfLHGDU?purpose=fullsize"
  },
  {
    name: 'American Chopsuey',
    category: 'Chinese',
    description: 'Crispy noodles topped with sweet and sour vegetable gravy.',
    price: 220, veg: true, spice: 1, emoji: '🍜',
    image: "https://images.openai.com/static-rsc-4/61_W6jatOpn-P_RqkmLJUhdCha-zaw3TfnUwMBpHTRtaxTLZpIgezxaQU58H44GoVVlQCtZFfUgoCbrR47KvOQMTvnYovrmc99uP5Mj7M5GBX6O0uGMiyStuPMYN3fDrmvUmTpl2aJoAjkAz7qFEoLa3cNFnwhEqhtE6OBfnXwCHE6Py9xPc-AieFt8Hsanv?purpose=fullsize"
  },

  // ========================================
  // CHINESE NON-VEG STARTERS
  // ========================================

  {
    name: 'Chicken Manchurian',
    category: 'Chinese',
    description: 'Juicy chicken pieces tossed in spicy Manchurian sauce.',
    price: 250, veg: false, spice: 2, emoji: '🍗',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/BwlFsih9l4AbyC-7xSbCZM1xAnsNNSLLHmrkcH4uB6P3A0TE1FN_QifN1XyTK9a7I7SfNtgV300fDFPD7HXgZ2kdGBan2CUMSOFVKAWW_esLGIbSyWi03U9os-FHgKrIJ0mvuTpupnHY6tDxLRFK53g8oJQ8uWeLlExwbBjX-gIvju6OiqB7r8TRAPXGUKk6?purpose=fullsize"
  },
  {
    name: 'Chicken Lollipop',
    category: 'Chinese',
    description: 'Crispy fried chicken lollipops with spicy coating.',
    price: 260, veg: false, spice: 3, emoji: '🍗',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/IlzXmfCgHBZ5aBT9tKK-CJlQMnd-I_A-Uvisqs2jcXmAZ7ws1CrrWie6ZLSTficrFvEFec-AWX_gG7Q6yRJzMnUd-MV5qH7xwLfPxRpcf3FNVIERlLSxeppmBROg69enZ-Rj7UmBDFCDuK4vSiD24ScHy6PtnG1S06zQDxPaU2zX0WlEAewdesXcIBYBXEan?purpose=fullsize"
  },
  {
    name: 'Chilli Chicken Dry',
    category: 'Chinese',
    description: 'Boneless chicken tossed with capsicum, onion and chilli sauce.',
    price: 260, veg: false, spice: 3, emoji: '🌶️',
    image: "https://images.openai.com/static-rsc-4/T2-gxesS6E_dU9QEa1jlrLqXNr2WpDWzwRcs8CYjfm8hhmPFeN0aWhmYLQ-AqB10u1W5azGAxv5hzXwNYh8TI_vhWjhnD4D64CqCv25DrKYYmvsyYx3uA9KgopicVy9BOHHRgENeAvYlBcOFj-hp8_bjY2OGUdktoMWkEgPzSElWYKOZCPQWIo51_bviXNZq?purpose=fullsize"
  },
  {
    name: 'Chicken Crispy',
    category: 'Chinese',
    description: 'Crunchy fried chicken strips tossed with Chinese seasoning.',
    price: 270, veg: false, spice: 2, emoji: '🍗',
    image: "https://images.openai.com/static-rsc-4/eR63_ujahUNRytzRRXTLaJ-9HBDtCjPm2ZnYJhoOEgVmBnMo5ktRE0mPqVELAIrPzkdFl6_r0ZOYPKZGsoIA6d41eM5afo4ZQ00fO70SPeivbIAbGRnq6cuG-8pVT1LyyvCn6g9Du3qNf2mb97iw_Ve8IECZ_2J396UOj3XnYjHpEChr1neurgVoMPWP0dSR?purpose=fullsize"
  },
  {
    name: 'Chicken 555',
    category: 'Chinese',
    description: 'Spicy fried chicken tossed with aromatic Indian-Chinese spices.',
    price: 280, veg: false, spice: 3, emoji: '🍗',
    image: "https://images.openai.com/static-rsc-4/3GTVNxKXsArc_x3ZgErC_XA7YBkDcIR94f3Cn4DoVbgiNruLaHcGdkRGYrZ-7CpNq76EgLR9BVekVeK__t8EpgO_m_w_PGaU6ZrQyC-NRkv_KfH-wGu_47szk2BRxCvjPiOCgb4CxanwQ1sUWhkmzQLYgQwSV4pAKP0qPYJD9yp_GKvLzOj87GFuWwoclsHz?purpose=fullsize"
  },

  // ========================================
  // CHINESE NOODLES
  // ========================================

  {
    name: 'Veg Hakka Noodles',
    category: 'Chinese',
    description: 'Stir-fried noodles with fresh vegetables and Chinese sauces.',
    price: 180, veg: true, spice: 1, emoji: '🍜',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/kQoHRiEEQSUmPKQGIq7m4l5kHJx1SO5S2xP9rT5c3KeVIl5mqgw46Udmk8y0JpQSTZPKtYRjnKlE4RkJOhZIO-2IgvETKg-f4qsJnrKHkMmZUYip7C-_ABBwjwQ24VTLU1Z5yrBOueSX9CkoFU4gKzVwW2IxatB-5j-G8oTdsSHnZ1l0msMxGDsmtAu4mgn2?purpose=fullsize"
  },
  {
    name: 'Schezwan Noodles',
    category: 'Chinese',
    description: 'Spicy noodles tossed in homemade Schezwan sauce.',
    price: 200, veg: true, spice: 3, emoji: '🍜',
    image: "https://images.openai.com/static-rsc-4/H3zCF_1uZ5_pi23XYBDPoNMdS1uSv6EBoDsC_c8yAaXCdlsC6YtJDARCggj7XpLgRfAEfBIEHBLLOMKgaWdZjEguLOnHcIZUr05EBUI7p26usCv6ET97V-v9HfS4wqWAP7aw6A9i2NUUz3sKLQbaLXHhBFw3mpBDlA73Mgw9yLgwHtdM9FZJcVeT4qlLSSW8?purpose=fullsize"
  },
  {
    name: 'Singapore Noodles',
    category: 'Chinese',
    description: 'Thin noodles stir-fried with vegetables and aromatic spices.',
    price: 210, veg: true, spice: 2, emoji: '🍝',
    image: "https://images.openai.com/static-rsc-4/Kir36rNpiRxu7akPqEve6K_tTLJep-txZJvTEg-KZU9uAgg5tw7WdoLYifiEG4UUvYqz76pZLGPu43bXLf-d5MuSK32lSFyZuX_h9jHc7QRj85vlJaIx7hqESpy2nOmoIxtBaL2mVK9lW8fcDtTvkiyWAQtZHaGEoAjLPQipFCqLGfOyrPelaJo7Opke3UNW?purpose=fullsize"
  },
  {
    name: 'Chicken Hakka Noodles',
    category: 'Chinese',
    description: 'Hakka noodles tossed with chicken, vegetables and sauces.',
    price: 240, veg: false, spice: 2, emoji: '🍜',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/N_ZemL3PWkTSvrXck8GAyCyY4ya9PVGPp6jeaPFjHh87lRxcHcaQ_d2vX6yqb9KQJMsMDo7Ifceo4NPp5p8_c65ne2lVvwkbAwBqTycj-2gm4mFSGmEBSoXHiuqbXxqDNtJciGPOzf6ma0SZ6o5dI1skCYymxd2A-aRU7Aj0Ch7R1-XMY_gA8fRzq8NMw0Rg?purpose=fullsize"
  },
  {
    name: 'Egg Hakka Noodles',
    category: 'Chinese',
    description: 'Stir-fried noodles with scrambled eggs and vegetables.',
    price: 210, veg: false, spice: 1, emoji: '🍳',
    image: "https://images.openai.com/static-rsc-4/12b6ew9sx1-WRMK7QWToK0Kw5UVA2cfJ-lcm5ITCIir9Y97i5ZAhxIECujFpHYZq7nCUz1pGJ-Ok6NDB4ta2u5eQFquAcJ-zqJptfO5tgowA9TZO409_XNqkUZgQ8PmqbsgiQL2EBwme8rulhES8zncS48P8B3dggTZtZF0Kl0i-7UsCkhQbpRQgPTl2bEbs?purpose=fullsize"
  },
  {
    name: 'Chicken Schezwan Noodles',
    category: 'Chinese',
    description: 'Spicy Schezwan noodles with chicken and vegetables.',
    price: 260, veg: false, spice: 3, emoji: '🍜',
    image: "https://images.openai.com/static-rsc-4/Nmhg9tZEgYWfF_Zhfj7fQFkdVHSOsP5vXecWnftQ9ebzn3-MBsF22UDmfULY3iAncZf-hkZVuK8c2OO4Kt5oIl2ATk9BSihWqcJOetDracfRfYkb9rIBv9S6vLr38uYyhRStn073JpUcQV50f4Q_TfyqgE0Jw34_z3Uu5FLaQDY1vPoQ1PPPFxd5dMpOLKAr?purpose=fullsize"
  },

  // ========================================
  // CHINESE FRIED RICE
  // ========================================

  {
    name: 'Veg Fried Rice',
    category: 'Chinese',
    description: 'Classic fried rice with fresh vegetables and Chinese sauces.',
    price: 180, veg: true, spice: 1, emoji: '🍚',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/uibf9USaKBMksd4Tmg2-Itm36Oiqkib1CaCSsAePCKvVbOTL217bcVQCMm2JC4DH2Lolw6QJJ2NruWmEnq3nELULVq9znESjR0cNIyUWwDJXC1XEvKWTxf5siXKin7PjSLCGtiJCpyoZ6Bx7HR26S8dYeiIZTh7Vdc1MJuTK--noot7sCZuDzuRQC5jYxUPD?purpose=fullsize"
  },
  {
    name: 'Schezwan Fried Rice',
    category: 'Chinese',
    description: 'Fried rice tossed in spicy Schezwan sauce.',
    price: 200, veg: true, spice: 3, emoji: '🍚',
    image: "https://images.openai.com/static-rsc-4/s_GEmG2-IgL4eFbQRV0I4voBr-zsscoqJx5jFx0j6VcJWh8Pkl90gKpgYLkql8nOs0hq6k5uLUDmxq3eq-IDV7McH9ekJlnju1rUEFUsLZhEz43iqE55KBcvMzAYL9ioqOvDiD-KpJYJCMpmEMhjCOlOaQ_wXsvpSF_lc5ZXg9_1sDQAkgVHpRS2DrMeBEpn?purpose=fullsize"
  },
  {
    name: 'Singapore Fried Rice',
    category: 'Chinese',
    description: 'Flavourful rice tossed with vegetables and aromatic spices.',
    price: 210, veg: true, spice: 2, emoji: '🍚',
    image: "https://images.openai.com/static-rsc-4/NlfZ2fIHOgx3ZwsI_58mB26P6obagsc0onVfIVAIDCOgcSoaX5UNGZvRPa3mO-aMf75zw4m-AEN-Xc7cQHtqGKvOVg3F1tqO31z9P4tG0l2LMVRTuBah0EFV098PiTHaRQecQOseETpzUK8PQi8xYByJQ-0TJJPU3pGMpyt2EOS1EWSWCsFBi3T2I_xCKcM_?purpose=fullsize"
  },
  {
    name: 'Chicken Fried Rice',
    category: 'Chinese',
    description: 'Stir-fried rice with chicken, egg and vegetables.',
    price: 240, veg: false, spice: 1, emoji: '🍗',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/lUAod_WNE_IXMm7KXra89aSyHmUEpMfHzUY5lOxdoNzaA4GQ0klMGYTCHS_RCu5eGnGxUp39un1kgGa73sqebIGOUB8dZoIaV79yYlB5YgY--iUBmKxPVljnVbSmKJ6yPmM3qZCCBD06Hq58Aun7vdwbj95OdMY3hAzfs8j3eMc67FORg7KQpf4KQI4hVNcW?purpose=fullsize"
  },
  {
    name: 'Egg Fried Rice',
    category: 'Chinese',
    description: 'Classic fried rice with scrambled eggs and spring onions.',
    price: 210, veg: false, spice: 1, emoji: '🍳',
    image: "https://images.openai.com/static-rsc-4/GLdSfNxF4L3fjULvtMp5Ks1h1MQuirfWlnADYn4AqjHhnxCIubcwthhmlC9aFDuJYwk5UqQG3yqtUJGHDM_ceeYpT8Q4QZbL_vSU3tvSZjq6MkfFHDFDtr0x01schRSCVrwWmn8kBMlfOvy29UpFREBKwmKJssaCQgkgDu0zt2AlgJXqFaMEFhSAdnA3TknO?purpose=fullsize"
  },
  {
    name: 'Triple Schezwan Rice',
    category: 'Chinese',
    description: 'Fried rice, noodles and spicy Schezwan gravy served together.',
    price: 280, veg: false, spice: 3, emoji: '🍛',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/H3y1YIGsfjy4oqHSor139EGJFaqzglrQznju1RYe0IE5rqMLx6r0BpVxfOzQwPC26XjGqVj7YMColnysefjqSz5DmNPQCMczkx53-p4a4GMPocdO_O8Ndh4fnAIn6HKh5-1jLmlvQvAr-GrsiB6dC-Y6U-id8bOgHjMXVGnl3jVODKfx303cC9oLsVmXdPpa?purpose=fullsize"
  },

  // ========================================
  // CHINESE GRAVY
  // ========================================

  {
    name: 'Veg Manchurian Gravy',
    category: 'Chinese',
    description: 'Vegetable dumplings in a flavourful Chinese gravy.',
    price: 200, veg: true, spice: 2, emoji: '🥘',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/OmSQ12maeL8Cm8MbGEije8qFMKptKOZWux7x9IRmZNkvkJ8tNix37qL9UtQnbK2CE4QMSsRwyIKxN2p7_1cF00npj0fJqdCcUxxfmm6S27YXJ_apq8WQmw58juRIBFvSuMDnCAGlqS17cZziLGLbxukyWAW3JGhD4wAt3ZGFbqFBCSnkIL0ywABfrDzwuH0q?purpose=fullsize"
  },
  {
    name: 'Paneer Chilli Gravy',
    category: 'Chinese',
    description: 'Paneer cubes cooked in spicy chilli gravy.',
    price: 230, veg: true, spice: 3, emoji: '🍲',
    image: "https://images.openai.com/static-rsc-4/K8OHZSp464q5aCX4AhSB3NFkqTVp2dFJtj29OK14reHBZgUP8zugB1pUnqJM9Ed6_yOWEXWtLHuXzlZctJSftU7xA_TKU9PVCefj-ur8ygDt_H0sQ1jqJ9tPudpYLb7C6MtC1AORg1TS3A_x7FO4gfEob8ppeHnj6JWXmPOZswhjl_nN_jsxXdpKgjHMv8SP?purpose=fullsize"
  },
  {
    name: 'Chicken Manchurian Gravy',
    category: 'Chinese',
    description: 'Chicken balls cooked in delicious Manchurian gravy.',
    price: 270, veg: false, spice: 2, emoji: '🍗',
    image: "https://images.openai.com/static-rsc-4/LNl8m9SuiEIjRz_SpsC-QtqPepHAFelydA200q031tzB1sjeV6DBzQQZ7iji_bA3gJCt6SmPZfU8vujLdCv7Cx4TPo5H_rQoQkvcN4FApGVrwJD3IxEpYj4oOXGgiwx1fMgcd_ct5BKov-Q6Qg89DuCsaiFQ0SH-KsMIm7QaFTGjs1svnziQLCYOChjkpM7v?purpose=fullsize"
  },
  {
    name: 'Chicken Hot Garlic',
    category: 'Chinese',
    description: 'Chicken cooked in a hot garlic sauce with vegetables.',
    price: 280, veg: false, spice: 3, emoji: '🌶️',
    image: "https://images.openai.com/static-rsc-4/QWLKIUbHS2j9h7AClwX7r7iYWITh44UIWjp1RkpgviGBO-7l5mO8F0vv6sfMb2RzzInurCf8UFzlBdWZvZlL7WiNrInioBylrhpJSxwqdzqcMeBAY-mUsTvRdP5VKIRlyeWsFLBZuV5mUQZ3fpTSbuQeociUEIy0G1nr-8NN6pAOL0C5FZkW6IDr-HSo_NMK?purpose=fullsize"
  },

  // ========================================
  // CHINESE SOUPS
  // ========================================

  {
    name: 'Veg Manchow Soup',
    category: 'Chinese',
    description: 'Spicy vegetable soup topped with crispy noodles.',
    price: 110, veg: true, spice: 2, emoji: '🍜',
    image: "https://images.openai.com/static-rsc-4/9VoQT7UKALUfDnihF35yHj5XICFh9d4fbhFnB8xuBB8I3PkEwjf-tHZByC14e6APUA4eRXLXuursEQqAMQ3Dvs-GjqabOqVuXLE2mONHRTFc8Tw9T3d1Rvs9qzIV0levosMLd5PlOe_QNhfjJYy2gmgtBfnn7YFNU6kqdmHfQIe5IpktrYBy6BVF814Sln7B?purpose=fullsize"
  },
  {
    name: 'Veg Sweet Corn Soup',
    category: 'Chinese',
    description: 'Creamy sweet corn soup with fresh vegetables.',
    price: 100, veg: true, spice: 0, emoji: '🥣',
    image: "https://images.openai.com/static-rsc-4/QqFxCO0gPJPobJlXOsbvPtYd8ICT1GNBbleitgLUfVLr7LnOjKwzBh95ehrG9dGLoxoEd5jEGXiY8hV0hjTi62egoodZkPuRrRrGsjasL6rB-6gG4WpuyaI7s9erq1Zw2IWkgOnbnn2HSM_RWZDrYtzV_gkmYX4U9gy97TxOG3HorVXimjDxPKgNgjb0OMUx?purpose=fullsize"
  },
  {
    name: 'Veg Hot and Sour Soup',
    category: 'Chinese',
    description: 'Hot and sour soup with mushrooms and vegetables.',
    price: 110, veg: true, spice: 3, emoji: '🥣',
    image: "https://images.openai.com/static-rsc-4/qBR-K7Lu0gu2XctoRd6M3bpU-dDi2M0XhkGIlw2tpp5n3oOYUJiPQG3uoCFmEj-bjaza6a2hE3mViD-X-TyyaDsijVvG4cvyC4MjGKCsah_wHqvif0_yOnP_rvZYmBOqilmKedCG3e9HcmGaU1ZZCXstD1kbxleTL_P_Y9d6t5ObQtfDq_7YOerqeiDc15HM?purpose=fullsize"
  },
  {
    name: 'Chicken Manchow Soup',
    category: 'Chinese',
    description: 'Spicy chicken soup with vegetables and crispy noodles.',
    price: 130, veg: false, spice: 2, emoji: '🍲',
    image: "https://images.openai.com/static-rsc-4/8N-zRVwyUTR2LycimtJddH0iiWZevIR6DYnPsgpqq3FwGBSsUjN66pdOnONRLSAMVnCvm4Qh3BdQY386YgGeNSBsaMYctPsA4RO0RhqjECTn_cqn74KYvaPxIUaTDClAjIHw_MFmbUpKFlrOwO7U0kZGH17OkCLqJ_bW8mFsUUMtoEClVNwo9uPdnx2UbURT?purpose=fullsize"
  },
  {
    name: 'Chicken Sweet Corn Soup',
    category: 'Chinese',
    description: 'Warm chicken and sweet corn soup.',
    price: 130, veg: false, spice: 0, emoji: '🥣',
    image: "https://images.openai.com/static-rsc-4/28L9VPJ57myITjTpKuFEZ1hnehopOQJB-Yy4zK7w6h4-nwYPDpdFH429u9sgFqxFjW3anwCnUG0be5IYHrW56GVNLK3oQz32YYSzpXlixHwNd9rpfJfwXx5xNoAh3NYkzwbLSwRy_9NBAyj8C5DmVHpurxMB0PpzTYA0VXA0QQRtv353ZHO--hcIZHRRxlsR?purpose=fullsize"
  },

  // ========================================
  // CHINESE COMBOS
  // ========================================

  {
    name: 'Veg Noodles Combo',
    category: 'Chinese',
    description: 'Veg Hakka noodles served with Veg Manchurian.',
    price: 260, veg: true, spice: 2, emoji: '🍱',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/Yy_Y9SwWfa-KMYvsv5NH0EMdfhLoPXW6RiWvBUH9azCXoRHjSJvqiNm5qp4RyoRnh_OcAvSyyuYPqTVevU5stoOVzDzYhWCUk8E-mHNa9e8sKFxnmyT7lwE4N61CNDn2xJ8xa9mEtSU7-NN7ERPYddgXUaUyoEUpjZ8Cu60bzHEo9XFNfiKwoSfTOT6vb3IY?purpose=fullsize"
  },
  {
    name: 'Chicken Rice Combo',
    category: 'Chinese',
    description: 'Chicken fried rice served with Chicken Manchurian gravy.',
    price: 320, veg: false, spice: 2, emoji: '🍱',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/n_qKPtjoecEkkSfH6j-d6sZ8XpmtXzB-YByfurPzj02a89hLCRPdMCtXdbyVxWVAQ9eTCMVdDGkfZ55y_QTAYZhQVcYKIgMXZ3zHn2_HY1ZFiy7KJJlllYH5yxas8pe1h6f-W2tLZIoLndYSk9UGUSBymY2ZHb2Axh51TrzYZu4hhFvAZ8nlBrfRjb08Zx2r?purpose=fullsize"
  },
  {
    name: 'Veg Schezwan Combo',
    category: 'Chinese',
    description: 'Schezwan fried rice served with Veg Manchurian gravy.',
    price: 280, veg: true, spice: 3, emoji: '🍱',
    image: "https://images.openai.com/static-rsc-4/pdW3ScvNKqZ9vQZvVP4fDCFx1JpyTIkFmrhHpzpTTCnAJ6-YvUFySecfRVIgbiVOYtl9GJS5eVSSPyELlmm_60pzd_j6rSQM7SSo-XCesyfJ3D16pdR83kI7RbNVie-Zs4pBEnHWtJFFDRalvS_bZ43jKUqYKqa0uGgGaxKYuXZKfhMdVM8hARDZqNdskzGI?purpose=fullsize"
  }
];

// ==========================================
// SPECIAL OFFERS
// ==========================================

const inDays = (n) =>
  new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const offers = [
  {
    title: 'Welcome Sunny!',
    description: '20% off your first order, up to ₹150.',
    code: 'SUNNY20',
    discountPercent: 20,
    minOrder: 300,
    maxDiscount: 150,
    validTill: inDays(365)
  },
  {
    title: 'Family Feast',
    description: '15% off on orders above ₹800. Perfect for sharing.',
    code: 'FEAST15',
    discountPercent: 15,
    minOrder: 800,
    maxDiscount: 250,
    validTill: inDays(365)
  },
  {
    title: 'Weekend Treat',
    description: '10% off any order over ₹400, every weekend.',
    code: 'WEEKEND10',
    discountPercent: 10,
    minOrder: 400,
    maxDiscount: 100,
    validTill: inDays(365)
  }
];

// ==========================================
// MONGODB SEED FUNCTION
// ==========================================

async function run() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/sunny_kitchen'
    );

    console.log('MongoDB connected successfully!');

    // Clear previous data
    await MenuItem.deleteMany({});
    await Offer.deleteMany({});

    console.log('Old menu and offers cleared.');

    // Insert new menu
    await MenuItem.insertMany(menu);

    // Insert offers
    await Offer.insertMany(offers);

    console.log('--------------------------------');
    console.log(`Total dishes: ${menu.length}`);
    console.log(`Total offers: ${offers.length}`);
    console.log('Indian and Chinese menu added!');
    console.log('--------------------------------');

    await mongoose.disconnect();

    console.log('MongoDB disconnected successfully.');

  } catch (err) {
    console.error('Seeding error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

run();
