import {
  fiveBitInput1BitOutputNand,
  fiveBitInput3BitOutputMaskBit,
  fourBitInput2BitOutput,
  fourBitInput4BitOutputBitwiseNot,
  sixBitInput2BitOutput,
  threeBitInput1BitOutput,
  threeBitInput2BitOutput,
  threeParity4BitInput1BitOutput,
  truthTableBalancedBits,
  truthTableEvenParity,
  truthTableHighBit,
  truthTableReverseBits,
  twoBitInput1BitOutputXor,
  twoMajority3BitInput1BitOutput,
} from '../config/logic-tables';
import clientPrisma from './prisma-client';

const truthTables = [
  {
    displayName: 'XOR (2-bit input, 1-bit output)',
    content: twoBitInput1BitOutputXor,
  },
  {
    displayName: 'Majority (3-bit input, 1-bit output)',
    content: twoMajority3BitInput1BitOutput,
  },
  {
    displayName: 'Parity 3 of 4 (4-bit input, 1-bit output)',
    content: threeParity4BitInput1BitOutput,
  },
  {
    displayName: 'Random 4-bit input, 2-bit output',
    content: fourBitInput2BitOutput,
  },
  {
    displayName: 'NAND (5-bit input, 1-bit output)',
    content: fiveBitInput1BitOutputNand,
  },
  {
    displayName: 'Random 6-bit input, 2-bit output',
    content: sixBitInput2BitOutput,
  },
  {
    displayName: '3-bit input, 2-bit output (encoder)',
    content: threeBitInput2BitOutput,
  },
  {
    displayName: 'Bitwise NOT (4-bit input, 4-bit output)',
    content: fourBitInput4BitOutputBitwiseNot,
  },
  {
    displayName: 'Mask bit (5-bit input, 3-bit output)',
    content: fiveBitInput3BitOutputMaskBit,
  },
  {
    displayName: 'Custom 3-bit input, 1-bit output',
    content: threeBitInput1BitOutput,
  },
  {
    displayName: 'Even Parity (4-bit input, 1-bit output)',
    content: truthTableEvenParity,
  },
  {
    displayName: 'Reverse Bits (4-bit input, 4-bit output)',
    content: truthTableReverseBits,
  },
  {
    displayName: 'High Bit Detector (3-bit input, 1-bit output)',
    content: truthTableHighBit,
  },
  {
    displayName: 'Balanced Bits (4-bit input, 1-bit output)',
    content: truthTableBalancedBits,
  },
];

const seedTruthTable = async (table: (typeof truthTables)[number]) => {
  return clientPrisma.truthTable.create({
    data: {
      displayName: table.displayName,
      entries: {
        create: table?.content?.map((entry) => ({
          input: entry.input,
          output: entry.output,
        })),
      },
    },
  });
};

const generate = async () => {
  try {
    console.log('Seeding database...');

    const adminUser = await clientPrisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin',
        lastName: 'User',
        password: 'admin123',
        role: 'ADMIN',
      },
    });

    console.log('Created admin user:', adminUser.email);

    for (const table of truthTables) {
      const created = await seedTruthTable(table);
      console.log(`Seeded table: ${created.displayName}`);
    }

    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Error while seeding:', error);
  } finally {
    await clientPrisma.$disconnect();
  }
};

generate();

export default generate;
