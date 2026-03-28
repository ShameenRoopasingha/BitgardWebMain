import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with default Products and Services...');

  // --- PRODUCTS ---
  const products = [
    {
      name: 'Point of Sale (POS) Pro',
      slug: 'pos-pro',
      tagline: 'Next-Generation Retail Management',
      description: 'A lightning-fast, cloud-based POS system designed for modern retail and restaurants. Handle transactions, track inventory in real-time, and manage your employees from one unified dashboard.',
      features: [
        { title: 'Real-time Inventory tracking' },
        { title: 'Multi-location support' },
        { title: 'Advanced Sales Analytics' }
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
      name: 'Cloud Migration & Architecture',
      slug: 'cloud-architecture',
      description: 'Future-proof your business by migrating to the cloud. We design robust cloud architectures that ensure 99.9% uptime, infinite scalability, and top-tier security.',
      features: ['AWS & Azure Deployment', 'Serverless Architecture', 'Database Optimization'],
      icon: 'FiGlobe',
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
