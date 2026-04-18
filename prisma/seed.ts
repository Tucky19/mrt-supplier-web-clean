import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizePartNo(value: string) {
  return value.trim().toUpperCase().replace(/[\s\-_]/g, '');
}

async function main() {
  // ======================
  // PRODUCTS
  // ======================
  const p1 = await prisma.product.upsert({
    where: { normalizedPartNo: normalizePartNo('P550123') },
    update: {},
    create: {
      partNo: 'P550123',
      normalizedPartNo: normalizePartNo('P550123'),
      brand: 'Donaldson',
      category: 'fuel_filter',
      title: 'กรองน้ำมันเชื้อเพลิง (Fuel Filter)',
      titleTh: 'กรองน้ำมันเชื้อเพลิง (Fuel Filter)',
      titleEn: 'Fuel Filter',
      spec: 'Spin-on type',
      description: 'สำหรับระบบเชื้อเพลิงในเครื่องยนต์ดีเซลและงานอุตสาหกรรม',
      unit: 'pcs',
      status: 'active',
      isFeatured: true,
    },
  });

  const p2 = await prisma.product.upsert({
    where: { normalizedPartNo: normalizePartNo('P551315') },
    update: {},
    create: {
      partNo: 'P551315',
      normalizedPartNo: normalizePartNo('P551315'),
      brand: 'Donaldson',
      category: 'lube_filter',
      title: 'ไส้กรองน้ำมันเครื่อง (Lube Filter)',
      titleTh: 'ไส้กรองน้ำมันเครื่อง (Lube Filter)',
      titleEn: 'Lube Filter',
      spec: 'Spin-on lube filter',
      description: 'ใช้สำหรับระบบหล่อลื่นของเครื่องยนต์และเครื่องจักร',
      unit: 'pcs',
      status: 'active',
      isFeatured: true,
    },
  });

  const p3 = await prisma.product.upsert({
    where: { normalizedPartNo: normalizePartNo('HF28943') },
    update: {},
    create: {
      partNo: 'HF28943',
      normalizedPartNo: normalizePartNo('HF28943'),
      brand: 'Fleetguard',
      category: 'hydraulic_filter',
      title: 'ไส้กรองไฮดรอลิก (Hydraulic Filter)',
      titleTh: 'ไส้กรองไฮดรอลิก (Hydraulic Filter)',
      titleEn: 'Hydraulic Filter',
      spec: 'Hydraulic return line filter',
      description: 'ใช้กับระบบไฮดรอลิกในเครื่องจักรอุตสาหกรรม',
      unit: 'pcs',
      status: 'active',
      isFeatured: false,
    },
  });

  const p4 = await prisma.product.upsert({
    where: { normalizedPartNo: normalizePartNo('932615Q') },
    update: {},
    create: {
      partNo: '932615Q',
      normalizedPartNo: normalizePartNo('932615Q'),
      brand: 'Parker',
      category: 'hydraulic_filter',
      title: 'ไส้กรองไฮดรอลิก (Hydraulic Filter)',
      titleTh: 'ไส้กรองไฮดรอลิก (Hydraulic Filter)',
      titleEn: 'Hydraulic Filter',
      spec: 'High-pressure hydraulic element',
      description: 'เหมาะสำหรับงาน hydraulic pressure line',
      unit: 'pcs',
      status: 'active',
      isFeatured: true,
    },
  });

  const p5 = await prisma.product.upsert({
    where: { normalizedPartNo: normalizePartNo('FF5320') },
    update: {},
    create: {
      partNo: 'FF5320',
      normalizedPartNo: normalizePartNo('FF5320'),
      brand: 'Fleetguard',
      category: 'fuel_filter',
      title: 'กรองน้ำมันเชื้อเพลิง (Fuel Filter)',
      titleTh: 'กรองน้ำมันเชื้อเพลิง (Fuel Filter)',
      titleEn: 'Fuel Filter',
      spec: 'Fuel filter / water separation support',
      description: 'ใช้สำหรับกรองสิ่งปนเปื้อนในระบบเชื้อเพลิง',
      unit: 'pcs',
      status: 'active',
      isFeatured: false,
    },
  });

  // ======================
  // SUPPLIERS
  // ======================
  const s1 = await prisma.supplier.upsert({
    where: { code: 'SUP-ABC' },
    update: {},
    create: {
      name: 'ABC Industrial Supply',
      code: 'SUP-ABC',
      contactName: 'Sales Team',
      contactEmail: 'sales@abc-industrial.example',
      contactPhone: '02-000-0001',
      lineId: '@abcindustrial',
      currency: 'THB',
      reliabilityScore: 8.7,
      leadTimeMinDays: 2,
      leadTimeMaxDays: 5,
      note: 'เหมาะกับ Donaldson และ Fleetguard',
      status: 'active',
    },
  });

  const s2 = await prisma.supplier.upsert({
    where: { code: 'SUP-PKR' },
    update: {},
    create: {
      name: 'Parker Motion Thailand',
      code: 'SUP-PKR',
      contactName: 'Industrial Parts Desk',
      contactEmail: 'sales@parker-motion.example',
      contactPhone: '02-000-0002',
      lineId: '@parkermotion',
      currency: 'THB',
      reliabilityScore: 9.1,
      leadTimeMinDays: 3,
      leadTimeMaxDays: 7,
      note: 'เชี่ยวชาญงาน hydraulic',
      status: 'active',
    },
  });

  // ======================
  // SUPPLIER PRICES
  // ======================
  const priceData = [
    {
      supplierId: s1.id,
      productId: p1.id,
      supplierPartNo: 'P550123',
      costAmount: 1000,
      freightAmount: 80,
      handlingAmount: 20,
      importAmount: 0,
      totalCostAmount: 1100,
      availableQty: 12,
      leadTimeDays: 3,
      stockStatus: 'in_stock',
      isPreferred: true,
    },
    {
      supplierId: s1.id,
      productId: p2.id,
      supplierPartNo: 'P551315',
      costAmount: 850,
      freightAmount: 70,
      handlingAmount: 20,
      importAmount: 0,
      totalCostAmount: 940,
      availableQty: 8,
      leadTimeDays: 4,
      stockStatus: 'in_stock',
      isPreferred: true,
    },
    {
      supplierId: s2.id,
      productId: p4.id,
      supplierPartNo: '932615Q',
      costAmount: 1450,
      freightAmount: 90,
      handlingAmount: 30,
      importAmount: 0,
      totalCostAmount: 1570,
      availableQty: 6,
      leadTimeDays: 5,
      stockStatus: 'in_stock',
      isPreferred: true,
    },
  ];

  for (const p of priceData) {
    await prisma.supplierPrice.upsert({
      where: {
        supplierId_productId_supplierPartNo: {
          supplierId: p.supplierId,
          productId: p.productId,
          supplierPartNo: p.supplierPartNo,
        },
      },
      update: {},
      create: {
        ...p,
        currency: 'THB',
        minOrderQty: 1,
      },
    });
  }

  // ======================
  // CROSS REFERENCES
  // ======================
  await prisma.crossReference.upsert({
    where: {
      fromProductId_toProductId: {
        fromProductId: p1.id,
        toProductId: p5.id,
      },
    },
    update: {},
    create: {
      fromProductId: p1.id,
      toProductId: p5.id,
      relationType: 'alternative',
      confidenceScore: 82.5,
      note: 'ใช้แทนกันได้ในบางกรณี',
    },
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });