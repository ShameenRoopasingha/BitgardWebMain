import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with default Products and Services...');

  // Remove the old 'Cloud Migration' service since we don't offer it
  try {
    await prisma.service.deleteMany({
      where: { slug: 'cloud-architecture' }
    });
    console.log('Removed old Cloud Migration service');
  } catch (e) {
    // Ignore if it doesn't exist
  }

  // --- PRODUCTS ---
  const products = [
    {
      name: 'Point of Sale (POS) Pro',
      slug: 'pos-pro',
      tagline: 'Next-Generation Retail Management',
      description: 'A lightning-fast, cloud-based POS system designed for modern retail and restaurants. Handle transactions, track inventory in real-time, and manage your employees from one unified dashboard.',
      features: [
        'Real-time Inventory tracking',
        'Multi-location support',
        'Advanced Sales Analytics'
      ],
      icon: 'FiMonitor',
      isActive: true,
      order: 2,
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log('✅ Products seeded');

  // --- SERVICES ---
  const services = [
    {
      name: 'Custom Software Development',
      slug: 'custom-software',
      description: 'We build scalable, secure, and high-performance custom software tailored exactly to your unique business requirements. From concept to deployment, we forge your dreams in code.',
      features: ['Web & Mobile Applications', 'Enterprise Software', 'API Integration'],
      icon: 'FiFileText',
      isActive: true,
      order: 1,
    },
    {
      name: 'Custom Website Development',
      slug: 'custom-websites',
      description: 'Stunning, fast, and fully responsive websites that turn visitors into customers. Built with cutting-edge technology for maximum performance and SEO ranking.',
      features: ['Responsive UI/UX Design', 'SEO Optimization', 'Lightning Fast Performance'],
      icon: 'FiMonitor',
      isActive: true,
      order: 2,
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log('✅ Services seeded');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seed completed.');
  });
