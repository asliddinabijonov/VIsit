export const demoData = {
  regions: [
    { id: 1, name: "Toshkent viloyati", title: "Poytaxt va zamonaviy shahar", image: "/assets/place-1.png" },
    { id: 2, name: "Samarqand", title: "Registon va buyuk meros", image: "/assets/place-2.png" },
    { id: 3, name: "Buxoro", title: "Tarixiy markaz", image: "/assets/place-3.png" },
    { id: 4, name: "Xiva", title: "Ichan Qal'a shahri", image: "/assets/place-1.png" },
    { id: 5, name: "Andijon", title: "Farg'ona vodiysi marvaridi", image: "/assets/place-2.png" },
    { id: 6, name: "Farg'ona", title: "Bog'lar va hunarmandchilik", image: "/assets/place-3.png" },
    { id: 7, name: "Namangan", title: "An'analar va tabiat", image: "/assets/place-1.png" },
    { id: 8, name: "Sirdaryo", title: "Sokin va go'zal manzillar", image: "/assets/place-2.png" },
    { id: 9, name: "Jizzax", title: "Tog' va tarix", image: "/assets/place-3.png" },
    { id: 10, name: "Navoiy", title: "Cho'l va oltin shahar", image: "/assets/place-1.png" },
    { id: 11, name: "Qashqadaryo", title: "Qadimiy meros", image: "/assets/place-2.png" },
    { id: 12, name: "Surxondaryo", title: "Issiq iqlim va tarix", image: "/assets/place-3.png" }
  ],
  restaurants: [
    {
      id: 101,
      viloyat: 2,
      title: "Registon Taomlari",
      description: "Milliy va Yevropa taomlari, iliq muhit.",
      location: "Samarqand sh., Registon ko'chasi 12",
      phone_number: "+998 90 111 22 33",
      email: "info@registon.uz",
      opening_hours: "11:00 - 23:00",
      rating: 4.7,
      images_detail: [{ image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop" }],
      xususiyat_detail: [{ turi: "Milliy oshxona" }, { turi: "Oila" }]
    }
  ],
  hotels: [
    {
      id: 201,
      viloyat: 2,
      title: "Samarqand Grand Hotel",
      description: "Markazda joylashgan, qulay va zamonaviy xonalar.",
      location: "Samarqand sh., Amir Temur ko'chasi 5",
      phone_number: "+998 90 222 33 44",
      email: "booking@grandhotel.uz",
      opening_hours: "24/7",
      price_per_night: 85,
      rating: 4.5,
      images_detail: [{ image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2100f?q=80&w=1200&auto=format&fit=crop" }],
      xususiyat_detail: [{ turi: "Wi-Fi" }, { turi: "Nonushta" }]
    }
  ],
  transports: [
    {
      id: 301,
      viloyat: 2,
      title: "Silk Road Transfer",
      description: "Shahar bo'ylab va aeroport transferi.",
      phone_number: "+998 90 333 44 55",
      email: "hello@silkroad.uz",
      transport_turi_detail: { turi: "Sedan" },
      xususiyat_detail: { turi: "Konditsioner" }
    }
  ],
  sights: [
    {
      id: 401,
      viloyat: 2,
      title: "Registon Maydoni",
      description: "Samarqandning yuragi va tarixiy durdonasi.",
      location: "Samarqand sh., Registon",
      cost: 30,
      images_detail: [{ image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop" }]
    }
  ]
};
